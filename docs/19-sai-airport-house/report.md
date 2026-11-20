# Video 2 — SAI airport → Siem Reap house — build report

Composition: `SaiAirportHouseKhVertical` (`src/videos/19-sai-airport-house`)
Output: `renders/19-sai-airport-house/19-sai-airport-house-kh-9x16.mp4`
Specs: 1080×1920 · 30 fps · 2330 frames · 77.7 s · H.264 + AAC 48 kHz stereo · 40,754,939 bytes
Mastering: `scripts/master-reel.sh` → loudnorm −14 LUFS, TP −1.5; measured mean −17.4 dB, max −1.9 dB.

## Live price check

Checked 20 Nov 2026 against the airport-schedules API (`docs/19-sai-airport-house/price-check.json`):

| Model | One way |
|---|---|
| Sedan | $22 |
| SUV | $22 |
| MPV | $30 |
| Van | $35 |

API route duration: `1h`. The only travel-time claim on screen is `≈ 1 ម៉ោង`.

## Scene timing

| Scene | Start | End | Voice |
|---|---|---|---|
| s01 arrival | 0.00 s | 5.07 s | 4.63 s |
| s02 wife / taxi outside | 5.07 s | 9.23 s | 3.87 s |
| s03 queue + highway | 9.23 s | 16.43 s | 6.90 s |
| s04 tired wife | 16.43 s | 20.63 s | 3.90 s |
| s05 phone + 4-model card | 20.63 s | 30.67 s | 9.73 s |
| s06 Sedan $22 | 30.67 s | 34.37 s | 3.40 s |
| s07 book / KHQR / name sign | 34.37 s | 48.77 s | 14.10 s |
| s08 sign + luggage | 48.77 s | 56.40 s | 7.33 s |
| s09 home | 56.40 s | 61.03 s | 4.33 s |
| s10 end card | 61.03 s | 77.67 s | n01 12.48 s + 3.33 s hold |

## Voices

| Line | Speaker | Clone | Duration | Loudness |
|---|---|---|---|---|
| s01 | Husband | Veha | 4.63 s | −17.2 dB mean |
| s02 | Wife | Sokhom | 3.84 s | −16.9 dB mean |
| s03 | Husband | Veha | 6.87 s | −17.2 dB mean |
| s04 | Wife | Sokhom | 3.87 s | −17.8 dB mean |
| s05 | Husband | Veha | 9.73 s | −17.2 dB mean |
| s06 | Wife | Sokhom | 3.39 s | −18.6 dB mean |
| s07 | Husband | Veha | 14.08 s | −17.4 dB mean |
| s08 | Wife | Sokhom | 7.33 s | −17.3 dB mean |
| s09 | Husband | Veha | 4.32 s | −17.7 dB mean |
| n01 | Narrator | Oudom | 12.48 s | −16.6 dB mean |

All finals are mono 192 kbps MP3, 80 Hz high-pass, loudnorm −17 LUFS / TP −1.5. No clipped samples (max −1.8 dB or lower). Starts and ends trimmed to the first/last word with a small guard.

## Verification

- Captions: white with navy outline, no background box, no speaker labels, active word teal, word-level timing from `timing.json`. Every caption line reconstructs the script text exactly (checked normalized string equality).
- Prices: `$22` is spoken in Khmer as `ម្ភៃពីរដុល្លារ`; `$22`, `$30`, `$35` are shown as digits. No other prices appear.
- Phone: `095 255 577` is on the end card only. It is absent from every voice text and from `words.json`.
- SAI: never spoken. `s01` voice drops it; the caption still shows `SAI` timed on `ព្រលាន`. `n01` does not say SAI.
- Phone UI: real `ui-transport-home.png` and `ui-sai-results.png`, cropped to 415×853 to remove the bottom browser strip, displayed at 540 px wide (larger than Video 1's 444 px). The screen has no grey strip at the bottom.
- Zero-duplicate assets: only `b-v2`, `woman-v2`, `real/sai-v2` places and `real/sai-v2/cars`. Shared brand assets are logo, music bed, SFX, caption style.
- Sticker cleanup: `woman-v2/relieved-smile.png` cropped from 600×740 to 600×615, removing the white cut-out gap on the lower cardigan. Original backup: `production/stickers/relieved-smile-original.png`.
- End card: logo, route, service line, 4-model price card, URL and phone inside safe margins. No captions. Holds 3.33 s after `n01`.
- Video 1 (`18-sai-house-airport`), its stickers and `Rentmee` were not modified.
- Typecheck passes. `npm run lint` fails only on the two pre-existing unused-variable errors in `src/videos/14-airport-couple/PrivateAirportCoupleVideo.tsx`; the new folder passes ESLint cleanly.
- `blackdetect` clean; the first frame is a hard open on the arrivals hall.

## Artifacts

- `renders/19-sai-airport-house/19-sai-airport-house-kh-9x16.mp4`
- `renders/19-sai-airport-house/contact-sheet.jpg`
- `renders/19-sai-airport-house/qa/` (16 frames)
- `production/voice/19-sai-airport-house/` (raw takes, MCP JSON, words, build scripts)
- `public/voice/sai-airport-house/s01–s09.mp3` + `n01.mp3`

## Limitation

Voice pronunciation was checked through the TTS word timestamps (English terms present, SAI/phone absent) and through loudness/silence/clipping inspection. A human listen-through of every line was not performed.
