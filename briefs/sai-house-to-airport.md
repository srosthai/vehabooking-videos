# SAI Video 1 — House → SAI airport (leaving for the flight) — STORYBOARD BRIEF

Work only inside `/home/dev/Native-project/Video-Remotions/Vehabooking`. NEVER touch `~/Native-project/Video-Remotions/Rentmee`.
Preserve all existing videos, voices, stickers and briefs (add new files only).

## Output (suggested)
- Composition: `src/videos/18-sai-house-to-airport` (copy structure/style of `14-airport-couple` and `17-airport-hotel`)
- Remotion id: `SaiHouseToAirportVertical`
- Render: `npm run render:18sai-house-airport-v` → `out/sai-house-to-airport-9x16.mp4`
- 1080×1920, 30fps, 9:16 only. Timing like 17: LEAD 4, VOICE_IN 2, TAIL 2, END_HOLD ≥ 120 frames (4 s) on the end card.
- Approved script source: Veha Booking . Thai bot (SAI airport-transfer script, Video 1). Scene note: at home, packing suitcases.

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
- Scene 5 (wife): "…តម្លៃចាប់ពី ២២ដុល្លារ ទេបង!" → voice "…តម្លៃចាប់ពី ម្ភៃពីរដុល្លារ ទេបង!" — matches the live cheapest price ($22 Sedan/SUV). No change needed.
- End-card text "ចាប់ពី ២២ដុល្លារ" also matches. The per-model row "Sedan $22 · SUV $22 · MPV $30 · Van $35" is approved final end-card text.

## Voices (KiriTTS)
- B = Husband (ប្តី) = cloned **Veha**
- C = Wife (ប្រពន្ធ) = cloned **Sokhom**  (stickers from `public/stickers/people/woman/`)
Generate one line at a time, sequentially, speed 1.0, natural mode, no style prompt, no pause trimming, keep punctuation.
Balance both voices around -17 LUFS. Stage directions in brackets are NOT spoken. Phone number NEVER spoken.
Voice text spellings: Veha Booking→វេហា ប៊ុកឃីង · vehabooking.com→វេហាប៊ុកឃីង ដត ខម · KHQR→ខេអេចឃ្យូអា · SAI→អេសអេអាយ · $22 / ២២ដុល្លារ→ម្ភៃពីរដុល្លារ · ម៉ោង ៨ព្រឹក→ម៉ោងប្រាំបីព្រឹក.
Captions keep the English / digits (Veha Booking, vehabooking.com, KHQR, SAI, $22, 8:00).

## Stickers
Realistic photographic cut-outs only, same pop-in frame + `pop` sfx every time, no A/B/C labels.
- B: `public/stickers/people/b/` — existing hah, happy, laugh, point-right, thinking, thumbsup, what, wow + NEW `scratch-head.png`, `show-phone.png`, `worried.png`, `explain.png`
- C: `public/stickers/people/woman/` — existing hah, happy, thinking, thumbsup, what, wow + NEW `worried.png`, `show-phone.png`, `sigh.png`, `point.png`, `relieved.png`
B sticker only on B lines, woman sticker only on C lines. A sticker swap inside one line is allowed where marked (→).

## Storyboard

### Scene 1 — Hook (≈5 s)
- Speaker: C (wife)
- Line: ប្រពន្ធ: បងហា៎ ស្អែកជើងយន្តហោះយើង ហោះចេញម៉ោង ៨ព្រឹកហើយណា៎ ចុះយើងជិះអីទៅព្រលានយន្តហោះទៅបង?
- Voice text: បងហា៎ ស្អែកជើងយន្តហោះយើង ហោះចេញម៉ោងប្រាំបីព្រឹកហើយណា៎ ចុះយើងជិះអីទៅព្រលានយន្តហោះទៅបង?
- Sticker: `woman/thinking.png` (asking, unsure)
- Visual: `public/real/airport-couple-user/home-warm-mirrored.png` slow Ken Burns; suitcase cut-outs `public/images/airport-couple/suitcase-black-clean.png` + `suitcase-blue-clean.png` slide in at the bottom (packing).
- On-screen: small teal chip "✈ ស្អែក 8:00" at the top. SFX: soft `clock-alarm` under the first second, then `pop` for the sticker.
- Transition: hard open (fast hook), crossfade out.

### Scene 2 — Husband's easy answer (≈2.5 s)
- Speaker: B (husband)
- Line: ប្តី: អូ៎ ហៅតុកតុកជិះទៅក៏បានដែរតើអូន!
- Voice text: same.
- Sticker: `b/hah.png` (casual, over-confident)
- Visual: `public/real/siemreap.jpg` (Siem Reap street with tuk-tuks parked on the right) quick zoom toward the tuk-tuks.
- On-screen: caption only. Transition: quick whoosh.

### Scene 3 — Problem: far + big suitcases (≈7 s; two visual beats, one voice line)
- Speaker: C (wife)
- Line: ប្រពន្ធ: អ្ហេ! ព្រលានថ្មី SAI ឆ្ងាយពីក្រុងប្រហែលមួយម៉ោងឯណោះបង! វ៉ាលីយើងធំៗ ជិះតុកតុក ទៅទាន់ដែរហីបង? យូរផង ប្រយ័ត្នខកជើងយន្តហោះណា៎!
- Voice text: អ្ហេ! ព្រលានថ្មី អេសអេអាយ ឆ្ងាយពីក្រុងប្រហែលមួយម៉ោងឯណោះបង! វ៉ាលីយើងធំៗ ជិះតុកតុក ទៅទាន់ដែរហីបង? យូរផង ប្រយ័ត្នខកជើងយន្តហោះណា៎!
- Sticker: `woman/worried.png` (NEW)
- Beat A ("…មួយម៉ោង"): `public/real/airport/siemreap-city.jpg` → `public/real/airport-hotel/scene08-sai-airport.png` with a simple teal route line "ក្រុងសៀមរាប → SAI" and chip "≈ 1 ម៉ោង".
- Beat B ("វ៉ាលីយើងធំៗ…"): suitcase cut-outs large over blurred home bg; `buzz` sfx on "ខកជើងយន្តហោះ".
- Transition: crossfade between beats.

### Scene 4 — Husband realises (≈3.5 s)
- Speaker: B (husband)
- Line: ប្តី: (អេះក្បាល) ហឹម... មែនតើអូន! ចុះអូនមានគំនិតអីល្អអត់?
- Voice text: ហឹម... មែនតើអូន! ចុះអូនមានគំនិតអីល្អអត់?  (stage direction not spoken)
- Sticker: `b/scratch-head.png` (NEW — the អេះក្បាល moment)
- Visual: `home-warm-mirrored.png` blurred/dimmed so the sticker carries the beat.
- Transition: crossfade.

### Scene 5 — Solution: Veha Booking private car (≈6.5 s; two beats)
- Speaker: C (wife)
- Line: ប្រពន្ធ: មើលនេះនែ៎! (បង្ហាញទូរស័ព្ទ) Veha Booking មានឡានឯកជនមកទទួលដល់ផ្ទះ ជូនដល់ព្រលានតែម្តង តម្លៃចាប់ពី ២២ដុល្លារ ទេបង!
- Voice text: មើលនេះនែ៎! វេហា ប៊ុកឃីង មានឡានឯកជនមកទទួលដល់ផ្ទះ ជូនដល់ព្រលានតែម្តង តម្លៃចាប់ពី ម្ភៃពីរដុល្លារ ទេបង!
- Sticker: `woman/show-phone.png` (NEW — the បង្ហាញទូរស័ព្ទ moment)
- Beat A: `public/images/airport-hotel/transport-search-phone.png` (vehabooking.com Airport Transfers in phone frame) pops up beside the sticker; `tap` sfx.
- Beat B ("មកទទួលដល់ផ្ទះ…"): `public/real/taxi-family/scene03-private-sedan.png` (white sedan at the house), then the 4-model price card.
- Price card: the 4-model card (Sedan $22 · SUV $22 · MPV $30 · Van $35, header "ចាប់ពី $22") slides up on "តម្លៃចាប់ពី ២២ដុល្លារ"; `coin` sfx.
- ⚠ Do NOT show `real/airport-hotel/real-ui/sai-listing.png`, `real/airport-hotel/sai-results.png` or `images/airport-hotel/sai-sedan-booknow.png`: they are old captures ($18 Sedan/SUV, $23 Van, $40 MPV) and do not match the live site.
- Transition: crossfade.

### Scene 6 — "How do we book?" (≈2.5 s)
- Speaker: B (husband)
- Line: ប្តី: ឡូយម៉េះ! ហើយកក់តាមណាដែរអូន?
- Voice text: same.
- Sticker: `b/wow.png`
- Visual: `public/real/cars/sedan.png` cut-out slides in over blurred `scene03-private-sedan.png`; `whoosh` sfx.

### Scene 7 — How to book (≈10 s; three beats)
- Speaker: C (wife)
- Line: ប្រពន្ធ: ស្រួលណាស់បង! គ្រាន់តែចូល vehabooking.com រើសម៉ោង រើសទីតាំងមកទទួល ហើយកក់ បន្ទាប់មកលុយបង់តាម KHQR ភ្លាមៗ គឺរួចរាល់! ចាំតែតៃកុងឡាន មកយក យើងដល់ផ្ទះទេបង។
- Voice text: ស្រួលណាស់បង! គ្រាន់តែចូល វេហាប៊ុកឃីង ដត ខម រើសម៉ោង រើសទីតាំងមកទទួល ហើយកក់ បន្ទាប់មកលុយបង់តាម ខេអេចឃ្យូអា ភ្លាមៗ គឺរួចរាល់! ចាំតែតៃកុងឡាន មកយក យើងដល់ផ្ទះទេបង។
- Sticker: `woman/happy.png` → `woman/thumbsup.png` on "គឺរួចរាល់!"
- Beat A ("vehabooking.com រើសម៉ោង រើសទីតាំង… កក់"): `public/real/airport-hotel/real-ui/transport-search.png` (Airport Transfers tab) inside the iPhone frame, three teal step chips: ① រើសម៉ោង ② រើសទីតាំងមកទទួល ③ កក់; `tap` sfx per chip.
- Beat B ("KHQR"): KHQR payment screen — MISSING. Source a real screenshot of the vehabooking.com KHQR checkout step. Fallback: teal "KHQR" text chip + `scan` sfx (do not draw a fake QR code).
- Beat C ("ចាំតែតៃកុងឡាន មកយក…"): `public/real/taxi-family/scene11-driver-door.png` (driver at the car door in front of a house); `car-horn-gentle` sfx.
- Transition: crossfades between beats, then into end card.

### Scene 8 — End card (hold ≥ 4 s, no voice)
- Background: `public/real/airport-hotel/scene08-sai-airport.png` blurred + dimmed; `public/veha-logo.png` at top.
- Layout (9:16, readable): logo top; title stacked on 2–3 centred lines; the service line(s) below; then the 4-model price card
  (teal header "ចាប់ពី ២២ដុល្លារ", 2×2 white tiles with car cut-out, model name and price, prices ≥ 48 px at 1080×1920);
  booking + phone lines at the bottom, inside the safe area (keep clear of the bottom ~250 px used by app UI). Preview: Page end-card frame.
- Hold: at least 4 s (120 frames) after the last element lands; reveal title → price card tiles (staggered 4 frames) → booking line.
- Text only (exact):
  - ជូនពីក្រុងសៀមរាប ➜ អាកាសយានដ្ឋានអន្តរជាតិសៀមរាបអង្គរ (SAI)
  - ចាប់ពី ២២ដុល្លារ | មកទទួលដល់ផ្ទះ ឬសណ្ឋាគារ | មិនខកជើងយន្តហោះ
  - Sedan $22 · SUV $22 · MPV $30 · Van $35  (approved 19 Nov 2026; shown as the 4-model price card)
  - កក់ឥឡូវនេះ៖ vehabooking.com | ទូរស័ព្ទ៖ 095 255 577
- Phone number on screen only, never spoken. Music `public/music/veha-bed.wav` resolves; `ding` sfx on reveal.

Estimated total: ≈ 40–42 s (confirm from KiriTTS timings).

## Visual rules
Restrained teal `#00B39F`, white, soft neutral. One idea per scene, smooth Ken Burns / crossfades, consistent sticker frame
and position, no speaker labels, no stacked cards. Captions white with dark outline, active word teal `#00B39F`,
no background box, word-level timing from KiriTTS. Music bed `public/music/veha-bed.wav` low under dialogue.

## Missing resources to source
1. Optional: a closer tuk-tuk photo (ideally with big suitcases) for Scene 2; `real/siemreap.jpg` works as is.
2. Real photo of the couple packing suitcases at home (optional; current plan uses home photo + suitcase cut-outs).
3. KHQR payment screenshot from the real vehabooking.com checkout for Scene 7.
4. A fresh vehabooking.com SAI listing screenshot showing Sedan $22 · SUV $22 · MPV $30 · Van $35 (the project screenshots are old: Sedan $18, SUV $18, MPV $40, Van $23). Until then use the 4-model price card.

## Guardrails
Only the facts in the approved script plus the live per-model prices above: from $22 (Sedan $22, SUV $22, MPV $30, Van $35), private car, pickup at home or hotel, SAI about one hour from town,
book on vehabooking.com, pay by KHQR. No invented prices, travel times, guarantees, luggage-capacity promises,
air-conditioning claims or live tracking. No phone number spoken.
