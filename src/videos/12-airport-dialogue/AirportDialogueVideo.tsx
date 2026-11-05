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
  const width = compact ? 170 : 370;
  const top = compact ? 1010 : 930;
  const side: React.CSSProperties = compact ? {right: 10} : line.speaker === "A" ? {left: 20} : {right: 20};
  return (
    <div style={{position: "absolute", top, width, ...side, scale: String(Math.max(0, s)), rotate: `${tilt * (1 - s) + tilt * 0.4}deg`, translate: `0px ${bob}px`, filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.38))", zIndex: 20}}>
      <Img src={staticFile(`stickers/people/${line.speaker.toLowerCase()}/${line.sticker}.png`)} style={{width: "100%"}} />
    </div>
  );
};

const Title: React.FC<{readonly line: Timed}> = ({line}) => {
  const size = line.id === "p10" ? 58 : line.title.length > 19 ? 68 : 76;
  return (
    <div style={{position: "absolute", left: 50, right: 50, top: 150, textAlign: "center", zIndex: 30}}>
      <div style={{fontFamily: khmerFamily, fontSize: size, fontWeight: 800, lineHeight: 1.32, color: "#fff", ...outline(14)}}>{line.title}</div>
    </div>
  );
};

// Long lines get a manual break after these words once QA shows a 3-line wrap.
const CAPTION_BREAK_AFTER: Record<string, string> = {
  p04: "ចាំទទួល",
  p12: "Now",
};
const CAPTION_FONT_SIZE: Record<string, number> = {
  p04: 44,
  p12: 44,
};

const Captions: React.FC<{readonly tl: readonly Timed[]}> = ({tl}) => {
  const frame = useCurrentFrame();
  const line = tl.find((l) => frame >= l.voiceFrom - 3 && frame < l.voiceFrom + l.audioFrames + 5);
  if (!line) return null;
  const local = frame - line.voiceFrom;
  const opacity = interpolate(local, [-3, 1, line.audioFrames + 1, line.audioFrames + 5], [0, 1, 1, 0], clamp);
  const display = line.segs.map(([text, start]) => ({text, start})).filter((x) => x.text);
  return (
    <div style={{position: "absolute", left: 24, right: 24, bottom: 240, textAlign: "center", opacity, zIndex: 50}}>
      <div style={{fontFamily: geistFamily, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: line.speaker === "A" ? "#7FE3D7" : "#FFC83D", marginBottom: 6, ...outline(8)}}>
        {line.speaker === "A" ? "● A" : "● B"}
      </div>
      <div style={{fontFamily: khmerFamily, fontWeight: line.speaker === "A" ? 700 : 800, fontStyle: "normal", fontSize: CAPTION_FONT_SIZE[line.id] ?? (line.speaker === "A" ? 54 : 56), lineHeight: 1.72, color: "#fff", ...outline(12)}}>
        {(() => {
          const breakKey = CAPTION_BREAK_AFTER[line.id];
          let breakUsed = false;
          return display.map(({text: w, start: st}, i) => {
            const s = st * 30;
            const pop = interpolate(local, [s, s + 3, s + 7], [1, 1.12, 1], clamp);
            const base = line.speaker === "A" ? "#FFFFFF" : "#FFE7A3";
            const span = (text: string, key: string) => (
              <span key={key} style={{color: local >= s ? teal : base, display: "inline-block", whiteSpace: "pre", scale: String(pop)}}>{text}</span>
            );
            if (breakKey && !breakUsed) {
              const at = w.indexOf(breakKey);
              if (at >= 0) {
                breakUsed = true;
                const cut = at + breakKey.length;
                return (
                  <React.Fragment key={i}>
                    {span(w.slice(0, cut), `${i}-a`)}
                    <br />
                    {w.slice(cut) ? span(w.slice(cut), `${i}-b`) : null}
                  </React.Fragment>
                );
              }
            }
            return <React.Fragment key={i}>{span(w, `${i}`)}</React.Fragment>;
          });
        })()}
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

const PHONE = {left: 240, top: 250, width: 600, height: 1060, bezel: 26, screenW: 548, screenH: 1008};
const SHOT_W = PHONE.screenW;
const SHOT_H = Math.round((SHOT_W * 868) / 411);
const STACK_H = SHOT_H * 2;
const MAX_SCROLL = Math.max(0, STACK_H - PHONE.screenH);

const PhoneScene: React.FC<{readonly duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const p = Math.min(1, Math.max(0, f / Math.max(1, duration - 1)));
  const scrollP = interpolate(p, [0.18, 0.78], [0, 1], clamp);
  const scrollY = -MAX_SCROLL * ease(scrollP);
  const tapP = interpolate(p, [0.78, 0.84], [0, 1], clamp);
  const pulse = 1 + Math.sin(f / 5) * 0.18;
  return (
    <AbsoluteFill>
      <Img src={staticFile("real/airport/phnompenh-city.jpg")} style={{width: "100%", height: "100%", objectFit: "cover", filter: "blur(22px) brightness(0.42)", transform: "scale(1.15)"}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.86),rgba(9,20,42,0.35) 45%,rgba(9,20,42,0.92))"}} />
      <div style={{position: "absolute", left: PHONE.left, top: PHONE.top, width: PHONE.width, height: PHONE.height, borderRadius: 88, background: "linear-gradient(145deg,#1B1E24,#050608)", boxShadow: "0 0 0 3px #6B7280, 0 0 0 5px #2A2D33, 0 50px 100px rgba(0,0,0,0.65), inset 0 0 0 2px rgba(255,255,255,0.12)", zIndex: 20}}>
        <div style={{position: "absolute", left: PHONE.bezel, top: PHONE.bezel, width: PHONE.screenW, height: PHONE.screenH, borderRadius: 68, overflow: "hidden", background: "#fff"}}>
          <div style={{position: "absolute", left: 0, top: 0, width: PHONE.screenW, height: STACK_H, transform: `translateY(${scrollY}px)`}}>
            <Img src={staticFile("real/airport/app-airport-search.png")} style={{width: SHOT_W, height: SHOT_H, objectFit: "cover", display: "block"}} />
            <Img src={staticFile("real/airport/app-airport-results.png")} style={{width: SHOT_W, height: SHOT_H, objectFit: "cover", display: "block"}} />
          </div>
          {tapP > 0 && (
            <>
              <div style={{position: "absolute", left: 385, top: 74, width: 86, height: 86, borderRadius: 999, border: "4px solid #00B39F", boxShadow: "0 0 30px rgba(0,179,159,0.85)", opacity: 0.9 * tapP, scale: String(pulse)}} />
              <div style={{position: "absolute", left: 401, top: 90, width: 54, height: 54, borderRadius: 999, background: "rgba(0,179,159,0.32)", opacity: tapP}} />
            </>
          )}
          <div style={{position: "absolute", left: (PHONE.screenW - 140) / 2, top: 12, width: 140, height: 34, borderRadius: 17, background: "#050608", zIndex: 30}} />
          <div style={{position: "absolute", left: (PHONE.screenW - 110) / 2, bottom: 8, width: 110, height: 5, borderRadius: 5, background: "rgba(9,20,42,0.45)", zIndex: 30}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const carCard = (label: string, seats: string, src: string, left: number, top: number, delay: number): React.ReactNode => (
  <FleetCard key={label} label={label} seats={seats} src={src} left={left} top={top} delay={delay} />
);

const FleetCard: React.FC<{readonly label: string; readonly seats: string; readonly src: string; readonly left: number; readonly top: number; readonly delay: number}> = ({label, seats, src, left, top, delay}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 12, stiffness: 170, mass: 0.7}});
  return (
    <div style={{position: "absolute", left, top, width: 290, height: 240, borderRadius: 28, background: "rgba(255,255,255,0.96)", boxShadow: "0 20px 46px rgba(0,0,0,0.28)", scale: String(Math.max(0, s)), padding: 16, zIndex: 15}}>
      <div style={{height: 150, display: "flex", alignItems: "center", justifyContent: "center"}}>
        <Img src={staticFile(src)} style={{maxWidth: "100%", maxHeight: "100%", objectFit: "contain"}} />
      </div>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6}}>
        <div style={{fontFamily: geistFamily, fontSize: 30, fontWeight: 800, color: navy}}>{label}</div>
        <div style={{fontFamily: khmerFamily, fontSize: 23, fontWeight: 700, color: "#5A6B85"}}>{seats}</div>
      </div>
    </div>
  );
};

const FleetScene: React.FC<{readonly duration: number; readonly index: number}> = ({duration, index}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cardIn = spring({frame: f - 6, fps, config: {damping: 13, stiffness: 150, mass: 0.8}});
  return (
    <AbsoluteFill>
      <Photo src="real/airport/phnompenh-city.jpg" duration={duration} index={index} zoom={0.08} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.8),rgba(9,20,42,0.35) 42%,rgba(9,20,42,0.88))"}} />
      {carCard("Sedan", "៤ កៅអី", "real/cars/sedan.png", 50, 350, 8)}
      {carCard("SUV", "៤ កៅអី", "real/cars/suv.png", 360, 350, 12)}
      {carCard("MPV", "៧ កៅអី", "real/cars/mpv.png", 50, 610, 16)}
      {carCard("Van", "១៥ កៅអី", "real/cars/van.png", 360, 610, 20)}
      <div style={{position: "absolute", left: 690, top: 350, width: 330, height: 500, borderRadius: 30, background: "#fff", overflow: "hidden", boxShadow: "0 24px 54px rgba(0,0,0,0.35)", scale: String(Math.max(0, cardIn)), transformOrigin: "50% 50%", zIndex: 16}}>
        <Img src={staticFile("real/airport/app-airport-results.png")} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "top"}} />
      </div>
      <div style={{position: "absolute", left: 690, top: 870, width: 330, textAlign: "center", fontFamily: geistFamily, fontSize: 24, fontWeight: 700, color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.6)", zIndex: 17}}>vehabooking.com · Airport</div>
    </AbsoluteFill>
  );
};

const CarScene: React.FC<{readonly line: Timed; readonly duration: number; readonly index: number}> = ({line, duration, index}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 10, fps, config: {damping: 12, stiffness: 150, mass: 0.8}});
  return (
    <AbsoluteFill>
      <Photo src="real/airport/techo-airport.jpg" duration={duration} index={index} zoom={0.08} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.84),rgba(9,20,42,0.3) 38%,rgba(9,20,42,0.9))"}} />
      <Img src={staticFile(line.photos[0])} style={{position: "absolute", left: 180, top: 500, width: 780, objectFit: "contain", scale: String(Math.max(0, s)), filter: "drop-shadow(0 35px 40px rgba(0,0,0,0.55))", zIndex: 14}} />
      <Badge text="Van · ១៥ កៅអី" x={250} y={820} delay={22} fontSize={48} />
    </AbsoluteFill>
  );
};

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
      ) : line.kind === "fleet" ? (
        <FleetScene duration={visualDuration} index={index} />
      ) : line.kind === "car" ? (
        <CarScene line={line} duration={visualDuration} index={index} />
      ) : line.kind === "crossfade" ? (
        <>
          <Photo src={line.photos[0]} duration={visualDuration} index={index} zoom={0.1} />
          <AbsoluteFill style={{opacity: cross}}><Photo src={line.photos[1] ?? line.photos[0]} duration={visualDuration} index={index + 1} zoom={0.1} /></AbsoluteFill>
        </>
      ) : (
        <Photo src={line.photos[0]} duration={visualDuration} index={index} zoom={line.kind === "price" ? 0.14 : 0.1} />
      )}
      {line.kind !== "phone" && (
        <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.72) 0%,rgba(9,20,42,0.12) 34%,transparent 52%,rgba(9,20,42,0.2) 68%,rgba(9,20,42,0.88) 100%)"}} />
      )}
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 45%, transparent 42%, rgba(9,20,42,0.38) 100%)"}} />
      {line.kind === "price" && (
        <>
          <Badge text="$15" x={90} y={620} delay={8} color={teal} textColor="#fff" fontSize={72} />
          <Badge text="ពីព្រលានតេជោ" x={90} y={790} delay={16} color="#fff" textColor={navy} fontSize={42} />
        </>
      )}
      <Title line={line} />
      <PersonSticker line={line} />
    </AbsoluteFill>
  );
};

const Sfx: React.FC = () => {
  const p12 = timeline[timeline.length - 1];
  const cues: SfxCue[] = timeline.flatMap((l, i) => {
    const list: SfxCue[] = [];
    if (i > 0) list.push({frame: l.from, sfx: "whoosh", note: `to ${l.id}`, volume: 0.42});
    list.push({frame: l.from + 8, sfx: "pop", note: `sticker ${l.sticker}`, volume: 0.55});
    if (l.id === "p06") list.push({frame: l.from + 24, sfx: "coin", note: "price $15", volume: 0.5});
    return list;
  });
  cues.push({frame: p12.from + Math.round(p12.duration * 0.8), sfx: "tap", note: "Book Now", volume: 0.75});
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
        const duck = timeline.reduce((g, l) => Math.min(g, interpolate(f, [l.voiceFrom - 4, l.voiceFrom, l.voiceFrom + l.audioFrames, l.voiceFrom + l.audioFrames + 6], [1, 0.42, 0.42, 1], clamp)), 1);
        return interpolate(f, [0, fps * 0.5, totalFrames - fps, totalFrames - 1], [0, 0.12, 0.12, 0], clamp) * duck;
      }} />
      {timeline.map((l) => (
        <Sequence key={`v-${l.id}`} from={l.voiceFrom} durationInFrames={l.audioFrames + 3} layout="none">
          <Audio src={staticFile(`voice/airport-dialogue/${l.id}.mp3`)} />
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

export const AirportDialogueKhVideo: React.FC = () => <Film />;
