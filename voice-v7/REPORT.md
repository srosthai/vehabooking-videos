# Voice v7 — PP-SR p01 Fix Report

## What changed
- Replaced **PP-SR p01** voice with the new take:
  - `https://mcp.kiritts.com/files/b0ee2429568e0023cc0f8790adba6efe.mp3`
  - Take 1 kept for reference only: `voice-v7/raw-take1.mp3`
- Processed with the same rules as `voice-v6/build.py`:
  - trimmed leading/trailing silence only at -45 dB, kept ≤0.05 s lead
  - one plain volume gain, clamped to ±4 dB
  - no speed/pitch change, no loudnorm, no internal pause cuts
  - output mono MP3 192 kbps
- New spoken text: «បង! ចុងសប្ដាហ៍នេះ ញុំចង់ទៅលេងសៀមរាបហើយ។»
- On-screen caption: «បង! ចុងសប្ដាហ៍នេះ ញុមចង់ទៅលេងសៀមរាបហើយ។»
  - removed «ដល់»
- Updated `src/videos/10-private-pp-sr/timing.json` p01 `audioFrames` and `segs`.
- Updated `private-pp-siemreap-khmer-script.md` line 1 to remove «ដល់».
- Added a p01-only line break after «នេះ » in
  `src/videos/10-private-pp-sr/PrivatePpSrVideo.tsx` so the caption reads:
  - line 1: «បង! ចុងសប្ដាហ៍នេះ»
  - line 2: «ញុមចង់ទៅលេងសៀមរាបហើយ។»
- `narration.ts` was not changed; it reads p01 from `timing.json`.

## p01 audio result
- Lead trim: **0.100 s** (exact 0.099625 s)
- Gain: **-1.50 dB**
- Final duration: **2.705813 s**
- `audioFrames`: **82**
- Integrated loudness: **-17.2 LUFS**
- True peak: **-2.1 dBFS** (no clipping; < -0.5 dBFS)

## Verification
- Still rendered: `out-check/v7-p01.png`
- Caption line break verified in the still.
- `npm run render:10pp-v`: **exit 0**
- Final video: `videos/08-private-pp-sr/private-pp-sr-kh-9x16.mp4`
- Video duration: **38.500 s**
- Audio stream: **AAC, 48 kHz, stereo**
- First 3 s signal check (`ffmpeg ... -t 3 -af volumedetect`):
  - mean_volume: **-16.6 dB**
  - max_volume: **-1.9 dB**

## Backups
- `voice-v7/prev/p01.mp3`
- `voice-v7/prev/timing.json`
- `voice-v7/prev/narration.ts.bak`
- `voice-v7/prev/PrivatePpSrVideo.tsx.bak`
- `voice-v7/prev/private-pp-siemreap-khmer-script.md`

No other videos were rendered and `../Rentmee` was not touched.
