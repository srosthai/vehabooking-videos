# voice-v8 REPORT — Ferry 03 + Private PP-SR

Applied the approved v8 voices/scripts to both videos, verified stills/audio, rendered both reels, and left `../Rentmee`, Family, and every other video untouched.

## Scope

| Video | Project | Voice folder | Timing | Lines |
|---|---|---|---|---|
| Ferry 03 (`fe`) | `src/videos/11-ferry-03` | `public/voice/ferry-03` | `src/videos/11-ferry-03/timing.json` | 12 |
| Private PP-SR (`pp`) | `src/videos/10-private-pp-sr` | `public/voice/pp-sr` | `src/videos/10-private-pp-sr/timing.json` | 13 |

Backups of both voice folders, both timing JSONs, both `narration.ts`, both video `.tsx`, and both script `.md` files are in `voice-v8/prev/` (33 files).

## Voice build

`voice-v8/build.py` reuses the `voice-v6/build.py` rules:

- Download each `spec.json` URL.
- Trim leading/trailing silence only at `-45 dB`, keeping at most `0.05 s` of lead.
- Subtract the measured lead trim from every seg start (`max(0, start)`, 2 decimals).
- One plain gain toward `-17 LUFS`, clamped to `±4 dB`.
- Mono MP3, 192 kbps.
- `audioFrames = ceil(duration × 30)`.
- Rewrite `timing.json` with exactly the 12 FE / 13 PP spec lines.

All outputs report `1` channel / `192k`. Full machine-readable stats are in `voice-v8/audio-report.json`.

### Ferry 03 (`fe`)

| Line | Spk | Duration (s) | Frames | Lead trim (s) | Gain (dB) | LUFS before → after | Peak (dBFS) |
|---|---|---|---|---|---|---|---|
| p01 | A | 4.525 | 136 | 0.000 | +4.00 | -22.1 → -18.3 | +1.80 |
| p02 | B | 3.828 | 115 | 0.000 | -1.30 | -15.7 → -17.3 | -1.90 |
| p03 | A | 1.573 | 48 | 1.398 | +4.00 | -24.6 → -20.8 | -4.50 |
| p04 | B | 3.879 | 117 | 0.000 | -2.60 | -14.4 → -17.2 | -3.10 |
| p05 | A | 1.985 | 60 | 0.297 | +4.00 | -24.4 → -20.6 | +0.20 |
| p06 | B | 5.440 | 164 | 0.000 | -3.00 | -14.0 → -17.3 | -3.50 |
| p07 | B | 3.671 | 111 | 0.075 | -2.70 | -14.3 → -17.3 | -3.10 |
| p08 | A | 2.881 | 87 | 0.000 | +4.00 | -21.7 → -18.0 | -0.60 |
| p09 | B | 4.685 | 141 | 0.000 | +0.10 | -17.1 → -17.3 | -0.40 |
| p10 | A | 5.203 | 157 | 0.000 | +4.00 | -21.9 → -18.2 | +1.70 |
| p11 | B | 4.378 | 132 | 0.000 | -3.00 | -14.0 → -17.2 | -3.40 |
| p12 | B | 2.158 | 65 | 0.050 | -2.10 | -14.9 → -17.3 | -2.70 |

### Private PP-SR (`pp`)

| Line | Spk | Duration (s) | Frames | Lead trim (s) | Gain (dB) | LUFS before → after | Peak (dBFS) |
|---|---|---|---|---|---|---|---|
| p01 | A | 2.527 | 76 | 0.000 | +4.00 | -21.3 → -17.6 | +1.80 |
| p02 | A | 2.475 | 75 | 0.159 | +4.00 | -26.8 → -23.1 | -5.20 |
| p03 | B | 4.434 | 134 | 0.000 | -0.60 | -16.4 → -17.3 | -1.20 |
| p04 | A | 2.488 | 75 | 0.000 | +4.00 | -22.7 → -18.9 | +0.50 |
| p05 | B | 3.414 | 103 | 0.000 | -1.30 | -15.7 → -17.2 | -2.00 |
| p06 | A | 2.015 | 61 | 0.000 | +3.90 | -20.9 → -17.2 | -0.10 |
| p07 | B | 2.507 | 76 | 0.000 | -1.20 | -15.8 → -17.3 | -1.70 |
| p08 | A | 2.507 | 76 | 0.166 | +3.80 | -20.8 → -17.3 | -0.50 |
| p09 | B | 3.505 | 106 | 0.000 | -0.80 | -16.2 → -17.3 | -1.30 |
| p10 | A | 2.867 | 87 | 0.159 | +3.30 | -20.3 → -17.2 | +0.60 |
| p11 | B | 4.381 | 132 | 0.000 | -1.40 | -15.6 → -17.3 | -1.90 |
| p12 | A | 2.941 | 89 | 0.000 | +4.00 | -27.4 → -23.7 | -3.50 |
| p13 | B | 2.704 | 82 | 0.000 | +0.60 | -17.6 → -17.3 | -0.10 |

The `+4 dB` clamp leaves some quiet source clips below `-17 LUFS` (FE p01/p03/p05/p08/p10; PP p02/p04/p12). Some intermediate MP3 peaks exceed `0 dBFS` after the plain gain (FE p01/p05/p10; PP p01/p04/p10); no per-clip limiter was added because v6 deliberately does not use one. The final reel master applies `loudnorm` plus `alimiter` (true peak `-1.5 dBTP`).

## Speaker label decision

Kept the existing on-screen labels:

- A → `● THAI`
- B → `● VEHA`

No earlier persona name was found. Git history (`git log -S'THAI'`) and the `.bak` files only ever contain `THAI` for A; there is no prior A label to restore. B was left as `● VEHA`.

`narration.ts` did not need text edits: its A/B speaker mapping already matches the v8 spec, its titles/photos are unchanged, and its captions are read from the rewritten `timing.json`.

## Titles

No scene titles were changed. Every existing title still matches its new line:

- FE: `ចង់បានកន្លែងស្ងាត់?`, `កោះរ៉ុងសន្លឹម`, `ទៅម៉េច?`, `30 នាទី`, `ថ្លៃអត់?`, `$17 · ទៅមក $30`, `08:00 – 16:00`, `សុវត្ថិភាព?`, `អាវពោង · អ្នកបើកជំនាញ`, `សម្រាកឲ្យពេញទី`, `ងាយៗ ៣ ជំហាន`, `vehabooking.com`.
- PP: `ចង់ទៅសៀមរាប!`, `ឡានក្រុង? ធុញហើយ!`, `ឡានឯកជន`, `ថ្លៃអត់?`, `ចាប់ពី $65`, `ថោកម្ល៉េះ!`, `Door to door`, `ឈប់ញ៉ាំបាន?`, `ឈប់ញ៉ាំ · ថតរូប`, `ឡានធំ?`, `Sedan · SUV · MPV · Van`, `ទៅអង្គរវត្ត!`, `កក់ឥឡូវទៅ!`.

## Captions

Captions are the exact `spec.json` text, highlighted word-by-word in teal with no box, and all lines were checked at render scale. Every line is now at most 2 lines.

Manual breaks added after these words:

- FE: `p01 លំហែ`, `p02 ហើយ`, `p06 តែម្ដង`, `p08 ហើយ`, `p09 ពោង`.
- PP: `p01 នេះ`, `p02 ណាស់`, `p07 ផ្ទះ`, `p08 បាយ`, `p09 រូប`, `p12 អញ្ចឹង`.

Ferry 03 layout adjustment: the B caption size is `58` (was `60`) and the caption container is `left/right: 20` (was `50`) so FE p06 fits two balanced lines instead of three. Non-phone stickers in both videos moved from `top: 1040` to `top: 960` to keep clear of captions; the phone sticker remains at `top: 1120`, width `190`.

The two scripts were rewritten with the v8 captions and speaker assignments:

- `scripts-ferry/ferry-03-koh-rong-sanloem-khmer-script.md`
- `private-pp-siemreap-khmer-script.md`

## QA stills

Required stills (all inspected, captions ≤ 2 lines, no caption/person-sticker overlap):

| Video | Scene | Frame | Path |
|---|---|---|---|
| FE | p10 A (long caption) | 1100 | `out-check/v8-fe-a.png` |
| FE | p06 B (long caption) | 570 | `out-check/v8-fe-b.png` |
| FE | p12 CTA | 1390 | `out-check/v8-fe-cta.png` |
| PP | p08 A (long caption) | 690 | `out-check/v8-pp-a.png` |
| PP | p11 B (long caption) | 990 | `out-check/v8-pp-b.png` |
| PP | p13 CTA | 1215 | `out-check/v8-pp-cta.png` |

Extra full-line QA: all 25 scenes were rendered into `out-check/v8-lines/` and tiled into `out-check/v8-fe-sheet.png` and `out-check/v8-pp-sheet.png`; `out-check/v8-fix-sheet.png` shows the rebalanced FE p08/p09 and PP p02/p07/p12.

## Final renders

Commands, in the required order, both foreground and exit `0`:

1. `npm run render:11ferry03-v`
2. `npm run render:10pp-v`

Outputs:

- `videos/11-ferry-03/ferry03-kh-9x16.mp4` — 42,484,597 bytes (42.7 MB), `h264` 1080×1920 @ 30 fps.
- `videos/08-private-pp-sr/private-pp-sr-kh-9x16.mp4` — 36,534,735 bytes (36.7 MB), `h264` 1080×1920 @ 30 fps.

No `.master.tmp.mp4` or other temp file remains under `videos/`.

## Verification

### Ferry 03

- Timeline: 1459 frames / `48.633 s`; ffprobe container duration `48.700 s` (AAC frame padding).
- Video: `1459` frames, `1080×1920`, `30/1`.
- Audio: AAC, `48000 Hz`, 2 channels, 2281 frames — stream present.
- First 5 s `volumedetect`: mean `-17.8 dB`, max `-1.9 dB`.

### Private PP-SR

- Timeline: 1305 frames / `43.500 s`; ffprobe container duration `43.600 s` (AAC frame padding).
- Video: `1305` frames, `1080×1920`, `30/1`.
- Audio: AAC, `48000 Hz`, 2 channels, 2041 frames — stream present.
- First 5 s `volumedetect`: mean `-17.7 dB`, max `-1.8 dB`.

Both masters are limited below `0 dBFS`; the first-five-second checks confirm real signal, not silence.
