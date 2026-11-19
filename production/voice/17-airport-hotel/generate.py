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

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / "voice-airport-hotel"
RAW = OUT / "raw"
MCP = OUT / "mcp"
RAW.mkdir(parents=True, exist_ok=True)
MCP.mkdir(parents=True, exist_ok=True)

# caption = display text (digits retained); voice_text = spoken Khmer price words.
LINES = [
    ("a01", "C", "Sokhom", "បង! ដល់ព្រលានយន្តហោះហើយ តែយប់ហើយ អីវ៉ាន់យើងក៏ច្រើនទៀត។", "បង! ដល់ព្រលានយន្តហោះហើយ តែយប់ហើយ អីវ៉ាន់យើងក៏ច្រើនទៀត។"),
    ("a02", "C", "Sokhom", "ចុះយើងជិះអីទៅសណ្ឋាគារទៅបង? ខ្លាចពិបាករកឡាន។", "ចុះយើងជិះអីទៅសណ្ឋាគារទៅបង? ខ្លាចពិបាករកឡាន។"),
    ("a03", "B", "Veha", "កុំបារម្ភអូន! បងកក់ឡានពី vehabooking.com រួចអស់ហើយ។", "កុំបារម្ភអូន! បងកក់ឡានពី vehabooking.com រួចអស់ហើយ។"),
    ("a04", "C", "Sokhom", "មែនអត់បង? កក់តាំងពីពេលណាហ្នឹង?", "មែនអត់បង? កក់តាំងពីពេលណាហ្នឹង?"),
    ("a05", "B", "Veha", "កក់តាំងពីមុនឡើងយន្តហោះម្ល៉េះ! ទោះយន្តហោះមកយឺត ក៏មានឡានចាំយើងស្រាប់ដែរ។", "កក់តាំងពីមុនឡើងយន្តហោះម្ល៉េះ! ទោះយន្តហោះមកយឺត ក៏មានឡានចាំយើងស្រាប់ដែរ។"),
    ("a06", "C", "Sokhom", "ចុះអ្នកបើកឡានហ្នឹង គាត់ចំណាំយើងម៉េចទៅបង?", "ចុះអ្នកបើកឡានហ្នឹង គាត់ចំណាំយើងម៉េចទៅបង?"),
    ("a07", "B", "Veha", "គាត់កាន់ផ្លាកឈ្មោះយើង ចាំនៅច្រកចេញហ្មងអូន ហើយគេជួយលើកអីវ៉ាន់យើងទៀត។", "គាត់កាន់ផ្លាកឈ្មោះយើង ចាំនៅច្រកចេញហ្មងអូន ហើយគេជួយលើកអីវ៉ាន់យើងទៀត។"),
    ("a08", "C", "Sokhom", "អញ្ចឹងស្រួលតើបង! ចុះសេវាកម្មហ្នឹងមានតែនៅភ្នំពេញ ឬនៅសៀមរាបក៏មានដែរ?", "អញ្ចឹងស្រួលតើបង! ចុះសេវាកម្មហ្នឹងមានតែនៅភ្នំពេញ ឬនៅសៀមរាបក៏មានដែរ?"),
    ("a09", "B", "Veha", "មានទាំងភ្នំពេញ ទាំងសៀមរាបហ្មង! ពីព្រលានទៅសណ្ឋាគារ ឬពីសណ្ឋាគារមកព្រលានវិញក៏បាន។", "មានទាំងភ្នំពេញ ទាំងសៀមរាបហ្មង! ពីព្រលានទៅសណ្ឋាគារ ឬពីសណ្ឋាគារមកព្រលានវិញក៏បាន។"),
    ("a10", "C", "Sokhom", "ចុះតម្លៃវិញ ថ្លៃអត់បង?", "ចុះតម្លៃវិញ ថ្លៃអត់បង?"),
    ("a11", "B", "Veha", "អត់ទេអូន! ឡាន Sedan នៅភ្នំពេញតែ $15 នៅសៀមរាបតែ $18 ទេ ឃើញតម្លៃច្បាស់មុនកក់ហ្មង។", "អត់ទេអូន! ឡាន Sedan នៅភ្នំពេញតែ ដប់ប្រាំដុល្លារ នៅសៀមរាបតែ ដប់ប្រាំបីដុល្លារ ទេ ឃើញតម្លៃច្បាស់មុនកក់ហ្មង។"),
    ("a12", "B", "Veha", "លើកក្រោយ អូនកក់ខ្លួនឯងក៏បានដែរ! គ្រាន់តែរើសព្រលាន រើសសណ្ឋាគារ ហើយចុច Book Now នៅ vehabooking.com ជាការស្រេច!", "លើកក្រោយ អូនកក់ខ្លួនឯងក៏បានដែរ! គ្រាន់តែរើសព្រលាន រើសសណ្ឋាគារ ហើយចុច Book Now នៅ vehabooking.com ជាការស្រេច!"),
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
