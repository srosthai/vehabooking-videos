# Airport couple Sedan — $15 update report

## Status

**Review draft rendered. Not fully complete.** Three requirements remain unresolved:

1. B pointing sticker did not arrive in the workspace.
2. No genuine Veha Booking screenshot showing $15 was available.
3. The 25 destination names/photos were not supplied, so the footer is not implemented.

No commit or push was made.

## Final output

- **MP4:** `/home/dev/Native-project/Video-Remotions/Vehabooking/out/airport-couple-sedan-9x16.mp4`
- **Thumbnail:** `/home/dev/Native-project/Video-Remotions/Vehabooking/out/airport-couple-sedan-thumbnail-9x16.png`
- **Thumbnail JPG preview:** `/home/dev/Native-project/Video-Remotions/Vehabooking/out/airport-couple-sedan-thumbnail-9x16.jpg`
- **Contact sheet:** `/home/dev/Native-project/Video-Remotions/Vehabooking/out/airport-couple-sedan-visual-contact-sheet.png`
- **Key frames:** `/home/dev/Native-project/Video-Remotions/Vehabooking/out/airport-couple-sedan-keyframes/`
- **Report:** `/home/dev/Native-project/Video-Remotions/Vehabooking/out/airport-couple-sedan-15-update-report.md`

Actual container duration: **64.600 s**. Video frames: **1936** at **30 fps** (64.533 s of video). Resolution: **1080×1920**. H.264 video, AAC 48 kHz stereo. File size: **37,113,210 bytes (35.4 MiB)**. Audio mean `-17.2 dB`, max `-1.9 dB`. `blackdetect`: no black segments.

## Price change

- **c11 only** was re-recorded with B’s existing **Veha** clone.
- New line: `តម្លៃពិសេស តែដប់ប្រាំដុល្លារទេអូន!`
- New c11 duration: **2.080 s / 63 frames**, loudness **-17.2 LUFS**.
- `timing.json` c11 segments and downstream timeline were rebuilt. The opening c01 pre-delay was then increased by 51 frames so the clock/alarm plays before any voice. Total video is now **1936 frames**.
- All other **12/13** voice MP3s are byte-identical.
- c11 hash change proof: `out/airport-couple-sedan-audio-c11-change.txt`
- 12-file hash check: `out/airport-couple-sedan-audio-hashes-check-12.txt`
- Full before/after hash files: `out/airport-couple-sedan-audio-hashes-before-15.txt`, `out/airport-couple-sedan-audio-hashes-after-15.txt`

No c08 audio was changed. c08 still says `ខ្ញុំ` twice as previously approved.

## Visible price updates

- S3 booking card now shows `Sedan · $15` and uses a **price-free genuine crop** of the existing Sedan card (`public/images/airport-couple/sedan-card-no-price.png`).
- S6 price card shows **$15**.
- S7 CTA card shows **$15**.
- Thumbnail shows **$15**.
- Script, brief, and voice-generation source now say 15 for c11.
- No visible `$18` remains in the composition or offer graphics.

## Visual changes completed

- New warm home `home-warm-reference.png` used in S1/S4/S5 via a mirrored derivative (`home-warm-mirrored.png`) so the driveway is on the right.
- Clock remains alone at frame 0 and fades out by frame 56.
- Tick SFX was removed. A synthesized clock alarm (`public/sfx/clock-alarm.wav`, 0.92 s) starts at frame 30 when the time changes to 07:40 and ends at frame 60.
- The c01 sticker pop moved from frame 4 to frame 48, matching C’s reveal; it no longer plays under the clock.
- A headline title `ម៉ោងប៉ុន្មានហើយ?` starts at frame 44, is visible by frame 45, and stays through C’s opening line.
- **c01 voice now begins at frame 60**, after the clock alarm. No people voice plays during the clock-only frame range.
- The complete dialogue timeline shifted by +51 frames. A’s sampeah remains on `ជម្រាបសួរ` and now falls at **frame 997** instead of 946.
- Clean suitcase cutouts derived from the supplied photos and used in S2/S4/S5.
- Sedan resized/repositioned for a more natural scale and grounded shadow.
- Captions raised to `bottom: 250` for safer phone framing; style unchanged.
- Final promotion: larger phone, genuine price-free search screen, $15 offer card, phone CTA, Book Now, sedan cutout, airport context behind.
- Thumbnail created at 1080×1920 with the three characters, logo, airport visual, sedan, and $15.

## Unresolved blockers

### 1. B pointing sticker — attachment missing

The B pointing image did not reach the workspace. The user message metadata contained **no attachments**, and no `point-right.png` file was present in the project or temporary upload locations.

- `public/stickers/people/b/point-right.png` **does not exist**.
- S3 still uses `public/stickers/people/b/what.png` (open palms).
- B is left of the phone, but the finger-pointing requirement is **not fulfilled**.
- The code has not been changed to claim a point asset that is absent.

Please re-upload the B sticker or place it at `public/stickers/people/b/point-right.png`.

### 2. Genuine $15 platform screenshot — unavailable

The live Veha Booking airport search for **Siemreap → Siem Reap Angkor International Airport (SAI)** was checked on 2026-11-08 and via the API for 2026-11-09. It shows **SEDAN STANDARD $18.00**, not $15.

- No genuine $15 screenshot exists in the project.
- The video therefore uses the genuine **price-free** `app-airport-search.png` in the final phone plus the approved **$15** offer card.
- No screenshot price was edited.
- A genuine $15 screenshot for the correct route is still required for full completion.

### 3. 25-destination footer — unresolved

The project still has no list of 25 destination names and no 25 destination images. The supplied `cambodia-footer-reference.png` is an illustration, not 25 identified destinations.

- No footer was added.
- The skyline has not been presented as 25 labeled destinations.

## Checks

- `npx tsc --noEmit`: passed.
- `npm run render:14airport-couple-v`: exit 0.
- Fresh keyframes extracted from the **new** MP4, not old stills.
- Fresh contact sheet built from the new MP4.
- Thumbnail rendered as a separate still.
- Clock first: frame 0 has no home.
- Home/wife reveal: frame 52/80 checked.
- Voice onset: frame 60 checked; clock is gone and C/title are visible.
- Car arrival: house-first frame 687, dust 739, parked 757 checked.
- A sampeah: frame 997 checked.
- c11 caption/price: frames 1423, 1453, 1457 checked.
- Final platform: frame 1851 checked.
- No black segments.
- 12/13 audio files unchanged; c11 intentionally changed.
- No full audio listen-through was performed; audio integrity is proven by hashes, ffprobe, loudness, and frame checks.

## Modified files

- `src/videos/14-airport-couple/PrivateAirportCoupleVideo.tsx`
- `src/videos/14-airport-couple/Thumbnail.tsx`
- `src/videos/14-airport-couple/Compositions.tsx`
- `src/videos/14-airport-couple/timing.json`
- `src/videos/14-airport-couple/script.md`
- `briefs/airport-couple-sedan.md`
- `voice-couple/generate.py`
- `voice-couple/words.json`
- `voice-couple/audio-report.json`
- `voice-couple/raw/c11.mp3`
- `voice-couple/mcp/c11-tts.json`
- `voice-couple/mcp/c11-words.json`
- `public/voice/airport-couple/c11.mp3`
- `public/real/airport-couple-user/home-warm-mirrored.png`
- `public/images/airport-couple/suitcase-black-clean.png`
- `public/images/airport-couple/suitcase-blue-clean.png`
- `public/images/airport-couple/sedan-card-no-price.png`
- `public/sfx/clock-alarm.wav`
- `out/airport-couple-sedan-9x16.mp4`
- `out/airport-couple-sedan-thumbnail-9x16.png`
- `out/airport-couple-sedan-visual-contact-sheet.png`
- `out/airport-couple-sedan-keyframes/`
- `out/airport-couple-sedan-15-update-report.md`
- audio hash proof files
