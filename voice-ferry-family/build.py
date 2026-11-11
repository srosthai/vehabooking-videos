#!/usr/bin/env python3
"""Build ferry-family voices and word-level caption timing."""
from __future__ import annotations

import json
import math
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VOICE = ROOT / "voice-ferry-family"
RAW = VOICE / "raw"
FINAL = ROOT / "public/voice/ferry-family"
TIMING = ROOT / "src/videos/15-ferry-family/timing.json"
FINAL.mkdir(parents=True, exist_ok=True)
TIMING.parent.mkdir(parents=True, exist_ok=True)

TARGET_LUFS = -17.0
TARGET_TP = -1.5
PUNCT = set("។៕៖ៈ!?,.\u200bៗ")


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


def strip_punct(s: str) -> str:
    return s.strip().strip("".join(PUNCT)).strip()


def price_spans(line_id: str, words: list[dict]):
    """Return {voice_index: (count, display)} for the spoken price phrases."""
    texts = [w["text"].strip() for w in words]
    spans = {}
    if line_id == "f05":
        i = next(i for i, t in enumerate(texts) if t == "ប្រាំបី")
        spans[i] = (3, "$8.50")
    elif line_id == "f06":
        i = next(i for i, t in enumerate(texts) if t == "ដប់")
        spans[i] = (3, "$17")
        j = next(j for j, t in enumerate(texts) if t == "ប្រាំបី" and j > i)
        spans[j] = (3, "$8.50")
    return spans


def segs_for(line_id: str, caption: str, words: list[dict]):
    spans = price_spans(line_id, words)
    tokens = []
    cursor = 0
    i = 0
    texts = [w["text"].strip() for w in words]
    while i < len(words):
        if i in spans:
            count, display = spans[i]
            pos = caption.find(display, cursor)
            if pos < 0:
                raise RuntimeError(f"{line_id}: price {display} not found after {cursor}")
            tokens.append((pos, float(words[i]["start"]), display))
            cursor = pos + len(display)
            i += count
            continue
        text = texts[i]
        if not text or all(ch in PUNCT for ch in text):
            i += 1
            continue
        # English domain is split by the TTS into "vehabooking" + "com".
        if text == "vehabooking" and i + 1 < len(texts) and texts[i + 1] == "com":
            display = "vehabooking.com"
            pos = caption.find(display, cursor)
            if pos < 0:
                raise RuntimeError(f"{line_id}: {display} not found after {cursor}")
            tokens.append((pos, float(words[i]["start"]), display))
            cursor = pos + len(display)
            i += 2
            continue
        pos = caption.find(text, cursor)
        if pos < 0:
            # TTS may split or attach a word slightly differently. Try the
            # normalized form in a short look-ahead window.
            found = False
            for alt in range(i + 1, min(len(words), i + 3)):
                for nxt in (texts[alt], f"{text}{texts[alt]}"):
                    p2 = caption.find(nxt, cursor)
                    if p2 >= 0:
                        pos = p2
                        text = nxt
                        i = alt
                        found = True
                        break
                if found:
                    break
            if not found:
                raise RuntimeError(f"{line_id}: word {text!r} not found after {cursor} in {caption!r}")
        tokens.append((pos, float(words[i]["start"]), text))
        cursor = pos + len(text)
        i += 1

    segs = []
    for n, (pos, start, _display) in enumerate(tokens):
        end = tokens[n + 1][0] if n + 1 < len(tokens) else len(caption)
        display = caption[pos:end].strip()
        if not display:
            display = _display
        segs.append([display, round(start, 2)])
    return segs


def main():
    data = json.loads((VOICE / "words.json").read_text())
    timing = {}
    report = []
    for line_id in sorted(data):
        line = data[line_id]
        raw = RAW / f"{line_id}.mp3"
        final = FINAL / f"{line_id}.mp3"
        words = line["words"]
        first_start = max(0.0, float(words[0]["start"]))
        last_end = max(float(w.get("end", w["start"])) for w in words)
        trim_start = max(0.0, first_start - 0.05)
        trim_end = min(duration(raw), last_end + 0.15)
        trimmed = Path("/tmp/opencode") / f"ferry-family-{line_id}-trim.wav"
        run(["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-af", f"atrim=start={trim_start}:end={trim_end},asetpts=PTS-STARTPTS", "-ar", "48000", "-ac", "1", str(trimmed)])
        m = loudnorm_measure(trimmed)
        af = (
            f"loudnorm=I={TARGET_LUFS}:TP={TARGET_TP}:LRA=11:"
            f"measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
            f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:"
            f"offset={m['target_offset']}:linear=true,alimiter=limit=0.85:level=false"
        )
        run(["ffmpeg", "-y", "-v", "error", "-i", str(trimmed), "-af", af, "-ac", "1", "-c:a", "libmp3lame", "-b:a", "192k", str(final)])
        dur = duration(final)
        info = audio_info(final)
        frames = math.ceil(dur * 30)
        words_adj = [
            {**w, "start": max(0.0, float(w["start"]) - trim_start), "end": max(0.0, float(w.get("end", w["start"])) - trim_start)}
            for w in words
        ]
        segs = segs_for(line_id, line["caption"], words_adj)
        timing[line_id] = {"audioFrames": frames, "segs": segs}
        report.append({
            "id": line_id, "speaker": line["speaker"], "voice": line["voice"],
            "duration": round(dur, 6), "audio_frames": frames, "loudness": round(loudness(final), 2),
            "channels": info.get("channels"), "bit_rate": info.get("bit_rate"),
            "seg_count": len(segs), "file": str(final.relative_to(ROOT)),
        })
        print(f"{line_id} {line['speaker']} {line['voice']} {dur:.3f}s {frames}f {loudness(final):.1f} LUFS {len(segs)} segs")
    TIMING.write_text(json.dumps(timing, ensure_ascii=False, indent=1) + "\n")
    (VOICE / "audio-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print("TOTAL AUDIO FRAMES", sum(v["audioFrames"] for v in timing.values()))


if __name__ == "__main__":
    main()
