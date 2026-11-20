import React from "react";
import {AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {clamp, geistFamily, khmerFamily} from "../brand";
import {SfxTrack, type SfxCue} from "../sfx";
import {END_CARD, endCardFrom, narrationFrames, narrationFrom, timeline, totalFrames, type Timed} from "./narration";

// Video 2 — SAI → Siem Reap house. Husband = B (Veha) · Wife = C (Sokhom).
const FPS = 30;
const NAVY = "#0E1B33";
const AMBER = "#F2A93B";
const GOLD = "#FFC857";
const TEAL = "#00B39F";
const CORAL = "#FF5D6C";
const outline = (w: number): React.CSSProperties => ({WebkitTextStroke: `${w}px ${NAVY}`, paintOrder: "stroke fill", textShadow: "0 6px 18px rgba(0,0,0,0.45)"});
const isLatin = (s: string) => /^[\x20-\x7E]+$/.test(s);
const sec = (s: number) => Math.round(s * FPS);
const at = (line: Timed, s: number) => line.voiceFrom - line.from + sec(s);
const byId = (id: Timed["id"]) => timeline.find((l) => l.id === id) as Timed;
const UI_HOME = "images/sai-v2/ui-transport-home-phone.png";
const UI_RESULTS = "images/sai-v2/ui-sai-results-phone.png";
const SHOT_W = 415;
const SHOT_H = 853;

const usePopAt = (start: number, damping = 12) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - start, fps, config: {damping, stiffness: 170, mass: 0.7}});
};

const Photo: React.FC<{
  readonly src: string;
  readonly duration: number;
  readonly zoom?: number;
  readonly pan?: number;
  readonly objectPosition?: string;
  readonly blur?: number;
  readonly dim?: number;
}> = ({src, duration, zoom = 0.08, pan = 16, objectPosition = "50% 50%", blur = 0, dim = 0.2}) => {
  const f = useCurrentFrame();
  const p = Math.min(1, Math.max(0, f / Math.max(1, duration - 1)));
  const scale = 1.04 + p * zoom + (blur ? 0.05 : 0);
  const x = interpolate(p, [0, 1], [-pan, pan], clamp);
  return (
    <AbsoluteFill style={{overflow: "hidden", background: NAVY}}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          transform: `scale(${scale}) translateX(${x}px)`,
          filter: `${blur ? `blur(${blur}px) ` : ""}brightness(${1 - dim})`,
        }}
      />
    </AbsoluteFill>
  );
};

const Shade: React.FC = () => (
  <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(14,27,51,0.58),rgba(14,27,51,0.06) 30%,transparent 48%,rgba(14,27,51,0.34) 68%,rgba(14,27,51,0.94))"}} />
);

const Fade: React.FC<{readonly from: number; readonly to?: number; readonly len?: number; readonly children: React.ReactNode}> = ({from, to = 1e9, len = 10, children}) => {
  const f = useCurrentFrame();
  const o = Math.min(interpolate(f, [from, from + len], [0, 1], clamp), interpolate(f, [to - len, to], [1, 0], clamp));
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const Chip: React.FC<{
  readonly start: number;
  readonly children: React.ReactNode;
  readonly top: number;
  readonly left?: number;
  readonly right?: number;
  readonly width?: number;
  readonly color?: string;
  readonly textColor?: string;
  readonly size?: number;
  readonly border?: string;
}> = ({start, children, top, left, right, width, color = TEAL, textColor = "#fff", size = 32, border = "rgba(255,255,255,0.9)"}) => {
  const s = usePopAt(start);
  return (
    <div style={{position: "absolute", top, left, right, width, display: "flex", justifyContent: left === undefined && right === undefined ? "center" : "flex-start", zIndex: 32}}>
      <div
        style={{
          transform: `scale(${s})`,
          opacity: Math.min(1, s * 1.5),
          background: color,
          color: textColor,
          borderRadius: 999,
          padding: "12px 26px",
          fontFamily: khmerFamily,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1.4,
          border: `3px solid ${border}`,
          boxShadow: "0 14px 36px rgba(0,0,0,0.42)",
          whiteSpace: width ? "normal" : "nowrap",
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Tick: React.FC<{readonly start: number; readonly top: number; readonly text: string}> = ({start, top, text}) => {
  const s = usePopAt(start, 10);
  return (
    <div style={{position: "absolute", left: 42, top, zIndex: 33, transform: `scale(${s})`, opacity: Math.min(1, s * 1.5), display: "flex", alignItems: "center", gap: 12, background: "rgba(0,179,159,0.94)", border: "3px solid rgba(255,255,255,0.9)", borderRadius: 999, padding: "10px 24px", boxShadow: "0 14px 30px rgba(0,0,0,0.35)"}}>
      <svg width={34} height={34} viewBox="0 0 24 24"><path d="M5 12.5 10 17 19 7" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
      <div style={{fontFamily: khmerFamily, fontWeight: 800, fontSize: 28, color: "#fff", lineHeight: 1.4}}>{text}</div>
    </div>
  );
};

const PersonSticker: React.FC<{readonly line: Timed; readonly width?: number; readonly top?: number; readonly side?: "left" | "right"}> = ({line, width = 400, top = 970, side}) => {
  const f = useCurrentFrame();
  const s = usePopAt(7, 10);
  const swapAt = line.swap ? at(line, line.swap[0]) : Infinity;
  const name = f >= swapAt ? line.swap?.[1] ?? line.sticker : line.sticker;
  const pop2 = line.swap ? spring({frame: f - swapAt, fps: FPS, config: {damping: 9, stiffness: 200}}) : 1;
  const dir = line.speaker === "B" ? "b-v2" : "woman-v2";
  const onLeft = side ? side === "left" : line.speaker === "C";
  const bob = Math.sin(f / 14) * 6;
  const tilt = (onLeft ? -5 : 5) * (1 - s) + Math.sin(f / 22) * 1.5;
  const scale = s * (f >= swapAt ? 0.9 + 0.1 * pop2 : 1);
  return (
    <Img
      src={staticFile(`stickers/people/${dir}/${name}.png`)}
      style={{
        position: "absolute",
        top,
        ...(onLeft ? {left: 24} : {right: 24}),
        width,
        transform: `translateY(${bob}px) rotate(${tilt}deg) scale(${scale})`,
        transformOrigin: "50% 100%",
        filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))",
        zIndex: 40,
      }}
    />
  );
};

const Captions: React.FC<{readonly line: Timed}> = ({line}) => {
  const f = useCurrentFrame();
  const local = f - (line.voiceFrom - line.from);
  const active = line.segs.filter(([, st]) => local >= st * FPS);
  if (!active.length) return null;
  const page = active[active.length - 1][2];
  const show = line.segs.filter(([, , p]) => p === page);
  const chars = show.reduce((n, s) => n + s[0].length, 0);
  const size = chars <= 18 ? 60 : chars <= 30 ? 55 : chars <= 44 ? 50 : 45;
  const o = interpolate(local, [-7, 0], [0, 1], clamp) * interpolate(local, [line.audioFrames + 1, line.audioFrames + 7], [1, 0], clamp);
  return (
    <div style={{position: "absolute", left: 34, right: 34, bottom: 232, textAlign: "center", opacity: o, zIndex: 50}}>
      <div style={{fontFamily: khmerFamily, fontWeight: 800, fontSize: size, lineHeight: 1.55, color: "#fff", ...outline(10)}}>
        {show.map(([word, st, , spaceAfter], i) => {
          const on = local >= st * FPS;
          return (
            <span key={`${word}-${i}`} style={{color: on ? TEAL : "#fff", fontFamily: isLatin(word) ? geistFamily : khmerFamily, marginRight: spaceAfter ? 11 : 0, display: "inline-block"}}>
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

type Ring = {readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly at: number};

const TapRing: React.FC<{readonly ring: Ring; readonly k: number}> = ({ring, k}) => {
  const f = useCurrentFrame();
  const t = f - ring.at;
  if (t < 0) return null;
  const s = spring({frame: t, fps: FPS, config: {damping: 12, stiffness: 180}});
  const pulse = (t % 24) / 24;
  return (
    <>
      <div style={{position: "absolute", left: (ring.x - ring.w / 2) * k - 6, top: (ring.y - ring.h / 2) * k - 6, width: ring.w * k + 12, height: ring.h * k + 12, borderRadius: 18, border: `5px solid ${TEAL}`, boxShadow: `0 0 0 ${4 + pulse * 10}px rgba(0,179,159,${0.35 * (1 - pulse)})`, transform: `scale(${0.85 + 0.15 * s})`, opacity: Math.min(1, s * 1.5)}} />
      <div style={{position: "absolute", left: ring.x * k - 22, top: ring.y * k - 22, width: 44, height: 44, borderRadius: 999, background: "rgba(0,179,159,0.48)", border: "3px solid #fff", transform: `scale(${interpolate(t, [0, 6, 12], [1.4, 0.8, 1], clamp)})`, opacity: interpolate(t, [0, 4, 20, 30], [0, 1, 1, 0], clamp)}} />
    </>
  );
};

const UiPhone: React.FC<{readonly start: number; readonly left: number; readonly top: number; readonly screenW?: number; readonly src: string; readonly rings?: readonly Ring[]}> = ({start, left, top, screenW = 540, src, rings = []}) => {
  const f = useCurrentFrame();
  const s = usePopAt(start, 14);
  const bezel = 22;
  const screenH = Math.round((screenW * SHOT_H) / SHOT_W);
  const phoneW = screenW + bezel * 2;
  const phoneH = screenH + bezel * 2;
  const k = screenW / SHOT_W;
  const drift = interpolate(f, [start + 40, start + 140], [1, 1.035], clamp);
  return (
    <div style={{position: "absolute", left, top, width: phoneW, height: phoneH, borderRadius: 74, background: "linear-gradient(145deg,#1B1E24,#050608)", boxShadow: "0 0 0 3px #6B7280, 0 44px 90px rgba(0,0,0,0.62)", zIndex: 24, transform: `translateY(${(1 - s) * 100}px) scale(${0.96 + 0.04 * s})`, opacity: Math.min(1, s * 1.5)}}>
      <div style={{position: "absolute", left: bezel, top: bezel, width: screenW, height: screenH, borderRadius: 54, overflow: "hidden", background: "#EEF3F3"}}>
        <Img src={staticFile(src)} style={{width: screenW, height: screenH, objectFit: "cover", display: "block", transform: `scale(${drift})`, transformOrigin: "50% 30%"}} />
        {rings.map((r) => <TapRing key={`${r.x}-${r.y}-${r.at}`} ring={r} k={k} />)}
      </div>
    </div>
  );
};

const models = [
  {name: "Sedan", price: 22, img: "real/sai-v2/cars/sedan.png"},
  {name: "SUV", price: 22, img: "real/sai-v2/cars/suv.png"},
  {name: "MPV", price: 30, img: "real/sai-v2/cars/mpv.png"},
  {name: "Van", price: 35, img: "real/sai-v2/cars/van.png"},
] as const;

const PriceTile: React.FC<{readonly start: number; readonly name: string; readonly price: number; readonly img: string; readonly h: number}> = ({start, name, price, img, h}) => {
  const s = usePopAt(start);
  return (
    <div style={{height: h, borderRadius: 28, background: "rgba(255,255,255,0.97)", boxShadow: "0 18px 40px rgba(0,0,0,0.3)", transform: `scale(${s})`, opacity: Math.min(1, s * 1.5), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 8}}>
      <Img src={staticFile(img)} style={{height: h * 0.44, maxWidth: "90%", objectFit: "contain"}} />
      <div style={{display: "flex", alignItems: "baseline", gap: 14, fontFamily: geistFamily, fontWeight: 800}}>
        <span style={{fontSize: h * 0.16, color: NAVY}}>{name}</span>
        <span style={{fontSize: h * 0.22, color: TEAL}}>${price}</span>
      </div>
    </div>
  );
};

const PriceCard: React.FC<{readonly start: number; readonly top: number; readonly tileH?: number; readonly left?: number; readonly right?: number}> = ({start, top, tileH = 205, left = 56, right = 56}) => {
  const head = usePopAt(start);
  return (
    <div style={{position: "absolute", left, right, top, zIndex: 31}}>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 14, height: 70, marginBottom: 24}}>
        <div style={{transform: `scale(${head})`, background: TEAL, color: "#fff", borderRadius: 999, padding: "10px 36px", fontFamily: khmerFamily, fontWeight: 800, fontSize: 42, border: "4px solid #fff", boxShadow: "0 14px 34px rgba(0,0,0,0.35)", whiteSpace: "nowrap"}}>
          ចាប់ពី <span style={{fontFamily: geistFamily}}>$22</span>
        </div>
        <div style={{transform: `scale(${head})`, background: AMBER, color: NAVY, borderRadius: 999, padding: "10px 22px", fontFamily: khmerFamily, fontWeight: 800, fontSize: 26, border: "3px solid rgba(255,255,255,0.9)", whiteSpace: "nowrap"}}>ថ្លៃថេរ</div>
      </div>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16}}>
        {models.map((m, i) => <PriceTile key={m.name} start={start + 5 + i * 4} name={m.name} price={m.price} img={m.img} h={tileH} />)}
      </div>
    </div>
  );
};

const KhqrCard: React.FC<{readonly start: number; readonly scan: number; readonly done: number}> = ({start, scan, done}) => {
  const f = useCurrentFrame();
  const s = usePopAt(start);
  const d = usePopAt(done, 10);
  const scanY = interpolate((f - scan) % 30, [0, 30], [0, 1]);
  return (
    <div style={{position: "absolute", left: 190, right: 190, top: 430, zIndex: 34, transform: `scale(${s})`, opacity: Math.min(1, s * 1.5)}}>
      <div style={{position: "relative", background: "#fff", borderRadius: 40, padding: "38px 26px", boxShadow: "0 22px 50px rgba(0,0,0,0.45)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, border: "6px solid #E1232E", overflow: "hidden"}}>
        <div style={{fontFamily: geistFamily, fontWeight: 900, fontSize: 104, color: "#E1232E", letterSpacing: 2}}>KHQR</div>
        <div style={{fontFamily: khmerFamily, fontWeight: 800, fontSize: 40, color: NAVY}}>បង់លុយភ្លាមៗ</div>
        {f < done && f >= scan ? <div style={{position: "absolute", left: 24, right: 24, top: 40 + scanY * 220, height: 6, borderRadius: 3, background: TEAL, boxShadow: `0 0 18px ${TEAL}`}} /> : null}
      </div>
      <div style={{display: "flex", justifyContent: "center", marginTop: 24}}>
        <div style={{transform: `scale(${d})`, display: "flex", alignItems: "center", gap: 14, background: TEAL, color: "#fff", borderRadius: 999, padding: "12px 32px", fontFamily: khmerFamily, fontWeight: 800, fontSize: 42, border: "4px solid #fff"}}>
          <svg width={40} height={40} viewBox="0 0 24 24"><path d="M5 12.5 10 17 19 7" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
          បង់រួចរាល់
        </div>
      </div>
    </div>
  );
};

const Visual: React.FC<{readonly line: Timed}> = ({line}) => {
  const D = line.duration + 10;
  const A = (s: number) => at(line, s);
  switch (line.id) {
    case "s01":
      return (
        <>
          <Photo src="real/sai-v2/p01-arrivals-hall-night.jpg" duration={D} zoom={0.07} objectPosition="50% 44%" />
          <Shade />
          <Chip start={A(1.2)} top={350} size={34}>SAI · យប់</Chip>
          <PersonSticker line={line} width={430} top={930} side="right" />
        </>
      );
    case "s02":
      return (
        <>
          <Photo src="real/sai-v2/p02-sai-terminal-night.jpg" duration={D} zoom={0.1} objectPosition="50% 54%" />
          <Shade />
          <Chip start={A(0.5)} top={356} color={AMBER} textColor={NAVY} size={30}>តាក់ស៊ីតាមផ្លូវ</Chip>
          <PersonSticker line={line} width={410} top={960} side="left" />
        </>
      );
    case "s03":
      return (
        <>
          <Fade from={0} to={A(2.45) + 10} len={10}>
            <Photo src="real/sai-v2/p03-taxi-queue-night.jpg" duration={D} zoom={0.08} objectPosition="50% 55%" />
          </Fade>
          <Fade from={A(2.45)} len={10}>
            <Photo src="real/sai-v2/p04-highway-night.jpg" duration={D} zoom={0.1} objectPosition="50% 52%" />
          </Fade>
          <Shade />
          <Chip start={A(1.0)} top={350} size={30}>SAI → ក្រុងសៀមរាប</Chip>
          <Chip start={A(3.55)} top={452} color={AMBER} textColor={NAVY} size={30}>≈ 1 ម៉ោង</Chip>
          <Chip start={A(4.2)} top={554} color={CORAL} size={42}>$ ?</Chip>
          <PersonSticker line={line} width={400} top={950} side="right" />
        </>
      );
    case "s04":
      return (
        <>
          <Photo src="real/sai-v2/p05-arrivals-bench-night.jpg" duration={D} zoom={0.06} dim={0.3} objectPosition="50% 56%" />
          <AbsoluteFill style={{background: "rgba(14,27,51,0.18)"}} />
          <Shade />
          <PersonSticker line={line} width={410} top={950} side="left" />
        </>
      );
    case "s05":
      return (
        <>
          <Fade from={0} to={A(4.9) + 10} len={10}>
            <Photo src="real/sai-v2/p01-arrivals-hall-night.jpg" duration={D} blur={12} dim={0.26} />
            <UiPhone start={A(0.18)} left={468} top={280} screenW={540} src={UI_HOME} rings={[{x: 293, y: 117, w: 166, h: 42, at: A(0.95)}]} />
            <Chip start={A(1.65)} top={352} left={36} color={TEAL} size={28}>✓ កក់រួចហើយ</Chip>
          </Fade>
          <Fade from={A(4.9)} len={10}>
            <Photo src="real/sai-v2/p06-sedan-pickup-night.jpg" duration={D} zoom={0.07} dim={0.26} objectPosition="50% 52%" />
            <PriceCard start={A(5.8)} top={330} tileH={205} />
          </Fade>
          <Shade />
          <PersonSticker line={line} width={400} top={980} side="left" />
        </>
      );
    case "s06":
      return <S06 line={line} />;
    case "s07":
      return <S07 line={line} />;
    case "s08":
      return <S08 line={line} />;
    case "s09":
      return (
        <>
          <Photo src="real/sai-v2/p09-house-gate-night.jpg" duration={D} zoom={0.08} objectPosition="50% 55%" />
          <Shade />
          <Chip start={A(0.8)} top={352} size={30}>ជូនដល់ផ្ទះ</Chip>
          <PersonSticker line={line} width={430} top={920} side="right" />
        </>
      );
    default:
      return null;
  }
};

const S06: React.FC<{readonly line: Timed}> = ({line}) => {
  const s = usePopAt(4, 16);
  return (
    <>
      <Photo src="real/sai-v2/p06-sedan-pickup-night.jpg" duration={line.duration + 10} blur={10} dim={0.3} />
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 62% 62%, rgba(0,179,159,0.3), transparent 55%)"}} />
      <Shade />
      <Img src={staticFile("real/sai-v2/cars/sedan.png")} style={{position: "absolute", left: 70, top: 480, width: 920, transform: `translateX(${(1 - s) * -900}px)`, filter: "drop-shadow(0 30px 34px rgba(0,0,0,0.55))", zIndex: 22}} />
      <Chip start={at(line, 0.4)} top={356} left={52} size={34}>Sedan $22</Chip>
      <Chip start={at(line, 1.45)} top={470} left={52} color={AMBER} textColor={NAVY} size={28}>ថ្លៃថេរ</Chip>
      <PersonSticker line={line} width={400} top={1000} side="left" />
    </>
  );
};

const S07: React.FC<{readonly line: Timed}> = ({line}) => {
  const A = (s: number) => at(line, s);
  return (
    <>
      <Fade from={0} to={A(7.45) + 10} len={10}>
        <Photo src="real/sai-v2/p02-sai-terminal-night.jpg" duration={line.duration + 10} blur={12} dim={0.28} />
        <UiPhone
          start={A(0.5)}
          left={468}
          top={280}
          screenW={540}
          src={UI_RESULTS}
          rings={[
            {x: 207, y: 283, w: 346, h: 42, at: A(4.2)},
            {x: 341, y: 391, w: 80, h: 34, at: A(5.5)},
          ]}
        />
        <Chip start={A(4.1)} top={344} left={30} width={408} size={25}>① រើសម៉ោងយន្តហោះមកដល់</Chip>
        <Chip start={A(5.35)} top={462} left={30} width={408} size={25}>② រើសទីតាំងផ្ទះ</Chip>
        <Chip start={A(6.55)} top={580} left={30} width={408} size={25}>③ បង់តាម KHQR</Chip>
      </Fade>
      <Fade from={A(7.45)} to={A(10.55) + 10} len={10}>
        <Photo src="real/sai-v2/p06-sedan-pickup-night.jpg" duration={line.duration + 10} blur={14} dim={0.34} />
        <KhqrCard start={A(7.5)} scan={A(7.95)} done={A(9.3)} />
      </Fade>
      <Fade from={A(10.55)} len={10}>
        <Photo src="real/sai-v2/p07-driver-sign-night.jpg" duration={line.duration + 10} zoom={0.08} objectPosition="54% 50%" />
      </Fade>
      <Shade />
      <Chip start={A(12.45)} top={352} size={30}>ផ្លាកឈ្មោះ</Chip>
      <PersonSticker line={line} width={360} top={990} side="left" />
    </>
  );
};

const S08: React.FC<{readonly line: Timed}> = ({line}) => {
  const A = (s: number) => at(line, s);
  return (
    <>
      <Fade from={0} to={A(4.1) + 10} len={10}>
        <Photo src="real/sai-v2/p07-driver-sign-night.jpg" duration={line.duration + 10} zoom={0.12} objectPosition="56% 46%" />
        <Chip start={A(0.7)} top={350} size={30}>ផ្លាកឈ្មោះយើង</Chip>
      </Fade>
      <Fade from={A(4.1)} len={10}>
        <Photo src="real/sai-v2/p08-driver-luggage-night.jpg" duration={line.duration + 10} zoom={0.07} objectPosition="50% 52%" />
        <Tick start={A(4.2)} top={346} text="មិនបាច់តម្រឹងជួរ" />
        <Tick start={A(5.2)} top={452} text="មិនបាច់តថ្លៃ" />
      </Fade>
      <Shade />
      <PersonSticker line={line} width={345} top={1000} side="left" />
    </>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const r = (d: number) => {
    const s = spring({frame: f - d, fps: FPS, config: {damping: 14, stiffness: 160}});
    return {opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 36}px)`};
  };
  const kh = (size: number, color = "#fff"): React.CSSProperties => ({fontFamily: khmerFamily, fontWeight: 800, fontSize: size, color, lineHeight: 1.5, textAlign: "center", ...outline(7)});
  return (
    <AbsoluteFill style={{opacity: interpolate(f, [0, 10], [0, 1], clamp)}}>
      <Photo src="real/sai-v2/p02-sai-terminal-night.jpg" duration={END_CARD} blur={14} dim={0.5} zoom={0.04} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(14,27,51,0.58),rgba(14,27,51,0.38) 45%,rgba(14,27,51,0.88))"}} />
      <div style={{position: "absolute", top: 92, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 20, ...r(0)}}>
        <div style={{width: 150, height: 150, borderRadius: 38, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 28px rgba(0,0,0,0.28)"}}>
          <Img src={staticFile("veha-logo.png")} style={{width: 124}} />
        </div>
        <div style={{fontFamily: geistFamily, fontWeight: 800, fontSize: 62, color: "#fff", letterSpacing: -1}}>Veha <span style={{color: TEAL}}>Booking</span></div>
      </div>
      <div style={{position: "absolute", top: 294, left: 50, right: 50, ...r(4)}}>
        <div style={kh(46)}>ព្រលាន <span style={{fontFamily: geistFamily}}>SAI</span> → ក្រុងសៀមរាប</div>
      </div>
      <div style={{position: "absolute", top: 382, left: 60, right: 60, ...r(8)}}>
        <div style={{fontFamily: khmerFamily, fontWeight: 700, fontSize: 29, color: "#E8FFFB", lineHeight: 1.6, textAlign: "center", ...outline(5)}}>ថ្លៃថេរ · អ្នកបើកកាន់ស្លាកឈ្មោះរង់ចាំ<br />ជូនដល់ផ្ទះ ឬសណ្ឋាគារ</div>
      </div>
      <PriceCard start={12} top={530} tileH={210} left={64} right={64} />
      <div style={{position: "absolute", top: 1090, left: 40, right: 40, ...r(30)}}>
        <div style={{fontFamily: khmerFamily, fontWeight: 800, fontSize: 40, color: "#fff", textAlign: "center", ...outline(6)}}>
          កក់ឥឡូវនេះ៖ <span style={{fontFamily: geistFamily, color: TEAL}}>vehabooking.com</span>
        </div>
      </div>
      <div style={{position: "absolute", top: 1178, left: 40, right: 40, ...r(34)}}>
        <div style={{fontFamily: khmerFamily, fontWeight: 700, fontSize: 38, color: "#fff", textAlign: "center", ...outline(5)}}>
          ទូរស័ព្ទ៖ <span style={{fontFamily: geistFamily, fontWeight: 800}}>095 255 577</span>
        </div>
      </div>
      <div style={{position: "absolute", bottom: 90, left: 0, right: 0, ...r(38)}}>
        <div style={{fontFamily: geistFamily, fontWeight: 700, fontSize: 24, color: "rgba(255,255,255,0.8)", textAlign: "center", letterSpacing: 1.2}}>SIEM REAP · CAMBODIA</div>
      </div>
    </AbsoluteFill>
  );
};

const Scene: React.FC<{readonly line: Timed}> = ({line}) => {
  const f = useCurrentFrame();
  const total = line.duration + 10;
  const fadeIn = line.id === "s01" ? 1 : interpolate(f, [0, 10], [0, 1], clamp);
  const opacity = Math.min(fadeIn, interpolate(f, [total - 10, total], [1, 0], clamp));
  return (
    <AbsoluteFill style={{opacity}}>
      <Visual line={line} />
      <Captions line={line} />
    </AbsoluteFill>
  );
};

const cues: SfxCue[] = (() => {
  const c: SfxCue[] = [];
  for (const l of timeline) {
    c.push({frame: l.from + 2, sfx: "whoosh", note: `${l.id} in`, volume: 0.34});
    c.push({frame: l.from + 8, sfx: "pop", note: `${l.id} sticker`, volume: 0.44});
  }
  const s03 = byId("s03"), s05 = byId("s05"), s07 = byId("s07"), s08 = byId("s08");
  c.push({frame: s03.voiceFrom + sec(4.2), sfx: "buzz", note: "unknown price", volume: 0.5});
  c.push({frame: s05.voiceFrom + sec(0.3), sfx: "tap", note: "phone", volume: 0.55});
  c.push({frame: s05.voiceFrom + sec(5.9), sfx: "coin", note: "price card", volume: 0.5});
  c.push({frame: s07.voiceFrom + sec(4.2), sfx: "tap", note: "pickup time", volume: 0.45});
  c.push({frame: s07.voiceFrom + sec(5.5), sfx: "tap", note: "drop-off", volume: 0.45});
  c.push({frame: s07.voiceFrom + sec(7.95), sfx: "scan", note: "KHQR", volume: 0.5});
  c.push({frame: s07.voiceFrom + sec(9.3), sfx: "ding", note: "paid", volume: 0.45});
  c.push({frame: s08.voiceFrom + sec(4.2), sfx: "tick", note: "no queue", volume: 0.45});
  c.push({frame: s08.voiceFrom + sec(5.2), sfx: "tick", note: "no haggling", volume: 0.45});
  c.push({frame: endCardFrom + 4, sfx: "whoosh", note: "end card", volume: 0.4});
  c.push({frame: endCardFrom + 14, sfx: "ding", note: "end card", volume: 0.45});
  return c;
})();

export const SaiAirportHouseKhVideo: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const brandOut = interpolate(f, [endCardFrom - 8, endCardFrom + 2], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: NAVY}}>
      {timeline.map((l) => (
        <Sequence key={l.id} from={l.from} durationInFrames={l.duration + 10} name={l.id} premountFor={20}>
          <Scene line={l} />
        </Sequence>
      ))}
      <Sequence from={endCardFrom} durationInFrames={END_CARD} name="end-card" premountFor={20}>
        <EndCard />
      </Sequence>

      <Audio
        src={staticFile("music/veha-bed.wav")}
        loop
        volume={(fr) => {
          const duck = [...timeline, {voiceFrom: narrationFrom, audioFrames: narrationFrames}].reduce(
            (g, l) => Math.min(g, interpolate(fr, [l.voiceFrom - 4, l.voiceFrom, l.voiceFrom + l.audioFrames, l.voiceFrom + l.audioFrames + 6], [1, 0.42, 0.42, 1], clamp)),
            1,
          );
          return interpolate(fr, [0, fps * 0.5, totalFrames - fps, totalFrames - 1], [0, 0.12, 0.12, 0], clamp) * duck;
        }}
      />
      {timeline.map((l) => (
        <Sequence key={`v-${l.id}`} from={l.voiceFrom} durationInFrames={l.audioFrames + 2} name={`voice ${l.id}`} layout="none">
          <Audio src={staticFile(`voice/sai-airport-house/${l.id}.mp3`)} />
        </Sequence>
      ))}
      <Sequence from={narrationFrom} durationInFrames={narrationFrames + 2} name="voice n01 narrator (Oudom)" layout="none">
        <Audio src={staticFile("voice/sai-airport-house/n01.mp3")} />
      </Sequence>
      <SfxTrack cues={cues} />

      <div style={{position: "absolute", left: 44, top: 44, scale: "0.72", transformOrigin: "0 0", opacity: brandOut, zIndex: 60}}>
        <Img src={staticFile("veha-logo-cut.png")} style={{width: 110, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.45))"}} />
      </div>
      <div style={{position: "absolute", right: 44, top: 54, fontFamily: geistFamily, fontWeight: 700, fontSize: 22, color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.55)", opacity: brandOut, zIndex: 60}}>vehabooking.com</div>
      <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 7, background: "rgba(255,255,255,0.18)", zIndex: 61}}>
        <div style={{height: "100%", width: `${(f / totalFrames) * 100}%`, background: `linear-gradient(90deg,${TEAL},${GOLD})`}} />
      </div>
    </AbsoluteFill>
  );
};
