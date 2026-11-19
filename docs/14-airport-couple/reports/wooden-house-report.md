> **Superseded:** this report describes the previous $18 revision. See `out/airport-couple-sedan-15-update-report.md` for the current $15 render.

# Airport couple Sedan — wooden-house visual revision

## Receipt

Implemented this visual-only revision inside `src/videos/14-airport-couple` in the current Vehabooking project. No commits, destructive git operations, publishing, new voices, or service installation. Other compositions, unrelated dirty files, and the sibling Rentmee project were left untouched.

## Final output

- **MP4:** `/home/dev/Native-project/Video-Remotions/Vehabooking/out/airport-couple-sedan-9x16.mp4`
- **Contact sheet:** `/home/dev/Native-project/Video-Remotions/Vehabooking/out/airport-couple-sedan-visual-contact-sheet.png`
- **Key frames:** `/home/dev/Native-project/Video-Remotions/Vehabooking/out/airport-couple-sedan-keyframes/`
- Duration: **63.200 s**
- Frames: **1894**
- Resolution: **1080×1920**
- Frame rate: **30 fps**
- Video: H.264
- Audio: **AAC 48 kHz stereo**
- Size: **41,994,994 bytes (40.0 MiB)** — below 100 MiB
- Audio mean `-17.2 dB`, max `-1.9 dB`
- `blackdetect`: no black segments
- `npx tsc --noEmit`: passed
- `npm run render:14airport-couple-v`: exit `0`

## Audio preservation

All 13 voice MP3s are unchanged.

- `out/airport-couple-sedan-audio-hashes-before-v2.txt`
- `out/airport-couple-sedan-audio-hashes-after-v2.txt`
- `diff` result: **identical**
- `out/airport-couple-sedan-audio-hashes-check.txt`: `sha256sum -c` all OK

No timing JSON, narration text, speaker roles, voice files, or dialogue were modified.

## New supplied house

- Read and verified `public/real/airport-couple-user/wooden-house.png` — 1200×1200, wooden Cambodian house on a leafy lane.
- Replaced the old modern concrete house in:
  - opening wife/home reveal
  - home arrival
  - loading scene
- The supplied wooden house is the only home used.
- Legacy `public/real/airport-couple-user/house.png` remains on disk but is no longer referenced by this composition.

## Source assets

- **Home:** `public/real/airport-couple-user/wooden-house.png` (1200×1200, new supplied wooden house)
- **Airport / town:** `public/real/airport/siemreap-airport.png`, `public/real/airport/siemreap-city.jpg`
- **Platform UI:** `public/real/airport/app-airport-search.png` (existing genuine Veha Booking screenshot)
- **Sedan:** `public/real/cars/sedan.png`, `public/real/sedan.jpg`
- **Suitcases:** supplied `public/real/airport-couple-user/suitcase-black.png` and `suitcase-blue.png`; exact cutouts at `public/images/airport-couple/suitcase-black.png` and `suitcase-blue.png`
- **Stickers:** `public/stickers/people/a/sampeah.png`; temporary `public/stickers/people/b/what.png`
- **Voice:** all 13 files under `public/voice/airport-couple/`
- No new photographic or voice assets were generated for this revision.

## Opening clock

- Frames **0–44:** clock-only dark setting; the house is not visible.
- Frame **0:** `07:39`; analog clock hands visible.
- Frame **30:** `07:40`; digital tick pulse and `tick` SFX cues at 0/15/30/45.
- Frames **45–60:** wooden house fades in; wife sticker reveals at frames **48–56** while she is speaking.
- No house on the first frame.
- Evidence: `clock-0.png`, `clock-30.png`, `reveal-55.png`, `s1.png`.

## Arrival

- House is shown first without a car: frame **636 / 21.20 s**.
- Sedan drives in on the lane and settles parked by frame **688 / 22.93 s**.
- Ground shadow, toy-scale perspective and subtle wheel dust are retained.
- Exact supplied suitcase cutouts are used in S2, S4 c08, and S5.
- Evidence: `house-before-car.png`, `mid-drive.png`, `dust.png`, `parked.png`, `s5-suitcases.png`.

## A sampeah

- c08 `voiceFrom`: **946**
- First word **ជម្រាបសួរ** starts at **0.000 s**
- A sampeah is visible from **frame 946 / 31.533 s** through frame **1050**
- Evidence: `sampeah-946.png`

## Booking scene — BLOCKER

The phone is now on the right with the genuine existing Veha Booking platform screenshot. B is placed on the left, elevated so his open right palm faces screen-right toward the phone. This is spatial staging only — the pose itself is not a true point.

**However, none of the existing B photographic stickers is a true pointing pose.** The available set contains happy, laugh/hah, thinking, thumbsup, what, and wow. The closest side-gesture is `public/stickers/people/b/what.png` (open palms), which is currently used as a temporary gesture toward the phone. It is **not** a true point.

**Concrete missing dependency:** a new approved B sticker in the same identity/outfit/white outline, e.g. `public/stickers/people/b/point-right.png` — arm extended, index finger pointing screen-right toward the phone. This revision is therefore a **review draft, not fully complete** on the B-pointing requirement.

Evidence: `s3-point.png` (frame 445 / 14.83 s).

## Final scene

- Real Siem Reap airport context is shown first.
- End card then shows a readable genuine existing Veha Booking app screenshot in an iPhone frame, plus the existing brand, website, phone number, approved `$18` price and Book Now CTA.
- No fabricated screens, prices or claims.
- Evidence: `s7-airport.png`, `end-card.png`.

## Contact sheet / key frames

Contact sheet was regenerated from the new MP4, not old stills:

| File | Frame | Time |
|---|---:|---:|
| `clock-0.png` | 0 | 0.00 s |
| `clock-30.png` | 30 | 1.00 s |
| `reveal-55.png` | 55 | 1.83 s |
| `s1.png` | 80 | 2.67 s |
| `s3-point.png` | 445 | 14.83 s |
| `house-before-car.png` | 636 | 21.20 s |
| `mid-drive.png` | 666 | 22.20 s |
| `dust.png` | 688 | 22.93 s |
| `parked.png` | 706 | 23.53 s |
| `sampeah-946.png` | 946 | 31.53 s |
| `s5-suitcases.png` | 1180 | 39.33 s |
| `s6-price.png` | 1402 | 46.73 s |
| `s7-airport.png` | 1638 | 54.60 s |
| `end-card.png` | 1800 | 60.00 s |

## Modified files

- `src/videos/14-airport-couple/PrivateAirportCoupleVideo.tsx`
- `src/videos/14-airport-couple/narration.ts` (c04 sticker changed from thumbsup to the closest available gesture)
- `out/airport-couple-sedan-9x16.mp4`
- `out/airport-couple-sedan-visual-contact-sheet.png`
- `out/airport-couple-sedan-keyframes/` (14 fresh key frames)
- `out/airport-couple-sedan-audio-hashes-before-v2.txt`
- `out/airport-couple-sedan-audio-hashes-after-v2.txt`
- `out/airport-couple-sedan-audio-hashes-check.txt`
- `out/airport-couple-sedan-wooden-house-report.md`

## Review scope

I reviewed the extracted final-MP4 keyframes and contact sheet, checked audio hashes, `ffprobe`, `volumedetect`, and `blackdetect`.

I did **not** perform a full listen-through of the rendered audio/video. Audio integrity is proven by hashes and stream checks, not full playback.

## Blockers

1. **Missing B pointing sticker.** Existing B assets have no true pointing pose; `what` is an open-hand gesture substitute. A proper B `point-right` pose is required for final approval.
2. No other visual blocker. All supplied house/suitcase/A-sampeah assets loaded and were used; no substitutions.
