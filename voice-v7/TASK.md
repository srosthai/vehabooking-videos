TASK v7: fix PP-SR scene 1 voice (p01) only. Never touch ../Rentmee. Do not render other videos.
1. Back up public/voice/pp-sr/p01.mp3 and videos/10-private-pp-sr/timing.json (and narration.ts if you change it) into voice-v7/prev/.
2. Download https://mcp.kiritts.com/files/b0ee2429568e0023cc0f8790adba6efe.mp3 to voice-v7/raw-p01.mp3 (also keep take1 b0575e630d52fbaf1e6d81fa3a1a2a73.mp3 as voice-v7/raw-take1.mp3 for reference, not used).
3. Process like voice-v6/build.py: trim only leading/trailing silence (keep <=0.05s lead), one plain gain to ~-17 LUFS (clamp +/-4dB), mono mp3 192k -> public/voice/pp-sr/p01.mp3. Check no clipping (peak < -0.5 dBFS).
4. New spoken text: «បង! ចុងសប្ដាហ៍នេះ ញុំចង់ទៅលេងសៀមរាបហើយ។» On-screen caption keeps ញុម: «បង! ចុងសប្ដាហ៍នេះ ញុមចង់ទៅលេងសៀមរាបហើយ។». Update p01 caption text wherever it lives (timing.json and narration.ts / script md for PP-SR) — remove «ដល់».
5. p01 segs (raw starts in seconds, subtract lead trim): [["បង! ",0.14],["ចុង",0.64],["សប្ដាហ៍",0.79],["នេះ ",1.17],["ញុម",1.27],["ចង់",1.65],["ទៅ",1.85],["លេង",1.95],["សៀមរាប",2.10],["ហើយ។",2.48]]. audioFrames = ceil(duration*30).
6. Make sure the caption doesn't wrap awkwardly (break only between words; ideally line 1 «បង! ចុងសប្ដាហ៍នេះ», line 2 the rest). Render a still of scene 1 into out-check/v7-p01.png to check.
7. npm run render:10pp-v must exit 0. Verify audio stream exists and has signal in the first 3s (ffmpeg volumedetect on -t 3).
8. Write voice-v7/REPORT.md with what changed, durations, still path, render result.
