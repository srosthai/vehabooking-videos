#!/usr/bin/env python3
"""Generate the 12 airport-dialogue voices with KiriTTS, one line at a time.

Voice rules from briefs/airport-dialogue.md:
- speed 1.0, voice_matching "natural", no instructions, no pause trimming
- A = "Better Voice.", B = "Veha"
- Khmer spellings for English tokens in the spoken text
"""
from __future__ import annotations

import json
import os
import sqlite3
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "voice-airport"
RAW = OUT / "raw"
MCP = OUT / "mcp"
RAW.mkdir(parents=True, exist_ok=True)
MCP.mkdir(parents=True, exist_ok=True)

LINES: list[dict] = [
    {
        "id": "p01", "speaker": "A",
        "caption": "បង! ញុមទើបចុះពីយន្តហោះ ហត់ណាស់ មិនដឹងជិះអីទៅសណ្ឋាគារទេ។",
        "voice": "បង! ញុំទើបចុះពីយន្តហោះ ហត់ណាស់ មិនដឹងជិះអីទៅសណ្ឋាគារទេ។",
    },
    {
        "id": "p02", "speaker": "B",
        "caption": "អឺ កក់ឡាន Veha Booking ទៅ! គេមកចាំទទួលដល់ព្រលានយន្តហោះតែម្ដង។",
        "voice": "អឺ កក់ឡាន វេហា ប៊ុកឃីង ទៅ! គេមកចាំទទួលដល់ព្រលានយន្តហោះតែម្ដង។",
    },
    {
        "id": "p03", "speaker": "A",
        "caption": "មែនហីបង! ហើយចាំយូរអត់ចុះបង?",
        "voice": "មែនហីបង! ហើយចាំយូរអត់ចុះបង?",
    },
    {
        "id": "p04", "speaker": "B",
        "caption": "អត់យូរទេ! អ្នកបើកឡានកាន់ស្លាកឈ្មោះ ចាំទទួលអូននៅមុខច្រកចេញស្រាប់។ គ្រាន់តែក្រឡេក ឃើញតែម្តង។",
        "voice": "អត់យូរទេ! អ្នកបើកឡានកាន់ស្លាកឈ្មោះ ចាំទទួលអូននៅមុខច្រកចេញស្រាប់។ គ្រាន់តែក្រឡេក ឃើញតែម្តង។",
    },
    {
        "id": "p05", "speaker": "A",
        "caption": "អូ ស្រួលមែនបង! ចុះតម្លៃគេថ្លៃអត់បង ហើយគេគិតម៉េចដែរបង?",
        "voice": "អូ ស្រួលមែនបង! ចុះតម្លៃគេថ្លៃអត់បង ហើយគេគិតម៉េចដែរបង?",
    },
    {
        "id": "p06", "speaker": "B",
        "caption": "អត់ថ្លៃទេ ពីព្រលានយន្តហោះតេជោ ទៅសណ្ឋាគារនៅភ្នំពេញ តែ $15 ទេ។",
        "voice": "អត់ថ្លៃទេ ពីព្រលានយន្តហោះតេជោ ទៅសណ្ឋាគារនៅភ្នំពេញ តែ ដប់ប្រាំដុល្លារ ទេ។",
    },
    {
        "id": "p07", "speaker": "A",
        "caption": "ចុម! ថោកមែនហ្ន៎! ចុះព្រលាននៅសៀមរាបមានដែរអត់?",
        "voice": "ចុម! ថោកមែនហ្ន៎! ចុះព្រលាននៅសៀមរាបមានដែរអត់?",
    },
    {
        "id": "p08", "speaker": "B",
        "caption": "មានតើ! ពីព្រលានយន្តហោះសៀមរាប ទៅសណ្ឋាគារនៅសៀមរាបក៏មានដែរ។",
        "voice": "មានតើ! ពីព្រលានយន្តហោះសៀមរាប ទៅសណ្ឋាគារនៅសៀមរាបក៏មានដែរ។",
    },
    {
        "id": "p09", "speaker": "A",
        "caption": "OK បង! ចុះបើញុមមកគ្នាច្រើន យកអីវ៉ាន់ច្រើនផង មានឡានធំដឹកអត់បង?",
        "voice": "អូខេ បង! ចុះបើញុំមកគ្នាច្រើន យកអីវ៉ាន់ច្រើនផង មានឡានធំដឹកអត់បង?",
    },
    {
        "id": "p10", "speaker": "B",
        "caption": "មានគ្រប់ម៉ូតហ្មង! ប្រភេទ Sedan, SUV, MPV, Van គឺមានចាប់ពីបួន ដល់ដប់ប្រាំកៅអី។",
        "voice": "មានគ្រប់ម៉ូតហ្មង! ប្រភេទ ស៊ីដាន់, អេសយូវី, អេមភីវី, វ៉ាន គឺមានចាប់ពីបួន ដល់ដប់ប្រាំកៅអី។",
    },
    {
        "id": "p11", "speaker": "A",
        "caption": "ល្អមែនបង! ចុះពេលត្រឡប់ទៅវិញ ពីសណ្ឋាគារទៅព្រលានយន្តហោះ គេមានដែរអត់បង?",
        "voice": "ល្អមែនបង! ចុះពេលត្រឡប់ទៅវិញ ពីសណ្ឋាគារទៅព្រលានយន្តហោះ គេមានដែរអត់បង?",
    },
    {
        "id": "p12", "speaker": "B",
        "caption": "មានតើ! គ្រាន់តែរើសថ្ងៃ រើសម៉ោង ចុច Book Now ទៅចប់។ ចូលកក់ឥឡូវហ្មងទៅ តាម vehabooking.com!",
        "voice": "មានតើ! គ្រាន់តែរើសថ្ងៃ រើសម៉ោង ចុច ប៊ុកណាវ ទៅចប់។ ចូលកក់ឥឡូវហ្មងទៅ តាម វេហាប៊ុកឃីង ដត ខម!",
    },
]

MCP_URL = "https://mcp.kiritts.com/mcp"
USER_AGENT = "curl/8.5.0"


def read_credential() -> dict:
    path = os.path.expanduser("~/.local/share/opencode/opencode.db")
    con = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
    row = con.execute("select value from credential where label='kiritts'").fetchone()
    con.close()
    if not row:
        raise RuntimeError("No kiritts credential in opencode.db")
    return json.loads(row[0])


def refresh_access(cred: dict) -> str:
    metadata = cred.get("metadata", {})
    client_id = metadata.get("client", {}).get("client_id")
    if not client_id:
        raise RuntimeError("No OAuth client_id in kiritts credential")
    data = urllib.parse.urlencode({
        "grant_type": "refresh_token",
        "refresh_token": cred["refresh"],
        "client_id": client_id,
    }).encode()
    req = urllib.request.Request("https://api.kiritts.com/oauth/token", data=data, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    req.add_header("User-Agent", USER_AGENT)
    with urllib.request.urlopen(req, timeout=60) as r:
        payload = json.loads(r.read().decode())
    return payload["access_token"]


def rpc(token: str, name: str, args: dict, ident: int, timeout: int = 240) -> dict:
    body = {"jsonrpc": "2.0", "id": ident, "method": "tools/call", "params": {"name": name, "arguments": args}}
    req = urllib.request.Request(MCP_URL, data=json.dumps(body).encode(), method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json, text/event-stream")
    req.add_header("Authorization", "Bearer " + token)
    req.add_header("User-Agent", USER_AGENT)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        raw = r.read().decode()
    datas = [line[6:] for line in raw.splitlines() if line.startswith("data: ")]
    return json.loads(datas[-1] if datas else raw)


def download(url: str, dst: Path) -> None:
    subprocess.run(
        ["curl", "-fL", "--retry", "6", "--retry-all-errors", "--retry-delay", "2", "-A", USER_AGENT, "-o", str(dst), url],
        check=True,
    )
    if not dst.exists() or dst.stat().st_size == 0:
        raise RuntimeError(f"Download failed: {url}")


def word_timestamps(token: str, speech_id: str, ident: int) -> dict:
    last = None
    for attempt in range(20):
        try:
            r = rpc(token, "get_word_timestamps", {"speech_id": speech_id, "format": "json"}, ident)
            sc = r.get("result", {}).get("structuredContent")
            if sc and sc.get("words"):
                return sc
            last = r
        except urllib.error.HTTPError as e:
            last = e.read().decode()[:500]
        time.sleep(2)
    raise RuntimeError(f"No word timestamps for {speech_id}: {last}")


def main() -> None:
    cred = read_credential()
    token = cred["access"]
    words_path = OUT / "words.json"
    data = json.loads(words_path.read_text(encoding="utf-8")) if words_path.exists() else {}

    for i, line in enumerate(LINES):
        line_id = line["id"]
        if line_id in data and (RAW / f"{line_id}.mp3").exists():
            print(f"{line_id}: cached")
            continue
        voice = "Better Voice." if line["speaker"] == "A" else "Veha"
        print(f"{line_id}: generating with {voice} ...", flush=True)
        try:
            r = rpc(token, "text_to_speech", {
                "text": line["voice"],
                "voice": voice,
                "speed": 1.0,
                "voice_matching": "natural",
                "format": "mp3",
            }, 100 + i)
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:1000]
            if e.code == 401:
                print("  access expired, refreshing")
                token = refresh_access(cred)
                cred = {**cred, "access": token}
                r = rpc(token, "text_to_speech", {
                    "text": line["voice"], "voice": voice, "speed": 1.0,
                    "voice_matching": "natural", "format": "mp3",
                }, 100 + i)
            else:
                raise RuntimeError(body)
        sc = r["result"]["structuredContent"]
        if not sc.get("speech_id"):
            raise RuntimeError(f"{line_id}: no speech_id: {r}")
        (MCP / f"{line_id}-tts.json").write_text(json.dumps(r, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        download(sc["url"], RAW / f"{line_id}.mp3")
        words = word_timestamps(token, sc["speech_id"], 200 + i)
        (MCP / f"{line_id}-words.json").write_text(json.dumps(words, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        data[line_id] = {
            "speaker": line["speaker"],
            "voice": voice,
            "caption": line["caption"],
            "voice_text": line["voice"],
            "speech_id": sc["speech_id"],
            "url": sc["url"],
            "duration": words.get("duration"),
            "words": words["words"],
        }
        words_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"  {words.get('duration')}s, {len(words['words'])} words", flush=True)

    print("DONE")


if __name__ == "__main__":
    main()
