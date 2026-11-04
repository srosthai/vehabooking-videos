import React from "react";
import {Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {geistFamily, khmerFamily} from "../fonts";

export const teal = "#00B39F";
export const tealDeep = "#00877A";
export const navy = "#1B3160";
export const navyDeep = "#111F40";
export const paper = "#F1FAF8";
export const mint = "#DDF5F1";
export const card = "#FFFFFF";
export const sun = "#FFC83D";
export const coral = "#FF5D6C";
export const muted = "#5A6B85";

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
export {geistFamily, khmerFamily};

export const enter = (frame: number, start: number, y = 40, dur = 18): React.CSSProperties => ({
  opacity: interpolate(frame, [start, start + dur * 0.6], [0, 1], clamp),
  translate: `0px ${interpolate(frame, [start, start + dur], [y, 0], {...clamp, easing: ease})}px`,
});

export const usePop = (delay: number, damping = 11) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, stiffness: 170, mass: 0.7}});
};

export type StickerName = "sad" | "thinking" | "really" | "wow" | "happy" | "love" | "ok" | "hi";

// Logo mascot stickers (public/stickers/veha/*.png): spring pop-in, settle wobble, idle bob.
export const Sticker: React.FC<{readonly name: StickerName; readonly size: number; readonly delay?: number; readonly tilt?: number; readonly style?: React.CSSProperties}> = ({name, size, delay = 6, tilt = -8, style}) => {
  const frame = useCurrentFrame();
  const s = usePop(delay, 9);
  const wobble = Math.sin((frame - delay) / 7) * 4 * Math.min(1, s);
  const bob = Math.sin(frame / 14) * 8;
  return (
    <Img
      src={staticFile(`stickers/veha/${name}.png`)}
      style={{
        width: size,
        height: "auto",
        scale: String(Math.max(0, s)),
        rotate: `${tilt * (1 - s) + wobble + tilt * 0.4}deg`,
        translate: `0px ${bob}px`,
        filter: "drop-shadow(0 18px 26px rgba(17,31,64,0.28))",
        ...style,
      }}
    />
  );
};

export const Logo: React.FC<{readonly size: number; readonly light?: boolean}> = ({size, light}) => (
  <div style={{display: "flex", alignItems: "center", gap: size * 0.22}}>
    <div style={{width: size, height: size, borderRadius: size * 0.28, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 22px rgba(17,31,64,0.15)"}}>
      <Img src={staticFile("veha-logo-cut.png")} style={{width: size * 0.78}} />
    </div>
    <div style={{fontFamily: geistFamily, fontWeight: 700, fontSize: size * 0.56, letterSpacing: -0.5, color: light ? "#FFFFFF" : navy, whiteSpace: "nowrap"}}>
      Veha <span style={{color: teal}}>Booking</span>
    </div>
  </div>
);

export const Card: React.FC<{readonly style?: React.CSSProperties; readonly children: React.ReactNode}> = ({style, children}) => (
  <div style={{background: card, borderRadius: 36, boxShadow: "0 24px 60px rgba(17,31,64,0.14)", ...style}}>{children}</div>
);

// Language: Khmer by default; English films wrap in <LangContext.Provider value="en"> and on-screen Khmer strings are swapped via `en`.
export const LangContext = React.createContext<"kh" | "en">("kh");
export const en: Record<string, string> = {
  "កក់បានជោគជ័យ!": "Booked!",
  "កក់ឡានទទួលព្រលានយន្តហោះ": "Airport pickup",
  "កក់ឡានឯកជន": "Private car",
  "កំពត": "Kampot",
  "គ្រួសារ": "Family",
  "ចាប់ពី": "From",
  "⏳ ចាំយូរ": "⏳ Long waits",
  "ជូនទៅទាន់ម៉ោង": "Right on time",
  "ជួយអ្នកគ្រប់ដំណើរ": "Here for every trip",
  "🛑 ឈប់ច្រើន": "🛑 Stops everywhere",
  "ឈប់បានតាមចិត្ត": "Stop anytime",
  "ដល់មុខទ្វារ 🏡": "Door to door 🏡",
  "តម្លៃសរុប": "Total",
  "តេជោ · ភ្នំពេញ": "Techo · Phnom Penh",
  "😩 ធុញ": "😩 So tiring",
  "ធ្វើការ": "Work trip",
  "ធ្វើដំណើរស្រួល គ្រប់ទីកន្លែង": "Easy travel, anywhere",
  "ព្រលានយន្តហោះ KTI": "KTI Airport",
  "ភ្នំពេញ": "Phnom Penh",
  "ភ្នំពេញ → សៀមរាប": "Phnom Penh → Siem Reap",
  "មិត្តភក្តិ": "Friends",
  "ម៉ាស៊ីនត្រជាក់": "Air-con",
  "សូមស្វាគមន៍": "Welcome",
  "សៀមរាប": "Siem Reap",
  "សៀមរាប-អង្គរ": "Siem Reap Angkor",
  "ហត់ហើយ… ទៅសណ្ឋាគារ?": "Tired… how to get to the hotel?",
  "ឡានសម្រាប់តែក្រុមបង": "The car is just for your group",
  "ឡានស្អាត": "Clean cars",
  "អង្គុយស្រួល": "Comfy seats",
  "អ្នកបើកបរចេះផ្លូវ": "Drivers know the roads",
  "៤ កៅអី": "4 seats",
  "៧ កៅអី": "7 seats",
  "១៥ កៅអី": "15 seats",
  "KTI → ភ្នំពេញ": "KTI → Phnom Penh"
};
export const useT = () => {
  const lang = React.useContext(LangContext);
  return {lang, t: (s: string) => (lang === "en" ? en[s] ?? s : s), font: lang === "en" ? geistFamily : khmerFamily};
};

export const Kh: React.FC<{readonly size: number; readonly color?: string; readonly weight?: number; readonly style?: React.CSSProperties; readonly children: React.ReactNode}> = ({size, color = navy, weight = 700, style, children}) => {
  const {t, font, lang} = useT();
  return <div style={{fontFamily: font, fontSize: size, fontWeight: weight, color, lineHeight: lang === "en" ? 1.25 : 1.55, ...style}}>{typeof children === "string" ? t(children) : children}</div>;
};

export const PriceTag: React.FC<{readonly label: string; readonly price: string; readonly delay: number; readonly style?: React.CSSProperties}> = ({label, price, delay, style}) => {
  const s = usePop(delay, 10);
  const {t, font} = useT();
  return (
    <div style={{display: "inline-flex", alignItems: "center", gap: 18, padding: "10px 30px 10px 34px", borderRadius: 999, background: navy, color: "#fff", scale: String(Math.max(0, s)), boxShadow: "0 16px 34px rgba(17,31,64,0.3)", whiteSpace: "nowrap", ...style}}>
      <span style={{fontFamily: font, fontSize: 36, fontWeight: 600, lineHeight: 1.5}}>{t(label)}</span>
      <span style={{fontFamily: geistFamily, fontSize: 60, fontWeight: 800, color: sun}}>{price}</span>
    </div>
  );
};

export const CarIcon: React.FC<{readonly width: number; readonly color?: string; readonly kind?: "sedan" | "suv" | "mpv" | "van"}> = ({width, color = teal, kind = "sedan"}) => {
  const body: Record<string, string> = {
    sedan: "M10 62 L22 40 Q28 30 42 30 L112 30 Q124 30 134 40 L156 56 L180 60 Q190 62 190 72 L190 84 L10 84 Z",
    suv: "M10 60 L18 30 Q22 20 36 20 L130 20 Q142 20 150 32 L164 52 L182 56 Q190 58 190 68 L190 84 L10 84 Z",
    mpv: "M10 60 L16 26 Q20 16 34 16 L136 16 Q148 16 156 30 L170 52 L184 56 Q190 58 190 68 L190 84 L10 84 Z",
    van: "M10 84 L10 22 Q10 10 24 10 L150 10 Q162 10 168 22 L186 56 Q190 60 190 70 L190 84 Z",
  };
  return (
    <svg width={width} height={width * 0.5} viewBox="0 0 200 100">
      <path d={body[kind]} fill={color} />
      <rect x={kind === "van" ? 24 : 40} y={kind === "sedan" ? 36 : 26} width={kind === "van" ? 120 : 90} height={kind === "sedan" ? 18 : 22} rx={6} fill="#CFF3EE" />
      <circle cx={50} cy={84} r={14} fill={navy} />
      <circle cx={50} cy={84} r={6} fill="#fff" />
      <circle cx={152} cy={84} r={14} fill={navy} />
      <circle cx={152} cy={84} r={6} fill="#fff" />
      <rect x={176} y={64} width={10} height={6} rx={3} fill={sun} />
    </svg>
  );
};

export const PlaneIcon: React.FC<{readonly size: number; readonly color?: string}> = ({size, color = navy}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 6 C54 6 56 12 56 18 L56 38 L92 58 L92 66 L56 56 L56 78 L68 86 L68 92 L50 88 L32 92 L32 86 L44 78 L44 56 L8 66 L8 58 L44 38 L44 18 C44 12 46 6 50 6 Z" fill={color} />
  </svg>
);

export const Check: React.FC<{readonly size: number; readonly progress: number}> = ({size, progress}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={46} fill={teal} />
    <path d="M28 52 L44 67 L73 36" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} strokeDashoffset={80 * (1 - progress)} />
  </svg>
);
