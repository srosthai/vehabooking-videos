# Private Phnom Penh → Kampot dialogue (13-private-kampot) — BRIEF
NEVER touch ~/Native-project/Video-Remotions/Rentmee.

## Goal
New composition `src/videos/13-private-kampot`, render script `npm run render:13kampot-v`. **9:16 ONLY.**
Base it on `12-airport-dialogue` and `10-private-pp-sr`, but **UPGRADE THE GRAPHICS** so they look more attractive and polished and stay consistent with the voice/title captions.

## Graphics upgrade (required)
- Smoother Ken Burns moves and transitions between scenes
- Nicer price and info cards with soft shadow and rounded corners in brand teal `#00B39F`
- Animated icons for the vehicle types (Sedan / SUV / MPV / Van)
- Clean speaker label + sticker frame that is consistent across every scene
- Subtle progress bar or brand bar
- Strong ending CTA with the vehabooking.com phone mockup and a pulsing Book Now button
- Everything consistent from scene to scene — same spacing, fonts, card style, sticker frame, label style

## Title captions must stay perfectly in sync with the voice
- Use KiriTTS word timestamps
- Captions in everyday Khmer, **NO background box**, each spoken word highlighted in teal `#00B39F`
- Max 2 lines on screen
- Never let the caption run ahead of or behind the audio

## Voices (KiriTTS)
- Generate **ONE line at a time**, sequentially, speed **1.0**, natural mode
- NO style prompt, NO pause trimming, keep punctuation
- Normal conversational volume; normalise so A and B are equally loud (~-17 LUFS)
- Person A = clone **"Better Voice"** (exact name may be `"Better Voice."`)
- Person B = clone **"Veha"**
- On-screen labels: `● A` and `● B` — must NOT overlap cards

## Voice-text spelling (captions stay English for these words)
- Veha Booking → វេហា ប៊ុកឃីង
- Book Now → ប៊ុកណាវ
- Sedan → ស៊ីដាន់
- SUV → អេសយូវី
- MPV → អេមភីវី
- Van → វ៉ាន
- vehabooking.com → វេហាប៊ុកឃីង ដត ខម
- $45 spoken as សែសិបប្រាំដុល្លារ, shown on screen as **$45**
- ញុំ allowed in voice text only; captions always show **ញុម**
- Do NOT speak any phone number
- Fast pace, no long gaps

## Real photos (already on disk)
`public/real/kampot/`:
- kampot-seahorse.jpg — seahorse statue on the river
- kampot-kayak.jpg — family kayaking in mangroves
- kampot-durian.jpg — durian roundabout at sunset
- kampot-river-resort.jpg — aerial river resort with mountains

Also reuse existing project photos:
- `public/real/bus-coach.png` for the bus complaint (line 2)
- `public/real/sedan.jpg`, `suv.jpg`, `van.jpg`, `public/real/cars/*` for private cars / vehicle cards
- `public/real/hotel.jpg`, `public/real/phnompenh.jpg`, `public/real/roadfood.jpg` / `roadsidefood.jpg` as needed
- App screens: `public/real/airport/app-airport-search.png` and other app screenshots in the project for the CTA phone mockup

### Photo mapping per line
1–2: family/travel feel + Kampot (seahorse or river resort). Line 2 MUST show `bus-coach.png`.
3: private car photo
5–6: price card over `kampot-river-resort`
7: car at a house → hotel (`kampot-river-resort` / `hotel.jpg`)
8–9: `kampot-durian` + roadside stops (`roadfood.jpg` / `roadsidefood.jpg`)
10–11: car cards with luggage (Sedan/SUV/MPV/Van)
12: iPhone frame with vehabooking.com app screens, then end on `kampot-kayak` or `kampot-seahorse`

Real photos only. No cartoons.

## Stickers
Use the existing realistic cut-out A/B stickers in `public/stickers/people/a/` and `public/stickers/people/b/` (happy, laugh, thinking, thumbsup, what, wow, hah).
- A stickers ONLY on A's lines; B stickers ONLY on B's lines
- Match emotion to the line
- Same frame + pop-in every time
- **Do NOT generate new stickers** (image tool has no funds). Do not use cartoons.

Suggested sticker mapping:
1 A thinking/excited · 2 A what/thinking · 3 B happy/thumbsup · 4 A what · 5 B happy · 6 A wow · 7 B explaining/thumbsup · 8 A what · 9 B happy · 10 A thinking · 11 B thumbsup/happy · 12 B thumbsup/happy

## Script (12 scenes) — use EXACTLY
1. A: «បង! ចុងសប្ដាហ៍នេះ ញុមចង់នាំគ្រួសារទៅលេងកំពតម្ដង។»
2. A: «តែមានក្មេងតូចៗផង ជិះឡានក្រុងពិបាកណាស់បង។»
3. B: «អឺ ចឹងជួលឡានឯកជន Veha Booking ទៅ! ជិះតែគ្រួសារអូនទេ។»
4. A: «មែនហីបង! ចុះតម្លៃគេគិតម៉េចដែរ ថ្លៃអត់?»
5. B: «អត់ថ្លៃទេ! ពីភ្នំពេញទៅកំពត ត្រឹមតែ $45 ប៉ុណ្ណោះ។»
6. A: «វ៉ាវ! ធូថ្លៃជាងជិះឡានក្រុងទៀតបង!»
7. B: «ឡានមកយកដល់មុខផ្ទះ ជូនដល់សណ្ឋាគារតែម្ដង។»
8. A: «ចុះបើក្មេងចង់ឈប់ចូលបន្ទប់ទឹក ឬទិញអីញ៉ាំតាមផ្លូវ បានអត់?»
9. B: «បានតើ! ចង់ឈប់ត្រង់ណា ប្រាប់អ្នកបើកឡានមួយម៉ាត់ទៅ។»
10. A: «អូ! ចុះមានឡានធំៗ អត់បង ព្រោះញុមដាក់អីវ៉ាន់ទៅ រាងច្រើនតិចបង?»
11. B: «មានគ្រប់ម៉ូតហ្មង! Sedan, SUV, MPV, Van ឡានគេស្អាត ត្រជាក់ ហើយអង្គុយស្រួលទៀត។»
12. B: «គ្រាន់តែរើសទីកន្លែង រើសថ្ងៃ ហើយចុច Book Now ទៅចប់។ ចូលកក់ឥឡូវហ្មងទៅ តាម vehabooking.com!»

## Finish
1. Add `render:13kampot-v` to package.json (mkdir videos/13-private-kampot, remotion render PrivateKampotKhVertical → videos/13-private-kampot/private-kampot-kh-9x16.mp4, then master-reel.sh).
2. Register the composition in Remotion.
3. Render the 9:16 mp4.
4. Final summary MUST include:
   - per-scene photo + sticker + length
   - which graphics were upgraded
   - any problems
   - exact output path
