import React from "react";
import {useCurrentFrame} from "remotion";

export type CharacterKind = "mom" | "dad" | "girl";
export type CharacterPose = "stand" | "phone" | "wave" | "point" | "hands";
export type CharacterMood = "happy" | "neutral" | "thinking" | "surprised";

const SKIN = "#E8A87C";
const SKIN_DARK = "#C97E56";
const SKIN_LIGHT = "#F3BE98";
const HAIR = "#2A1B18";
const HAIR_LIGHT = "#4A2C25";
const MOUTH = "#7A2E35";
const BLUSH = "#F08B7B";

type Cfg = {
  headY: number;
  headRx: number;
  headRy: number;
  neckY: number;
  shoulderY: number;
  waistY: number;
  hipY: number;
  footY: number;
  shirt: string;
  shirtDark: string;
  pants: string;
  pantsDark: string;
  shoe: string;
  skin: string;
  skinDark: string;
  skinLight: string;
  hair: string;
  hairLight: string;
  scale: number;
};

const CFG: Record<CharacterKind, Cfg> = {
  mom: {
    headY: 112, headRx: 52, headRy: 57, neckY: 160, shoulderY: 205, waistY: 375, hipY: 395, footY: 635,
    shirt: "#0FB5A0", shirtDark: "#00877A", pants: "#1B3160", pantsDark: "#111F40", shoe: "#6B3A25",
    skin: SKIN, skinDark: SKIN_DARK, skinLight: SKIN_LIGHT, hair: HAIR, hairLight: HAIR_LIGHT, scale: 1,
  },
  dad: {
    headY: 108, headRx: 53, headRy: 58, neckY: 158, shoulderY: 202, waistY: 380, hipY: 400, footY: 640,
    shirt: "#1B3160", shirtDark: "#111F40", pants: "#C8A46B", pantsDark: "#A98750", shoe: "#4A2C25",
    skin: "#D99A72", skinDark: "#B87550", skinLight: "#EFB994", hair: "#241714", hairLight: "#402820", scale: 1,
  },
  girl: {
    headY: 126, headRx: 55, headRy: 59, neckY: 176, shoulderY: 220, waistY: 390, hipY: 410, footY: 615,
    shirt: "#FFC83D", shirtDark: "#E9A900", pants: "#3D6FA8", pantsDark: "#2C527D", shoe: "#F7F1E6",
    skin: "#F0B48B", skinDark: "#D18B60", skinLight: "#FFD0AD", hair: "#2A1B18", hairLight: "#4A2C25", scale: 0.92,
  },
};

const Eye: React.FC<{readonly x: number; readonly y: number; readonly closed: number; readonly look?: number; readonly r?: number}> = ({x, y, closed, look = 0, r = 6}) => (
  <g>
    <ellipse cx={x} cy={y} rx={r + 4} ry={r + 5} fill="#fff" />
    <ellipse cx={x + look} cy={y} rx={r * 0.55} ry={r * 0.8} fill="#231A17" />
    <circle cx={x + look - r * 0.22} cy={y - r * 0.28} r={r * 0.22} fill="#fff" opacity={0.9} />
    {closed > 0.5 && <rect x={x - r - 5} y={y - 2} width={(r + 5) * 2} height={4} rx={2} fill={SKIN_DARK} />}
  </g>
);

const Arm: React.FC<{
  readonly side: "left" | "right";
  readonly cfg: Cfg;
  readonly pose: CharacterPose;
  readonly frame: number;
  readonly child?: boolean;
}> = ({side, cfg, pose, frame, child}) => {
  const sx = side === "left" ? 78 : 222;
  const sy = cfg.shoulderY + 4;
  const w = child ? 19 : 22;
  const handR = child ? 13 : 15;
  const sign = side === "left" ? -1 : 1;
  let path = `M ${sx} ${sy} C ${sx + sign * 14} ${sy + 55}, ${sx + sign * 18} ${sy + 105}, ${sx + sign * 10} ${sy + 150}`;
  let handX = sx + sign * 10;
  let handY = sy + 150;
  let phone = false;
  let wave = false;
  if (side === "right" && pose === "phone") {
    path = `M ${sx} ${sy} C ${sx - 18} ${sy + 42}, ${sx - 6} ${sy + 78}, ${sx - 28} ${sy + 96}`;
    handX = sx - 30; handY = sy + 96; phone = true;
  }
  if (side === "right" && pose === "wave") { wave = true; }
  if (side === "right" && pose === "point") {
    path = `M ${sx} ${sy} C ${sx + 30} ${sy + 6}, ${sx + 62} ${sy + 2}, ${sx + 78} ${sy + 18}`;
    handX = sx + 82; handY = sy + 20;
  }
  if (side === "right" && pose === "hands") {
    path = `M ${sx} ${sy} C ${sx - 24} ${sy + 48}, ${sx - 34} ${sy + 92}, ${sx - 16} ${sy + 128}`;
    handX = sx - 18; handY = sy + 130;
  }
  const waveAngle = wave ? Math.sin(frame / 5) * 10 : 0;
  return (
    <g transform={wave ? `rotate(${waveAngle} ${sx} ${sy})` : undefined}>
      <path d={path} fill="none" stroke={cfg.skin} strokeWidth={w} strokeLinecap="round" />
      <circle cx={handX} cy={handY} r={handR} fill={cfg.skin} />
      {phone && (
        <g transform={`translate(${handX - 14} ${handY - 34}) rotate(-6)`}>
          <rect x={0} y={0} width={30} height={52} rx={7} fill="#1B3160" />
          <rect x={3} y={4} width={24} height={42} rx={4} fill="#BDEBFF" />
          <circle cx={15} cy={49} r={2.2} fill="#0FB5A0" />
        </g>
      )}
    </g>
  );
};

export const Character: React.FC<{
  readonly kind: CharacterKind;
  readonly pose?: CharacterPose;
  readonly mood?: CharacterMood;
  readonly speaking?: boolean;
  readonly style?: React.CSSProperties;
  readonly offset?: number;
}> = ({kind, pose = "stand", mood = "happy", speaking = false, style, offset = 0}) => {
  const frame = useCurrentFrame();
  const cfg = CFG[kind];
  const child = kind === "girl";
  const t = frame + offset;
  const breathe = Math.sin(t / 18) * 1.8;
  const sway = Math.sin(t / 34) * 1.1;
  const blinkPhase = (t + (kind === "dad" ? 23 : kind === "girl" ? 41 : 11)) % 88;
  const closed = blinkPhase < 3 ? 1 : 0;
  const mouthOpen = speaking ? 3 + Math.abs(Math.sin(t / 4.2)) * 9 : 0;
  const look = mood === "thinking" ? 4 : 0;
  const headTilt = mood === "thinking" ? -5 : Math.sin(t / 40) * 1.2;
  const armPose = pose;

  const hairCap = `M ${150 - cfg.headRx - 2} ${cfg.headY - 2} C ${150 - cfg.headRx - 8} ${cfg.headY - 80}, ${150 + cfg.headRx + 8} ${cfg.headY - 80}, ${150 + cfg.headRx + 2} ${cfg.headY - 2} C ${150 + 34} ${cfg.headY - 24}, ${150 + 20} ${cfg.headY - 34}, 150 ${cfg.headY - 34} C ${150 - 20} ${cfg.headY - 34}, ${150 - 34} ${cfg.headY - 24}, ${150 - cfg.headRx - 2} ${cfg.headY - 2} Z`;

  return (
    <div style={{width: "100%", height: "100%", ...style}}>
      <svg viewBox="0 0 300 700" width="100%" height="100%" style={{overflow: "visible"}}>
        <defs>
          <linearGradient id={`shirt-${kind}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={cfg.shirt} />
            <stop offset="100%" stopColor={cfg.shirtDark} />
          </linearGradient>
          <linearGradient id={`pants-${kind}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={cfg.pants} />
            <stop offset="100%" stopColor={cfg.pantsDark} />
          </linearGradient>
          <radialGradient id={`skin-${kind}`} cx="0.35" cy="0.25" r="0.9">
            <stop offset="0%" stopColor={cfg.skinLight} />
            <stop offset="70%" stopColor={cfg.skin} />
            <stop offset="100%" stopColor={cfg.skinDark} />
          </radialGradient>
          <filter id={`soft-${kind}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        {/* shadow */}
        <ellipse cx={150} cy={cfg.footY + 18} rx={86} ry={16} fill="#1B3160" opacity={0.16} filter={`url(#soft-${kind})`} />

        <g transform={`translate(0 ${breathe}) rotate(${sway} 150 ${cfg.footY})`}>
          {/* legs */}
          <path d={`M 112 ${cfg.hipY} C 104 ${cfg.hipY + 70}, 106 ${cfg.footY - 55}, 112 ${cfg.footY}`} stroke={cfg.pantsDark} strokeWidth={child ? 31 : 35} strokeLinecap="round" fill="none" />
          <path d={`M 188 ${cfg.hipY} C 196 ${cfg.hipY + 70}, 194 ${cfg.footY - 55}, 188 ${cfg.footY}`} stroke={cfg.pants} strokeWidth={child ? 31 : 35} strokeLinecap="round" fill="none" />
          {/* shoes */}
          <ellipse cx={112} cy={cfg.footY + 6} rx={28} ry={13} fill={cfg.shoe} />
          <ellipse cx={188} cy={cfg.footY + 6} rx={28} ry={13} fill={cfg.shoe} />
          <ellipse cx={104} cy={cfg.footY + 3} rx={13} ry={5} fill="#fff" opacity={0.18} />

          {/* torso */}
          <path d={`M 78 ${cfg.shoulderY} C 66 ${cfg.shoulderY + 42}, 86 ${cfg.waistY - 40}, 100 ${cfg.waistY} L 200 ${cfg.waistY} C 214 ${cfg.waistY - 40}, 234 ${cfg.shoulderY + 42}, 222 ${cfg.shoulderY} C 190 ${cfg.shoulderY - 18}, 110 ${cfg.shoulderY - 18}, 78 ${cfg.shoulderY} Z`} fill={`url(#shirt-${kind})`} />
          {/* shirt highlight / collar */}
          <path d={`M 112 ${cfg.shoulderY - 4} C 128 ${cfg.shoulderY + 30}, 172 ${cfg.shoulderY + 30}, 188 ${cfg.shoulderY - 4}`} stroke="#fff" strokeWidth={3} opacity={0.22} fill="none" />
          <path d={`M 138 ${cfg.shoulderY - 8} L 150 ${cfg.shoulderY + 16} L 162 ${cfg.shoulderY - 8}`} fill={cfg.skin} opacity={0.9} />
          {kind === "dad" && [0, 1, 2].map((i) => <circle key={i} cx={150} cy={cfg.shoulderY + 48 + i * 42} r={2.6} fill="#fff" opacity={0.5} />)}
          {kind === "girl" && <path d="M 132 300 C 144 288 156 288 168 300" stroke="#fff" strokeWidth={3} opacity={0.5} fill="none" />}

          {/* arms */}
          <Arm side="left" cfg={cfg} pose={armPose} frame={frame} child={child} />
          <Arm side="right" cfg={cfg} pose={armPose} frame={frame} child={child} />
          {/* sleeves */}
          <rect x={66} y={cfg.shoulderY - 2} width={34} height={46} rx={14} fill={cfg.shirtDark} transform={`rotate(7 83 ${cfg.shoulderY + 20})`} />
          <rect x={200} y={cfg.shoulderY - 2} width={34} height={46} rx={14} fill={cfg.shirtDark} transform={`rotate(-7 217 ${cfg.shoulderY + 20})`} />
          {kind !== "girl" && <rect x={108} y={cfg.waistY - 12} width={84} height={13} rx={6} fill={kind === "dad" ? "#6B4A2A" : "#0B2A52"} />}
          {kind === "dad" && <rect x={144} y={cfg.waistY - 13} width={12} height={15} rx={3} fill="#E2C07A" />}

          {/* neck */}
          <rect x={136} y={cfg.neckY - 6} width={28} height={34} rx={12} fill={cfg.skinDark} />
          <rect x={138} y={cfg.neckY - 8} width={24} height={30} rx={10} fill={`url(#skin-${kind})`} />

          {/* head */}
          <g transform={`rotate(${headTilt} 150 ${cfg.headY})`}>
            <ellipse cx={150} cy={cfg.headY} rx={cfg.headRx} ry={cfg.headRy} fill={`url(#skin-${kind})`} />
            <ellipse cx={150 - cfg.headRx + 4} cy={cfg.headY + 8} rx={9} ry={14} fill={cfg.skin} />
            <ellipse cx={150 + cfg.headRx - 4} cy={cfg.headY + 8} rx={9} ry={14} fill={cfg.skin} />

            {/* hair back / bun / braids */}
            {kind === "mom" && <circle cx={150} cy={cfg.headY - 58} r={30} fill={cfg.hair} />}
            {kind === "mom" && <path d={`M 98 ${cfg.headY - 8} C 96 ${cfg.headY + 30}, 108 ${cfg.headY + 40}, 116 ${cfg.headY + 46}`} stroke={cfg.hair} strokeWidth={14} strokeLinecap="round" fill="none" />}
            {kind === "mom" && <path d={`M 202 ${cfg.headY - 8} C 204 ${cfg.headY + 30}, 192 ${cfg.headY + 40}, 184 ${cfg.headY + 46}`} stroke={cfg.hair} strokeWidth={14} strokeLinecap="round" fill="none" />}
            {kind === "girl" && (
              <g>
                {[-1, 1].map((s) => (
                  <g key={s}>
                    <path d={`M ${150 + s * (cfg.headRx - 8)} ${cfg.headY + 4} C ${150 + s * (cfg.headRx + 20)} ${cfg.headY + 44}, ${150 + s * (cfg.headRx + 18)} ${cfg.headY + 96}, ${150 + s * (cfg.headRx + 4)} ${cfg.headY + 126}`} stroke={cfg.hair} strokeWidth={16} strokeLinecap="round" fill="none" />
                    <circle cx={150 + s * (cfg.headRx + 4)} cy={cfg.headY + 128} r={9} fill={cfg.hairLight} />
                  </g>
                ))}
              </g>
            )}

            <path d={hairCap} fill={cfg.hair} />
            {kind === "mom" && <path d={`M 104 ${cfg.headY - 6} C 118 ${cfg.headY - 40}, 142 ${cfg.headY - 48}, 160 ${cfg.headY - 40} C 136 ${cfg.headY - 30}, 120 ${cfg.headY - 14}, 112 ${cfg.headY + 2} Z`} fill={cfg.hairLight} opacity={0.55} />}
            {kind === "dad" && <path d={`M 150 ${cfg.headY - 40} C 162 ${cfg.headY - 30}, 176 ${cfg.headY - 16}, 186 ${cfg.headY - 4}`} stroke={cfg.hairLight} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.7} />}
            {kind === "girl" && <path d={`M 112 ${cfg.headY - 22} C 126 ${cfg.headY - 42}, 150 ${cfg.headY - 48}, 170 ${cfg.headY - 40}`} stroke={cfg.hairLight} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.7} />}

            {/* brows */}
            <path d={`M 118 ${cfg.headY - 18} C 126 ${cfg.headY - 24}, 138 ${cfg.headY - 23}, 144 ${cfg.headY - 18}`} stroke={cfg.hair} strokeWidth={4} strokeLinecap="round" fill="none" />
            <path d={`M 156 ${cfg.headY - 18} C 162 ${cfg.headY - 23}, 174 ${cfg.headY - 24}, 182 ${cfg.headY - 18}`} stroke={cfg.hair} strokeWidth={4} strokeLinecap="round" fill="none" />

            {/* eyes */}
            <Eye x={132} y={cfg.headY + 2} closed={closed} look={look} r={kind === "girl" ? 6.5 : 5.8} />
            <Eye x={168} y={cfg.headY + 2} closed={closed} look={look} r={kind === "girl" ? 6.5 : 5.8} />

            {/* nose */}
            <path d={`M 150 ${cfg.headY + 12} C 146 ${cfg.headY + 22}, 148 ${cfg.headY + 25}, 153 ${cfg.headY + 23}`} stroke={cfg.skinDark} strokeWidth={2.3} strokeLinecap="round" fill="none" opacity={0.7} />

            {/* blush */}
            <ellipse cx={116} cy={cfg.headY + 28} rx={10} ry={5} fill={BLUSH} opacity={0.32} />
            <ellipse cx={184} cy={cfg.headY + 28} rx={10} ry={5} fill={BLUSH} opacity={0.32} />

            {/* mouth */}
            {mouthOpen > 0 ? (
              <g>
                <ellipse cx={150} cy={cfg.headY + 38} rx={13} ry={mouthOpen / 2 + 2} fill={MOUTH} />
                <ellipse cx={150} cy={cfg.headY + 41} rx={7} ry={Math.max(1.5, mouthOpen / 4)} fill="#D96A78" opacity={0.7} />
              </g>
            ) : mood === "surprised" ? (
              <ellipse cx={150} cy={cfg.headY + 38} rx={9} ry={10} fill={MOUTH} />
            ) : (
              <path d={`M 136 ${cfg.headY + 34} C 144 ${cfg.headY + 44}, 156 ${cfg.headY + 44}, 164 ${cfg.headY + 34}`} stroke={MOUTH} strokeWidth={4} strokeLinecap="round" fill="none" />
            )}

            {/* earrings */}
            {kind === "mom" && [116, 184].map((x) => <circle key={x} cx={x} cy={cfg.headY + 30} r={3.2} fill="#FFC83D" />)}

            {/* rim light */}
            <path d={`M ${150 - cfg.headRx + 4} ${cfg.headY - 20} C ${150 - cfg.headRx + 10} ${cfg.headY + 18}, ${150 - cfg.headRx + 18} ${cfg.headY + 38}, ${150 - cfg.headRx + 30} ${cfg.headY + 44}`} stroke="#fff" strokeWidth={2.4} opacity={0.28} fill="none" strokeLinecap="round" />
          </g>

          {/* girl backpack */}
          {kind === "girl" && (
            <g>
              <rect x={88} y={cfg.shoulderY + 18} width={34} height={110} rx={16} fill="#FF5D6C" />
              <rect x={94} y={cfg.shoulderY + 26} width={22} height={38} rx={10} fill="#FFD7D4" opacity={0.5} />
              <path d={`M 120 ${cfg.shoulderY + 10} C 132 ${cfg.shoulderY + 50}, 132 ${cfg.shoulderY + 90}, 126 ${cfg.shoulderY + 118}`} stroke="#FF5D6C" strokeWidth={7} fill="none" strokeLinecap="round" />
              <path d={`M 180 ${cfg.shoulderY + 10} C 168 ${cfg.shoulderY + 50}, 168 ${cfg.shoulderY + 90}, 174 ${cfg.shoulderY + 118}`} stroke="#FF5D6C" strokeWidth={7} fill="none" strokeLinecap="round" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
