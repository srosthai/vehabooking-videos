# Ferry 05 — Family trip (husband & wife)

## Output

- **Video:** `/home/dev/Native-project/Video-Remotions/Vehabooking/out/ferry-family-9x16.mp4`
- **Contact sheet:** `/home/dev/Native-project/Video-Remotions/Vehabooking/out/ferry-family-contact-sheet.png`
- **Keyframes:** `/home/dev/Native-project/Video-Remotions/Vehabooking/out/ferry-family-keyframes/`
- Duration: **52.200 s** container / **52.100 s** video
- Frames: **1563**
- Resolution: **1080×1920**
- Frame rate: **30 fps**
- Video: H.264
- Audio: **AAC 48 kHz stereo**
- Size: **35,625,097 bytes (34.0 MiB)**
- Audio after master: mean `-17.1 dB`, max `-1.9 dB`
- `blackdetect`: no black segments
- Only 9:16 composition. No 16:9.
- No commit or push.

## Voices

All 12 lines were generated sequentially with KiriTTS:

- Husband / People B: **Veha**
- Wife / People C: **Sokhom**

| Line | Speaker | Voice | Duration |
|---|---|---|---:|
| f01 | C | Sokhom | 3.348 s |
| f02 | C | Sokhom | 3.189 s |
| f03 | B | Veha | 3.840 s |
| f04 | C | Sokhom | 2.357 s |
| f05 | B | Veha | 4.320 s |
| f06 | C | Sokhom | 6.058 s |
| f07 | B | Veha | 2.529 s |
| f08 | C | Sokhom | 5.440 s |
| f09 | B | Veha | 5.270 s |
| f10 | C | Sokhom | 3.149 s |
| f11 | B | Veha | 4.960 s |
| f12 | B | Veha | 4.729 s |

- Spoken prices are Khmer words:
  - `$17` → `ដប់ប្រាំពីរដុល្លារ`
  - `$8.50` → `ប្រាំបីដុល្លារកន្លះ`
- Captions show the approved digits `$17` and `$8.50`.
- `Book Now` and `vehabooking.com` are present as English words in the f12 word timestamps.
- No phone number appears in the script, voice, captions, or end card.
- No full human listen-through was possible in this environment. Word timestamps are complete; no truncated/missing line was detected. Each final MP3 was loudnorm-normalized to roughly **-17 LUFS**.

## Visuals

- Scene 1: `scene01-home-family.png` + C happy + Koh Rong inset.
- Scene 2: `real/ferry03/speed-ferry-skyline.jpg` + C thinking + `?`.
- Scene 3: `scene03-toddler.png` + B `point-right.png` + `FREE` / `Under 5`.
- Scene 4: `scene11-kohrong.png` + C wow + zoom.
- Scene 5: `scene05-older-kids.png` + B happy + `$8.50` / `Age 5–13`.
- Scene 6: fare card Adult `$17` / Kids 5–13 `$8.50` / Under 5 `FREE`.
- Scene 7: `scene07-family-pier.png` + B thumbs-up.
- Scene 8: `scene08-kids-on-ferry.png` + C thinking.
- Scene 9: split `scene09-lifejackets.png` / `scene09-cabin.png` + check pills.
- Scene 10: `scene10-coast.png` + `Sihanoukville` / `Koh Rong` / `Koh Rong Sanloem` labels.
- Scene 11: split `scene11-kohrong.png` / `scene11-kohrongsanloem.png` + English labels.
- Scene 12: `booking-screenshot.png` inside iPhone, tap on `Book Now`, then logo + `vehabooking.com` end card.

The booking screenshot keeps the real `$30` round-trip adult fare as approved. The end card has no phone number.

## Checks

- `npx tsc --noEmit`: passed.
- `npm run render:15ferry-family-v`: passed; output includes `scripts/master-reel.sh`.
- Fresh keyframes and contact sheet extracted from the new export.
- `ffprobe`: 1080×1920, 30 fps, 1563 frames, AAC 48 kHz stereo.
- `blackdetect`: no black segments.
- No Wikimedia assets referenced in composition 15; all scene photos come from `public/real/ferry-family/` or the existing user-provided `public/real/ferry03/` set.
