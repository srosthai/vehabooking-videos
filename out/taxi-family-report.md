# Private Taxi 01 — Family trip Phnom Penh → Siem Reap

## Output

- **Video:** `/home/dev/Native-project/Video-Remotions/Vehabooking/out/taxi-family-9x16.mp4`
- **Contact sheet:** `/home/dev/Native-project/Video-Remotions/Vehabooking/out/taxi-family-contact-sheet.png`
- **Keyframes:** `/home/dev/Native-project/Video-Remotions/Vehabooking/out/taxi-family-keyframes/`
- Duration: **54.600 s**
- Frames: **1637**
- Resolution: **1080×1920**
- Frame rate: **30 fps**
- Video: H.264
- Audio: AAC 48 kHz stereo
- Size: **43,612,856 bytes (41.6 MiB)**
- Mastered audio: mean `-17.2 dB`, max `-1.9 dB`
- `blackdetect`: no black segments
- **9:16 only.**
- No commit or push.

## Scene plan / actual timings

| # | Speaker | Time | Scene |
|---|---|---:|---|
| 1 | Wife C | 0:00–0:04.50 | Home family + Angkor Wat inset + C happy |
| 2 | Wife C | 0:04.50–0:08.97 | Crowded bus + C thinking |
| 3 | Husband B | 0:08.97–0:12.67 | Private sedan + teal Private Taxi + B point-right |
| 4 | Wife C | 0:12.67–0:16.17 | Family car zoom + C wow |
| 5 | Husband B | 0:16.17–0:21.57 | Roadside stop + food/toilet icons + B thumbs-up |
| 6 | Wife C | 0:21.57–0:24.90 | Luggage + C what |
| 7 | Husband B | 0:24.90–0:31.73 | Sedan/SUV/MPV/Van cards pop in |
| 8 | Wife C | 0:31.73–0:33.47 | “$?” price question + C thinking |
| 9 | Husband B | 0:33.47–0:39.53 | Real platform results image in iPhone + from $65 + route |
| 10 | Wife C | 0:39.53–0:43.33 | Phnom Penh pin drop + C happy |
| 11 | Husband B | 0:43.33–0:47.33 | Driver door → Siem Reap hotel + B thumbs-up |
| 12 | Husband B | 0:47.33–0:54.57 | Real platform results image + Book Now tap + logo/website/phone end card |

## Voices

All 12 lines generated sequentially with KiriTTS:

- Husband / B = **Veha**
- Wife / C = **Sokhom**

| Line | Speaker | Duration |
|---|---|---:|
| t01 | C | 4.229 s |
| t02 | C | 4.310 s |
| t03 | B | 3.548 s |
| t04 | C | 3.360 s |
| t05 | B | 5.249 s |
| t06 | C | 3.200 s |
| t07 | B | 6.690 s |
| t08 | C | 1.600 s (level-corrected to -17.4 LUFS) |
| t09 | B | 5.920 s |
| t10 | C | 3.649 s |
| t11 | B | 3.840 s |
| t12 | B | 6.080 s |

- `$65` is spoken as `ហុកសិបប្រាំដុល្លារ`; captions show `$65`.
- English terms appear as English in the word timestamps:
  - t03: `Private Taxi`
  - t07: `Sedan`, `SUV`, `MPV`, `Van`
  - t12: `Book Now`, `vehabooking.com`
- No phone number appears in the script, voice, or captions. The end card shows **095 255 577** on screen only.
- No full human listen-through was possible in this environment. Word timestamps are complete for all 12 lines; no missing/truncated line detected.

## Visual assets

- `scene01-home-family.png`, `scene01-angkorwat.png`
- `scene02-crowded-bus.png`
- `scene03-private-sedan.png`
- `scene04-family-car.png`
- `scene05-roadside-stop.png`
- `scene06-luggage.png`
- `scene07-{sedan,suv,mpv,van}.png`
- `scene10-home-pin-bg.png`
- `scene11-driver-door.png`, `scene11-siemreap-hotel.png`
- `vehabooking-pp-sr-results.png` — real platform results image used in both phone scenes, cropped above the footer; the genuine page includes its other live vehicle options/prices. The `$65` Sedan row is the one highlighted by the offer overlay and tap. The footer phone number is cropped out; the end card carries `095 255 577` on screen only.
- Final end card: Veha Booking logo + `vehabooking.com` + `095 255 577` (on screen only).
- B: `point-right.png`, `thumbsup.png`, `happy.png`
- C: `happy.png`, `thinking.png`, `wow.png`, `what.png`

## Checks

- `npx tsc --noEmit`: passed.
- `npm run render:16taxi-family-v`: passed, including `scripts/master-reel.sh`.
- `ffprobe`: 1080×1920, 30 fps, 1637 frames, AAC 48 kHz stereo, 54.600 s.
- Audio mean `-17.2 dB`, max `-1.9 dB`; no black segments.
- Fresh keyframes and contact sheet extracted from the final MP4.
- No phone number in voice or captions; **095 255 577** appears only on the final end card.
- The offer overlays/end card use `$65`; the real platform page itself includes its genuine other live result prices.
- `$?` is a question graphic, not a price.
- Both phone scenes now use the real platform results image, not the earlier white mock/card crop. The platform footer phone number is cropped out.
- No Wikimedia assets used; all scene photos are the supplied `public/real/taxi-family/` assets.
- No commit or push.
