#!/usr/bin/env python3
"""Build SAI airport-to-house voices and word-level caption timing."""
from __future__ import annotations

import json
import math
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
VOICE = ROOT / "production/voice/19-sai-airport-house"
RAW = VOICE / "raw"
FINAL = ROOT / "public/voice/sai-airport-house"
TIMING = ROOT / "src/videos/19-sai-airport-house/timing.json"
FINAL.mkdir(parents=True, exist_ok=True)
TIMING.parent.mkdir(parents=True, exist_ok=True)

TARGET_LUFS = -17.0
TARGET_TP = -1.5
PUNCT = set("។៕៖ៈ!?,.\u200bៗ")

# Multi-word spoken phrases that map to one display token.
# (first spoken word, spoken-word count, display token)
SPANS = {
    "s01": [("ព្រលាន", 1, "ព្រលាន SAI")],
    "s05": [("វេហា", 3, "Veha Booking"), ("ម្ភៃ", 3, "$22")],
    "s07": [("វេហា", 5, "vehabooking.com"), ("ខេ", 4, "KHQR")],
    "s09": [("វេហា", 3, "Veha Booking")],
}

# Hand-tuned caption pages: the segment index that starts each new page.
PAGE_STARTS = {
    "s01": [6],
    "s02": [4],
    "s03": [10, 19, 26],
    "s04": [4],
    "s05": [9, 17, 21, 26],
    "s06": [3],
    "s07": [6, 13, 18, 20],
    "s08": [13, 18, 22],
    "s09": [3],
}


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


def segs_for(line_id: str, caption: str, words: list[dict]):
    spans = {}
    texts = [w["text"].strip() for w in words]
    for target, count, display in SPANS.get(line_id, []):
        idx = next(i for i, t in enumerate(texts) if t == target)
        spans[idx] = (count, display)

    tokens = []
    cursor = 0
    i = 0
    while i < len(words):
        if i in spans:
            count, display = spans[i]
            pos = caption.find(display, cursor)
            if pos < 0:
                raise RuntimeError(f"{line_id}: span {display} not found after {cursor}")
            tokens.append((pos, float(words[i]["start"]), display, pos + len(display)))
            cursor = pos + len(display)
            i += count
            continue
        text = texts[i]
        if not text or all(ch in PUNCT for ch in text):
            i += 1
            continue
        # TTS may split a visual word into several spoken parts. Find each
        # part sequentially; keep the raw gap to preserve Khmer spacing.
        pos = caption.find(text, cursor)
        if pos < 0:
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
                # Skip an unmatched noise token rather than fail the build.
                print(f"  {line_id}: skip unmatched {text!r}")
                i += 1
                continue
        tokens.append((pos, float(words[i]["start"]), text, pos + len(text)))
        cursor = pos + len(text)
        i += 1

    segs = []
    for n, (pos, start, _display, _end) in enumerate(tokens):
        end = tokens[n + 1][0] if n + 1 < len(tokens) else len(caption)
        raw = caption[pos:end]
        display = raw.strip()
        if not display:
            display = _display
        space_after = raw != raw.rstrip()
        segs.append([display, round(start, 2), space_after])
    return paginate(line_id, segs)


def paginate(line_id, segs):
    """Assign the hand-tuned page for each display segment."""
    starts = set(PAGE_STARTS.get(line_id, []))
    pages = []
    cur = []
    for i, (word, start, space_after) in enumerate(segs):
        if i in starts and cur:
            pages.append(cur)
            cur = []
        cur.append([word, start, 0, space_after])
    if cur:
        pages.append(cur)
    out = []
    for page_idx, page in enumerate(pages):
        for word, start, _old, space_after in page:
            out.append([word, start, page_idx, space_after])
    return out


def main():
    data = json.loads((VOICE / "words.json").read_text())
    timing = {}
    report = []
    for line_id in ["s01", "s02", "s03", "s04", "s05", "s06", "s07", "s08", "s09", "n01"]:
        line = data[line_id]
        raw = RAW / f"{line_id}.mp3"
        final = FINAL / f"{line_id}.mp3"
        words = line["words"]
        first_start = max(0.0, float(words[0]["start"]))
        last_end = max(float(w.get("end", w["start"])) for w in words)
        trim_start = max(0.0, first_start - 0.05)
        trim_end = min(duration(raw), last_end + 0.15)
        trimmed = Path("/tmp/opencode") / f"sai-airport-house-{line_id}-trim.wav"
        run(["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-af", f"highpass=f=80,atrim=start={trim_start}:end={trim_end},asetpts=PTS-STARTPTS", "-ar", "48000", "-ac", "1", str(trimmed)])
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
        segs = segs_for(line_id, line["caption"], words_adj) if line["caption"] else []
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
