#!/usr/bin/env bash
# Final mastering pass for a rendered reel: two-pass loudnorm to -14 LUFS, true peak -1.5 dBTP, AAC 48 kHz.
# Video stream is copied untouched. Usage: scripts/master-reel.sh videos/NN-name/NN-name.mp4
set -euo pipefail
in="$1"; tmp="${in%.mp4}.master.tmp.mp4"
m=$(ffmpeg -nostats -i "$in" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$m" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -y -loglevel error -i "$in" -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,alimiter=limit=0.8:level=false" -c:a aac -b:a 320k -ar 48000 -movflags +faststart "$tmp"
mv "$tmp" "$in"
