# SAI Video 2 — SAI airport → House (landing, ride home) — STORYBOARD BRIEF

Work only inside `/home/dev/Native-project/Video-Remotions/Vehabooking`. NEVER touch `~/Native-project/Video-Remotions/Rentmee`.
Preserve all existing videos, voices, stickers and briefs (add new files only).

## Output (suggested)
- Composition: `src/videos/19-sai-airport-to-house` (copy structure/style of `17-airport-hotel` and `14-airport-couple`)
- Remotion id: `SaiAirportToHouseVertical`
- Render: `npm run render:19sai-airport-house-v` → `out/sai-airport-to-house-9x16.mp4`
- 1080×1920, 30fps, 9:16 only. Timing like 17: LEAD 4, VOICE_IN 2, TAIL 2, END_HOLD ≥ 120 frames (4 s) on the end card.
- Approved script source: Veha Booking . Thai bot (SAI airport-transfer script, Video 2). Scene note: SAI arrivals at night.

## Prices (live from vehabooking.com, checked 19 Nov 2026, 2:25 PM UTC+7)
Source: vehabooking.com public airport-transfer API, travel dates 21 and 26 Nov 2026, operator AAA TRAVEL & TOURS, one way, per car:
- `https://vehabooking.com/api/backend/api/taxi/v1/customer/airport/schedules/siemreap/siem-reap-angkor-international-airport-sai?date=2026-11-21`
- `https://vehabooking.com/api/backend/api/taxi/v1/customer/airport/schedules/siem-reap-angkor-international-airport-sai/siemreap?date=2026-11-21`

| Model (site name) | Town → SAI | SAI → Town |
|---|---|---|
| Sedan (SEDAN STANDARD) | $22 | $22 |
| SUV (SUV STANDARD) | $22 | $22 |
| MPV (MPV COMFORT) | $30 | $30 |
| Van (VAN STANDARD) | $35 | $35 |

Same prices both directions. Cheapest = $22 (Sedan / SUV), so "ចាប់ពី ២២ដុល្លារ / from $22" in the script is correct.
Voice text for the price stays ម្ភៃពីរដុល្លារ. Re-check the API on render day; prices can change.
On screen: **4-model price card** (teal `#00B39F` header "ចាប់ពី $22", four rows: Sedan $22 · SUV $22 · MPV $30 · Van $35, using car cut-outs
`public/real/cars/sedan.png`, `suv.png`, `mpv.png`, `van.png`). Only one-way prices; do not show round-trip prices.

### Spoken price lines (checked against the live site)
- Scene 5 (husband): "…តម្លៃចាប់ពី ២២ដុល្លារ ថ្លៃថេរ មិនបាច់តថ្លៃទេអូន!" → voice "…តម្លៃចាប់ពី ម្ភៃពីរដុល្លារ ថ្លៃថេរ…" — matches the live cheapest price ($22 Sedan/SUV). No change needed.
- End-card text "ចាប់ពី ២២ដុល្លារ" also matches. The per-model row "Sedan $22 · SUV $22 · MPV $30 · Van $35" is approved final end-card text.

## Voices (KiriTTS)
- B = Husband (ប្តី) = cloned **Veha**
- C = Wife (ប្រពន្ធ) = cloned **Sokhom**  (stickers from `public/stickers/people/woman/`)
Generate one line at a time, sequentially, speed 1.0, natural mode, no style prompt, no pause trimming, keep punctuation.
Balance both voices around -17 LUFS. Stage directions in brackets are NOT spoken. Phone number NEVER spoken.
Voice text spellings: Veha Booking→វេហា ប៊ុកឃីង · vehabooking.com→វេហាប៊ុកឃីង ដត ខម · KHQR→ខេអេចឃ្យូអា · SAI→អេសអេអាយ · $22 / ២២ដុល្លារ→ម្ភៃពីរដុល្លារ.
Captions keep the English / digits (Veha Booking, vehabooking.com, KHQR, SAI, $22).

## Stickers
Realistic photographic cut-outs only, same pop-in frame + `pop` sfx every time, no A/B/C labels.
- B: `public/stickers/people/b/` — existing hah, happy, laugh, point-right, thinking, thumbsup, what, wow + NEW `scratch-head.png`, `show-phone.png`, `worried.png`, `explain.png`
- C: `public/stickers/people/woman/` — existing hah, happy, thinking, thumbsup, what, wow + NEW `worried.png`, `show-phone.png`, `sigh.png`, `point.png`, `relieved.png`
B sticker only on B lines, woman sticker only on C lines. A sticker swap inside one line is allowed where marked (→).

## Storyboard

### Scene 1 — Hook: landed late at night (≈5 s)
- Speaker: B (husband)
- Line: ប្តី: អូនហា៎ យើងដល់ព្រលាន SAI ហើយ! តែយប់ជ្រៅម្លេះ ចុះយើងជិះអីទៅផ្ទះវិញទៅអូន?
- Voice text: អូនហា៎ យើងដល់ព្រលាន អេសអេអាយ ហើយ! តែយប់ជ្រៅម្លេះ ចុះយើងជិះអីទៅផ្ទះវិញទៅអូន?
- Sticker: `b/thinking.png`
- Visual: 0.8 s flash of `public/real/airport-hotel/scene05-plane-landing.png` (`whoosh`), then `public/real/airport-hotel/scene01-arrival-night.png` (couple with luggage at night) slow Ken Burns.
- On-screen: small teal chip "SAI · យប់" at the top.
- Transition: hard open, crossfade out.

### Scene 2 — Wife's easy answer (≈4 s)
- Speaker: C (wife)
- Line: ប្រពន្ធ: អូ៎ ចេញទៅខាងក្រៅ ចាំរកតាក់ស៊ីតាមផ្លូវក៏បានដែរតើបង!
- Voice text: same.
- Sticker: `woman/hah.png` (casual)
- Visual: `public/real/airport-hotel/scene08-sai-airport.png` (SAI terminal exterior at dusk/night).
- Transition: quick whoosh.

### Scene 3 — Problem: queue + far + unknown price (≈8 s; two beats)
- Speaker: B (husband)
- Line: ប្តី: អ្ហេ! មើលទៅ គេតម្រឹងជួររកឡានវែងអន្លាយ! ហើយព្រលាននេះឆ្ងាយពីក្រុងប្រហែលមួយម៉ោង មិនដឹងគេហៅថ្លៃប៉ុន្មានទេ ប្រយ័ត្នគេឡើងថ្លៃលើយើងណា៎អូន!
- Voice text: same (no English words).
- Sticker: `b/worried.png` (NEW — worried, pointing at the queue)
- Beat A ("គេតម្រឹងជួរ…"): `public/real/airport-hotel/scene02-taxi-queue.png` (long taxi queue at night).
- Beat B ("ឆ្ងាយ…មួយម៉ោង… ថ្លៃប៉ុន្មាន"): `public/real/airport/siemreap-city.jpg` darkened, teal route "SAI → ក្រុងសៀមរាប" + chip "≈ 1 ម៉ោង", then a "$ ?" chip with `buzz` sfx.
- Transition: crossfade between beats.

### Scene 4 — Wife is tired (≈4 s)
- Speaker: C (wife)
- Line: ប្រពន្ធ: (ដកដង្ហើមធំ) ហឹម... ហត់ផងហើយ ចុះបងមានវិធីអីល្អអត់?
- Voice text: ហឹម... ហត់ផងហើយ ចុះបងមានវិធីអីល្អអត់?  (stage direction not spoken)
- Sticker: `woman/sigh.png` (NEW — the ដកដង្ហើមធំ moment)
- Visual: `scene01-arrival-night.png` blurred + dimmed.

### Scene 5 — Solution: booked in advance (≈8.5 s; two beats)
- Speaker: B (husband)
- Line: ប្តី: មើលនេះនែ៎! (បង្ហាញទូរស័ព្ទ) បងកក់ Veha Booking ទុកមុនហើយ មានឡានឯកជនមកចាំទទួលនៅព្រលាន ជូនដល់ផ្ទះតែម្តង តម្លៃចាប់ពី ២២ដុល្លារ ថ្លៃថេរ មិនបាច់តថ្លៃទេអូន!
- Voice text: មើលនេះនែ៎! បងកក់ វេហា ប៊ុកឃីង ទុកមុនហើយ មានឡានឯកជនមកចាំទទួលនៅព្រលាន ជូនដល់ផ្ទះតែម្តង តម្លៃចាប់ពី ម្ភៃពីរដុល្លារ ថ្លៃថេរ មិនបាច់តថ្លៃទេអូន!
- Sticker: `b/show-phone.png` (NEW — the បង្ហាញទូរស័ព្ទ moment)
- Beat A: `public/real/airport-hotel/scene03-husband-phone.png` → `public/images/airport-hotel/transport-search-phone.png` pops in; `tap` sfx.
- Beat B ("ចាប់ពី ២២ដុល្លារ ថ្លៃថេរ"): `public/real/airport-hotel/scene11-sedan-night.png` + the 4-model price card (header "ចាប់ពី $22") and a teal chip "ថ្លៃថេរ"; `coin` sfx.
- ⚠ Do NOT show `real/airport-hotel/real-ui/sai-listing.png`, `real/airport-hotel/sai-results.png` or `images/airport-hotel/sai-sedan-booknow.png`: old captures ($18 Sedan/SUV, $23 Van, $40 MPV), they do not match the live site.

### Scene 6 — "How did you book?" (≈2.5 s)
- Speaker: C (wife)
- Line: ប្រពន្ធ: ឡូយម៉េះបង! ចុះបងកក់តាមណាដែរ?
- Voice text: same.
- Sticker: `woman/wow.png`
- Visual: `public/real/cars/sedan.png` cut-out over blurred `scene11-sedan-night.png`; `whoosh`.

### Scene 7 — How to book + name sign (≈11 s; three beats)
- Speaker: B (husband)
- Line: ប្តី: ស្រួលណាស់អូន! គ្រាន់តែចូល vehabooking.com រើសម៉ោងយន្តហោះមកដល់ រើសទីតាំងផ្ទះ ហើយបង់លុយតាម KHQR ភ្លាមៗ គឺរួចរាល់! ពេលចុះពីយន្តហោះ អ្នកបើកឡានគេកាន់ស្លាកឈ្មោះចាំយើងហើយ។
- Voice text: ស្រួលណាស់អូន! គ្រាន់តែចូល វេហាប៊ុកឃីង ដត ខម រើសម៉ោងយន្តហោះមកដល់ រើសទីតាំងផ្ទះ ហើយបង់លុយតាម ខេអេចឃ្យូអា ភ្លាមៗ គឺរួចរាល់! ពេលចុះពីយន្តហោះ អ្នកបើកឡានគេកាន់ស្លាកឈ្មោះចាំយើងហើយ។
- Sticker: `b/explain.png` (NEW) → `b/thumbsup.png` on "គឺរួចរាល់!"
- Beat A: `public/real/airport-hotel/real-ui/transport-search.png` in the iPhone frame, step chips ① រើសម៉ោងយន្តហោះមកដល់ ② រើសទីតាំងផ្ទះ; `tap` sfx.
- Beat B ("KHQR"): KHQR payment screen — MISSING (same as Video 1). Fallback: teal "KHQR" chip + `scan` sfx, no fake QR.
- Beat C ("អ្នកបើកឡាន…ស្លាកឈ្មោះ"): `public/real/airport-hotel/scene07-driver-nameboard.png` (driver holding a blank sign at arrivals; optionally place `public/veha-logo-cut.png` on the blank board, no invented customer name).

### Scene 8 — Result: there's our name sign (≈7 s; two beats)
- Speaker: C (wife)
- Line: ប្រពន្ធ: នោះ! មែនហើយបង គេកាន់ស្លាកឈ្មោះយើងឈររង់ចាំនៅនោះ! មិនបាច់តម្រឹងជួរ មិនបាច់តថ្លៃ ស្រួលខ្លួនដល់ហើយ។
- Voice text: same.
- Sticker: `woman/point.png` (NEW) → `woman/relieved.png` (NEW) on "ស្រួលខ្លួនដល់ហើយ"
- Beat A ("នោះ!… ស្លាកឈ្មោះ"): `scene07-driver-nameboard.png` with a push-in toward the sign.
- Beat B ("មិនបាច់តម្រឹងជួរ មិនបាច់តថ្លៃ"): `public/real/airport-hotel/scene07-luggage-help.png` → `scene11-sedan-night.png`; teal ticks "✓ មិនបាច់តម្រឹងជួរ" "✓ មិនបាច់តថ្លៃ" appear on the words; `ding` sfx.

### Scene 9 — Closing (≈4.5 s)
- Speaker: B (husband)
- Line: ប្តី: ចាំណា៎អូន! លើកក្រោយមកដល់សៀមរាប ទុកចិត្តលើ Veha Booking បាន។
- Voice text: ចាំណា៎អូន! លើកក្រោយមកដល់សៀមរាប ទុកចិត្តលើ វេហា ប៊ុកឃីង បាន។
- Sticker: `b/thumbsup.png`
- Visual: arrival home at night — MISSING. Fallback: `public/real/airport-hotel/scene09-sr-hotel.png` (sedan at a Siem Reap hotel at night; matches "home or hotel") or `public/real/taxi-family/scene03-private-sedan.png` (day, less ideal).

### Scene 10 — End card (hold ≥ 4 s, no voice)
- Background: `public/real/airport-hotel/scene08-sai-airport.png` blurred + dimmed; `public/veha-logo.png` at top.
- Layout (9:16, readable): logo top; title stacked on 2–3 centred lines; the service line(s) below; then the 4-model price card
  (teal header "ចាប់ពី ២២ដុល្លារ", 2×2 white tiles with car cut-out, model name and price, prices ≥ 48 px at 1080×1920);
  booking + phone lines at the bottom, inside the safe area (keep clear of the bottom ~250 px used by app UI). Preview: Page end-card frame.
- Hold: at least 4 s (120 frames) after the last element lands; reveal title → price card tiles (staggered 4 frames) → booking line.
- Text only (exact):
  - សេវាទទួលពីអាកាសយានដ្ឋានអន្តរជាតិសៀមរាបអង្គរ (SAI) ⇄ ក្រុងសៀមរាប
  - ចាប់ពី ២២ដុល្លារ | ថ្លៃថេរ | អ្នកបើកកាន់ស្លាកឈ្មោះរង់ចាំ | ជូនដល់ផ្ទះ ឬសណ្ឋាគារ
  - Sedan $22 · SUV $22 · MPV $30 · Van $35  (approved 19 Nov 2026; shown as the 4-model price card)
  - កក់ឥឡូវនេះ៖ vehabooking.com | ទូរស័ព្ទ៖ 095 255 577
- Phone number on screen only, never spoken. `ding` on reveal, music `veha-bed.wav` resolves.

Estimated total: ≈ 57–60 s (confirm from KiriTTS timings).

## Visual rules
Restrained teal `#00B39F`, white, soft neutral. One idea per scene, smooth Ken Burns / crossfades, consistent sticker frame
and position, no speaker labels, no stacked cards. Captions white with dark outline, active word teal `#00B39F`,
no background box, word-level timing from KiriTTS. Night palette: keep photos slightly dimmed so white captions read.

## Missing resources to source
1. KHQR payment screenshot from the real vehabooking.com checkout (Scene 7).
2. Night arrival at a house (sedan in front of a Siem Reap house at night) for Scene 9.
3. Optional: a driver holding a sign with an actual name (current `scene07-driver-nameboard.png` sign is blank).
4. A fresh vehabooking.com SAI listing screenshot showing Sedan $22 · SUV $22 · MPV $30 · Van $35 (the project screenshots are old: Sedan $18, SUV $18, MPV $40, Van $23). Until then use the 4-model price card.

## Guardrails
Only the facts in the approved script plus the live per-model prices above: from $22 (Sedan $22, SUV $22, MPV $30, Van $35), fixed price, private car waiting at SAI, drop-off at home (or hotel on the end card),
SAI about one hour from town, book on vehabooking.com by flight arrival time, pay by KHQR, driver holds a name sign.
No invented prices, travel times, guarantees, flight tracking, luggage-capacity promises, air-conditioning claims or live tracking.
No phone number spoken.
