#!/usr/bin/env python3
"""Build airport-dialogue voices + timing.

- No pause trimming: the raw KiriTTS clip is encoded as delivered.
- Loudness: two-pass loudnorm to -17 LUFS / -1.5 dBTP, then a safety limiter,
  so A ("Better Voice.") and B ("Veha") sit at the same conversational level.
- Caption starts come from KiriTTS word timestamps, mapped to the exact
  on-screen chunks (so English captions can replace Khmer spellings).
"""
from __future__ import annotations

import json
import math
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VOICE = ROOT / "voice-airport"
RAW = VOICE / "raw"
TMP = VOICE / "tmp"
FINAL = ROOT / "public/voice/airport-dialogue"
TIMING = ROOT / "src/videos/12-airport-dialogue/timing.json"
TMP.mkdir(parents=True, exist_ok=True)
FINAL.mkdir(parents=True, exist_ok=True)
TIMING.parent.mkdir(parents=True, exist_ok=True)

TARGET_LUFS = -17.0
TARGET_TP = -1.5

REPLACEMENTS = [
    ("vehabooking.com", "វេហាប៊ុកឃីង ដត ខម"),
    ("Veha Booking", "វេហា ប៊ុកឃីង"),
    ("Book Now", "ប៊ុកណាវ"),
    ("Sedan", "ស៊ីដាន់"),
    ("SUV", "អេសយូវី"),
    ("MPV", "អេមភីវី"),
    ("Van", "វ៉ាន"),
    ("OK", "អូខេ"),
    ("$15", "ដប់ប្រាំដុល្លារ"),
    ("ញុម", "ញុំ"),
]


def run(cmd: list[str], check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, check=check, text=True, capture_output=True)


def duration(path: Path) -> float:
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        text=True,
    ).strip())


def audio_info(path: Path) -> dict:
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-select_streams", "a:0",
        "-show_entries", "stream=channels,bit_rate,sample_rate",
        "-of", "json", str(path),
    ], text=True)
    return json.loads(out)["streams"][0]


def loudness(path: Path) -> float:
    p = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-filter_complex", "ebur128", "-f", "null", "-"])
    m = re.search(r"Integrated loudness:\s*I:\s*(-?\d+(?:\.\d+)?)\s*LUFS", p.stderr)
    if not m:
        raise RuntimeError(f"Could not read loudness from {path}")
    return float(m.group(1))


def loudnorm_measure(path: Path) -> dict:
    p = run([
        "ffmpeg", "-hide_banner", "-nostats", "-i", str(path),
        "-af", f"loudnorm=I={TARGET_LUFS}:TP={TARGET_TP}:LRA=11:print_format=json",
        "-f", "null", "-",
    ])
    matches = re.findall(r"\{[^{}]+\}", p.stderr, re.S)
    if not matches:
        raise RuntimeError(f"Could not read loudnorm data from {path}")
    return json.loads(matches[-1])


def spokenize(caption: str) -> str:
    s = caption
    for src, dst in REPLACEMENTS:
        s = s.replace(src, dst)
    return s


def norm(s: str) -> str:
    return re.sub(r"[\s.,!?។…,;:'\"“”‘’\-–—]", "", s)


def caption_chunks(caption: str) -> list[str]:
    chunks = re.findall(r"\S+\s*", caption)
    if "".join(chunks) != caption:
        raise RuntimeError(f"Chunking changed caption: {caption!r}")
    return chunks


def build_segs(caption: str, words: list[dict]) -> list[list]:
    lex = []
    for w in words:
        n = norm(w["text"])
        if n:
            lex.append((n, float(w["start"]), float(w["end"])))
    if not lex:
        raise RuntimeError("No lexical words")

    # Character ranges of the spoken text, then caption chunks, in the same
    # normalized space. The two texts are asserted equal below.
    cum = []
    off = 0
    for text, start, end in lex:
        cum.append((off, off + len(text), start, end))
        off += len(text)
    voice_total = off
    caption_total = len(norm(spokenize(caption)))
    if voice_total != caption_total:
        raise RuntimeError(f"Alignment mismatch {voice_total} != {caption_total} for {caption!r}")

    chunks = caption_chunks(caption)
    # "Veha Booking" and "Book Now" are spoken as single Khmer phrases but
    # displayed as two English words. Group them only for offset accounting.
    groups: list[list[int]] = []
    i = 0
    while i < len(chunks):
        pair = (chunks[i].strip(), chunks[i + 1].strip() if i + 1 < len(chunks) else "")
        if pair in (("Veha", "Booking"), ("Book", "Now")):
            groups.append([i, i + 1])
            i += 2
        else:
            groups.append([i])
            i += 1

    segs: list[list] = []
    cap_off = 0
    for group in groups:
        group_text = "".join(chunks[j] for j in group)
        piece = norm(spokenize(group_text))
        if not piece:
            continue
        target = cap_off
        start = lex[-1][1]
        gi = len(cum) - 1
        for idx, (a, b, s, _e) in enumerate(cum):
            if a <= target < b or (target == voice_total and b == voice_total):
                start = s
                gi = idx
                break
        for n, j in enumerate(group):
            # Two-word phrases spoken as two words ("Veha Booking",
            # "Book Now") get a per-word start; anything else shares the
            # phrase start.
            sub_start = cum[min(gi + n, len(cum) - 1)][2] if len(group) == 2 else start
            segs.append([chunks[j], round(sub_start, 2)])
        cap_off += len(piece)
    if cap_off != caption_total:
        raise RuntimeError(f"Caption chunk alignment mismatch for {caption!r}")
    joined = "".join(x[0] for x in segs)
    if joined != caption:
        raise RuntimeError(f"segs do not reconstruct caption: {joined!r} != {caption!r}")
    return segs


def main() -> None:
    data = json.loads((VOICE / "words.json").read_text(encoding="utf-8"))
    timing = {}
    report = []
    for line_id, line in data.items():
        raw = RAW / f"{line_id}.mp3"
        final = FINAL / f"{line_id}.mp3"
        if not raw.exists():
            raise FileNotFoundError(raw)

        m = loudnorm_measure(raw)
        af = (
            f"loudnorm=I={TARGET_LUFS}:TP={TARGET_TP}:LRA=11:"
            f"measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
            f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:"
            f"offset={m['target_offset']}:linear=true,"
            "alimiter=limit=0.85:level=false"
        )
        run(["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-af", af, "-ac", "1", "-c:a", "libmp3lame", "-b:a", "192k", str(final)])

        dur = duration(final)
        info = audio_info(final)
        if int(info.get("channels", 0)) != 1:
            raise RuntimeError(f"{line_id}: expected mono, got {info}")
        segs = build_segs(line["caption"], line["words"])
        frames = math.ceil(dur * 30.0)
        timing[line_id] = {"audioFrames": frames, "segs": segs}
        report.append({
            "id": line_id,
            "speaker": line["speaker"],
            "voice": line["voice"],
            "duration": round(dur, 6),
            "audio_frames": frames,
            "loudness": round(loudness(final), 2),
            "channels": info.get("channels"),
            "bit_rate": info.get("bit_rate"),
            "seg_count": len(segs),
            "file": str(final.relative_to(ROOT)),
        })
        print(f"{line_id} {line['speaker']} {dur:.3f}s {frames}f {loudness(final):.1f} LUFS {len(segs)} segs")

    TIMING.write_text(json.dumps(timing, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    (VOICE / "audio-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    total = sum(v["audioFrames"] for v in timing.values())
    print(f"wrote {TIMING.relative_to(ROOT)}; voice frames total {total} ({total/30:.2f}s)")


if __name__ == "__main__":
    main()
