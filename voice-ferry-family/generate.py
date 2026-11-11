#!/usr/bin/env python3
"""Generate the 12 ferry-family lines with KiriTTS, one line at a time."""
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
OUT = ROOT / "voice-ferry-family"
RAW = OUT / "raw"
MCP = OUT / "mcp"
RAW.mkdir(parents=True, exist_ok=True)
MCP.mkdir(parents=True, exist_ok=True)

# caption = display text (digits retained); voice_text = spoken Khmer price words.
LINES = [
    ("f01", "C", "Sokhom", "បង! ចុងសប្ដាហ៍នេះ អូនចង់នាំកូនៗទៅដើរលេងកោះម្ដងបង។", "បង! ចុងសប្ដាហ៍នេះ អូនចង់នាំកូនៗទៅដើរលេងកោះម្ដងបង។"),
    ("f02", "C", "Sokhom", "តែយើងមានកូនតូចៗ ខ្លាចសំបុត្រទូកថ្លៃ ហើយអស់លុយច្រើនបង។", "តែយើងមានកូនតូចៗ ខ្លាចសំបុត្រទូកថ្លៃ ហើយអស់លុយច្រើនបង។"),
    ("f03", "B", "Veha", "អត់ថ្លៃទេអូន! កូនតូចយើងអាយុក្រោមប្រាំឆ្នាំ ជិះទូកហ្វ្រីតើ។", "អត់ថ្លៃទេអូន! កូនតូចយើងអាយុក្រោមប្រាំឆ្នាំ ជិះទូកហ្វ្រីតើ។"),
    ("f04", "C", "Sokhom", "ពិតមែនហ្អេសបង? ហ្វ្រីមែនហីបង!", "ពិតមែនហ្អេសបង? ហ្វ្រីមែនហីបង!"),
    ("f05", "B", "Veha", "មែនតើអូន! បើកូនធំអាយុប្រាំ ដល់ ដប់បីឆ្នាំ សំបុត្រត្រឹមតែ $8.50 ទេ។", "មែនតើអូន! បើកូនធំអាយុប្រាំ ដល់ ដប់បីឆ្នាំ សំបុត្រត្រឹមតែ ប្រាំបីដុល្លារកន្លះ ទេ។"),
    ("f06", "C", "Sokhom", "ចុម! ចឹងបងនឹងអូនម្នាក់ $17 កូនធំ $8.50 កូនតូចហ្វ្រី អត់អស់លុយច្រើនទេបង!", "ចុម! ចឹងបងនឹងអូនម្នាក់ ដប់ប្រាំពីរដុល្លារ កូនធំ ប្រាំបីដុល្លារកន្លះ កូនតូចហ្វ្រី អត់អស់លុយច្រើនទេបង!"),
    ("f07", "B", "Veha", "និងហើយអូន! បងកក់មួយគ្រួសារយើងហ្មង។", "និងហើយអូន! បងកក់មួយគ្រួសារយើងហ្មង។"),
    ("f08", "C", "Sokhom", "ចុះជិះទូកមានសុវត្ថិភាពអត់បង? អូនបារម្ភកូនៗយើងណាស់។", "ចុះជិះទូកមានសុវត្ថិភាពអត់បង? អូនបារម្ភកូនៗយើងណាស់។"),
    ("f09", "B", "Veha", "កុំបារម្ភអូន! ខាងទូកគេមានអាវពោងអោយពាក់ គ្រប់ៗគ្នា ហើយមានបន្ទប់ទឹកលើទូកថែមទៀត។", "កុំបារម្ភអូន! ខាងទូកគេមានអាវពោងអោយពាក់ គ្រប់ៗគ្នា ហើយមានបន្ទប់ទឹកលើទូកថែមទៀត។"),
    ("f10", "C", "Sokhom", "អញ្ចឹងអូនធូរចិត្តហើយ! ចុះយើងទៅកោះណាល្អបង?", "អញ្ចឹងអូនធូរចិត្តហើយ! ចុះយើងទៅកោះណាល្អបង?"),
    ("f11", "B", "Veha", "ទូកចេញពីព្រះសីហនុ មានទៅទាំងកោះរ៉ុង និងកោះរ៉ុងសន្លឹម អូនចង់ទៅណាក៏បាន។", "ទូកចេញពីព្រះសីហនុ មានទៅទាំងកោះរ៉ុង និងកោះរ៉ុងសន្លឹម អូនចង់ទៅណាក៏បាន។"),
    ("f12", "B", "Veha", "ចាំបងកក់ឥឡូវហ្មង! រើសកោះ រើសថ្ងៃ ចុច Book Now ជាការស្រេច នៅលើ vehabooking.com!", "ចាំបងកក់ឥឡូវហ្មង! រើសកោះ រើសថ្ងៃ ចុច Book Now ជាការស្រេច នៅលើ vehabooking.com!"),
]

MCP_URL = "https://mcp.kiritts.com/mcp"
UA = "curl/8.5.0"


def read_cred():
    path = os.path.expanduser("~/.local/share/opencode/opencode.db")
    con = sqlite3.connect(f"file:{path}?mode=ro", uri=True)
    row = con.execute("select value from credential where label='kiritts'").fetchone()
    con.close()
    return json.loads(row[0])


def refresh(cred):
    cid = cred["metadata"]["client"]["client_id"]
    data = urllib.parse.urlencode({"grant_type": "refresh_token", "refresh_token": cred["refresh"], "client_id": cid}).encode()
    req = urllib.request.Request("https://api.kiritts.com/oauth/token", data=data, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    req.add_header("User-Agent", UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode())["access_token"]


def rpc(token, name, args, ident):
    body = {"jsonrpc": "2.0", "id": ident, "method": "tools/call", "params": {"name": name, "arguments": args}}
    req = urllib.request.Request(MCP_URL, data=json.dumps(body).encode(), method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json, text/event-stream")
    req.add_header("Authorization", "Bearer " + token)
    req.add_header("User-Agent", UA)
    with urllib.request.urlopen(req, timeout=180) as r:
        raw = r.read().decode()
    datas = [l[6:] for l in raw.splitlines() if l.startswith("data: ")]
    return json.loads(datas[-1] if datas else raw)


def download(url, dst):
    subprocess.run(["curl", "-fL", "--retry", "6", "--retry-all-errors", "--retry-delay", "2", "-A", UA, "-o", str(dst), url], check=True)
    if not dst.exists() or dst.stat().st_size == 0:
        raise RuntimeError("download failed")


def word_timestamps(token, speech_id, ident):
    last = None
    for _ in range(25):
        try:
            r = rpc(token, "get_word_timestamps", {"speech_id": speech_id, "format": "json"}, ident)
            sc = r.get("result", {}).get("structuredContent")
            if sc and sc.get("words"):
                return sc
            last = r
        except Exception as e:
            last = repr(e)
        time.sleep(2)
    raise RuntimeError(f"no timestamps for {speech_id}: {last}")


def main():
    cred = read_cred()
    token_file = Path("/tmp/opencode/kiritts-access.txt")
    token = token_file.read_text().strip() if token_file.exists() else cred["access"]
    data_path = OUT / "words.json"
    data = json.loads(data_path.read_text()) if data_path.exists() else {}
    for i, (line_id, speaker, voice, caption, voice_text) in enumerate(LINES):
        if line_id in data and (RAW / f"{line_id}.mp3").exists():
            print(f"{line_id}: cached", flush=True)
            continue
        print(f"{line_id}: {speaker} · {voice}", flush=True)
        r = None
        for attempt in range(8):
            try:
                r = rpc(token, "text_to_speech", {"text": voice_text, "voice": voice, "speed": 1.0, "voice_matching": "natural", "format": "mp3"}, 3000 + i)
                if r.get("result", {}).get("structuredContent"):
                    break
                print("  retry response", json.dumps(r)[:240], flush=True)
            except urllib.error.HTTPError as e:
                if e.code == 401:
                    token = refresh(cred)
                    token_file.write_text(token)
                    print("  refreshed token", flush=True)
                else:
                    print("  http", e.code, e.read().decode()[:200], flush=True)
            except Exception as e:
                print("  retry", type(e).__name__, e, flush=True)
            time.sleep(3)
        if not r or not r.get("result", {}).get("structuredContent"):
            raise RuntimeError(f"TTS failed for {line_id}")
        sc = r["result"]["structuredContent"]
        (MCP / f"{line_id}-tts.json").write_text(json.dumps(r, ensure_ascii=False, indent=2) + "\n")
        download(sc["url"], RAW / f"{line_id}.mp3")
        words = word_timestamps(token, sc["speech_id"], 4000 + i)
        (MCP / f"{line_id}-words.json").write_text(json.dumps(words, ensure_ascii=False, indent=2) + "\n")
        data[line_id] = {
            "speaker": speaker, "voice": voice, "caption": caption, "voice_text": voice_text,
            "speech_id": sc["speech_id"], "url": sc["url"], "duration": words.get("duration"), "words": words["words"],
        }
        data_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
        print(f"  {words.get('duration')}s, {len(words['words'])} words", flush=True)
        time.sleep(1)
    print("DONE", flush=True)


if __name__ == "__main__":
    main()
