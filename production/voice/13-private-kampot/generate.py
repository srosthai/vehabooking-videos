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

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / "voice-kampot"
RAW = OUT / "raw"
MCP = OUT / "mcp"
RAW.mkdir(parents=True, exist_ok=True)
MCP.mkdir(parents=True, exist_ok=True)

LINES: list[dict] = [
    {
        "id": "p01", "speaker": "A",
        "caption": "បង! ចុងសប្ដាហ៍នេះ ញុមចង់នាំគ្រួសារទៅលេងកំពតម្ដង។",
        "voice": "បង! ចុងសប្ដាហ៍នេះ ញុំចង់នាំគ្រួសារទៅលេងកំពតម្ដង។",
    },
    {
        "id": "p02", "speaker": "A",
        "caption": "តែមានក្មេងតូចៗផង ជិះឡានក្រុងពិបាកណាស់បង។",
        "voice": "តែមានក្មេងតូចៗផង ជិះឡានក្រុងពិបាកណាស់បង។",
    },
    {
        "id": "p03", "speaker": "B",
        "caption": "អឺ ចឹងជួលឡានឯកជន Veha Booking ទៅ! ជិះតែគ្រួសារអូនទេ។",
        "voice": "អឺ ចឹងជួលឡានឯកជន វេហា ប៊ុកឃីង ទៅ! ជិះតែគ្រួសារអូនទេ។",
    },
    {
        "id": "p04", "speaker": "A",
        "caption": "មែនហីបង! ចុះតម្លៃគេគិតម៉េចដែរ ថ្លៃអត់?",
        "voice": "មែនហីបង! ចុះតម្លៃគេគិតម៉េចដែរ ថ្លៃអត់?",
    },
    {
        "id": "p05", "speaker": "B",
        "caption": "អត់ថ្លៃទេ! ពីភ្នំពេញទៅកំពត ត្រឹមតែ $45 ប៉ុណ្ណោះ។",
        "voice": "អត់ថ្លៃទេ! ពីភ្នំពេញទៅកំពត ត្រឹមតែ សែសិបប្រាំដុល្លារ ប៉ុណ្ណោះ។",
    },
    {
        "id": "p06", "speaker": "A",
        "caption": "វ៉ាវ! ធូថ្លៃជាងជិះឡានក្រុងទៀតបង!",
        "voice": "វ៉ាវ! ធូថ្លៃជាងជិះឡានក្រុងទៀតបង!",
    },
    {
        "id": "p07", "speaker": "B",
        "caption": "ឡានមកយកដល់មុខផ្ទះ ជូនដល់សណ្ឋាគារតែម្ដង។",
        "voice": "ឡានមកយកដល់មុខផ្ទះ ជូនដល់សណ្ឋាគារតែម្ដង។",
    },
    {
        "id": "p08", "speaker": "A",
        "caption": "ចុះបើក្មេងចង់ឈប់ចូលបន្ទប់ទឹក ឬទិញអីញ៉ាំតាមផ្លូវ បានអត់?",
        "voice": "ចុះបើក្មេងចង់ឈប់ចូលបន្ទប់ទឹក ឬទិញអីញ៉ាំតាមផ្លូវ បានអត់?",
    },
    {
        "id": "p09", "speaker": "B",
        "caption": "បានតើ! ចង់ឈប់ត្រង់ណា ប្រាប់អ្នកបើកឡានមួយម៉ាត់ទៅ។",
        "voice": "បានតើ! ចង់ឈប់ត្រង់ណា ប្រាប់អ្នកបើកឡានមួយម៉ាត់ទៅ។",
    },
    {
        "id": "p10", "speaker": "A",
        "caption": "អូ! ចុះមានឡានធំៗ អត់បង ព្រោះញុមដាក់អីវ៉ាន់ទៅ រាងច្រើនតិចបង?",
        "voice": "អូ! ចុះមានឡានធំៗ អត់បង ព្រោះញុំដាក់អីវ៉ាន់ទៅ រាងច្រើនតិចបង?",
    },
    {
        "id": "p11", "speaker": "B",
        "caption": "មានគ្រប់ម៉ូតហ្មង! Sedan, SUV, MPV, Van ឡានគេស្អាត ត្រជាក់ ហើយអង្គុយស្រួលទៀត។",
        "voice": "មានគ្រប់ម៉ូតហ្មង! ស៊ីដាន់, អេសយូវី, អេមភីវី, វ៉ាន ឡានគេស្អាត ត្រជាក់ ហើយអង្គុយស្រួលទៀត។",
    },
    {
        "id": "p12", "speaker": "B",
        "caption": "គ្រាន់តែរើសទីកន្លែង រើសថ្ងៃ ហើយចុច Book Now ទៅចប់។ ចូលកក់ឥឡូវហ្មងទៅ តាម vehabooking.com!",
        "voice": "គ្រាន់តែរើសទីកន្លែង រើសថ្ងៃ ហើយចុច ប៊ុកណាវ ទៅចប់។ ចូលកក់ឥឡូវហ្មងទៅ តាម វេហាប៊ុកឃីង ដត ខម!",
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
