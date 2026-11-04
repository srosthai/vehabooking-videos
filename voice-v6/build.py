#!/usr/bin/env python3
"""voice-v6/build.py — audio + timing rebuild for the pp and fe videos.

Rules from voice-v6/TASK.md:
- New lines: download base+url+".mp3".
- Reuse lines: copy the reuse mp3 and take segs from reuse_timing exactly.
- Trim only leading/trailing silence at -45 dB, keep at most 0.05 s lead.
- Keep all internal pauses, speed and pitch unchanged.
- One plain volume gain to target about -17 LUFS, clamped to +/-4 dB.
- Output mono MP3 192 kbps.
- Subtract the actual leading trim from every caption start.
- Write audioFrames = ceil(duration * 30) and keep all other timing keys.
"""
from __future__ import annotations

import json
import math
import re
import shutil
import subprocess
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
VOICE_V6 = ROOT / "voice-v6"
SPEC = json.loads((VOICE_V6 / "spec.json").read_text(encoding="utf-8"))
RAW_DIR = VOICE_V6 / "raw"
TMP_DIR = VOICE_V6 / "tmp"
RAW_DIR.mkdir(parents=True, exist_ok=True)
TMP_DIR.mkdir(parents=True, exist_ok=True)

TRIM = (
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,"
    "areverse,"
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,"
    "areverse"
)
TARGET_LUFS = -17.0
MAX_GAIN = 4.0


def run(cmd: list[str], check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, check=check, text=True, capture_output=True)


def ffprobe_duration(path: Path) -> float:
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        text=True,
    ).strip()
    return float(out)


def ffprobe_audio(path: Path) -> dict[str, Any]:
    out = subprocess.check_output(
        [
            "ffprobe", "-v", "error", "-select_streams", "a:0",
            "-show_entries", "stream=channels,bit_rate,sample_rate",
            "-of", "json", str(path),
        ],
        text=True,
    )
    return json.loads(out)["streams"][0]


def loudness(path: Path) -> float:
    p = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-filter_complex", "ebur128", "-f", "null", "-"])
    m = re.search(r"Integrated loudness:\s*I:\s*(-?\d+(?:\.\d+)?)\s*LUFS", p.stderr)
    if not m:
        raise RuntimeError(f"Could not read loudness from {path}")
    return float(m.group(1))


def lead_silence(path: Path) -> float:
    """Duration of leading silence according to the same -45 dB threshold."""
    p = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", "silencedetect=noise=-45dB:d=0.01", "-f", "null", "-"])
    events = [(m.group(1), float(m.group(2))) for m in re.finditer(r"silence_(start|end):\s*(-?[0-9.]+)", p.stderr)]
    if events and events[0][0] == "start" and events[0][1] <= 0.02:
        if len(events) > 1 and events[1][0] == "end":
            return max(0.0, events[1][1])
    return 0.0


def download(url: str, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    p = run([
        "curl", "-fL", "--retry", "3", "--retry-delay", "1",
        "-A", "curl/8.5.0", "-o", str(dst), url,
    ])
    if not dst.exists() or dst.stat().st_size == 0:
        raise RuntimeError(f"Download failed: {url}\n{p.stderr}")


def backup(voice_dir: Path, name: str) -> None:
    dst = VOICE_V6 / f"prev-{name}"
    if voice_dir.exists() and not dst.exists():
        shutil.copytree(voice_dir, dst)
        print(f"  backup {voice_dir.relative_to(ROOT)} -> {dst.relative_to(ROOT)}")
    elif dst.exists():
        print(f"  backup already exists: {dst.relative_to(ROOT)}")


def process_line(video: str, line_id: str, cfg: dict[str, Any], timing: dict[str, Any], reuse_cache: dict[str, dict[str, Any]]) -> dict[str, Any]:
    voice_dir = ROOT / SPEC[video]["dir"]
    voice_dir.mkdir(parents=True, exist_ok=True)
    raw = RAW_DIR / f"{video}-{line_id}.mp3"
    trimmed = TMP_DIR / f"{video}-{line_id}-trim.wav"
    final = voice_dir / f"{line_id}.mp3"

    if "url" in cfg:
        url = SPEC["base"] + cfg["url"] + ".mp3"
        download(url, raw)
        source = f"new: {url}"
        caps = cfg["caps"]
        starts = cfg["starts"]
        if len(caps) != len(starts):
            raise RuntimeError(f"{video}/{line_id}: caps/starts length mismatch")
        segs = [[str(cap), float(start)] for cap, start in zip(caps, starts)]
    elif "reuse" in cfg:
        reuse_path = ROOT / cfg["reuse"]
        if not reuse_path.exists():
            raise FileNotFoundError(reuse_path)
        shutil.copyfile(reuse_path, raw)
        source = f"reuse: {cfg['reuse']}"
        reuse_timing = reuse_cache.get(cfg["reuse_timing"])
        if reuse_timing is None:
            reuse_timing = json.loads((ROOT / cfg["reuse_timing"]).read_text(encoding="utf-8"))
            reuse_cache[cfg["reuse_timing"]] = reuse_timing
        segs = [[str(text), float(start)] for text, start in reuse_timing[line_id]["segs"]]
    else:
        raise RuntimeError(f"{video}/{line_id}: missing url/reuse")

    lead_end = lead_silence(raw)
    # The trim keeps at most 0.05 s of lead. Anything beyond that was removed.
    lead_trim = max(0.0, lead_end - 0.05)

    p = run(["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-af", TRIM, "-ac", "1", "-c:a", "pcm_s16le", str(trimmed)])
    if p.returncode != 0 or not trimmed.exists():
        raise RuntimeError(f"Trim failed for {video}/{line_id}: {p.stderr}")

    loud_before = loudness(trimmed)
    gain = max(-MAX_GAIN, min(MAX_GAIN, TARGET_LUFS - loud_before))
    p = run([
        "ffmpeg", "-y", "-v", "error", "-i", str(trimmed),
        "-af", f"volume={gain:.2f}dB", "-ac", "1",
        "-c:a", "libmp3lame", "-b:a", "192k", str(final),
    ])
    if p.returncode != 0 or not final.exists():
        raise RuntimeError(f"Encode failed for {video}/{line_id}: {p.stderr}")

    duration = ffprobe_duration(final)
    info = ffprobe_audio(final)
    if int(info.get("channels", 0)) != 1:
        raise RuntimeError(f"{video}/{line_id}: output is not mono ({info})")
    audio_frames = math.ceil(duration * 30.0)
    loud_after = loudness(final)

    adjusted = [[text, round(max(0.0, start - lead_trim), 2)] for text, start in segs]
    entry = timing.get(line_id, {})
    entry["audioFrames"] = audio_frames
    entry["segs"] = adjusted
    timing[line_id] = entry

    print(
        f"  {video}/{line_id}: {source.split(':')[0]:5s} lead_trim={lead_trim:.3f}s "
        f"gain={gain:+.2f}dB {duration:.3f}s {audio_frames}f {loud_before:.1f}->{loud_after:.1f} LUFS"
    )
    return {
        "id": line_id,
        "source": source,
        "lead_trim": round(lead_trim, 3),
        "gain_db": round(gain, 2),
        "duration": round(duration, 3),
        "audio_frames": audio_frames,
        "loudness_before": round(loud_before, 2),
        "loudness_after": round(loud_after, 2),
        "channels": info.get("channels"),
        "bit_rate": info.get("bit_rate"),
        "file": str(final.relative_to(ROOT)),
    }


def main() -> None:
    report: dict[str, list[dict[str, Any]]] = {}
    for video in ("pp", "fe"):
        print(f"\n=== {video} ===")
        cfg = SPEC[video]
        voice_dir = ROOT / cfg["dir"]
        timing_path = ROOT / cfg["timing"]
        backup(voice_dir, video)
        timing = json.loads(timing_path.read_text(encoding="utf-8"))
        reuse_cache: dict[str, dict[str, Any]] = {}
        rows = []
        for line_id, line in cfg["lines"].items():
            rows.append(process_line(video, line_id, line, timing, reuse_cache))
        timing_path.write_text(json.dumps(timing, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        report[video] = rows
        print(f"  wrote {timing_path.relative_to(ROOT)}")

    (VOICE_V6 / "audio-report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print("\nDONE. audio-report.json written.")


if __name__ == "__main__":
    main()
