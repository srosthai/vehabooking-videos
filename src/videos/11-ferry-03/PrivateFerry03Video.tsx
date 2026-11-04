import React from "react";
import {AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {clamp, ease, geistFamily, khmerFamily, Logo, navy, teal} from "../brand";
import {SfxTrack, type SfxCue} from "../sfx";
import {timeline, totalFrames, type Timed} from "./narration";

const outline = (w: number): React.CSSProperties => ({WebkitTextStroke: `${w}px ${navy}`, paintOrder: "stroke fill", textShadow: "0 6px 18px rgba(0,0,0,0.45)"});
const photoSrc = (src: string) => (src.includes("/") || src.includes(".") ? src : `real/${src}.jpg`);

const Photo: React.FC<{readonly src: string; readonly duration: number; readonly index: number; readonly zoom?: number; readonly pan?: number}> = ({src, duration, index, zoom = 0.1, pan = 18}) => {
  const f = useCurrentFrame();
  const p = Math.min(1, Math.max(0, f / Math.max(1, duration - 1)));
  const scale = 1.08 + p * zoom;
  const dir = index % 2 ? 1 : -1;
  const x = dir * interpolate(p, [0, 1], [-pan, pan]);
  const y = interpolate(p, [0, 1], [-10, 14]);
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <Img src={staticFile(photoSrc(src))} style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale}) translate(${x}px,${y}px)`}} />
    </AbsoluteFill>
  );
};

const PersonSticker: React.FC<{readonly line: Timed}> = ({line}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 6, fps, config: {damping: 10, stiffness: 170, mass: 0.7}});
  const compact = line.kind === "phone";
  const tilt = line.speaker === "A" ? -6 : 6;
  const bob = Math.sin(f / 14) * 8;
  const width = compact ? 190 : 420;
  const top = compact ? 1120 : 1040;
  const side: React.CSSProperties = compact ? {right: 12} : line.speaker === "A" ? {left: 20} : {right: 20};
  return (
    <div style={{position: "absolute", top, width, ...side, scale: String(Math.max(0, s)), rotate: `${tilt * (1 - s) + tilt * 0.4}deg`, translate: `0px ${bob}px`, filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.38))", zIndex: 20}}>
      <Img src={staticFile(`stickers/people/${line.speaker.toLowerCase()}/${line.sticker}.png`)} style={{width: "100%"}} />
    </div>
  );
};

const Title: React.FC<{readonly line: Timed}> = ({line}) => (
  <div style={{position: "absolute", left: 50, right: 50, top: 170, textAlign: "center", zIndex: 30}}>
    <div style={{fontFamily: khmerFamily, fontSize: 84, fontWeight: 800, lineHeight: 1.32, color: "#fff", ...outline(14)}}>{line.title}</div>
  </div>
);

const Captions: React.FC<{readonly tl: readonly Timed[]}> = ({tl}) => {
  const frame = useCurrentFrame();
  const line = tl.find((l) => frame >= l.voiceFrom - 3 && frame < l.voiceFrom + l.audioFrames + 5);
  if (!line) return null;
  const local = frame - line.voiceFrom;
  const opacity = interpolate(local, [-3, 1, line.audioFrames + 1, line.audioFrames + 5], [0, 1, 1, 0], clamp);
  const display = line.segs
    .map(([raw, st]) => ({text: raw.replace(/vehabooking(\.com)?/i, "vehabooking.com"), start: st}))
    .filter((x) => x.text);
  return (
    <div style={{position: "absolute", left: 50, right: 50, bottom: 260, textAlign: "center", opacity, zIndex: 50}}>
      <div style={{fontFamily: geistFamily, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: line.speaker === "A" ? "#7FE3D7" : "#FFC83D", marginBottom: 4, ...outline(8)}}>{line.speaker === "A" ? "● THAI" : "● VEHA"}</div>
      <div style={{fontFamily: khmerFamily, fontWeight: line.speaker === "A" ? 700 : 800, fontStyle: "normal", fontSize: line.speaker === "A" ? 56 : 60, lineHeight: 1.75, color: "#fff", ...outline(12)}}>
        {display.map(({text: w, start: st}, i) => {
          const s = st * 30;
          const pop = interpolate(local, [s, s + 3, s + 7], [1, 1.12, 1], clamp);
          const base = line.speaker === "A" ? "#FFFFFF" : "#FFE7A3";
          return <span key={i} style={{color: local >= s ? teal : base, display: "inline-block", whiteSpace: "pre", scale: String(pop)}}>{w}</span>;
        })}
      </div>
    </div>
  );
};

const Badge: React.FC<{readonly text: string; readonly x: number; readonly y: number; readonly delay?: number; readonly color?: string; readonly textColor?: string; readonly fontSize?: number}> = ({text, x, y, delay = 0, color = teal, textColor = "#fff", fontSize = 58}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 11, stiffness: 170, mass: 0.7}});
  return (
    <div style={{position: "absolute", left: x, top: y, scale: String(Math.max(0, s)), zIndex: 25}}>
      <div style={{padding: "20px 44px", borderRadius: 999, background: color, border: "8px solid #fff", boxShadow: "0 28px 60px rgba(0,0,0,0.4)"}}>
        <div style={{fontFamily: khmerFamily, fontSize, fontWeight: 900, color: textColor, lineHeight: 1.2}}>{text}</div>
      </div>
    </div>
  );
};

const PHONE = {left: 230, top: 300, width: 620, height: 1100, bezel: 28, screenW: 564, screenH: 1044};
const IMG_H = Math.round((PHONE.screenW * 863) / 403);
const MAX_SCROLL = Math.max(0, IMG_H - PHONE.screenH);
const TAP_FRAME = Math.round(2.04 * 30);
const TAP_X = (201 / 403) * PHONE.screenW;
const TAP_Y = (332 / 863) * IMG_H;

const PhoneScene: React.FC<{readonly duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const p = Math.min(1, Math.max(0, f / Math.max(1, duration - 1)));
  const scrollY = -MAX_SCROLL * ease(p);
  const tap = f >= TAP_FRAME;
  const pulse = 1 + Math.sin((f - TAP_FRAME) / 5) * 0.18;
  return (
    <AbsoluteFill>
      <Img src={staticFile("real/ferry03/krs-beach-yellow-boat.jpg")} style={{width: "100%", height: "100%", objectFit: "cover", filter: "blur(20px) brightness(0.42)", transform: "scale(1.14)"}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.82),rgba(9,20,42,0.38) 42%,rgba(9,20,42,0.9))"}} />
      <div style={{position: "absolute", left: PHONE.left, top: PHONE.top, width: PHONE.width, height: PHONE.height, borderRadius: 90, background: "linear-gradient(145deg,#1B1E24,#050608)", boxShadow: "0 0 0 3px #6B7280, 0 0 0 5px #2A2D33, 0 50px 100px rgba(0,0,0,0.65), inset 0 0 0 2px rgba(255,255,255,0.12)", zIndex: 20}}>
        <div style={{position: "absolute", left: PHONE.bezel, top: PHONE.bezel, width: PHONE.screenW, height: PHONE.screenH, borderRadius: 70, overflow: "hidden", background: "#fff"}}>
          <div style={{position: "absolute", left: 0, top: 0, width: PHONE.screenW, height: PHONE.screenH, transform: `translateY(${scrollY}px)`}}>
            <Img src={staticFile("real/ferry03/booking-screenshot.png")} style={{width: PHONE.screenW, height: IMG_H, objectFit: "cover", imageRendering: "auto"}} />
            {tap && (
              <>
                <div style={{position: "absolute", left: TAP_X - 42, top: TAP_Y - 42, width: 84, height: 84, borderRadius: 999, border: "4px solid #00B39F", boxShadow: "0 0 30px rgba(0,179,159,0.85)", opacity: 0.9, scale: String(pulse)}} />
                <div style={{position: "absolute", left: TAP_X - 25, top: TAP_Y - 25, width: 50, height: 50, borderRadius: 999, background: "rgba(0,179,159,0.32)"}} />
                <div style={{position: "absolute", left: 40, top: TAP_Y - 32, width: 484, height: 64, borderRadius: 32, background: "rgba(0,179,159,0.18)", boxShadow: "0 0 34px rgba(0,179,159,0.8)"}} />
              </>
            )}
          </div>
          <div style={{position: "absolute", left: (PHONE.screenW - 140) / 2, top: 14, width: 140, height: 34, borderRadius: 17, background: "#050608", zIndex: 30}} />
          <div style={{position: "absolute", left: (PHONE.screenW - 110) / 2, bottom: 10, width: 110, height: 5, borderRadius: 5, background: "rgba(9,20,42,0.45)", zIndex: 30}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => (
  <>
    <AbsoluteFill style={{background: "linear-gradient(140deg,rgba(17,31,64,0.96),rgba(0,135,122,0.9))"}} />
    <div style={{position: "absolute", left: 70, right: 70, top: 260, display: "flex", flexDirection: "column", alignItems: "center", gap: 24, zIndex: 25}}>
      <Logo size={160} light />
      <div style={{fontFamily: geistFamily, fontSize: 70, fontWeight: 800, color: "#fff", letterSpacing: 0.5}}>vehabooking.com</div>
      <div style={{fontFamily: geistFamily, fontSize: 42, fontWeight: 700, color: "#fff"}}>+855 95 255 577</div>
      <div style={{marginTop: 12, padding: "22px 52px", borderRadius: 999, background: teal, color: "#fff", fontFamily: geistFamily, fontSize: 42, fontWeight: 900, border: "5px solid #fff", boxShadow: "0 24px 50px rgba(0,0,0,0.32)"}}>Book Now</div>
    </div>
  </>
);

const Scene: React.FC<{readonly line: Timed; readonly index: number}> = ({line, index}) => {
  const f = useCurrentFrame();
  const visualDuration = line.duration + 6;
  const inP = interpolate(f, [0, 6], [0, 1], clamp);
  const outP = interpolate(f, [visualDuration - 6, visualDuration], [1, 0], clamp);
  const opacity = Math.min(inP, outP);
  const slide = (1 - inP) * (line.speaker === "A" ? 22 : -22);
  const cross = interpolate(f, [visualDuration * 0.45, visualDuration * 0.55], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity, transform: `translateX(${slide}px)`}}>
      {line.kind === "phone" ? (
        <PhoneScene duration={visualDuration} />
      ) : line.kind === "end" ? (
        <>
          <Photo src={line.photos[0]} duration={visualDuration} index={index} zoom={0.08} />
          <EndCard />
        </>
      ) : line.kind === "crossfade" ? (
        <>
          <Photo src={line.photos[0]} duration={visualDuration} index={index} zoom={0.1} />
          <AbsoluteFill style={{opacity: cross}}><Photo src={line.photos[1] ?? line.photos[0]} duration={visualDuration} index={index + 1} zoom={0.1} /></AbsoluteFill>
        </>
      ) : (
        <Photo src={line.photos[0]} duration={visualDuration} index={index} zoom={line.kind === "zoom" ? 0.18 : 0.1} />
      )}
      {line.kind !== "phone" && line.kind !== "end" && (
        <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.72) 0%,rgba(9,20,42,0.12) 34%,transparent 52%,rgba(9,20,42,0.2) 68%,rgba(9,20,42,0.86) 100%)"}} />
      )}
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 45%, transparent 42%, rgba(9,20,42,0.38) 100%)"}} />
      {line.kind === "speed" && <Badge text="30 នាទី" x={250} y={650} delay={8} fontSize={64} />}
      {line.kind === "price" && (
        <>
          <Badge text="$17" x={80} y={590} delay={8} color={teal} textColor="#fff" fontSize={64} />
          <Badge text="ទៅមក $30" x={80} y={770} delay={16} color="#fff" textColor={navy} fontSize={52} />
        </>
      )}
      {line.kind === "time" && <Badge text="08:00 – 16:00" x={120} y={650} delay={8} fontSize={56} />}
      <Title line={line} />
      <PersonSticker line={line} />
    </AbsoluteFill>
  );
};

const Sfx: React.FC = () => {
  const cues: SfxCue[] = timeline.flatMap((l, i) => {
    const list: SfxCue[] = [];
    if (i > 0) list.push({frame: l.from, sfx: "whoosh", note: `to ${l.id}`, volume: 0.45});
    list.push({frame: l.from + 8, sfx: "pop", note: `sticker ${l.sticker}`, volume: 0.6});
    if (l.id === "p06") list.push({frame: l.from + 20, sfx: "coin", note: "price", volume: 0.5});
    if (l.id === "p11") list.push({frame: l.from + TAP_FRAME, sfx: "tap", note: "Book Now", volume: 0.8});
    return list;
  });
  return <SfxTrack cues={cues} />;
};

const Film: React.FC = () => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
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
        <Sequence key={`v-${l.id}`} from={l.voiceFrom} durationInFrames={l.audioFrames + 3} layout="none">
          <Audio src={staticFile(`voice/ferry-03/${l.id}.mp3`)} />
        </Sequence>
      ))}
      <Sfx />
      <div style={{position: "absolute", left: 60, top: 60, scale: "0.8", transformOrigin: "0 0", zIndex: 60}}><Logo size={80} light /></div>
      <div style={{position: "absolute", right: 60, top: 78, fontFamily: geistFamily, fontWeight: 700, fontSize: 26, color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.55)", zIndex: 60}}>vehabooking.com</div>
      <Captions tl={timeline} />
      <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 10, background: "rgba(255,255,255,0.22)", zIndex: 70}}>
        <div style={{width: `${(frame / totalFrames) * 100}%`, height: "100%", background: `linear-gradient(90deg,${teal},#FFC83D)`}} />
      </div>
    </AbsoluteFill>
  );
};

export const Ferry03KhVideo: React.FC = () => <Film />;
