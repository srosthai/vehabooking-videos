import React from "react";
import {AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {clamp, ease, geistFamily, khmerFamily, Logo, navy, teal} from "../brand";
import {SfxTrack, type SfxCue} from "../sfx";
import {timeline, totalFrames, type Timed} from "./narration";

const gold = "#FFC83D";
const outline = (w: number): React.CSSProperties => ({WebkitTextStroke: `${w}px ${navy}`, paintOrder: "stroke fill", textShadow: "0 6px 18px rgba(0,0,0,0.45)"});
const photoSrc = (src: string) => (src.includes("/") || src.includes(".") ? src : `real/${src}.jpg`);
const stickerDir = (s: Timed["speaker"]) => (s === "B" ? "b" : "c");
const speakerLabel = (s: Timed["speaker"]) => (s === "B" ? "● VEHA" : "● SOKHOM");

const Photo: React.FC<{readonly src: string; readonly duration: number; readonly index: number; readonly zoom?: number; readonly pan?: number; readonly objectPosition?: string}> = ({src, duration, index, zoom = 0.09, pan = 18, objectPosition = "50% 50%"}) => {
  const f = useCurrentFrame();
  const p = Math.min(1, Math.max(0, f / Math.max(1, duration - 1)));
  const scale = 1.04 + p * zoom;
  const dir = index % 2 ? 1 : -1;
  const x = dir * interpolate(p, [0, 1], [-pan, pan], clamp);
  const y = interpolate(p, [0, 1], [-8, 14], clamp);
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <Img src={staticFile(photoSrc(src))} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition, transform: `scale(${scale}) translate(${x}px,${y}px)`}} />
    </AbsoluteFill>
  );
};

const PersonSticker: React.FC<{readonly line: Timed}> = ({line}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 6, fps, config: {damping: 10, stiffness: 170, mass: 0.7}});
  const point = line.id === "a03";
  const a11 = line.id === "a11";
  const small = line.id === "a09" || line.id === "a10" || line.id === "a12";
  const width = point ? 620 : a11 ? 180 : small ? 260 : 420;
  const top = point ? 760 : a11 ? 1240 : small ? 1160 : 960;
  const side: React.CSSProperties = point
    ? {left: 0}
    : line.id === "a10"
      ? {right: 18}
      : line.speaker === "B"
        ? {right: 18}
        : {left: 18};
  const tilt = point ? 0 : line.speaker === "B" ? 6 : -6;
  const bob = Math.sin(f / 14) * 6;
  return (
    <div style={{position: "absolute", top, width, ...side, scale: String(Math.max(0, s)), rotate: `${tilt * (1 - s) + tilt * 0.4}deg`, translate: `0px ${bob}px`, filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.38))", zIndex: 24}}>
      <Img src={staticFile(`stickers/people/${stickerDir(line.speaker)}/${line.sticker}.png`)} style={{width: "100%"}} />
    </div>
  );
};

const Title: React.FC<{readonly line: Timed}> = ({line}) => {
  const size = line.title.length > 24 ? 52 : line.title.length > 18 ? 60 : 72;
  return (
    <div style={{position: "absolute", left: 44, right: 44, top: 160, textAlign: "center", zIndex: 30}}>
      <div style={{fontFamily: khmerFamily, fontSize: size, fontWeight: 800, lineHeight: 1.3, color: "#fff", ...outline(14)}}>{line.title}</div>
    </div>
  );
};

const CAPTION_FONT_SIZE: Record<string, number> = {
  a07: 50,
  a08: 50,
  a09: 48,
  a11: 48,
  a12: 48,
};

const Captions: React.FC<{readonly tl: readonly Timed[]}> = ({tl}) => {
  const frame = useCurrentFrame();
  const line = tl.find((l) => frame >= l.voiceFrom - 3 && frame < l.voiceFrom + l.audioFrames + 5);
  if (!line) return null;
  const local = frame - line.voiceFrom;
  const opacity = interpolate(local, [-3, 1, line.audioFrames + 1, line.audioFrames + 5], [0, 1, 1, 0], clamp);
  const size = CAPTION_FONT_SIZE[line.id] ?? 52;
  return (
    <div style={{position: "absolute", left: 20, right: 20, bottom: 260, textAlign: "center", opacity, zIndex: 70}}>
      <div style={{fontFamily: geistFamily, fontWeight: 900, fontSize: 28, letterSpacing: 2, color: line.speaker === "B" ? "#7FE3D7" : gold, marginBottom: 4, ...outline(8)}}>{speakerLabel(line.speaker)}</div>
      <div style={{fontFamily: khmerFamily, fontWeight: 800, fontSize: size, lineHeight: 1.65, color: "#fff", ...outline(11)}}>
        {line.segs.map(([word, st], i) => {
          const active = local >= st * 30;
          const latin = /[A-Za-z]/.test(word);
          return (
            <span key={i} style={{color: active ? teal : "#FFFFFF", display: "inline-block", marginRight: 9, fontFamily: latin ? geistFamily : khmerFamily}}>
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const Pill: React.FC<{readonly text: string; readonly left?: number; readonly right?: number; readonly top: number; readonly color?: string; readonly size?: number}> = ({text, left, right, top, color = teal, size = 26}) => (
  <div style={{position: "absolute", left, right, top, zIndex: 27, padding: "10px 18px", borderRadius: 999, background: "rgba(7,20,40,0.8)", border: "2px solid rgba(255,255,255,0.6)", fontFamily: geistFamily, fontSize: size, fontWeight: 900, color, textAlign: "center", boxShadow: "0 16px 34px rgba(0,0,0,0.35)"}}>{text}</div>
);

const MiniPhone: React.FC<{readonly src: string; readonly left: number; readonly top: number; readonly width: number; readonly height: number; readonly label: string; readonly sub?: string}> = ({src, left, top, width, height, label, sub}) => {
  const screenW = width - 36;
  return (
    <>
      <div style={{position: "absolute", left, top, width, height, borderRadius: 56, background: "linear-gradient(145deg,#1B1E24,#050608)", boxShadow: "0 0 0 3px #6B7280, 0 0 0 5px #2A2D33, 0 40px 80px rgba(0,0,0,0.6)", zIndex: 22}}>
        <div style={{position: "absolute", left: 18, top: 18, width: screenW, height: height - 36, borderRadius: 42, overflow: "hidden", background: "#F7FAFA"}}>
          <div style={{position: "absolute", left: 0, right: 0, top: 54, textAlign: "center", fontFamily: geistFamily, fontSize: 22, fontWeight: 900, color: teal}}>{label}</div>
          {sub ? <div style={{position: "absolute", left: 0, right: 0, top: 84, textAlign: "center", fontFamily: geistFamily, fontSize: 16, fontWeight: 700, color: "#5A6B85"}}>{sub}</div> : null}
          <div style={{position: "absolute", left: 10, right: 10, top: 130, borderRadius: 14, overflow: "hidden", border: "1px solid #DCE9E7"}}>
            <Img src={staticFile(src)} style={{width: "100%", display: "block"}} />
          </div>
          <div style={{position: "absolute", left: 0, right: 0, top: 430, display: "flex", flexDirection: "column", alignItems: "center", gap: 10}}>
            <div style={{width: 56, height: 56, borderRadius: 999, background: teal, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 24px rgba(0,179,159,0.35)"}}>
              <svg width={30} height={30} viewBox="0 0 24 24"><path d="M5 12.5 10 17 19 7" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div style={{fontFamily: geistFamily, fontSize: 18, fontWeight: 800, color: navy}}>Available</div>
          </div>
          <div style={{position: "absolute", left: 0, right: 0, bottom: 24, textAlign: "center", fontFamily: geistFamily, fontSize: 15, fontWeight: 700, color: "#8A97A8"}}>vehabooking.com</div>
          <div style={{position: "absolute", left: (screenW - 90) / 2, top: 12, width: 90, height: 24, borderRadius: 12, background: "#050608"}} />
        </div>
      </div>
    </>
  );
};

const SearchPhone: React.FC<{readonly line: Timed}> = ({line}) => {
  const phoneW = 520, phoneH = 820, bezel = 24, screenW = 472, screenH = 772;
  return (
    <>
      <Photo src={line.photos[0]} duration={line.duration + 6} index={0} zoom={0.05} />
      <div style={{position: "absolute", left: 492, top: 430, width: phoneW, height: phoneH, borderRadius: 74, background: "linear-gradient(145deg,#1B1E24,#050608)", boxShadow: "0 0 0 3px #6B7280, 0 0 0 5px #2A2D33, 0 44px 90px rgba(0,0,0,0.6)", zIndex: 22}}>
        <div style={{position: "absolute", left: bezel, top: bezel, width: screenW, height: screenH, borderRadius: 54, overflow: "hidden", background: "#F7FAFA"}}>
          <Img src={staticFile(line.photos[1])} style={{position: "absolute", left: 0, top: 44, width: screenW, height: "auto", display: "block"}} />
          <div style={{position: "absolute", left: 0, right: 0, top: 390, display: "flex", flexDirection: "column", alignItems: "center", gap: 10}}>
            <div style={{width: 58, height: 58, borderRadius: 999, background: teal, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 24px rgba(0,179,159,0.35)"}}>
              <svg width={32} height={32} viewBox="0 0 24 24"><path d="M5 12.5 10 17 19 7" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div style={{fontFamily: geistFamily, fontSize: 19, fontWeight: 800, color: navy}}>Airport Transfers</div>
          </div>
          <div style={{position: "absolute", left: 0, right: 0, bottom: 22, textAlign: "center", fontFamily: geistFamily, fontSize: 18, fontWeight: 700, color: "#8A97A8"}}>vehabooking.com</div>
          <div style={{position: "absolute", left: (screenW - 110) / 2, top: 14, width: 110, height: 28, borderRadius: 14, background: "#050608", zIndex: 30}} />
        </div>
      </div>
    </>
  );
};

const Nameboard: React.FC<{readonly line: Timed; readonly index: number}> = ({line, index}) => {
  const f = useCurrentFrame();
  const cross = interpolate(f, [line.duration * 0.5, line.duration * 0.65], [0, 1], clamp);
  return (
    <>
      <Photo src={line.photos[0]} duration={line.duration + 6} index={index} zoom={0.06} />
      <div style={{position: "absolute", left: 154, top: 1038, width: 540, padding: "12px 18px", borderRadius: 8, background: "rgba(255,255,255,0.98)", boxShadow: "0 6px 16px rgba(0,0,0,0.12)", zIndex: 27, textAlign: "center"}}>
        <div style={{fontFamily: geistFamily, fontSize: 42, fontWeight: 900, color: "#1B3160", letterSpacing: 1}}>Mr. & Mrs.</div>
        <div style={{fontFamily: geistFamily, fontSize: 18, fontWeight: 800, color: teal, letterSpacing: 2, marginTop: 2}}>VEHA BOOKING</div>
      </div>
      <AbsoluteFill style={{opacity: cross}}><Photo src={line.photos[1]} duration={line.duration + 6} index={index + 1} zoom={0.07} /></AbsoluteFill>
    </>
  );
};

const AirportsSplit: React.FC<{readonly line: Timed}> = ({line}) => (
  <>
    <Img src={staticFile(line.photos[0])} style={{position: "absolute", left: 0, top: 0, width: 540, height: 1920, objectFit: "cover"}} />
    <Img src={staticFile(line.photos[1])} style={{position: "absolute", left: 540, top: 0, width: 540, height: 1920, objectFit: "cover"}} />
    <div style={{position: "absolute", left: 536, top: 0, width: 8, height: 1920, background: "rgba(255,255,255,0.85)", zIndex: 25}} />
    <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.55),rgba(9,20,42,0.08) 38%,rgba(9,20,42,0.92))"}} />
    <div style={{position: "absolute", left: 28, top: 520, width: 484, textAlign: "center", fontFamily: geistFamily, fontSize: 36, fontWeight: 900, color: "#fff", ...outline(10), zIndex: 27}}>Phnom Penh</div>
    <div style={{position: "absolute", right: 28, top: 520, width: 484, textAlign: "center", fontFamily: geistFamily, fontSize: 36, fontWeight: 900, color: "#fff", ...outline(10), zIndex: 27}}>Siem Reap</div>
  </>
);

const TwoCities: React.FC<{readonly line: Timed}> = ({line}) => {
  const f = useCurrentFrame();
  const cross = interpolate(f, [line.duration * 0.55, line.duration * 0.72], [0, 1], clamp);
  return (
    <>
      <AbsoluteFill style={{background: "#07111F"}} />
      <MiniPhone src={line.photos[0]} left={20} top={390} width={470} height={760} label="Airport → Hotel" sub="Phnom Penh" />
      <MiniPhone src={line.photos[1]} left={510} top={390} width={470} height={760} label="Airport → Hotel" sub="Siem Reap" />
      <Pill text="Both directions" left={330} top={1180} color="#fff" size={24} />
      <AbsoluteFill style={{opacity: cross, zIndex: 30}}>
        <Img src={staticFile(line.photos[2])} style={{position: "absolute", left: 0, top: 0, width: 540, height: 1920, objectFit: "cover"}} />
        <Img src={staticFile(line.photos[3])} style={{position: "absolute", left: 540, top: 0, width: 540, height: 1920, objectFit: "cover"}} />
        <div style={{position: "absolute", left: 536, top: 0, width: 8, height: 1920, background: "rgba(255,255,255,0.85)", zIndex: 25}} />
        <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.55),rgba(9,20,42,0.08) 38%,rgba(9,20,42,0.92))"}} />
        <div style={{position: "absolute", left: 28, top: 520, width: 484, textAlign: "center", fontFamily: geistFamily, fontSize: 34, fontWeight: 900, color: "#fff", ...outline(10), zIndex: 27}}>Phnom Penh</div>
        <div style={{position: "absolute", right: 28, top: 520, width: 484, textAlign: "center", fontFamily: geistFamily, fontSize: 34, fontWeight: 900, color: "#fff", ...outline(10), zIndex: 27}}>Siem Reap</div>
      </AbsoluteFill>
    </>
  );
};

const PriceQuestion: React.FC<{readonly line: Timed}> = ({line}) => (
  <>
    <Photo src="real/airport-hotel/scene11-sedan-night.png" duration={line.duration + 6} index={0} zoom={0.07} />
    <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.82),rgba(9,20,42,0.22) 38%,rgba(9,20,42,0.92))"}} />
    <div style={{position: "absolute", left: 46, top: 420, width: 540, height: 900, borderRadius: 70, background: "linear-gradient(145deg,#1B1E24,#050608)", boxShadow: "0 0 0 3px #6B7280, 0 0 0 5px #2A2D33, 0 40px 80px rgba(0,0,0,0.6)", zIndex: 22}}>
      <div style={{position: "absolute", left: 18, top: 18, width: 504, height: 864, borderRadius: 52, overflow: "hidden", background: "#F7FAFA"}}>
        <div style={{position: "absolute", left: 14, top: 54, right: 14, borderRadius: 16, overflow: "hidden", border: "1px solid #DCE9E7"}}>
          <Img src={staticFile(line.photos[0])} style={{width: "100%", display: "block"}} />
        </div>
        <div style={{position: "absolute", left: 0, right: 0, top: 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 8}}>
          <div style={{width: 52, height: 52, borderRadius: 999, background: teal, display: "flex", alignItems: "center", justifyContent: "center"}}>
            <svg width={28} height={28} viewBox="0 0 24 24"><path d="M5 12.5 10 17 19 7" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{fontFamily: geistFamily, fontSize: 18, fontWeight: 800, color: navy}}>Available</div>
        </div>
        <div style={{position: "absolute", left: 0, right: 0, bottom: 28, textAlign: "center", fontFamily: geistFamily, fontSize: 18, fontWeight: 700, color: "#8A97A8"}}>vehabooking.com</div>
        <div style={{position: "absolute", left: (504 - 120) / 2, top: 14, width: 120, height: 30, borderRadius: 15, background: "#050608"}} />
      </div>
    </div>
    <div style={{position: "absolute", right: 58, top: 520, zIndex: 28, fontFamily: geistFamily, fontSize: 220, fontWeight: 900, color: teal, lineHeight: 0.9, ...outline(12)}}>$?</div>
  </>
);

const Prices: React.FC<{readonly line: Timed}> = ({line}) => (
  <>
    <Photo src={line.photos[2]} duration={line.duration + 6} index={0} zoom={0.05} />
    <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.86),rgba(9,20,42,0.3) 40%,rgba(9,20,42,0.94))"}} />
    <div style={{position: "absolute", left: 52, top: 300, fontFamily: geistFamily, fontSize: 36, fontWeight: 900, color: "#fff", ...outline(8)}}>Phnom Penh</div>
    <div style={{position: "absolute", left: 60, top: 360, width: 940, borderRadius: 20, overflow: "hidden", border: "3px solid rgba(255,255,255,0.75)", boxShadow: "0 24px 60px rgba(0,0,0,0.5)", zIndex: 24}}>
      <Img src={staticFile(line.photos[0])} style={{width: "100%", display: "block"}} />
    </div>
    <div style={{position: "absolute", left: 62, top: 700, fontFamily: geistFamily, fontSize: 92, fontWeight: 900, color: teal, ...outline(10)}}>$15 <span style={{color: "#fff", fontSize: 34}}>Phnom Penh</span></div>
    <div style={{position: "absolute", left: 52, top: 900, fontFamily: geistFamily, fontSize: 36, fontWeight: 900, color: "#fff", ...outline(8)}}>Siem Reap</div>
    <div style={{position: "absolute", left: 60, top: 960, width: 940, borderRadius: 20, overflow: "hidden", border: "3px solid rgba(255,255,255,0.75)", boxShadow: "0 24px 60px rgba(0,0,0,0.5)", zIndex: 24}}>
      <Img src={staticFile(line.photos[1])} style={{width: "100%", display: "block"}} />
    </div>
    <div style={{position: "absolute", left: 62, top: 1250, fontFamily: geistFamily, fontSize: 92, fontWeight: 900, color: teal, ...outline(10)}}>$18 <span style={{color: "#fff", fontSize: 34}}>Siem Reap</span></div>
  </>
);

const EndCard: React.FC = () => (
  <AbsoluteFill style={{background: "linear-gradient(140deg,#111F40,#00786C)"}}>
    <div style={{position: "absolute", left: 0, right: 0, top: 720, display: "flex", flexDirection: "column", alignItems: "center", gap: 24}}>
      <Logo size={172} light />
      <div style={{fontFamily: geistFamily, fontSize: 66, fontWeight: 800, color: "#fff", letterSpacing: 0.5}}>vehabooking.com</div>
      <div style={{fontFamily: geistFamily, fontSize: 36, fontWeight: 700, color: "#fff", letterSpacing: 1.2}}>+855(0)95255577</div>
    </div>
  </AbsoluteFill>
);

const PhoneEnd: React.FC<{readonly line: Timed}> = ({line}) => {
  const f = useCurrentFrame();
  const {duration} = line;
  const hotelP = interpolate(f, [duration * 0.38, duration * 0.52], [0, 1], clamp);
  const endP = interpolate(f, [duration * 0.6, duration * 0.73], [0, 1], {...clamp, easing: ease});
  const tap = f >= 54;
  const pulse = 1 + Math.sin((f - 54) / 5) * 0.18;
  return (
    <>
      <Img src={staticFile("real/airport-hotel/scene11-sedan-night.png")} style={{width: "100%", height: "100%", objectFit: "cover", filter: "blur(14px) brightness(0.42)", transform: "scale(1.12)"}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.84),rgba(9,20,42,0.34) 42%,rgba(9,20,42,0.94))"}} />
      <div style={{position: "absolute", left: 76, top: 430, width: 928, borderRadius: 28, overflow: "hidden", border: "4px solid rgba(255,255,255,0.8)", boxShadow: "0 30px 70px rgba(0,0,0,0.58)", zIndex: 24}}>
        <Img src={staticFile(line.photos[0])} style={{width: "100%", display: "block"}} />
        {tap && (
          <>
            <div style={{position: "absolute", left: 790, top: 78, width: 78, height: 78, borderRadius: 999, border: "4px solid #00B39F", boxShadow: "0 0 30px rgba(0,179,159,0.9)", opacity: 0.9, scale: String(pulse)}} />
            <div style={{position: "absolute", left: 812, top: 100, width: 34, height: 34, borderRadius: 999, background: "rgba(0,179,159,0.36)"}} />
          </>
        )}
      </div>
      <AbsoluteFill style={{opacity: hotelP, zIndex: 30}}>
        <Img src={staticFile(line.photos[1])} style={{width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85)"}} />
        <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.55),rgba(9,20,42,0.1) 36%,rgba(9,20,42,0.9))"}} />
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: endP, zIndex: 65}}><EndCard /></AbsoluteFill>
    </>
  );
};

const Scene: React.FC<{readonly line: Timed; readonly index: number}> = ({line, index}) => {
  const f = useCurrentFrame();
  const visualDuration = line.duration + 6;
  const inP = interpolate(f, [0, 6], [0, 1], clamp);
  const outP = interpolate(f, [visualDuration - 6, visualDuration], [1, 0], clamp);
  const opacity = Math.min(inP, outP);
  const slide = (1 - inP) * (line.speaker === "B" ? 22 : -22);

  const renderVisual = () => {
    if (line.kind === "searchPhone") return <SearchPhone line={line} />;
    if (line.kind === "nameboard") return <Nameboard line={line} index={index} />;
    if (line.kind === "airportsSplit") return <AirportsSplit line={line} />;
    if (line.kind === "twoCities") return <TwoCities line={line} />;
    if (line.kind === "priceQuestion") return <PriceQuestion line={line} />;
    if (line.kind === "prices") return <Prices line={line} />;
    if (line.kind === "phoneEnd") return <PhoneEnd line={line} />;
    return <Photo src={line.photos[0]} duration={visualDuration} index={index} zoom={line.kind === "arrivalNight" ? 0.07 : 0.05} />;
  };

  return (
    <AbsoluteFill style={{opacity, transform: `translateX(${slide}px)`}}>
      {renderVisual()}
      {line.kind !== "searchPhone" && line.kind !== "nameboard" && line.kind !== "airportsSplit" && line.kind !== "twoCities" && line.kind !== "priceQuestion" && line.kind !== "prices" && line.kind !== "phoneEnd" && (
        <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.62),rgba(9,20,42,0.08) 34%,transparent 52%,rgba(9,20,42,0.22) 68%,rgba(9,20,42,0.9))"}} />
      )}
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 45%, transparent 42%, rgba(9,20,42,0.38) 100%)"}} />
      {line.kind === "flightTracking" && (
        <>
          <Pill text="Flight tracking" left={60} top={520} color="#7FE3D7" size={30} />
          <div style={{position: "absolute", left: 60, top: 590, fontFamily: khmerFamily, fontSize: 30, fontWeight: 800, color: "#fff", ...outline(8), zIndex: 27}}>យន្តហោះមកយឺតក៏មានឡានចាំ</div>
        </>
      )}
      <Title line={line} />
      <PersonSticker line={line} />
    </AbsoluteFill>
  );
};

const Sfx: React.FC = () => {
  const cues: SfxCue[] = timeline.flatMap((l, i) => {
    const out: SfxCue[] = [];
    if (i > 0) out.push({frame: l.from, sfx: "whoosh", note: `to ${l.id}`, volume: 0.4});
    out.push({frame: l.from + 8, sfx: "pop", note: `sticker ${l.sticker}`, volume: 0.52});
    if (l.id === "a11") out.push({frame: l.from + 20, sfx: "coin", note: "prices", volume: 0.45});
    if (l.id === "a12") out.push({frame: l.from + 54, sfx: "tap", note: "Book Now", volume: 0.75});
    return out;
  });
  return <SfxTrack cues={cues} />;
};

const Film: React.FC = () => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const a12 = timeline.find((l) => l.id === "a12")!;
  const endCardStart = a12.from + a12.duration * 0.6;
  const brandOut = interpolate(frame, [endCardStart, endCardStart + 14], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: navy}}>
      {timeline.map((l, i) => (
        <Sequence key={l.id} from={l.from} durationInFrames={l.duration + 6} name={`${l.id} · ${l.title}`} premountFor={20}>
          <Scene line={l} index={i} />
        </Sequence>
      ))}
      <Audio src={staticFile("music/veha-bed.wav")} loop volume={(f) => {
        const duck = timeline.reduce((g, l) => Math.min(g, interpolate(f, [l.voiceFrom - 4, l.voiceFrom, l.voiceFrom + l.audioFrames, l.voiceFrom + l.audioFrames + 6], [1, 0.45, 0.45, 1], clamp)), 1);
        return interpolate(f, [0, fps * 0.5, totalFrames - fps, totalFrames - 1], [0, 0.12, 0.12, 0], clamp) * duck;
      }} />
      {timeline.map((l) => (
        <Sequence key={`v-${l.id}`} from={l.voiceFrom} durationInFrames={l.audioFrames + 3} layout="none" name={`voice ${l.id}`}>
          <Audio src={staticFile(`voice/airport-hotel/${l.id}.mp3`)} />
        </Sequence>
      ))}
      <Sfx />
      <div style={{position: "absolute", left: 60, top: 60, scale: "0.8", transformOrigin: "0 0", opacity: brandOut, zIndex: 60}}><Logo size={80} light /></div>
      <div style={{position: "absolute", right: 60, top: 78, fontFamily: geistFamily, fontWeight: 700, fontSize: 26, color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.55)", opacity: brandOut, zIndex: 60}}>vehabooking.com</div>
      <Captions tl={timeline} />
      <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 10, background: "rgba(255,255,255,0.22)", zIndex: 70}}>
        <div style={{width: `${(frame / totalFrames) * 100}%`, height: "100%", background: `linear-gradient(90deg,${teal},${gold})`}} />
      </div>
    </AbsoluteFill>
  );
};

export const AirportHotelKhVideo: React.FC = () => <Film />;
