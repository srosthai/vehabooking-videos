TASK (voice v6, natural conversational voice). Work ONLY in this project. NEVER touch ../Rentmee. Do not render the Family video.
Spec: voice-v6/spec.json. Two videos: "pp" (Private PP-SR) and "fe" (Ferry 03).
For each line in spec:
 a) If it has "url": download base+url+".mp3" with curl to voice-v6/raw/<video>-<id>.mp3. Use "starts" (seconds, one per caption) and "caps" (caption text).
    If it has "reuse": copy that mp3 as the raw file, and take segs for that id from the "reuse_timing" json (keep its caption text and start times exactly).
 b) Process each raw file with ffmpeg: trim ONLY leading and trailing silence (silenceremove start_periods=1, start_threshold=-45dB, and the same for the end via areverse), keep at most 0.05s lead. Do NOT cut pauses inside the line, do NOT change speed or pitch, do NOT use loudnorm. Gentle volume match only: measure integrated loudness (ebur128) and apply a single plain volume gain so each clip lands at about -17 LUFS (clamp gain to +/-4 dB). Output mono mp3 192k at <dir>/<id>.mp3 (back up the existing folder first to voice-v6/prev-<video>/).
 c) If leading trim removed T seconds, subtract T from every start (min 0) and round to 2 decimals.
 d) Write <timing> json entry: {"audioFrames": ceil(duration_seconds*30), "segs": [[cap, start], ...]}. Keep all other keys.
Then render 9x16 only: `npm run render:10pp-v` then `npm run render:11ferry03-v`. Must exit 0.
Finally write voice-v6/REPORT.md: per line: source (new url or reuse), lead trim, gain dB, final duration; and the two video durations (ffprobe).
