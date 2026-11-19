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
VOICE = ROOT / "voice-kampot"
RAW = VOICE / "raw"
TMP = VOICE / "tmp"
FINAL = ROOT / "public/voice/kampot"
TIMING = ROOT / "src/videos/13-private-kampot/timing.json"
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
    ("$45", "សែសិបប្រាំដុល្លារ"),
    ("ញុម", "ញុំ"),
]


# Word-level caption map: (display text including its original spacing,
# index into the KiriTTS word list). Concatenation must reproduce the caption.
MANUAL_SEGS: dict[str, list[tuple[str, int]]] = {
    "p01": [("បង! ",0),("ចុង",1),("សប្ដាហ៍",2),("នេះ ",3),("ញុម",4),("ចង់",5),("នាំ",6),("គ្រួសារ",7),("ទៅ",8),("លេង",9),("កំពត",10),("ម្ដង",11),("។",12)],
    "p02": [("តែ",0),("មាន",1),("ក្មេង",2),("តូច",3),("ៗ",4),("ផង ",5),("ជិះ",6),("ឡានក្រុង",7),("ពិបាក",8),("ណាស់",9),("បង",10),("។",11)],
    "p03": [("អឺ ",0),("ចឹង",1),("ជួល",2),("ឡាន",3),("ឯកជន ",4),("Veha ",5),("Booking ",6),("ទៅ! ",8),("ជិះ",9),("តែ",10),("គ្រួសារ",11),("អូន",12),("ទេ",13),("។",14)],
    "p04": [("មែន",0),("ហី",1),("បង! ",2),("ចុះ",3),("តម្លៃ",4),("គេ",5),("គិត",6),("ម៉េច",7),("ដែរ ",8),("ថ្លៃ",9),("អត់?",10)],
    "p05": [("អត់",0),("ថ្លៃ",1),("ទេ! ",2),("ពី",3),("ភ្នំពេញ",4),("ទៅ",5),("កំពត ",6),("ត្រឹមតែ ",7),("$45 ",8),("ប៉ុណ្ណោះ",11),("។",12)],
    "p06": [("វ៉ាវ! ",0),("ធូថ្លៃ",1),("ជាង",2),("ជិះ",3),("ឡានក្រុង",4),("ទៀត",5),("បង!",6)],
    "p07": [("ឡាន",0),("មក",1),("យក",2),("ដល់",3),("មុខ",4),("ផ្ទះ ",5),("ជូន",6),("ដល់",7),("សណ្ឋាគារ",8),("តែម្ដង",9),("។",10)],
    "p08": [("ចុះ",0),("បើ",1),("ក្មេង",2),("ចង់",3),("ឈប់",4),("ចូល",5),("បន្ទប់ទឹក ",6),("ឬ",7),("ទិញ",8),("អី",9),("ញ៉ាំ",10),("តាម",11),("ផ្លូវ ",12),("បាន",13),("អត់?",14)],
    "p09": [("បាន",0),("តើ! ",1),("ចង់",2),("ឈប់",3),("ត្រង់ណា ",4),("ប្រាប់",5),("អ្នកបើក",6),("ឡាន",7),("មួយ",8),("ម៉ាត់",9),("ទៅ",10),("។",11)],
    "p10": [("អូ! ",0),("ចុះ",1),("មាន",2),("ឡាន",3),("ធំ",4),("ៗ ",5),("អត់",6),("បង ",7),("ព្រោះ",8),("ញុម",9),("ដាក់",10),("អីវ៉ាន់",11),("ទៅ ",12),("រាង",13),("ច្រើន",14),("តិច",15),("បង?",16)],
    "p11": [("មាន",0),("គ្រប់",1),("ម៉ូត",2),("ហ្មង! ",3),("Sedan, ",4),("SUV, ",5),("MPV, ",7),("Van ",9),("ឡាន",10),("គេ",11),("ស្អាត ",12),("ត្រជាក់ ",13),("ហើយ",14),("អង្គុយ",15),("ស្រួល",16),("ទៀត",17),("។",18)],
    "p12": [("គ្រាន់តែ",0),("រើស",1),("ទីកន្លែង ",2),("រើស",3),("ថ្ងៃ ",4),("ហើយ",5),("ចុច ",6),("Book ",7),("Now ",8),("ទៅ",9),("ចប់",10),("។ ",11),("ចូល",12),("កក់",13),("ឥឡូវ",14),("ហ្មង",15),("ទៅ ",16),("តាម ",17),("vehabooking.com!",18)],
}


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
        if line_id in MANUAL_SEGS:
            segs = [[text, round(line["words"][idx]["start"], 2)] for text, idx in MANUAL_SEGS[line_id]]
            joined = "".join(text for text, _ in segs)
            if joined != line["caption"]:
                raise RuntimeError(f"Manual segs mismatch for {line_id}: {joined!r}")
        else:
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
