#!/usr/bin/env python3
"""voice-v8/build.py — rebuild all FE/PP voices from voice-v8/spec.json.

Same audio rules as voice-v6/build.py: trim only leading/trailing silence at
-45 dB, keep <=0.05 s lead, one plain gain to about -17 LUFS (clamped +/-4 dB),
mono MP3 192 kbps. Caption starts are reduced by the measured lead trim.
"""
from __future__ import annotations

import json
import math
import re
import subprocess
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
VOICE_V8 = ROOT / "voice-v8"
SPEC = json.loads((VOICE_V8 / "spec.json").read_text(encoding="utf-8"))
RAW = VOICE_V8 / "raw"
TMP = VOICE_V8 / "tmp"
RAW.mkdir(parents=True, exist_ok=True)
TMP.mkdir(parents=True, exist_ok=True)

TRIM = (
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,"
    "areverse,"
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,"
    "areverse"
)
TARGET_LUFS = -17.0
MAX_GAIN = 4.0


def run(cmd: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, check=True, text=True, capture_output=True)


def duration(path: Path) -> float:
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        text=True,
    ).strip())


def audio_info(path: Path) -> dict[str, Any]:
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries", "stream=channels,bit_rate,sample_rate", "-of", "json", str(path)],
        text=True,
    )
    return json.loads(out)["streams"][0]


def loudness_and_peak(path: Path) -> tuple[float, float]:
    p = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-filter_complex", "ebur128=peak=true", "-f", "null", "-"])
    m = re.search(r"Integrated loudness:\s*I:\s*(-?\d+(?:\.\d+)?)\s*LUFS", p.stderr)
    pm = re.search(r"True peak:\s*Peak:\s*(-?\d+(?:\.\d+)?)\s*dBFS", p.stderr)
    if not m or not pm:
        raise RuntimeError(f"Could not read loudness/peak from {path}")
    return float(m.group(1)), float(pm.group(1))


def lead_silence(path: Path) -> float:
    p = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "silencedetect=noise=-45dB:d=0.01", "-f", "null", "-"])
    events = [(m.group(1), float(m.group(2))) for m in re.finditer(r"silence_(start|end):\s*(-?[0-9.]+)", p.stderr)]
    if events and events[0][0] == "start" and events[0][1] <= 0.02:
        if len(events) > 1 and events[1][0] == "end":
            return max(0.0, events[1][1])
    return 0.0


def download(url: str, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    run(["curl", "-fL", "--retry", "6", "--retry-all-errors", "--retry-delay", "2", "-A", "curl/8.5.0", "-o", str(dst), url])
    if not dst.exists() or dst.stat().st_size == 0:
        raise RuntimeError(f"Download failed: {url}")


def process(video: str, line_id: str, line: dict[str, Any]) -> dict[str, Any]:
    voice_dir = ROOT / ("public/voice/ferry-03" if video == "fe" else "public/voice/pp-sr")
    voice_dir.mkdir(parents=True, exist_ok=True)
    raw = RAW / f"{video}-{line_id}.mp3"
    trimmed = TMP / f"{video}-{line_id}-trim.wav"
    final = voice_dir / f"{line_id}.mp3"

    download(line["url"], raw)
    lead_end = lead_silence(raw)
    lead_trim = max(0.0, lead_end - 0.05)

    run(["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-af", TRIM, "-ac", "1", "-c:a", "pcm_s16le", str(trimmed)])
    loud_before, peak_before = loudness_and_peak(trimmed)
    gain = max(-MAX_GAIN, min(MAX_GAIN, TARGET_LUFS - loud_before))
    run([
        "ffmpeg", "-y", "-v", "error", "-i", str(trimmed), "-af", f"volume={gain:.2f}dB",
        "-ac", "1", "-c:a", "libmp3lame", "-b:a", "192k", str(final),
    ])
    dur = duration(final)
    info = audio_info(final)
    if int(info.get("channels", 0)) != 1:
        raise RuntimeError(f"{video}/{line_id}: output not mono ({info})")
    loud_after, peak_after = loudness_and_peak(final)
    frames = math.ceil(dur * 30.0)
    segs = [[str(text), round(max(0.0, float(start) - lead_trim), 2)] for text, start in line["segs"]]
    caption = line["caption"]
    joined = "".join(text for text, _ in segs)
    if joined != caption:
        print(f"  WARNING {video}/{line_id}: segs do not reconstruct caption exactly")
    print(
        f"  {video}/{line_id}: lead={lead_trim:.3f}s gain={gain:+.2f}dB dur={dur:.3f}s "
        f"{frames}f {loud_before:.1f}->{loud_after:.1f} LUFS peak={peak_before:.2f}->{peak_after:.2f}dBFS"
    )
    return {
        "id": line_id,
        "speaker": "A" if (video == "fe" and line_id in {"p01", "p03", "p05", "p08", "p10"}) or (video == "pp" and line_id in {"p01", "p02", "p04", "p06", "p08", "p10", "p12"}) else "B",
        "url": line["url"],
        "caption": caption,
        "lead_trim": round(lead_trim, 6),
        "gain_db": round(gain, 2),
        "duration": round(dur, 6),
        "audio_frames": frames,
        "loudness_before": round(loud_before, 2),
        "loudness_after": round(loud_after, 2),
        "peak_before_dbfs": round(peak_before, 2),
        "peak_dbfs": round(peak_after, 2),
        "channels": info.get("channels"),
        "bit_rate": info.get("bit_rate"),
        "segs": segs,
        "file": str(final.relative_to(ROOT)),
    }


def main() -> None:
    report: dict[str, list[dict[str, Any]]] = {}
    for video in ("fe", "pp"):
        print(f"=== {video} ===")
        timing_path = ROOT / ("src/videos/11-ferry-03/timing.json" if video == "fe" else "src/videos/10-private-pp-sr/timing.json")
        rows = []
        timing: dict[str, Any] = {}
        for line_id, line in SPEC[video].items():
            row = process(video, line_id, line)
            rows.append(row)
            timing[line_id] = {"audioFrames": row["audio_frames"], "segs": row["segs"]}
        timing_path.write_text(json.dumps(timing, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        report[video] = rows
        print(f"  wrote {timing_path.relative_to(ROOT)}")
    (VOICE_V8 / "audio-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("DONE")


if __name__ == "__main__":
    main()
