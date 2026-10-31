#!/usr/bin/env bash
# Downloads the English KiriTTS "Ethan" clips and speeds them 1.05x (matches caption timings).
set -e
mkdir -p public/voice/veha-en && cd public/voice/veha-en
while read id h; do curl -sf -o /tmp/$id.mp3 https://mcp.kiritts.com/files/$h.mp3 && ffmpeg -y -v error -i /tmp/$id.mp3 -af atempo=1.05 -b:a 192k $id.mp3 && rm /tmp/$id.mp3; done <<'L'
ea01 77fd5fc463998b4c1dde0e3fdd1181eb
b02 0f8874a90ee3ef36596a65d7095549c2
ea03 d3e37ab8e1bd57b84e28ebf191d0d3c7
ea04 50f3ca0c2ea5295c0c2ec5568b7f9bde
ea05 7cc36160ad3571a17247709790a72164
ea06 afd27c8417641bea096991c8ee12003f
b05 81db1f147a7dfdf0d92acb9ad5abe668
b06 fd4688db6dff91f20136995cfa68a675
b09 1a7e5f59250477045fab0d3a5519944d
ea10 ea853994953d77e5a634078ec5cf42e1
b11 bd9004933731ab1223fe33cd8f3666d6
b12 ddcf2fbe7d0309368ed2d47cea287d89
ep01 dc3b2377f791aea3261432a1ea55aa4c
ep03 29d8156ce00be0a4a95d15ffacd0e008
ep06 3ae9b1d0f1845f41de0c9f3fe56d75d9
ep07 7c8070e53888aa021815d3d70f848c1f
ep10 2c0152acee8b24170b4637d2f0cf89eb
L
