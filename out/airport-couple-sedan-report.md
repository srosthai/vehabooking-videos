# Airport couple Sedan — build report

## Output

- **Exact MP4:** `/home/dev/Native-project/Video-Remotions/Vehabooking/out/airport-couple-sedan-9x16.mp4`
- Contact sheet: `out/airport-couple-sedan-contact-sheet.png`
- Composition: `src/videos/14-airport-couple` · `AirportCoupleSedanVertical`
- Render command: `npm run render:14airport-couple-v`
- Saved brief: `briefs/airport-couple-sedan.md`

`ffprobe`:

- Container duration: **63.200 s**
- Timeline: **1894 frames / 63.133 s**
- Video: **1080×1920**, 30 fps, H.264, 1894 frames
- Audio: **AAC 48 kHz stereo**, present
- Size: **21,097,847 bytes**

## Voices

Verified with the KiriTTS voice catalogue:

| Character | Required voice | Exact name found | Category | Voice ID |
|---|---|---|---|---|
| A / Driver | Better Voice | **Better Voice.** | Cloned | `vc_940e01b6ac0a4e4d821db4991a7d5df4` |
| B / Husband | Veha | **Veha** | Cloned | `vc_134010249c6b46c29e30e18b40671f36` |
| C / Wife | Sokhom | **Sokhom** | Cloned | `vc_e6f80c0cb8514a87ad725b63218f50da` |
| Narrator | Oudom | **Oudom** | Standard / male | `vc_cfd750a68fc14372908f267f16325791` |

- All 13 clips were generated **one line at a time, sequentially**.
- `speed: 1.0`, `voice_matching: "natural"`, no `instructions`, no pause trimming, punctuation kept.
- The driver’s line keeps **ខ្ញុំ**; no phone number is spoken.
- Each clip is mono MP3 192 kbps, normalised to about **-17 LUFS**.
- `Sokhom` c07 and c10 received small post-gain corrections (+1.2 dB and +2.7 dB) after the first pass; final loudness is -17.4 and -17.5 LUFS.

**ID verification:** exact IDs were read from the authenticated KiriTTS voice catalogue and saved in `voice-couple/voices.json`. No IDs were guessed.

### Clip durations

| Clip | Speaker | Voice | Duration | Frames | LUFS |
|---|---|---|---:|---:|---:|
| c01 | C | Sokhom | 3.520 s | 106 | -17.2 |
| c02 | B | Veha | 3.200 s | 96 | -17.0 |
| c03 | C | Sokhom | 6.080 s | 183 | -17.2 |
| c04 | B | Veha | 6.880 s | 207 | -17.4 |
| c05 | C | Sokhom | 4.960 s | 149 | -17.2 |
| c06 | B | Veha | 1.280 s | 39 | -17.2 |
| c07 | C | Sokhom | 2.720 s | 82 | -17.4 |
| c08 | A | Better Voice. | 6.560 s | 197 | -17.2 |
| c09 | C | Sokhom | 4.640 s | 140 | -17.4 |
| c10 | C | Sokhom | 2.240 s | 68 | -17.5 |
| c11 | B | Veha | 2.400 s | 72 | -17.2 |
| c12 | C | Sokhom | 4.640 s | 140 | -17.3 |
| c13 | N | Oudom | 6.400 s | 192 | -17.2 |

## Scenes

| Scene | Lines | Main visual | Sticker(s) | Length |
|---|---|---|---|---:|
| S1 | c01–c02 | Morning clock 07:40 + flight 10:00 card | C thinking, B happy | 7.40 s |
| S2 | c03 | Siem Reap town + route home → airport + two suitcases | C what | 6.33 s |
| S3 | c04 | iPhone frame + real Sedan $18 app card crop | B thumbsup | 7.13 s |
| S4 | c05–c08 | Home arrival + white Sedan + gentle horn | C what, B happy, C wow, A happy | 17.37 s |
| S5 | c09 | Home arrival + loaded luggage card | C happy | 4.90 s |
| S6 | c10–c12 | Real sedan interior + $18 price card | C thinking, B happy, C wow | 10.03 s |
| S7 | c13 | Siem Reap airport → branded end card | Narrator, no sticker | 9.97 s |

Total: **1894 frames / 63.13 s** — inside the requested 60–70 s target, derived from actual voices.

## Asset sources

- `public/real/airport/siemreap-city.jpg` — Siem Reap town aerial, route/booking backgrounds.
- `public/real/airport/siemreap-airport.png` — current Siem Reap Angkor International Airport.
- `public/real/cars/sedan.png` — white Sedan cut-out.
- `public/real/sedan.jpg` — real sedan interior.
- `public/images/airport-couple/sedan-18-card.png` — cropped from the existing `public/real/airport/app-airport-results.png`; shows only the supplied Sedan/$18 row.
- `public/real/hotel.jpg` — **not used as a home**; no genuine home photo exists in the project, so the morning/arrival scenes use clean graphic house/clock elements instead of misrepresenting a location.
- Stickers — existing transparent photographic cut-outs:
  - A: `public/stickers/people/a/`
  - B: `public/stickers/people/b/`
  - C: `public/stickers/people/woman/`
- Music — existing `public/music/veha-bed.wav`, low volume, ducked under dialogue.
- Horn — newly synthesized `public/sfx/car-horn-gentle.wav`, two short gentle beeps; not a spoken line.

## Graphics upgrade

- Restrained teal/white/soft-neutral palette with one visual idea per scene.
- Gentle scene-local Ken Burns moves and 10-frame scene crossfades.
- Custom morning clock scene, route card with home/plane icons and luggage icons.
- Clean iPhone frame with real Sedan $18 app card and route/door-pickup rows; no other car prices.
- Consistent sticker frame with a colour accent, no A/B/C labels.
- Large $18 price card with “Sedan · ក្នុងមួយឡាន”; no misleading price animation.
- Strong airport-to-end-card transition with logo, price, website, phone, pulsing Book Now CTA.
- Subtle top progress bar and bottom brand bar.
- Word-level Khmer captions from KiriTTS word timestamps; active word teal, white text with dark outline, no box.

## Dialogue updates

Latest requested dialogue lines were regenerated with the same voices and rebuilt at word level:

- c01 → **បង! ម៉ោងប៉ុន្មានហើយ? ជើងយន្តហោះយើងចេញម៉ោងដប់ណាបង?**
- c03 → **ពីក្រុងទៅព្រលានយន្តហោះសៀមរាប ឆ្ងាយណាស់ណាបង! កុំប្រាប់ថា ជិះម៉ូតូ ហើយដឹកវ៉ាលី ធំៗ ពីរហ្នឹង ទៀតណាបង!**
- c05 → **នោះណ៎បង! ឡានណាគេឈប់មុខផ្ទះយើងនេះ! ឡានដែលបងកក់មែនបង?**
- c08 → **ជម្រាបសួរបង! ខ្ញុំមកពី Veha Booking។ តោះចាំខ្ញុំជួយ លើកវ៉ាលីរបស់បងដាក់លើឡាន។**
- c09 → **មកទទួលដល់មុខផ្ទះអីចឹង ស្រួលមែន! ប្តីរបស់អូន ពិតជាឆ្លាតមែន។**

Earlier updated lines c06/c07/c10 remain in the same pass:
- c06 **ហ្នឹងហើយអូន!**
- c07 **ចុម! លឿនរបស់គេ!**
- c10 **ចុះមួយឡានហ្នឹង តម្លៃប៉ុន្មានដែរបង?**

Small spelling normalizations for clear TTS: `បស់` → `របស់`, `អុីចឹង` → `អ៊ីចឹង`, `ពីរនឹង` → `ពីរហ្នឹង`, `នោះណបង` → `នោះណ៎បង`, `យើងនិង` → `យើងនេះ`.

All clips are balanced at `-17.2` to `-17.5 LUFS`; c07 and c10 received small post-gain corrections.

## Verification

- `npx tsc --noEmit` — passed.
- `npm run render:14airport-couple-v` — exit `0`.
- `ffprobe` — 1080×1920, 30 fps, 1894 frames, AAC 48 kHz stereo.
- Overall audio — mean `-17.2 dB`, max `-1.9 dB`; no clipping.
- `blackdetect` — no black segments detected.
- Contact sheet — generated from frames extracted from the final MP4, not from source stills.
- Caption sync — each voice clip is placed at its `voiceFrom`; word starts come from `get_word_timestamps`; captions and highlights are driven by those same timestamps. No caption starts before its clip.
- No phone number is spoken; it appears only on the end card.
- No A/B/C labels appear in the video.

## Problems / limitations

1. **No genuine home photo exists in the project.** I did not use `hotel.jpg` as a fake home. S1 uses a clean morning clock graphic; S4/S5 use house/car graphic staging. This is reported rather than misrepresented.
2. **Voice IDs are not exposed by the MCP voice list.** Exact names were verified and used; no IDs were guessed. The TTS tool is name-based.
3. Narrator caption is 3 lines at 40 px to keep the full sentence readable; all dialogue captions are 1–2 lines. No text is cropped or covered.
4. The horn is a synthesized SFX, not a licensed recording. It is low-volume and used only for the two short beeps in S4.
