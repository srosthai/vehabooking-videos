import React from "react";
import {AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {clamp, ease, geistFamily, khmerFamily, Logo, navy, teal} from "../brand";
import {SfxTrack, type SfxCue} from "../sfx";
import {timeline, totalFrames, type Timed} from "./narration";

const gold = "#FFC83D";
const outline = (w: number): React.CSSProperties => ({WebkitTextStroke: `${w}px ${navy}`, paintOrder: "stroke fill", textShadow: "0 6px 18px rgba(0,0,0,0.45)"});
const photoSrc = (src: string) => (src.includes("/") || src.includes(".") ? src : `real/${src}.jpg`);
const speakerLabel = (s: Timed["speaker"]) => (s === "B" ? "● VEHA" : "● SOKHOM");
const stickerDir = (s: Timed["speaker"]) => (s === "B" ? "b" : "c");

const Photo: React.FC<{readonly src: string; readonly duration: number; readonly index: number; readonly zoom?: number; readonly pan?: number; readonly objectPosition?: string}> = ({src, duration, index, zoom = 0.1, pan = 18, objectPosition = "50% 50%"}) => {
  const f = useCurrentFrame();
  const p = Math.min(1, Math.max(0, f / Math.max(1, duration - 1)));
  const scale = 1.05 + p * zoom;
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
  const point = line.id === "f03";
  const compact = line.kind === "phoneEnd";
  const width = point ? 620 : compact ? 210 : line.id === "f09" || line.id === "f11" ? 320 : 420;
  const top = point ? 760 : compact ? 1110 : 960;
  const side: React.CSSProperties = point
    ? {left: 0}
    : line.id === "f06"
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
  const size = line.title.length > 24 ? 56 : line.title.length > 18 ? 64 : 76;
  return (
    <div style={{position: "absolute", left: 44, right: 44, top: 160, textAlign: "center", zIndex: 30}}>
      <div style={{fontFamily: khmerFamily, fontSize: size, fontWeight: 800, lineHeight: 1.3, color: "#fff", ...outline(14)}}>{line.title}</div>
    </div>
  );
};

const CAPTION_FONT_SIZE: Record<string, number> = {
  f06: 50,
  f09: 50,
  f11: 50,
  f12: 50,
};

const Captions: React.FC<{readonly tl: readonly Timed[]}> = ({tl}) => {
  const frame = useCurrentFrame();
  const line = tl.find((l) => frame >= l.voiceFrom - 3 && frame < l.voiceFrom + l.audioFrames + 5);
  if (!line) return null;
  const local = frame - line.voiceFrom;
  const opacity = interpolate(local, [-3, 1, line.audioFrames + 1, line.audioFrames + 5], [0, 1, 1, 0], clamp);
  const size = CAPTION_FONT_SIZE[line.id] ?? 56;
  return (
    <div style={{position: "absolute", left: 20, right: 20, bottom: 260, textAlign: "center", opacity, zIndex: 70}}>
      <div style={{fontFamily: geistFamily, fontWeight: 900, fontSize: 28, letterSpacing: 2, color: line.speaker === "B" ? "#7FE3D7" : gold, marginBottom: 4, ...outline(8)}}>{speakerLabel(line.speaker)}</div>
      <div style={{fontFamily: khmerFamily, fontWeight: 800, fontSize: size, lineHeight: 1.65, color: "#fff", ...outline(11)}}>
        {line.segs.map(([word, st], i) => {
          const active = local >= st * 30;
          const latin = /[A-Za-z]/.test(word);
          return (
            <span key={i} style={{color: active ? teal : "#FFFFFF", display: "inline-block", marginRight: 10, fontFamily: latin ? geistFamily : khmerFamily}}>
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const BigLabel: React.FC<{readonly text: string; readonly left?: number; readonly right?: number; readonly top: number; readonly color?: string; readonly size?: number; readonly sub?: string}> = ({text, left, right, top, color = teal, size = 140, sub}) => (
  <div style={{position: "absolute", left, right, top, textAlign: right ? "right" : "left", zIndex: 26}}>
    <div style={{fontFamily: geistFamily, fontWeight: 900, fontSize: size, lineHeight: 0.95, color, ...outline(10)}}>{text}</div>
    {sub ? <div style={{fontFamily: geistFamily, fontWeight: 800, fontSize: 46, color: "#fff", marginTop: 8, ...outline(8)}}>{sub}</div> : null}
  </div>
);

const MapPill: React.FC<{readonly text: string; readonly left: number; readonly top: number}> = ({text, left, top}) => (
  <div style={{position: "absolute", left, top, zIndex: 26, display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 999, background: "rgba(7,20,40,0.78)", border: "2px solid rgba(255,255,255,0.55)", boxShadow: "0 16px 34px rgba(0,0,0,0.35)"}}>
    <div style={{width: 13, height: 13, borderRadius: 999, background: teal, boxShadow: "0 0 0 6px rgba(0,179,159,0.18)"}} />
    <div style={{fontFamily: geistFamily, fontSize: 28, fontWeight: 800, color: "#fff"}}>{text}</div>
  </div>
);

const CheckPill: React.FC<{readonly text: string; readonly left: number; readonly top: number}> = ({text, left, top}) => (
  <div style={{position: "absolute", left, top, zIndex: 27, display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 999, background: "rgba(7,20,40,0.8)", border: "2px solid rgba(255,255,255,0.6)", boxShadow: "0 16px 34px rgba(0,0,0,0.35)"}}>
    <div style={{width: 30, height: 30, borderRadius: 999, background: teal, display: "flex", alignItems: "center", justifyContent: "center"}}>
      <svg width={20} height={20} viewBox="0 0 24 24"><path d="M5 12.5 10 17 19 7" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
    <div style={{fontFamily: khmerFamily, fontSize: 28, fontWeight: 800, color: "#fff"}}>{text}</div>
  </div>
);

const FareRow: React.FC<{readonly label: string; readonly price: string; readonly accent?: string}> = ({label, price, accent = navy}) => (
  <div style={{display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 18, padding: "12px 0", borderBottom: "1px solid #E6EDF0"}}>
    <div style={{fontFamily: geistFamily, fontSize: 24, fontWeight: 800, color: "#5A6B85", letterSpacing: 0.6}}>{label}</div>
    <div style={{fontFamily: geistFamily, fontSize: 58, fontWeight: 900, color: accent, lineHeight: 1}}>{price}</div>
  </div>
);

const FareCard: React.FC = () => (
  <div style={{position: "absolute", left: 66, top: 470, width: 590, padding: "26px 30px 28px", borderRadius: 36, background: "rgba(255,255,255,0.98)", boxShadow: "0 32px 72px rgba(0,0,0,0.38)", borderTop: `8px solid ${teal}`, zIndex: 28}}>
    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8}}>
      <div style={{fontFamily: geistFamily, fontSize: 22, fontWeight: 900, letterSpacing: 1.4, color: teal}}>FERRY FARES</div>
      <div style={{fontFamily: geistFamily, fontSize: 18, fontWeight: 800, letterSpacing: 1.2, color: "#5A6B85"}}>ONE WAY</div>
    </div>
    <FareRow label="ADULT" price="$17" />
    <FareRow label="KIDS 5–13" price="$8.50" accent={teal} />
    <FareRow label="UNDER 5" price="FREE" accent={teal} />
    <div style={{fontFamily: khmerFamily, fontSize: 24, fontWeight: 700, color: "#5A6B85", marginTop: 16}}>តម្លៃក្នុងមួយនាក់ · ទៅមួយផ្លូវ</div>
  </div>
);

const HomeIsland: React.FC<{readonly line: Timed; readonly index: number}> = ({line, index}) => {
  const f = useCurrentFrame();
  const slide = interpolate(f, [18, 40], [430, 0], {...clamp, easing: ease});
  const opacity = interpolate(f, [18, 30], [0, 1], clamp);
  return (
    <>
      <Photo src={line.photos[0]} duration={line.duration + 6} index={index} zoom={0.08} />
      <div style={{position: "absolute", right: 22, top: 700, width: 350, height: 470, borderRadius: 30, overflow: "hidden", border: "6px solid rgba(255,255,255,0.9)", boxShadow: "0 30px 60px rgba(0,0,0,0.45)", transform: `translateX(${slide}px)`, opacity, zIndex: 22}}>
        <Img src={staticFile(line.photos[1])} style={{width: "100%", height: "100%", objectFit: "cover"}} />
        <AbsoluteFill style={{background: "linear-gradient(180deg,transparent 45%,rgba(7,17,34,0.8))"}} />
        <div style={{position: "absolute", left: 18, bottom: 16, fontFamily: geistFamily, fontSize: 30, fontWeight: 900, color: "#fff"}}>Koh Rong</div>
      </div>
    </>
  );
};

const PhoneEnd: React.FC<{readonly line: Timed}> = ({line}) => {
  const f = useCurrentFrame();
  const {duration} = line;
  const endP = interpolate(f, [duration * 0.54, duration * 0.7], [0, 1], {...clamp, easing: ease});
  const tap = f >= 54;
  const pulse = 1 + Math.sin((f - 54) / 5) * 0.18;
  const phoneW = 620, phoneH = 1100, bezel = 28, screenW = 564, screenH = 1044;
  const imageH = Math.round((screenW * 863) / 403);
  const screenTop = 44;
  const tapX = (201 / 403) * screenW;
  const tapY = screenTop + (332 / 863) * imageH;
  return (
    <>
      <Img src={staticFile("real/ferry-family/scene11-kohrongsanloem.png")} style={{width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px) brightness(0.42)", transform: "scale(1.14)"}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.84),rgba(9,20,42,0.36) 42%,rgba(9,20,42,0.92))"}} />
      <div style={{position: "absolute", left: 190, top: 300, width: phoneW, height: phoneH, borderRadius: 90, background: "linear-gradient(145deg,#1B1E24,#050608)", boxShadow: "0 0 0 3px #6B7280, 0 0 0 5px #2A2D33, 0 50px 100px rgba(0,0,0,0.65), inset 0 0 0 2px rgba(255,255,255,0.12)", zIndex: 22}}>
        <div style={{position: "absolute", left: bezel, top: bezel, width: screenW, height: screenH, borderRadius: 70, overflow: "hidden", background: "#fff"}}>
          <Img src={staticFile(line.photos[0])} style={{position: "absolute", left: 0, top: screenTop, width: screenW, height: imageH, objectFit: "cover"}} />
          {tap && (
            <>
              <div style={{position: "absolute", left: tapX - 42, top: tapY - 42, width: 84, height: 84, borderRadius: 999, border: "4px solid #00B39F", boxShadow: "0 0 30px rgba(0,179,159,0.9)", opacity: 0.9, scale: String(pulse)}} />
              <div style={{position: "absolute", left: tapX - 25, top: tapY - 25, width: 50, height: 50, borderRadius: 999, background: "rgba(0,179,159,0.34)"}} />
              <div style={{position: "absolute", left: 40, top: tapY - 32, width: 484, height: 64, borderRadius: 32, background: "rgba(0,179,159,0.2)", boxShadow: "0 0 34px rgba(0,179,159,0.85)"}} />
            </>
          )}
          <div style={{position: "absolute", left: (screenW - 140) / 2, top: 14, width: 140, height: 34, borderRadius: 17, background: "#050608", zIndex: 30}} />
        </div>
      </div>
      <AbsoluteFill style={{opacity: endP, background: "linear-gradient(140deg,#111F40,#00786C)", zIndex: 65}}>
        <div style={{position: "absolute", left: 0, right: 0, top: 760, display: "flex", flexDirection: "column", alignItems: "center", gap: 30}}>
          <Logo size={172} light />
          <div style={{fontFamily: geistFamily, fontSize: 68, fontWeight: 800, color: "#fff", letterSpacing: 0.5}}>vehabooking.com</div>
        </div>
      </AbsoluteFill>
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
    if (line.kind === "phoneEnd") return <PhoneEnd line={line} />;
    if (line.kind === "homeIsland") return <HomeIsland line={line} index={index} />;
    if (line.kind === "checks") {
      return (
        <>
          <Img src={staticFile(line.photos[0])} style={{position: "absolute", left: 0, top: 0, width: 540, height: 1920, objectFit: "cover"}} />
          <Img src={staticFile(line.photos[1])} style={{position: "absolute", left: 540, top: 0, width: 540, height: 1920, objectFit: "cover"}} />
          <div style={{position: "absolute", left: 536, top: 0, width: 8, height: 1920, background: "rgba(255,255,255,0.85)", zIndex: 25}} />
          <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.55),rgba(9,20,42,0.08) 38%,rgba(9,20,42,0.92))"}} />
          <CheckPill text="អាវពោង" left={50} top={520} />
          <CheckPill text="បន្ទប់ទឹក" left={570} top={520} />
        </>
      );
    }
    if (line.kind === "split") {
      return (
        <>
          <Img src={staticFile(line.photos[0])} style={{position: "absolute", left: 0, top: 0, width: 540, height: 1920, objectFit: "cover"}} />
          <Img src={staticFile(line.photos[1])} style={{position: "absolute", left: 540, top: 0, width: 540, height: 1920, objectFit: "cover"}} />
          <div style={{position: "absolute", left: 536, top: 0, width: 8, height: 1920, background: "rgba(255,255,255,0.85)", zIndex: 25}} />
          <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.55),rgba(9,20,42,0.08) 38%,rgba(9,20,42,0.92))"}} />
          <div style={{position: "absolute", left: 30, right: 30, top: 510, display: "flex", justifyContent: "space-between", zIndex: 27}}>
            <div style={{width: 470, textAlign: "center", fontFamily: geistFamily, fontSize: 40, fontWeight: 900, color: "#fff", ...outline(10)}}>Koh Rong</div>
            <div style={{width: 470, textAlign: "center", fontFamily: geistFamily, fontSize: 40, fontWeight: 900, color: "#fff", ...outline(10)}}>Koh Rong Sanloem</div>
          </div>
        </>
      );
    }
    return (
      <>
        <Photo src={line.photos[0]} duration={visualDuration} index={index} zoom={line.kind === "zoom" ? 0.2 : 0.08} />
        {line.kind === "coast" && (
          <>
            <MapPill text="Sihanoukville" left={64} top={560} />
            <MapPill text="Koh Rong" left={600} top={700} />
            <MapPill text="Koh Rong Sanloem" left={520} top={1010} />
          </>
        )}
        {line.kind === "fare" && <FareCard />}
      </>
    );
  };

  return (
    <AbsoluteFill style={{opacity, transform: `translateX(${slide}px)`}}>
      {renderVisual()}
      {line.kind !== "phoneEnd" && line.kind !== "checks" && line.kind !== "split" && (
        <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.68) 0%,rgba(9,20,42,0.1) 34%,transparent 52%,rgba(9,20,42,0.22) 68%,rgba(9,20,42,0.88) 100%)"}} />
      )}
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 45%, transparent 42%, rgba(9,20,42,0.38) 100%)"}} />
      {line.kind === "free" && (
        <>
          <BigLabel text="FREE" right={54} top={560} size={154} color={teal} sub="Under 5" />
        </>
      )}
      {line.kind === "kidsPrice" && (
        <>
          <BigLabel text="$8.50" left={54} top={610} size={132} color={teal} />
          <div style={{position: "absolute", left: 58, top: 790, fontFamily: geistFamily, fontSize: 44, fontWeight: 900, color: "#fff", letterSpacing: 1.4, ...outline(8)}}>Age 5–13</div>
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
    out.push({frame: l.from + 8, sfx: "pop", note: `sticker ${l.sticker}`, volume: 0.55});
    if (l.id === "f05" || l.id === "f06") out.push({frame: l.from + 20, sfx: "coin", note: "fare", volume: 0.45});
    if (l.id === "f12") out.push({frame: l.from + 54, sfx: "tap", note: "Book Now", volume: 0.75});
    return out;
  });
  return <SfxTrack cues={cues} />;
};

const Film: React.FC = () => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const f12 = timeline.find((l) => l.id === "f12")!;
  const endCardStart = f12.from + f12.duration * 0.54;
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
          <Audio src={staticFile(`voice/ferry-family/${l.id}.mp3`)} />
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

export const FerryFamilyKhVideo: React.FC = () => <Film />;
