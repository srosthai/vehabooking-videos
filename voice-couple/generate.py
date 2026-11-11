#!/usr/bin/env python3
"""Generate the 13 airport-couple lines with KiriTTS, sequentially."""
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
OUT = ROOT / "voice-couple"
RAW = OUT / "raw"
MCP = OUT / "mcp"
RAW.mkdir(parents=True, exist_ok=True)
MCP.mkdir(parents=True, exist_ok=True)

LINES = [
    ("c01", "C", "Sokhom", "បង! ម៉ោងប៉ុន្មានហើយ? ជើងយន្តហោះយើងចេញម៉ោងដប់ណាបង?", "បង! ម៉ោងប៉ុន្មានហើយ? ជើងយន្តហោះយើងចេញម៉ោងដប់ណាបង?"),
    ("c02", "B", "Veha", "ហឹម! កុំប្រញាប់ពេក... បងចេះរៀបចំហើយ!", "ហឹម! កុំប្រញាប់ពេក... បងចេះរៀបចំហើយ!"),
    ("c03", "C", "Sokhom", "ពីក្រុងទៅព្រលានយន្តហោះសៀមរាប ឆ្ងាយណាស់ណាបង! កុំប្រាប់ថា ជិះម៉ូតូ ហើយដឹកវ៉ាលី ធំៗ ពីរហ្នឹង ទៀតណាបង!", "ពីក្រុងទៅព្រលានយន្តហោះសៀមរាប ឆ្ងាយណាស់ណាបង! កុំប្រាប់ថា ជិះម៉ូតូ ហើយដឹកវ៉ាលី ធំៗ ពីរហ្នឹង ទៀតណាបង!"),
    ("c04", "B", "Veha", "ជិះម៉ូតូអីអូន! បងបានកក់ឡាន Sedan តាម Veha Booking រួចហើយ។ ហើយឡាននឹងមកទទួលយើងដល់មុខផ្ទះតែម្តង!", "ជិះម៉ូតូអីអូន! បងបានកក់ឡាន ស៊ីដាន់ តាម វេហា ប៊ុកឃីង រួចហើយ។ ហើយឡាននឹងមកទទួលយើងដល់មុខផ្ទះតែម្តង!"),
    ("c05", "C", "Sokhom", "នោះណ៎បង! ឡានណាគេឈប់មុខផ្ទះយើងនេះ! ឡានដែលបងកក់មែនបង?", "នោះណ៎បង! ឡានណាគេឈប់មុខផ្ទះយើងនេះ! ឡានដែលបងកក់មែនបង?"),
    ("c06", "B", "Veha", "ហ្នឹងហើយអូន!", "ហ្នឹងហើយអូន!"),
    ("c07", "C", "Sokhom", "ចុម! លឿនរបស់គេ!", "ចុម! លឿនរបស់គេ!"),
    ("c08", "A", "Better Voice.", "ជម្រាបសួរបង! ខ្ញុំមកពី Veha Booking។ តោះចាំខ្ញុំជួយ លើកវ៉ាលីរបស់បងដាក់លើឡាន។", "ជម្រាបសួរបង! ខ្ញុំមកពី វេហា ប៊ុកឃីង។ តោះចាំខ្ញុំជួយ លើកវ៉ាលីរបស់បងដាក់លើឡាន។"),
    ("c09", "C", "Sokhom", "មកទទួលដល់មុខផ្ទះអីចឹង ស្រួលមែន! ប្តីរបស់អូន ពិតជាឆ្លាតមែន។", "មកទទួលដល់មុខផ្ទះអីចឹង ស្រួលមែន! ប្តីរបស់អូន ពិតជាឆ្លាតមែន។"),
    ("c10", "C", "Sokhom", "ចុះមួយឡានហ្នឹង តម្លៃប៉ុន្មានដែរបង?", "ចុះមួយឡានហ្នឹង តម្លៃប៉ុន្មានដែរបង?"),
    ("c11", "B", "Veha", "តម្លៃពិសេស តែដប់ប្រាំដុល្លារទេអូន!", "តម្លៃពិសេស តែដប់ប្រាំដុល្លារទេអូន!"),
    ("c12", "C", "Sokhom", "អូ! មួយឡានតែប៉ុណ្ណឹង? ដឹងអ៊ីចឹង អូនឈប់បារម្ភតាំងពីមុនហើយ!", "អូ! មួយឡានតែប៉ុណ្ណឹង? ដឹងអ៊ីចឹង អូនឈប់បារម្ភតាំងពីមុនហើយ!"),
    ("c13", "N", "Oudom", "ពីផ្ទះ ឬសណ្ឋាគារ ទៅព្រលានយន្តហោះសៀមរាប ហើយពីព្រលានមកផ្ទះវិញ កក់តាម Veha Booking កាន់តែមានភាពងាយស្រួល!", "ពីផ្ទះ ឬសណ្ឋាគារ ទៅព្រលានយន្តហោះសៀមរាប ហើយពីព្រលានមកផ្ទះវិញ កក់តាម វេហា ប៊ុកឃីង កាន់តែមានភាពងាយស្រួល!"),
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
    token = open("/tmp/opencode/kiritts-access.txt").read().strip() if os.path.exists("/tmp/opencode/kiritts-access.txt") else cred["access"]
    data_path = OUT / "words.json"
    data = json.loads(data_path.read_text()) if data_path.exists() else {}
    for i, (line_id, speaker, voice, caption, voice_text) in enumerate(LINES):
        if line_id in data and (RAW / f"{line_id}.mp3").exists():
            print(f"{line_id}: cached")
            continue
        print(f"{line_id}: {speaker} · {voice}", flush=True)
        r = None
        for attempt in range(6):
            try:
                r = rpc(token, "text_to_speech", {"text": voice_text, "voice": voice, "speed": 1.0, "voice_matching": "natural", "format": "mp3"}, 100 + i)
                if r.get("result", {}).get("structuredContent"):
                    break
                print("  retry response", json.dumps(r)[:240], flush=True)
            except urllib.error.HTTPError as e:
                if e.code == 401:
                    token = refresh(cred)
                    open("/tmp/opencode/kiritts-access.txt", "w").write(token)
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
        words = word_timestamps(token, sc["speech_id"], 200 + i)
        (MCP / f"{line_id}-words.json").write_text(json.dumps(words, ensure_ascii=False, indent=2) + "\n")
        data[line_id] = {"speaker": speaker, "voice": voice, "caption": caption, "voice_text": voice_text, "speech_id": sc["speech_id"], "url": sc["url"], "duration": words.get("duration"), "words": words["words"]}
        data_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
        print(f"  {words.get('duration')}s, {len(words['words'])} words", flush=True)
    print("DONE")


if __name__ == "__main__":
    main()
