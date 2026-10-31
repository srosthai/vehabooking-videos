#!/usr/bin/env bash
# usage: ./fetch.sh <hashes.txt> <public dir>
set -e; H=$1; P=$2
while read l id h; do d=$P/voice/ferry-$l; mkdir -p $d
 curl -sf -o /tmp/fz.mp3 https://mcp.kiritts.com/files/$h.mp3
 ffmpeg -y -v error -i /tmp/fz.mp3 -af "silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.08,areverse" -b:a 192k $d/$id.mp3
 echo "$l $id $(ffprobe -v error -show_entries format=duration -of csv=p=0 $d/$id.mp3)"
done < $H
