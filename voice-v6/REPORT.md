# Voice v6 — Build & Render Report

Built with `voice-v6/build.py` from `voice-v6/spec.json`. Only leading/trailing silence was trimmed; no speed/pitch changes and no loudnorm. Each clip was matched with one plain volume gain (clamped to ±4 dB), mono MP3 192 kbps.

## Verification

- Backups created before overwriting: `voice-v6/prev-pp/`, `voice-v6/prev-fe/`.
- All final clips are mono, 192 kbps; measured final loudness is ~-17.2 to -17.3 LUFS.
- Every `audioFrames` value matches `ceil(ffprobe duration × 30)`; caption starts were reduced by the measured lead trim and clamped at 0.
- `npm run render:10pp-v` exited 0.
- `npm run render:11ferry03-v` exited 0.

## PP — Private PP → Siem Reap

| Line | Source | Lead trim (s) | Gain (dB) | Final duration (s) |
|---|---|---:|---:|---:|
| p01 | new: https://mcp.kiritts.com/files/d921082ab26db1a315df297362e434b4.mp3 | 0.000 | -1.40 | 4.063 |
| p02 | new: https://mcp.kiritts.com/files/46bd57545a23f2ed656d52527e2e9f3d.mp3 | 0.164 | +2.50 | 2.225 |
| p03 | new: https://mcp.kiritts.com/files/8faf71871a2ba1746f43267c126f9457.mp3 | 0.000 | +0.70 | 3.187 |
| p04 | new: https://mcp.kiritts.com/files/760fd789e0a9de1d6e8bd3bd17a763c8.mp3 | 0.000 | +2.60 | 1.643 |
| p05 | new: https://mcp.kiritts.com/files/9b717ae40315a3b3c109297512699d3d.mp3 | 0.000 | -1.00 | 3.060 |
| p06 | new: https://mcp.kiritts.com/files/d59733d616a3bfcb0321633ac09fa45a.mp3 | 0.088 | -0.30 | 2.006 |
| p07 | new: https://mcp.kiritts.com/files/ceb0f4cb2ae439a0702d208ecc39ab06.mp3 | 0.000 | -2.10 | 2.881 |
| p08 | new: https://mcp.kiritts.com/files/a12bb450d54ce89ee5db70ed5cad1646.mp3 | 0.000 | -1.80 | 1.918 |
| p09 | new: https://mcp.kiritts.com/files/d5c63212506ddc732419d122ae7d95cc.mp3 | 0.000 | -1.50 | 3.678 |
| p10 | new: https://mcp.kiritts.com/files/78e301c76d512b91b6fd2ae7914d58c3.mp3 | 0.010 | -1.30 | 1.745 |
| p11 | reuse: voice-bak5/pp-sr/p11.mp3 | 0.000 | -0.50 | 4.275 |
| p12 | new: https://mcp.kiritts.com/files/55bc5402213169366d67698affe8b3e9.mp3 | 0.000 | -1.30 | 2.207 |
| p13 | new: https://mcp.kiritts.com/files/9383594453ea969366fc8ccbe3129f01.mp3 | 0.000 | -0.60 | 2.240 |

**Video:** `videos/08-private-pp-sr/private-pp-sr-kh-9x16.mp4` — ffprobe duration **39.900s**

## FE — Ferry 03

| Line | Source | Lead trim (s) | Gain (dB) | Final duration (s) |
|---|---|---:|---:|---:|
| p01 | reuse: voice-bak5/ferry-03/p01.mp3 | 0.000 | +0.00 | 3.035 |
| p02 | new: https://mcp.kiritts.com/files/1470773c15c19433f72b3c1d18dd1b4e.mp3 | 0.000 | -1.80 | 2.720 |
| p03 | reuse: voice-bak5/ferry-03/p03.mp3 | 0.026 | +2.70 | 1.338 |
| p04 | new: https://mcp.kiritts.com/files/1bf29a04f8d60e56463e4a349adde822.mp3 | 0.153 | -3.30 | 3.359 |
| p05 | new: https://mcp.kiritts.com/files/5812c68754d687d5de1108d2eaca780c.mp3 | 0.153 | +2.00 | 0.744 |
| p06 | reuse: voice-bak5/ferry-03/p06.mp3 | 0.000 | -0.40 | 2.521 |
| p07 | reuse: voice-bak5/ferry-03/p07.mp3 | 0.145 | -1.60 | 2.856 |
| p08 | reuse: voice-bak5/ferry-03/p08.mp3 | 0.000 | +1.50 | 1.600 |
| p09 | reuse: voice-bak5/ferry-03/p09.mp3 | 0.000 | -2.40 | 4.640 |
| p10 | reuse: voice-bak5/ferry-03/p10.mp3 | 0.000 | +1.20 | 2.434 |
| p11 | reuse: voice-bak5/ferry-03/p11.mp3 | 0.018 | -1.20 | 2.718 |
| p12 | reuse: voice-bak5/ferry-03/p12.mp3 | 0.000 | -1.20 | 2.641 |

**Video:** `videos/11-ferry-03/ferry03-kh-9x16.mp4` — ffprobe duration **35.100s**
