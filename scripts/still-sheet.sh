#!/usr/bin/env bash
# Render one still per scene for both formats into out/ (QA). Usage: scripts/still-sheet.sh
set -euo pipefail
node stills.mjs PrivateAirportKhVertical,PrivateAirportKhHorizontal 90,178,291,480,677,797,901,1082,1227,1344,1445,1697
