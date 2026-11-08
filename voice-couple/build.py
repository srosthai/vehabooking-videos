#!/usr/bin/env python3
"""Build airport-couple voices + word-level timing."""
from __future__ import annotations

import json
import math
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VOICE = ROOT / "voice-couple"
RAW = VOICE / "raw"
FINAL = ROOT / "public/voice/airport-couple"
TIMING = ROOT / "src/videos/14-airport-couple/timing.json"
FINAL.mkdir(parents=True, exist_ok=True)
TIMING.parent.mkdir(parents=True, exist_ok=True)

TARGET_LUFS = -17.0
TARGET_TP = -1.5
ENGLISH = {"ស៊ីដាន់": "Sedan", "វេហា": "Veha"}


def run(cmd, check=True):
    return subprocess.run(cmd, check=check, text=True, capture_output=True)


def duration(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)], text=True).strip())


def audio_info(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries", "stream=channels,bit_rate,sample_rate", "-of", "json", str(path)], text=True)
    return json.loads(out)["streams"][0]


def loudness(path):
    p = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-filter_complex", "ebur128", "-f", "null", "-"])
    m = re.search(r"Integrated loudness:\s*I:\s*(-?\d+(?:\.\d+)?)\s*LUFS", p.stderr)
    if not m:
        raise RuntimeError(f"loudness failed {path}")
    return float(m.group(1))


def loudnorm_measure(path):
    p = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-af", f"loudnorm=I={TARGET_LUFS}:TP={TARGET_TP}:LRA=11:print_format=json", "-f", "null", "-"])
    m = re.findall(r"\{[^{}]+\}", p.stderr, re.S)
    if not m:
        raise RuntimeError(f"loudnorm failed {path}")
    return json.loads(m[-1])


def make_segs(caption: str, words: list[dict]) -> list[list]:
    """One caption segment per spoken word; English brand/car tokens mapped back."""
    tokens = []  # (display, voice_index)
    i = 0
    while i < len(words):
        w = words[i]["text"].strip()
        if w in ("។", "៕", "៖", "ៈ"):
            i += 1
            continue
        if w == "វេហា" and i + 2 < len(words) and words[i + 1]["text"].strip() == "ប៊ុក" and words[i + 2]["text"].strip() == "ឃីង":
            tokens.append(("Veha", i))
            tokens.append(("Booking", i + 1))
            i += 3
            continue
        if w in ENGLISH:
            tokens.append((ENGLISH[w], i))
            i += 1
            continue
        tokens.append((w, i))
        i += 1

    # Locate each display token in caption in order, then slice between starts.
    starts = []
    pos = 0
    for text, idx in tokens:
        at = caption.find(text, pos)
        if at < 0:
            raise RuntimeError(f"token {text!r} not found after {pos} in {caption!r}")
        starts.append((at, idx))
        pos = at + len(text)
    # If English "Veha" and "Booking" are separate tokens, they are already found.
    segs = []
    for n, (at, idx) in enumerate(starts):
        end = starts[n + 1][0] if n + 1 < len(starts) else len(caption)
        segs.append([caption[at:end], round(float(words[idx]["start"]), 2)])
    joined = "".join(x[0] for x in segs)
    if joined != caption:
        raise RuntimeError(f"segs mismatch: {joined!r} != {caption!r}")
    return segs


def main():
    data = json.loads((VOICE / "words.json").read_text())
    timing = {}
    report = []
    for line_id, line in data.items():
        raw = RAW / f"{line_id}.mp3"
        final = FINAL / f"{line_id}.mp3"
        m = loudnorm_measure(raw)
        af = (
            f"loudnorm=I={TARGET_LUFS}:TP={TARGET_TP}:LRA=11:"
            f"measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
            f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:"
            f"offset={m['target_offset']}:linear=true,alimiter=limit=0.85:level=false"
        )
        run(["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-af", af, "-ac", "1", "-c:a", "libmp3lame", "-b:a", "192k", str(final)])
        dur = duration(final)
        info = audio_info(final)
        frames = math.ceil(dur * 30)
        segs = make_segs(line["caption"], line["words"])
        timing[line_id] = {"audioFrames": frames, "segs": segs}
        report.append({"id": line_id, "speaker": line["speaker"], "voice": line["voice"], "duration": round(dur, 6), "audio_frames": frames, "loudness": round(loudness(final), 2), "channels": info.get("channels"), "bit_rate": info.get("bit_rate"), "seg_count": len(segs), "file": str(final.relative_to(ROOT))})
        print(f"{line_id} {line['speaker']} {line['voice']} {dur:.3f}s {frames}f {loudness(final):.1f} LUFS {len(segs)} segs")
    TIMING.write_text(json.dumps(timing, ensure_ascii=False, indent=1) + "\n")
    (VOICE / "audio-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print("TOTAL", sum(v["audioFrames"] for v in timing.values()))


if __name__ == "__main__":
    main()
