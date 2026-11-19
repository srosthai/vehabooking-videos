TASK v8: apply NEW approved scripts to BOTH videos. Never touch ../Rentmee. Do not render Family or any other video.
Spec: voice-v8/spec.json -> {"fe": Ferry 03 (src/videos/11-ferry-03 / public/voice/ferry-03), "pp": Private PP-SR (src/videos/10-private-pp-sr / public/voice/pp-sr)}. Each line: url (new voice, already QA'd), segs [[captionPiece, rawStartSec]], caption (= exact on-screen text).
Speakers: A voice is now KiriTTS clone "Better Voice.", B is "Veha".
 FE: p01 A, p02 B, p03 A, p04 B, p05 A, p06 B, p07 B, p08 A, p09 B, p10 A, p11 B, p12 B.
 PP: p01 A, p02 A, p03 B, p04 A, p05 B, p06 A, p07 B, p08 A, p09 B, p10 A, p11 B, p12 A, p13 B.
Steps:
1. Back up public/voice/ferry-03, public/voice/pp-sr, both timing.json, narration.ts, video tsx, and both script .md files into voice-v8/prev/.
2. Reuse voice-v6/build.py logic: download each url, trim ONLY leading/trailing silence (keep <=0.05s lead), one plain gain to ~-17 LUFS (clamp +/-4 dB), mono mp3 192k -> <voice dir>/<id>.mp3. Subtract lead trim from seg starts (min 0, 2 decimals). audioFrames=ceil(dur*30). Rewrite timing.json with exactly these lines (remove stale keys if line count changed; PP has 13, FE has 12).
3. Update narration.ts (speaker per line, text/caption) so the scene list matches 12 / 13 lines with speakers above. Keep existing scene photos and titles; if a scene title no longer fits the new line, adjust minimally and report. Stickers: A stickers for A lines, B stickers for B lines (unchanged mapping).
4. Speaker label: on screen A currently shows "THAI" (a voice name). Check git history / *.bak* files for what A's label was before; if A's label was previously a persona name, restore that; otherwise keep the existing label style and report. Do not change B's label. Report exactly what you did.
5. Captions: word-by-word teal highlight from segs, no box, break only between words, avoid awkward wraps (2 lines max; add manual line breaks for long lines if needed).
6. Update scripts-ferry/ferry-03-koh-rong-sanloem-khmer-script.md and private-pp-siemreap-khmer-script.md with the new scripts (captions text, speaker A/B).
7. Typecheck must pass. Render stills for checking: for each video, 3 frames (a long-caption A scene, a long-caption B scene, the CTA) into out-check/v8-*.png and check caption wrap and sticker overlap.
8. npm run render:11ferry03-v then npm run render:10pp-v, both must exit 0. Verify audio stream present (volumedetect first 5s) and print ffprobe durations.
9. Write voice-v8/REPORT.md: per line duration/lead trim/gain, label decision, title changes, still paths, durations, render results.
