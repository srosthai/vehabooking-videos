import type React from "react";
import {Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {Character, type CharacterKind, type CharacterPose} from "./characters";
import {BookUI, Chip, Dust, Grain, Hills, LightRays, Palm, PhoneFrame, Plant, RouteUI, Sofa, Sun, Van, Vignette, WindowLight, spark} from "./world";
import {clamp, geistFamily, Kh, khmerFamily, sun, teal} from "../brand";

const Stage: React.FC<{readonly children: React.ReactNode; readonly bg: string}> = ({children, bg}) => (
  <div style={{position: "absolute", inset: 0, background: bg, overflow: "hidden"}}>
    {children}
    <Vignette strength={0.34} />
    <Grain opacity={0.055} />
  </div>
);

const Char: React.FC<{readonly kind: CharacterKind; readonly pose?: CharacterPose; readonly speaking?: boolean; readonly left: number; readonly top: number; readonly width: number; readonly opacity?: number; readonly blur?: number; readonly offset?: number; readonly z?: number}> = ({kind, pose, speaking, left, top, width, opacity = 1, blur = 0, offset = 0, z = 5}) => (
  <div style={{position: "absolute", left, top, width, height: width * (700 / 300), opacity, filter: blur ? `blur(${blur}px)` : undefined, zIndex: z}}>
    <Character kind={kind} pose={pose} speaking={speaking} offset={offset} />
  </div>
);

const LivingBg: React.FC<{readonly blur?: boolean}> = ({blur}) => (
  <div style={{position: "absolute", inset: 0, filter: blur ? "blur(9px) brightness(0.94)" : undefined, transform: blur ? "scale(1.05)" : undefined}}>
    <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg,#F9E7D2 0%,#F3D2B3 64%,#E8BE98 100%)"}} />
    <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 120, background: "linear-gradient(180deg,rgba(27,49,96,0.10),transparent)"}} />
    <WindowLight x={68} y={250} w={350} h={650} />
    <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 640, background: "linear-gradient(180deg,#D8A878,#B98458)"}} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <div key={i} style={{position: "absolute", left: i * 190 - 80, bottom: 0, width: 8, height: 640, background: "rgba(255,255,255,0.10)", transform: "skewX(-12deg)"}} />)}
    <Sofa x={190} y={1110} />
    <Plant x={820} y={940} />
    <div style={{position: "absolute", left: 690, top: 300, width: 230, height: 170, borderRadius: 18, background: "#FFF8EC", border: "12px solid #E8C79D", boxShadow: "0 18px 30px rgba(27,49,96,0.16)", transform: "rotate(2deg)"}}>
      <div style={{position: "absolute", inset: 14, borderRadius: 8, background: "linear-gradient(160deg,#BDEBFF,#F4DFA8)"}} />
      <div style={{position: "absolute", left: 28, top: 44, width: 130, height: 6, borderRadius: 6, background: "rgba(27,49,96,0.18)"}} />
      <div style={{position: "absolute", left: 28, top: 62, width: 96, height: 6, borderRadius: 6, background: "rgba(27,49,96,0.12)"}} />
    </div>
    <div style={{position: "absolute", left: 700, top: 500, width: 180, height: 140, borderRadius: 18, background: "#FFF8EC", border: "12px solid #E8C79D", boxShadow: "0 18px 30px rgba(27,49,96,0.16)", transform: "rotate(-3deg)"}}>
      <div style={{position: "absolute", inset: 12, borderRadius: 8, background: "linear-gradient(160deg,#FFD79A,#FF9A6B)"}} />
    </div>
    <LightRays x={-260} y={-100} rotate={-14} opacity={0.3} />
    <Dust count={22} speed={0.7} />
  </div>
);

const Luggage: React.FC<{readonly x: number; readonly y: number; readonly color?: string; readonly scale?: number}> = ({x, y, color = "#0FB5A0", scale = 1}) => (
  <div style={{position: "absolute", left: x, top: y, width: 150, height: 210, transform: `scale(${scale})`, zIndex: 6}}>
    <div style={{position: "absolute", left: 0, top: 20, width: 150, height: 190, borderRadius: 24, background: `linear-gradient(160deg,${color},#0A8A7C)`, boxShadow: "0 18px 28px rgba(17,31,64,0.22)"}} />
    <div style={{position: "absolute", left: 34, top: 0, width: 82, height: 34, borderRadius: "18px 18px 0 0", border: "10px solid #C9A26A", borderBottom: "none"}} />
    <div style={{position: "absolute", left: 18, top: 78, width: 114, height: 8, borderRadius: 8, background: "rgba(255,255,255,0.35)"}} />
    <div style={{position: "absolute", left: 18, top: 96, width: 78, height: 8, borderRadius: 8, background: "rgba(255,255,255,0.2)"}} />
  </div>
);

const FloorShadow: React.FC<{readonly x: number; readonly y: number; readonly w: number}> = ({x, y, w}) => <div style={{position: "absolute", left: x, top: y, width: w, height: 28, borderRadius: 999, background: "rgba(17,31,64,0.18)", filter: "blur(10px)"}} />;

const PhotoFlash: React.FC<{readonly x: number; readonly y: number; readonly at: number}> = ({x, y, at}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 4, at + 12], [0, 1, 0], clamp);
  return <div style={{position: "absolute", left: x, top: y, width: 220, height: 220, borderRadius: 999, background: "radial-gradient(circle,#fff,rgba(255,255,255,0))", opacity: p, zIndex: 20, pointerEvents: "none"}} />;
};

const Polaroid: React.FC<{readonly x: number; readonly y: number; readonly at: number; readonly rotate?: number}> = ({x, y, at, rotate = 8}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 12], [0, 1], clamp);
  return (
    <div style={{position: "absolute", left: x + (1 - p) * 80, top: y - p * 90, width: 170, height: 210, padding: 10, paddingBottom: 40, borderRadius: 10, background: "#FFFDF7", boxShadow: "0 20px 40px rgba(17,31,64,0.25)", transform: `rotate(${rotate - p * 10}deg)`, opacity: p, zIndex: 18}}>
      <div style={{width: "100%", height: 140, borderRadius: 4, background: "linear-gradient(160deg,#FFD79A,#FF8A5B 55%,#2BA8D8 56%,#1B6FA8)"}} />
      <div style={{position: "absolute", left: 20, bottom: 14, width: 90, height: 5, borderRadius: 5, background: "rgba(27,49,96,0.18)"}} />
    </div>
  );
};

const Confetti: React.FC<{readonly at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 45], [0, 1], clamp);
  return (
    <div style={{position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 30}}>
      {Array.from({length: 34}).map((_, i) => {
        const x = 80 + spark(i + 2) * 920;
        const y = 180 + spark(i + 8) * 300 + p * (700 + spark(i + 5) * 700);
        return <div key={i} style={{position: "absolute", left: x, top: y, width: 10 + spark(i + 13) * 10, height: 16 + spark(i + 17) * 14, borderRadius: 3, background: [teal, sun, "#FF5D6C", "#fff"][i % 4], opacity: p * 0.9, transform: `rotate(${p * 360 + i * 20}deg)`}} />;
      })}
    </div>
  );
};

// 01 · living room wide
export const LivingWide: React.FC = () => (
  <Stage bg="#F9E7D2">
    <LivingBg />
    <FloorShadow x={60} y={1495} w={950} />
    <Char kind="mom" pose="stand" speaking left={15} top={700} width={360} />
    <Char kind="dad" pose="hands" left={370} top={690} width={370} offset={14} />
    <Char kind="girl" pose="wave" left={720} top={750} width={340} offset={28} />
    <Luggage x={860} y={1320} color="#0FB5A0" scale={0.72} />
    <div style={{position: "absolute", left: 90, top: 1340, width: 300, height: 52, borderRadius: 999, background: "rgba(255,255,255,0.45)", filter: "blur(12px)"}} />
  </Stage>
);

// 02 · dad close
export const LivingDad: React.FC = () => (
  <Stage bg="#F9E7D2">
    <LivingBg blur />
    <Char kind="dad" pose="hands" speaking left={140} top={110} width={860} offset={6} />
    <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 52% 40%, transparent 30%, rgba(17,31,64,0.18) 100%)"}} />
  </Stage>
);

// 03 · daughter close
export const LivingGirl: React.FC = () => (
  <Stage bg="#F9E7D2">
    <LivingBg blur />
    <Char kind="girl" pose="wave" speaking left={220} top={180} width={800} offset={11} />
    <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 56% 38%, transparent 30%, rgba(17,31,64,0.16) 100%)"}} />
  </Stage>
);

// 04 · mom with phone
export const LivingMomPhone: React.FC = () => (
  <Stage bg="#F9E7D2">
    <LivingBg blur />
    <Char kind="mom" pose="phone" speaking left={80} top={100} width={860} offset={3} />
    <div style={{position: "absolute", left: 520, top: 820, width: 330, height: 220, borderRadius: 36, background: "radial-gradient(ellipse,rgba(0,179,159,0.45),transparent 70%)", filter: "blur(20px)"}} />
    <Chip text="ឡានឯកជន" x={620} y={560} icon="🚐" delay={8} />
    <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 42% 38%, transparent 32%, rgba(17,31,64,0.2) 100%)"}} />
  </Stage>
);

// 05 · route + price on phone
export const PhoneRoute: React.FC = () => {
  return (
    <Stage bg="linear-gradient(180deg,#F7E6D1,#E8C8A8)">
      <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 20% 18%, rgba(255,230,170,0.95), transparent 52%)"}} />
      <div style={{position: "absolute", left: -160, top: 300, width: 600, height: 600, borderRadius: 999, background: "rgba(0,179,159,0.12)", filter: "blur(30px)"}} />
      <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 640, background: "linear-gradient(180deg,#C99B6A,#A87545)"}} />
      <div style={{position: "absolute", left: 0, right: 0, bottom: 620, height: 30, background: "rgba(17,31,64,0.12)", filter: "blur(10px)"}} />
      <div style={{position: "absolute", left: 260, top: 240, zIndex: 10}}><PhoneFrame width={560} tilt={-6}><RouteUI /></PhoneFrame></div>
      <Chip text="៤ នាក់" x={50} y={1320} icon="👨‍👩‍👧" delay={12} />
      <Chip text="ចាប់ពី $45" x={50} y={1440} icon="💵" delay={20} color={sun} />
      <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 300, background: "linear-gradient(0deg,rgba(17,31,64,0.18),transparent)"}} />
      <Dust count={20} speed={0.6} />
    </Stage>
  );
};

// 06 · car lineup, dad
export const CarLineupDad: React.FC = () => {
  const f = useCurrentFrame();
  const glow = 0.35 + Math.sin(f / 16) * 0.12;
  return (
  <Stage bg="linear-gradient(180deg,#FFD79A 0%,#FF9A6B 45%,#C9A46B 46%,#9C7648 100%)">
    <Sun size={260} x={780} y={180} />
    <Hills y={620} tone="warm" />
    {[0, 1, 2].map((i) => <Palm key={i} x={i * 430 - 40} y={540} size={260} flip={i % 2 === 1} color="#2A6D6A" trunk="#7A5230" />)}
    <div style={{position: "absolute", left: 0, right: 0, top: 920, height: 340, background: "linear-gradient(180deg,#C9A46B,#8E6A42)"}} />
    <div style={{position: "absolute", left: 90, top: 780, width: 800, height: 30, borderRadius: 999, background: "rgba(17,31,64,0.16)", filter: "blur(10px)"}} />
    <div style={{position: "absolute", left: 535, top: 715, width: 490, height: 210, borderRadius: 48, border: `6px solid rgba(0,179,159,${glow})`, boxShadow: `0 0 60px rgba(0,179,159,${glow})`, transform: `scale(${1 + Math.sin(f / 18) * 0.01})`}} />
    <Van x={520} y={650} width={520} color="#F7F1E6" />
    <Char kind="dad" pose="point" speaking left={30} top={560} width={420} offset={4} />
    <Char kind="girl" pose="wave" left={300} top={640} width={350} offset={18} />
    <Chip text="Van · ១៥ កៅអី" x={590} y={540} icon="🚐" delay={6} color={teal} />
    <Chip text="៤–១៥ កៅអី" x={760} y={1160} icon="👨‍👩‍👧" delay={12} color={sun} />
    <LightRays x={-200} y={-200} rotate={-10} opacity={0.25} />
    <Dust count={24} speed={0.8} />
  </Stage>
  );
};

// 07 · car lineup, daughter
export const CarLineupGirl: React.FC = () => (
  <Stage bg="linear-gradient(180deg,#FFD79A 0%,#FF9A6B 45%,#C9A46B 46%,#9C7648 100%)">
    <div style={{position: "absolute", inset: 0, filter: "blur(8px) brightness(0.96)"}}>
      <Sun size={260} x={780} y={180} />
      <Hills y={620} tone="warm" />
      <Van x={120} y={720} width={620} color="#F7F1E6" />
      <div style={{position: "absolute", left: 0, right: 0, top: 920, height: 340, background: "linear-gradient(180deg,#C9A46B,#8E6A42)"}} />
    </div>
    <Char kind="girl" pose="wave" speaking left={260} top={180} width={760} offset={9} />
    <Chip text="អង្គុយធំទូលាយ" x={580} y={820} icon="✨" delay={8} color={teal} />
    <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 55% 40%, transparent 32%, rgba(17,31,64,0.18) 100%)"}} />
  </Stage>
);

// 08 · book now on phone
export const PhoneBook: React.FC = () => {
  return (
    <Stage bg="linear-gradient(180deg,#F7E6D1,#E8C8A8)">
      <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 16%, rgba(255,230,170,0.95), transparent 52%)"}} />
      <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 640, background: "linear-gradient(180deg,#C99B6A,#A87545)"}} />
      <div style={{position: "absolute", left: 260, top: 240, zIndex: 10}}><PhoneFrame width={560} tilt={-4}><BookUI tapped /></PhoneFrame></div>
      <Chip text="បញ្ជាក់ភ្លាម" x={30} y={620} icon="✓" delay={6} color={teal} />
      <Chip text="តម្លៃច្បាស់" x={40} y={1320} icon="💵" delay={14} color={sun} />
      <Dust count={18} speed={0.6} />
    </Stage>
  );
};

// 09 · confirmation
export const Confirm: React.FC = () => (
  <Stage bg="linear-gradient(180deg,#F7E6D1,#E8C8A8)">
    <div style={{position: "absolute", inset: 0, background: "radial-gradient(circle at 22% 18%, rgba(255,230,170,0.95), transparent 52%)"}} />
    <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 640, background: "linear-gradient(180deg,#C99B6A,#A87545)"}} />
    <div style={{position: "absolute", left: 260, top: 220, zIndex: 10}}><PhoneFrame width={560} tilt={-3}><BookUI tapped /></PhoneFrame></div>
    <Confetti at={10} />
    <Chip text="បញ្ជាក់ភ្លាម" x={40} y={500} icon="✓" delay={4} color={teal} />
    <Chip text="គ្មានលាក់លុយ" x={40} y={1320} icon="🔒" delay={12} color={sun} />
    <Dust count={16} speed={0.5} />
  </Stage>
);

// 10 · car arrives at the house
export const HouseArrival: React.FC = () => {
  const f = useCurrentFrame();
  const drive = interpolate(f, [0, 28], [-420, 0], clamp);
  return (
    <Stage bg="linear-gradient(180deg,#BDEBFF 0%,#E9FAFF 52%,#C9A46B 53%,#9C7648 100%)">
      <Sun size={230} x={790} y={150} />
      <Palm x={30} y={430} size={300} color="#2A8C6A" trunk="#8A5A32" />
      <Palm x={860} y={480} size={230} flip color="#2A8C6A" trunk="#8A5A32" />
      <div style={{position: "absolute", left: 480, top: 430, width: 460, height: 430, borderRadius: 16, background: "linear-gradient(160deg,#FFF8EC,#F2D9B8)", border: "10px solid #E8C79D", boxShadow: "0 30px 60px rgba(17,31,64,0.18)"}}>
        <div style={{position: "absolute", left: -40, top: -80, width: 540, height: 110, background: "#1B3160", clipPath: "polygon(8% 100%, 50% 0, 92% 100%)"}} />
        <div style={{position: "absolute", left: 40, top: 100, width: 110, height: 100, borderRadius: 12, background: "#BDEBFF", border: "8px solid #fff"}} />
        <div style={{position: "absolute", right: 40, top: 100, width: 110, height: 100, borderRadius: 12, background: "#BDEBFF", border: "8px solid #fff"}} />
        <div style={{position: "absolute", left: 180, bottom: 0, width: 100, height: 190, borderRadius: "14px 14px 0 0", background: "#0FB5A0"}} />
        <div style={{position: "absolute", left: 210, bottom: 90, width: 40, height: 8, borderRadius: 8, background: "rgba(255,255,255,0.7)"}} />
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 880, height: 240, background: "linear-gradient(180deg,#C9A46B,#8E6A42)"}} />
      <div style={{position: "absolute", left: 0, right: 0, top: 1080, height: 24, background: "rgba(255,255,255,0.5)", filter: "blur(4px)"}} />
      <div style={{position: "absolute", left: 0, right: 0, top: 1120, bottom: 0, background: "linear-gradient(180deg,#8E6A42,#6B4A2A)"}} />
      <div style={{position: "absolute", left: 20, top: 900, width: 600, transform: `translateX(${drive}px)`, zIndex: 3}}><Van x={0} y={0} width={560} color="#F7F1E6" /></div>
      <Char kind="dad" pose="hands" speaking left={530} top={870} width={280} offset={4} />
      <Char kind="mom" pose="hands" left={700} top={920} width={260} offset={12} />
      <Char kind="girl" pose="wave" left={870} top={950} width={210} offset={20} />
      <Luggage x={540} y={1300} color="#FF5D6C" scale={0.55} />
      <FloorShadow x={80} y={1510} w={820} />
      <Chip text="ទៅដល់មុខទ្វារ" x={600} y={620} icon="🏠" delay={18} color={teal} />
      <Dust count={20} speed={0.7} />
    </Stage>
  );
};

// 11 · road stop, daughter taking a photo
export const RoadStopGirl: React.FC = () => (
  <Stage bg="linear-gradient(180deg,#FFD79A 0%,#FF9A6B 46%,#2A6D6A 47%,#1B4C5A 100%)">
    <Sun size={240} x={730} y={220} />
    <Hills y={560} tone="warm" />
    <Palm x={50} y={440} size={260} color="#1E5A58" trunk="#6B4A2A" />
    <Palm x={900} y={500} size={220} flip color="#1E5A58" trunk="#6B4A2A" />
    <div style={{position: "absolute", left: 0, right: 0, top: 900, height: 300, background: "linear-gradient(180deg,#9C7648,#6B4A2A)"}} />
    <div style={{position: "absolute", left: -100, right: -100, top: 1080, height: 260, borderRadius: "50% 50% 0 0", background: "#3B4D52"}} />
    <div style={{position: "absolute", left: 0, right: 0, top: 1150, height: 18, background: "rgba(255,255,255,0.4)", filter: "blur(3px)"}} />
    <div style={{position: "absolute", left: 10, top: 940, zIndex: 3}}><Van x={0} y={0} width={420} color="#F7F1E6" /></div>
    <Char kind="dad" pose="hands" left={470} top={880} width={250} offset={8} />
    <Char kind="mom" pose="hands" left={680} top={920} width={230} offset={16} />
    <Char kind="girl" pose="phone" speaking left={870} top={950} width={190} offset={24} />
    <PhotoFlash x={1010} y={1110} at={12} />
    <Polaroid x={740} y={720} at={16} rotate={10} />
    <Chip text="ឡានឯកជន" x={40} y={1180} icon="🚐" delay={10} color={sun} />
    <LightRays x={-260} y={-200} rotate={-12} opacity={0.25} />
    <Dust count={24} speed={0.9} />
  </Stage>
);

// 12 · road stop, mom close
export const RoadStopMom: React.FC = () => (
  <Stage bg="linear-gradient(180deg,#FFD79A 0%,#FF9A6B 46%,#2A6D6A 47%,#1B4C5A 100%)">
    <div style={{position: "absolute", inset: 0, filter: "blur(9px) brightness(0.95)"}}>
      <Sun size={240} x={730} y={220} />
      <Hills y={560} tone="warm" />
      <Palm x={50} y={440} size={260} color="#1E5A58" trunk="#6B4A2A" />
      <Palm x={900} y={500} size={220} flip color="#1E5A58" trunk="#6B4A2A" />
      <div style={{position: "absolute", left: 0, right: 0, top: 900, height: 300, background: "linear-gradient(180deg,#9C7648,#6B4A2A)"}} />
    </div>
    <Char kind="mom" pose="hands" speaking left={140} top={120} width={860} offset={7} />
    <Polaroid x={760} y={900} at={2} rotate={-8} />
    <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 52% 40%, transparent 32%, rgba(17,31,64,0.18) 100%)"}} />
  </Stage>
);

// 13 · arrival in Kampot
export const KampotDad: React.FC = () => (
  <Stage bg="linear-gradient(180deg,#FFD79A 0%,#FF9A6B 38%,#FF7A59 46%,#1B6FA8 47%,#0E3A5C 100%)">
    <Sun size={300} x={610} y={260} />
    <div style={{position: "absolute", left: 0, right: 0, top: 700, height: 400, background: "linear-gradient(180deg,rgba(27,111,168,0.1),rgba(14,58,92,0.6))"}} />
    {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{position: "absolute", left: 80 + i * 160, top: 980 + (i % 3) * 30, width: 120, height: 8, borderRadius: 8, background: "rgba(255,255,255,0.24)", filter: "blur(1px)"}} />)}
    <div style={{position: "absolute", left: 70, top: 640, width: 330, height: 90, borderRadius: "50% 50% 0 0", background: "#123F4F", opacity: 0.65}} />
    <div style={{position: "absolute", left: 70, top: 760, width: 330, height: 4, background: "rgba(255,255,255,0.18)"}} />
    <Palm x={20} y={520} size={300} color="#123F4F" trunk="#3A2A20" />
    <Palm x={880} y={560} size={250} flip color="#123F4F" trunk="#3A2A20" />
    <div style={{position: "absolute", left: 680, top: 780, width: 260, height: 120, borderRadius: 18, background: "#8A5A32", border: "8px solid #6B4A2A", transform: "rotate(-3deg)", display: "flex", alignItems: "center", justifyContent: "center"}}>
      <Kh size={54} color="#FFF3D0">កំពត</Kh>
    </div>
    <div style={{position: "absolute", left: 800, top: 890, width: 20, height: 110, background: "#6B4A2A"}} />
    <Char kind="dad" pose="hands" speaking left={100} top={780} width={330} offset={4} />
    <Char kind="mom" pose="hands" left={410} top={830} width={310} offset={14} />
    <Char kind="girl" pose="wave" left={710} top={860} width={290} offset={26} />
    <FloorShadow x={120} y={1460} w={760} />
    <Chip text="ដល់កំពតហើយ" x={690} y={580} icon="🌅" delay={10} color={sun} />
    <Dust count={26} speed={0.6} />
  </Stage>
);

// 14 · end card over Kampot
export const KampotEnd: React.FC = () => {
  const f = useCurrentFrame();
  const show = interpolate(f, [130, 148], [0, 1], clamp);
  return (
    <Stage bg="linear-gradient(180deg,#FFD79A 0%,#FF9A6B 38%,#FF7A59 46%,#1B6FA8 47%,#0E3A5C 100%)">
      <Sun size={300} x={610} y={260} />
      <div style={{position: "absolute", left: 0, right: 0, top: 700, height: 400, background: "linear-gradient(180deg,rgba(27,111,168,0.1),rgba(14,58,92,0.6))"}} />
      {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{position: "absolute", left: 80 + i * 160, top: 980 + (i % 3) * 30, width: 120, height: 8, borderRadius: 8, background: "rgba(255,255,255,0.24)", filter: "blur(1px)"}} />)}
      <Palm x={20} y={520} size={300} color="#123F4F" trunk="#3A2A20" />
      <Palm x={880} y={560} size={250} flip color="#123F4F" trunk="#3A2A20" />
      <Char kind="mom" pose="hands" speaking left={60} top={820} width={300} offset={4} />
      <Char kind="dad" pose="hands" left={380} top={830} width={300} offset={14} />
      <Char kind="girl" pose="wave" left={700} top={860} width={280} offset={26} />
      <div style={{position: "absolute", inset: 0, background: `linear-gradient(0deg,rgba(9,20,42,0.92) 0%,rgba(9,20,42,0.6) 42%,transparent 70%)`, opacity: show}} />
      <div style={{position: "absolute", left: 80, right: 80, bottom: 110, opacity: show, translate: `0px ${(1 - show) * 40}px`}}>
        <div style={{display: "flex", alignItems: "center", gap: 18, marginBottom: 20}}>
          <div style={{width: 96, height: 96, borderRadius: 28, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 30px rgba(0,0,0,0.25)"}}>
            <Img src={staticFile("veha-logo-cut.png")} style={{width: 72}} />
          </div>
          <div>
            <div style={{fontFamily: geistFamily, fontSize: 40, fontWeight: 800, color: "#fff"}}>Veha <span style={{color: teal}}>Booking</span></div>
            <div style={{fontFamily: khmerFamily, fontSize: 24, color: "rgba(255,255,255,0.7)"}}>ធ្វើដំណើរស្រួលៗ ជាមួយគ្រួសារ</div>
          </div>
        </div>
        <div style={{display: "inline-flex", alignItems: "center", gap: 14, padding: "16px 34px", borderRadius: 999, background: teal, color: "#fff", fontFamily: geistFamily, fontSize: 34, fontWeight: 900, boxShadow: "0 18px 36px rgba(0,179,159,0.35)"}}>vehabooking.com</div>
        <div style={{display: "inline-flex", alignItems: "center", gap: 10, marginTop: 18, padding: "10px 22px", borderRadius: 999, background: "rgba(255,255,255,0.1)", fontFamily: geistFamily, fontSize: 28, fontWeight: 800, color: "#FFE28A"}}>+855 95 255 577</div>
      </div>
      <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(9,20,42,0.22) 100%)"}} />
      <Dust count={22} speed={0.5} />
    </Stage>
  );
};
