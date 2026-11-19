# Airport 02 — Airport to hotel (husband & wife), Phnom Penh & Siem Reap

**Final render:** `out/airport-hotel-9x16.mp4`
**Specs:** 1080×1920 · 30 fps · 1654 frames · 55.200 s · H.264 + AAC 48 kHz stereo · 33,390,421 bytes
**Composition:** `AirportHotelKhVertical` (`src/videos/17-airport-hotel`)

## Voices

| Line | Speaker | Clone | Voice length | Loudness |
|---|---|---|---|---|
| a01 | Wife | Sokhom | 4.29 s | −17.2 LUFS |
| a02 | Wife | Sokhom | 3.55 s | −17.2 LUFS |
| a03 | Husband | Veha | 3.35 s | −17.2 LUFS |
| a04 | Wife | Sokhom | 2.86 s | −17.3 LUFS |
| a05 | Husband | Veha | 5.07 s | −17.1 LUFS |
| a06 | Wife | Sokhom | 2.23 s | −17.3 LUFS |
| a07 | Husband | Veha | 3.68 s | −17.2 LUFS |
| a08 | Wife | Sokhom | 4.83 s | −17.2 LUFS |
| a09 | Husband | Veha | 5.27 s | −17.1 LUFS |
| a10 | Wife | Sokhom | 1.92 s | −17.2 LUFS |
| a11 | Husband | Veha | 8.16 s | −17.3 LUFS |
| a12 | Husband | Veha | 7.03 s | −17.1 LUFS |

All lines generated sequentially via KiriTTS. The two quiet short lines (a04, a10) were corrected with +3.5 dB / +5.0 dB gain to the same −17 dB target.

## Scene timings

| # | Line | Start | End | Scene |
|---|---|---|---|---|
| 1 | a01 | 0.00 s | 4.57 s | Arrival at night, couple with luggage |
| 2 | a02 | 4.57 s | 8.27 s | Busy pickup curb |
| 3 | a03 | 8.27 s | 11.77 s | iPhone frame with real transport-search UI |
| 4 | a04 | 11.77 s | 14.77 s | Wife "wow" over phone scene |
| 5 | a05 | 14.77 s | 20.00 s | Plane landing + flight tracking |
| 6 | a06 | 20.00 s | 22.37 s | Arrival scene, wife "what" |
| 7 | a07 | 22.37 s | 26.20 s | Name board + luggage help |
| 8 | a08 | 26.20 s | 31.17 s | Phnom Penh / Siem Reap airport split |
| 9 | a09 | 31.17 s | 36.60 s | Real Sedan cards in iPhone frames → hotel split |
| 10 | a10 | 36.60 s | 38.67 s | Real Phnom Penh Sedan card + "$?" |
| 11 | a11 | 38.67 s | 46.97 s | Full real $15 / $18 Sedan cards |
| 12 | a12 | 46.97 s | 55.13 s | Real card + Book Now tap → hotel → end card |

## User feedback fixes

- **S9 / S10 / S12** now show the **full real platform card/listing** from `pnh-sedan-booknow.png` and `sai-sedan-booknow.png` — car image, listing text, price and `Book Now` are all visible inside the iPhone frame. No fabricated UI and no narrow price-only crop.
- **Hotel scene** ends clean: the hotel photo overlay is `zIndex: 30`, so the booking card is fully covered during the transition. The card no longer remains over the hotel.
- **Book Now tap** is positioned on the real button area in the full card.

## Checks

- Captions: white with outline, no background box, word-by-word teal highlight, synced to KiriTTS word timestamps. Caption text coverage matches every generated line.
- Prices: spoken in Khmer (`ដប់ប្រាំដុល្លារ` / `ដប់ប្រាំបីដុល្លារ`), displayed as digits `$15` / `$18`.
- Phone `+855(0)95255577` appears only on the end card; not spoken and not in narration.
- Audio master: mean −17.1 dB, max −1.9 dB.
- No black segments (`blackdetect` clean).
- English terms kept English on screen: Sedan, Book Now, vehabooking.com.

## Verification artifacts

- `out/airport-hotel-contact-sheet.png` — 15-frame contact sheet incl. S9, S10, S11, S12 card/hotel/end.
- `out/airport-hotel-keyframes/` — full-resolution final keyframes.

## Limitation

KiriTTS word timestamps were checked for completeness and caption coverage; a human listen-through of every voice line was not performed. Voice/auth token had to be refreshed during production, so further regeneration may require re-authorization.
