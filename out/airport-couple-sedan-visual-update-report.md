# Airport couple Sedan — visual update report

## Target verified

- Project: `/home/dev/Native-project/Video-Remotions/Vehabooking`
- Composition: `src/videos/14-airport-couple`
- Remotion ID: `AirportCoupleSedanVertical`
- Render command: `npm run render:14airport-couple-v`
- Final output: `out/airport-couple-sedan-9x16.mp4`
- Portrait only: **1080×1920, 30 fps**
- No changes to `src/videos/12-airport-dialogue`, `src/videos/13-private-kampot`, any other composition, or the sibling Rentmee project.
- No commits, destructive git operations, publishing, new voices, or service installation.

## Final output

- **MP4:** `/home/dev/Native-project/Video-Remotions/Vehabooking/out/airport-couple-sedan-9x16.mp4`
- Duration: **63.200 s**
- Frames: **1894**
- Resolution: **1080×1920**
- Frame rate: **30 fps**
- Video: H.264
- Audio: **AAC 48 kHz stereo**
- Size: **29,389,311 bytes (28.0 MiB)** — below 100 MiB
- Overall audio: mean **-17.2 dB**, max **-1.9 dB**
- `blackdetect`: no black segments detected
- `npm run render:14airport-couple-v`: exit **0**

## Audio preservation proof

Before/after SHA-256 files:

- `out/airport-couple-sedan-audio-hashes-before.txt`
- `out/airport-couple-sedan-audio-hashes-after.txt`

`diff` result: **identical** — all **13/13** clips unchanged.

No voice files, timing JSON, narration.ts, script text, or speaker roles were modified in this visual pass.

## Provided assets used

| Asset | Use |
|---|---|
| `public/real/airport-couple-user/house.png` | Supplied house used as the real house background in S1, S4 and S5. The old house icon/SVG was removed from the home scenes, route card and booking row. |
| `public/real/airport-couple-user/suitcase-black.png` | Derived transparent cutout → `public/images/airport-couple/suitcase-black.png`; used in S2, S4 (c08) and S5. |
| `public/real/airport-couple-user/suitcase-blue.png` | Derived transparent cutout → `public/images/airport-couple/suitcase-blue.png`; used in S2, S4 (c08) and S5. |
| `public/stickers/people/a/sampeah.png` | Exact approved A sampeah pose, used at the exact c08 word **ជម្រាបសួរ**. |
| `public/real/airport-couple-user/arrival-before.png` | Reference screenshot only; not placed as a scene photo. |
| `public/real/airport-couple-user/driver-before.png` | Reference screenshot only; not placed as a scene photo. |

Existing real photos retained:

- `public/real/airport/siemreap-city.jpg` — S2/S3 real Siem Reap town background.
- `public/real/sedan.jpg` — S6 real sedan interior.
- `public/real/airport/siemreap-airport.png` — S7 current Siem Reap airport.
- `public/images/airport-couple/sedan-18-card.png` — cropped from the existing real app screenshot.

## Visual changes

- **Stickers:** the frosted/blur card behind every sticker was removed. Stickers are now naked transparent cutouts, enlarged from 300 px to 360 px image width for all A/B/C stickers.
- **S2:** real Siem Reap town background retained; generic suitcase icons replaced with the two exact supplied suitcase cutouts.
- **S3:** real town background and clean iPhone booking frame retained.
- **S4:** supplied house is shown **first without a car** (frames 626–644), then the real white sedan cutout drives in from the right (frames 644–688) and settles parked. Ground shadow and brief low dust were added near the wheels. House stays visible.
- **S5:** house and parked sedan remain; both exact supplied suitcases are shown beside the car.
- **S6:** real sedan interior and $18 price card retained.
- **S7:** real Siem Reap airport and branded end card retained.

No main scene uses a plain teal/color-only setting any more. The only flat overlay is the restrained caption scrim.

## A sampeah sync

- c08 line: `943` → `1147` frames.
- c08 `voiceFrom`: **946**.
- First word **ជម្រាបសួរ** starts at **0.000 s** in the c08 clip.
- Sampeah visible: **frame 946 (31.533 s)** through **frame 1050**; it switches back to the happy sticker for “តោះចាំខ្ញុំជួយ...” at frame 1051.
- Evidence: `out/airport-couple-sedan-keyframes/sampeah-946.png`.

## Key frames and contact sheet

Contact sheet:
`out/airport-couple-sedan-visual-contact-sheet.png`

Key-frame folder:
`out/airport-couple-sedan-keyframes/`

| File | Scene | Frame | Time |
|---|---|---:|---:|
| `s1.png` | S1 real house + clock | 39 | 1.30 s |
| `s2.png` | S2 real town + supplied suitcases | 255 | 8.50 s |
| `s3.png` | S3 booking phone | 445 | 14.83 s |
| `house-before-car.png` | House first, no car | 636 | 21.20 s |
| `mid-drive.png` | Sedan driving in | 666 | 22.20 s |
| `dust.png` | Subtle wheel dust | 688 | 22.93 s |
| `parked.png` | Sedan parked | 706 | 23.53 s |
| `sampeah-946.png` | A sampeah at ជម្រាបសួរ | 946 | 31.53 s |
| `s5-suitcases.png` | S5 exact suitcases | 1180 | 39.33 s |
| `s6-price.png` | S6 real interior + $18 | 1402 | 46.73 s |
| `s7-airport.png` | S7 real airport | 1638 | 54.60 s |
| `end-card.png` | End card | 1800 | 60.00 s |

## Modified files

- `src/videos/14-airport-couple/PrivateAirportCoupleVideo.tsx`
- `public/images/airport-couple/suitcase-black.png` *(new derived cutout)*
- `public/images/airport-couple/suitcase-blue.png` *(new derived cutout)*
- `out/airport-couple-sedan-9x16.mp4` *(re-rendered)*
- `out/airport-couple-sedan-visual-contact-sheet.png` *(new)*
- `out/airport-couple-sedan-keyframes/` *(new, 12 key frames)*
- `out/airport-couple-sedan-audio-hashes-before.txt` *(new proof)*
- `out/airport-couple-sedan-audio-hashes-after.txt` *(new proof)*
- `out/airport-couple-sedan-audio-hashes-check.txt` *(new `sha256sum -c` proof)*
- `out/airport-couple-sedan-visual-update-report.md` *(this report)*

## Verification scope

- Type check: `npx tsc --noEmit` passed.
- Render: `npm run render:14airport-couple-v` exit `0`.
- `ffprobe`: checked duration, resolution, fps, frame count and audio streams.
- Audio hashes: before/after identical for all 13 clips.
- `blackdetect`: no black segments.
- Frame review: I visually reviewed the extracted key frames and contact sheet above. I did **not** perform a full listen-through of the rendered audio/video; audio integrity is proven by hashes, ffprobe and volumedetect, not by full playback.

## Failures / blockers

- None in the requested visual update.
- All supplied assets loaded and were used; no substitution was needed.
- Old report and old contact sheet remain in `out/`; the new visual report and visual contact sheet are the files above.
