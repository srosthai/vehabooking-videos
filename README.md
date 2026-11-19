# Veha Booking promo videos (Remotion)

| Folder | What is in it |
|---|---|
| `renders/` | **Finished videos**, one folder per video (`renders/INDEX.md` lists them all) |
| `docs/` | Briefs, scripts and reports per video (`docs/NN-slug/`), ferry series concepts |
| `src/videos/NN-slug/` | Remotion source for each video (`Compositions.tsx`, `narration.ts`, `timing.json`, `script.md`) |
| `public/` | Assets used by the renders (voice, real photos, images, stickers, music, sfx) |
| `production/voice/` | KiriTTS voice work folders (`generate.py`, `build.py`, raw takes) |
| `scripts/` | `master-reel.sh` (loudness master), `still-sheet.sh`, `stills.mjs`, `voice/` fetch helpers |
| `archive/` | Old renders, duplicates, `.bak` files, QA scratch (git-ignored, nothing deleted) |
| `out/` | Scratch output for test renders and stills (git-ignored) |

Render a video: `npm run render:NN-slug-v` (for example `npm run render:18-sai-house-airport-v`).
Old script names such as `render:18sai-house-airport-v` still work as aliases.
Checks: `npm run lint` (eslint + tsc).
