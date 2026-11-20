# Video 2 — SAI → House (`19-sai-airport-house`) — STORYBOARD v2 (zero reuse from Video 1)

Status: storyboard only (20 Nov 2026, UTC+7). Not voiced, not rendered. Video 1 (`18-sai-house-airport`) and Rentmee untouched.
Preview frames: `docs/19-sai-airport-house/storyboard/v2-s*.jpg` · contact sheets in the same folder.

## Zero-duplicate rule
Every sticker, place photo, car and end-card background in s01–s10 is a **new Video 2 asset**:
- Stickers: only `public/stickers/people/b-v2/` and `public/stickers/people/woman-v2/` (new outfits, new poses). No file from `b/`, `woman/`, `a/`, `c/`.
- Places: only `public/real/sai-v2/` (all newly generated, night). Nothing from `real/airport-hotel/`, `real/airport/`, `real/taxi-family/`, `real/airport-couple-user/`, `real/siemreap.jpg`.
- Cars: only `public/real/sai-v2/cars/` (new silver studio cut-outs). Not `real/cars/*.png` (Video 1 price card / s06 hero).
- Not used anywhere: `scene08-sai-airport.png`, `siemreap-city.jpg`, `transport-search-phone.png`, `real/cars/sedan.png`, suitcase cut-outs, `home-warm-mirrored.png`, `scene03-private-sedan.png`, `scene11-driver-door.png`.
- Shared on purpose (brand, not scene resources): `veha-logo.png`, music bed, sfx, caption style.
- ⚠ Only overlap left: the vehabooking.com UI screenshots `real/sai/ui-transport-home.png` + `real/sai/ui-sai-results.png` (s05/s07) — **temporary**; see Missing Resources #1.

## Night-Arrival palette
| Role | Hex |
|---|---|
| Midnight navy (base, gradients, end card) | `#0E1B33` |
| Slate (panels, secondary chips) | `#1F2D4A` |
| Arrival amber (warning / info chips, ticks accent) | `#F2A93B` |
| Soft gold (labels, end-card service line) | `#FFC857` |
| Veha teal (brand, active caption word, price header) | `#00B39F` |
| White (captions, tiles) | `#FFFFFF` |
Photos dimmed ~20 % with a navy bottom gradient so white captions read. Captions: white + dark outline, active word teal.

## Outfits (Video 2 only)
- B (husband, Veha voice): dark navy button overshirt, open, over a charcoal-grey tee. (V1: white polo.)
- Woman (wife, Sokhom voice): soft sage-green knit cardigan over a cream top, hair loose. (V1: pink shirt.)
Same faces (generated from the clean `b/happy.png` / `woman/happy.png` identity), realistic photo cut-outs, white border + soft shadow (same pipeline as earlier stickers).

## New stickers
| File | Emotion / pose | Used in |
|---|---|---|
| `b-v2/arrive-look.png` | looking around, tired-curious, holding sling-bag strap | s01 |
| `b-v2/worried-queue.png` | worried, checking wristwatch | s03 |
| `b-v2/show-phone-dark.png` | proud, holding up black phone | s05 |
| `b-v2/explain-welcome.png` | explaining, both hands open | s07 (A/B) |
| `b-v2/ok-done.png` | proud OK hand sign ("រួចរាល់") | s07 (swap on "គឺរួចរាល់!") |
| `b-v2/relaxed-thumbsup.png` | relaxed thumbs-up | s09 |
| `woman-v2/shrug-casual.png` | breezy shrug, palms up | s02 |
| `woman-v2/tired-sigh.png` | exhausted sigh, hand on forehead | s04 |
| `woman-v2/hopeful-clasp.png` | impressed, hands clasped | s06 |
| `woman-v2/spot-point.png` | excited, pointing right | s08 A |
| `woman-v2/relieved-smile.png` | relieved, hand on chest | s08 B (swap on "ស្រួលខ្លួនដល់ហើយ") |

## New places (`public/real/sai-v2/`, 1080×1920, generated likenesses — not real photos)
| File | Scene |
|---|---|
| `p01-arrivals-hall-night.jpg` — arrivals hall, glass exit, amber lights | s01, s05 A (blurred) |
| `p02-sai-terminal-night.jpg` — terminal exterior, sweeping lit roof, palms | s02, s07 A (blurred), s10 (blurred) |
| `p03-taxi-queue-night.jpg` — long taxi queue at the curb | s03 A |
| `p04-highway-night.jpg` — dark country road, palms, town glow | s03 B |
| `p05-arrivals-bench-night.jpg` — empty benches + luggage trolley | s04 |
| `p06-sedan-pickup-night.jpg` — dark sedan waiting at pickup lane | s05 B, s06 (blurred) |
| `p07-driver-sign-night.jpg` — driver with sign "VEHA BOOKING / Mr. DARA" | s07 C, s08 A |
| `p08-driver-luggage-night.jpg` — driver loading suitcase into trunk | s08 B |
| `p09-house-gate-night.jpg` — Siem Reap house gate, porch lights, sedan, suitcase | s09 |
| `cars/sedan.png` `cars/suv.png` `cars/mpv.png` `cars/van.png` — silver cut-outs | s05 B + s10 price card, s06 hero (sedan) |

## Voices
B = KiriTTS cloned **Veha** · Wife = cloned **Sokhom** · End card = Explore voice **Oudom** (no captions).
Natural mode, speed 1.0, no style prompt, no pause trimming, keep punctuation, word timestamps, −17 LUFS.
**"SAI" is never spoken** (V1 lesson): dropped from voice text; captions still show "SAI". Phone number never spoken.

## Scenes
### s01 — Hook: landed late (≈5 s) · B
- Line (caption): អូនហា៎ យើងដល់ព្រលាន SAI ហើយ! តែយប់ជ្រៅម្លេះ ចុះយើងជិះអីទៅផ្ទះវិញទៅអូន?
- Voice: អូនហា៎ យើងដល់ព្រលានហើយ! តែយប់ជ្រៅម្លេះ ចុះយើងជិះអីទៅផ្ទះវិញទៅអូន?  (SAI caption timed on "ព្រលាន")
- Sticker `b-v2/arrive-look.png` · BG `sai-v2/p01-arrivals-hall-night.jpg` slow push-in · chip "SAI · យប់" (teal) · hard open, crossfade out.
### s02 — Wife's easy answer (≈4 s) · Wife
- Line/voice: អូ៎ ចេញទៅខាងក្រៅ ចាំរកតាក់ស៊ីតាមផ្លូវក៏បានដែរតើបង!
- Sticker `woman-v2/shrug-casual.png` · BG `p02-sai-terminal-night.jpg` (low framing on roof + road) · whoosh.
### s03 — Problem: queue + far + price (≈8 s, 2 beats) · B
- Line/voice: អ្ហេ! មើលទៅ គេតម្រឹងជួររកឡានវែងអន្លាយ! ហើយព្រលាននេះឆ្ងាយពីក្រុងប្រហែលមួយម៉ោង មិនដឹងគេហៅថ្លៃប៉ុន្មានទេ ប្រយ័ត្នគេឡើងថ្លៃលើយើងណា៎អូន!
- Sticker `b-v2/worried-queue.png`
- A: `p03-taxi-queue-night.jpg` · B: `p04-highway-night.jpg` + teal route line, chips "SAI → ក្រុងសៀមរាប" (teal), "≈ 1 ម៉ោង" (amber), "$ ?" (red, `buzz`). Crossfade between beats.
### s04 — Wife is tired (≈4 s) · Wife
- Voice: ហឹម... ហត់ផងហើយ ចុះបងមានវិធីអីល្អអត់?  (stage direction not spoken)
- Sticker `woman-v2/tired-sigh.png` · BG `p05-arrivals-bench-night.jpg` dimmed.
### s05 — Solution (≈8.5 s, 2 beats) · B
- Voice: មើលនេះនែ៎! បងកក់ វេហា ប៊ុកឃីង ទុកមុនហើយ មានឡានឯកជនមកចាំទទួលនៅព្រលាន ជូនដល់ផ្ទះតែម្តង តម្លៃចាប់ពី ម្ភៃពីរដុល្លារ ថ្លៃថេរ មិនបាច់តថ្លៃទេអូន!
- Sticker `b-v2/show-phone-dark.png`
- A: `p01-arrivals-hall-night.jpg` blurred + UiPhone with `real/sai/ui-transport-home.png` (⚠ temporary, see Missing #1), `tap`.
- B: `p06-sedan-pickup-night.jpg` + 4-model price card (teal header "ចាប់ពី $22"; Sedan $22 · SUV $22 · MPV $30 · Van $35 with `sai-v2/cars/*`), amber chip "ថ្លៃថេរ", `coin`.
### s06 — "How did you book?" (≈2.5 s) · Wife
- Line/voice: ឡូយម៉េះបង! ចុះបងកក់តាមណាដែរ?
- Sticker `woman-v2/hopeful-clasp.png` · `sai-v2/cars/sedan.png` hero over blurred `p06-sedan-pickup-night.jpg` · whoosh.
### s07 — How to book + name sign (≈11 s, 3 beats) · B
- Voice: ស្រួលណាស់អូន! គ្រាន់តែចូល វេហាប៊ុកឃីង ដត ខម រើសម៉ោងយន្តហោះមកដល់ រើសទីតាំងផ្ទះ ហើយបង់លុយតាម ខេអេចឃ្យូអា ភ្លាមៗ គឺរួចរាល់! ពេលចុះពីយន្តហោះ អ្នកបើកឡានគេកាន់ស្លាកឈ្មោះចាំយើងហើយ។
- Sticker `b-v2/explain-welcome.png` → `b-v2/ok-done.png` on "គឺរួចរាល់!"
- A: blurred `p02-sai-terminal-night.jpg` + UiPhone `real/sai/ui-sai-results.png` (⚠ temporary), chips ① រើសម៉ោងយន្តហោះមកដល់ ② រើសទីតាំងផ្ទះ, `tap`.
- B: amber "KHQR" chip + `scan` sfx (no fake QR — real KHQR screen still missing).
- C: `p07-driver-sign-night.jpg` (sign "VEHA BOOKING / Mr. DARA").
### s08 — Result (≈7 s, 2 beats) · Wife
- Line/voice: នោះ! មែនហើយបង គេកាន់ស្លាកឈ្មោះយើងឈររង់ចាំនៅនោះ! មិនបាច់តម្រឹងជួរ មិនបាច់តថ្លៃ ស្រួលខ្លួនដល់ហើយ។
- Sticker `woman-v2/spot-point.png` → `woman-v2/relieved-smile.png` on "ស្រួលខ្លួនដល់ហើយ"
- A: push-in on the sign in `p07-driver-sign-night.jpg` · B: `p08-driver-luggage-night.jpg` + teal ticks "✓ មិនបាច់តម្រឹងជួរ" "✓ មិនបាច់តថ្លៃ", `ding`.
### s09 — Closing (≈4.5 s) · B
- Voice: ចាំណា៎អូន! លើកក្រោយមកដល់សៀមរាប ទុកចិត្តលើ វេហា ប៊ុកឃីង បាន។
- Sticker `b-v2/relaxed-thumbsup.png` · BG `p09-house-gate-night.jpg` (home arrival — fills V1's missing resource).
### s10 — End card (hold ≥ 3 s after narration) · Oudom, no captions
- BG `p02-sai-terminal-night.jpg` blurred + navy overlay; `veha-logo.png` top.
- Text (exact): សេវាទទួលពីអាកាសយានដ្ឋានអន្តរជាតិសៀមរាបអង្គរ (SAI) ⇄ ក្រុងសៀមរាប · price card ចាប់ពី $22 (Sedan $22 · SUV $22 · MPV $30 · Van $35, `sai-v2/cars/*`) · ថ្លៃថេរ · អ្នកបើកកាន់ស្លាកឈ្មោះរង់ចាំ · ជូនដល់ផ្ទះ ឬសណ្ឋាគារ · កក់ឥឡូវនេះ៖ vehabooking.com · ទូរស័ព្ទ៖ 095 255 577 (on screen only).
- Oudom narration: to be written on voice day (no SAI, no phone number, only approved facts); music ducked.

## Prices
Sedan $22 · SUV $22 · MPV $30 · Van $35, one way, SAI → Siem Reap town (vehabooking.com airport API, checked 19 Nov 2026). Re-check on render day.

## Missing resources
1. **Fresh vehabooking.com UI screenshots for SAI → Siem Reap (reverse direction)** — home/transport search + SAI results list showing $22/$22/$30/$35. Until received, s05 A / s07 A use Video 1's `ui-transport-home.png` / `ui-sai-results.png` **temporarily** — the only remaining overlap with Video 1.
2. Real KHQR payment screen from the vehabooking.com checkout (s07 B) — fallback chip only.
3. Optional: real photos to replace generated likenesses (SAI exterior at night, arrivals hall, a real Veha driver with a name sign). All `sai-v2/` places are AI-generated; the SAI terminal is a likeness, not the exact building. Sign name "Mr. DARA" is a placeholder; change if the user prefers.
4. Optional: higher-resolution places (generated at 576×1024, upscaled to 1080×1920 — slightly soft at full screen; fine under Ken Burns + dim).
