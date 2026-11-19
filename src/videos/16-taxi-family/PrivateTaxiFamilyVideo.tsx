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
  const point = line.id === "t03";
  const compact = line.kind === "phoneEnd";
  const small = line.id === "t07" || line.id === "t09";
  const width = point ? 620 : compact ? 210 : small ? 250 : 420;
  const top = point ? 760 : compact ? 1110 : small ? 1160 : 960;
  const side: React.CSSProperties = point
    ? {left: 0}
    : line.id === "t06" || line.id === "t10"
      ? {left: 18}
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
  const size = line.title.length > 24 ? 54 : line.title.length > 18 ? 62 : 74;
  return (
    <div style={{position: "absolute", left: 44, right: 44, top: 160, textAlign: "center", zIndex: 30}}>
      <div style={{fontFamily: khmerFamily, fontSize: size, fontWeight: 800, lineHeight: 1.3, color: "#fff", ...outline(14)}}>{line.title}</div>
    </div>
  );
};

const CAPTION_FONT_SIZE: Record<string, number> = {
  t03: 52,
  t05: 50,
  t07: 48,
  t09: 50,
  t11: 50,
  t12: 50,
};

const Captions: React.FC<{readonly tl: readonly Timed[]}> = ({tl}) => {
  const frame = useCurrentFrame();
  const line = tl.find((l) => frame >= l.voiceFrom - 3 && frame < l.voiceFrom + l.audioFrames + 5);
  if (!line) return null;
  const local = frame - line.voiceFrom;
  const opacity = interpolate(local, [-3, 1, line.audioFrames + 1, line.audioFrames + 5], [0, 1, 1, 0], clamp);
  const size = CAPTION_FONT_SIZE[line.id] ?? 54;
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

const StopPill: React.FC<{readonly icon: string; readonly label: string; readonly left: number; readonly top: number}> = ({icon, label, left, top}) => (
  <div style={{position: "absolute", left, top, zIndex: 27, display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 999, background: "rgba(7,20,40,0.82)", border: "2px solid rgba(255,255,255,0.6)"}}>
    <div style={{fontSize: 30, lineHeight: 1}}>{icon}</div>
    <div style={{fontFamily: khmerFamily, fontSize: 26, fontWeight: 800, color: "#fff"}}>{label}</div>
  </div>
);

const HomeAngkor: React.FC<{readonly line: Timed; readonly index: number}> = ({line, index}) => {
  const f = useCurrentFrame();
  const slide = interpolate(f, [18, 40], [430, 0], {...clamp, easing: ease});
  const opacity = interpolate(f, [18, 30], [0, 1], clamp);
  return (
    <>
      <Photo src={line.photos[0]} duration={line.duration + 6} index={index} zoom={0.07} />
      <div style={{position: "absolute", right: 22, top: 700, width: 350, height: 470, borderRadius: 30, overflow: "hidden", border: "6px solid rgba(255,255,255,0.9)", boxShadow: "0 30px 60px rgba(0,0,0,0.45)", transform: `translateX(${slide}px)`, opacity, zIndex: 22}}>
        <Img src={staticFile(line.photos[1])} style={{width: "100%", height: "100%", objectFit: "cover"}} />
        <AbsoluteFill style={{background: "linear-gradient(180deg,transparent 45%,rgba(7,17,34,0.8))"}} />
        <div style={{position: "absolute", left: 18, bottom: 16, fontFamily: geistFamily, fontSize: 30, fontWeight: 900, color: "#fff"}}>Siem Reap</div>
      </div>
    </>
  );
};

const VehicleCard: React.FC<{readonly src: string; readonly label: string; readonly left: number; readonly top: number; readonly start: number}> = ({src, label, left, top, start}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - start, fps, config: {damping: 13, stiffness: 170, mass: 0.8}});
  return (
    <div style={{position: "absolute", left, top, width: 480, height: 540, borderRadius: 28, overflow: "hidden", border: "4px solid rgba(255,255,255,0.55)", boxShadow: "0 24px 50px rgba(0,0,0,0.4)", opacity: Math.min(1, Math.max(0, s)), scale: String(Math.max(0, s)), zIndex: 23}}>
      <Img src={staticFile(src)} style={{width: "100%", height: "100%", objectFit: "cover"}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(7,17,34,0.05),rgba(7,17,34,0.15) 50%,rgba(7,17,34,0.88))"}} />
      <div style={{position: "absolute", left: 22, right: 22, bottom: 18, fontFamily: geistFamily, fontSize: 38, fontWeight: 900, color: "#fff", textAlign: "center"}}>{label}</div>
    </div>
  );
};

const Vehicles: React.FC<{readonly line: Timed}> = ({line}) => {
  const wordStart = (word: string) => {
    const found = line.segs.find(([w]) => w.replace(/[!,.]/g, "") === word);
    return found ? found[1] * 30 : 0;
  };
  const labels = ["Sedan", "SUV", "MPV", "Van"];
  const pos = [[30, 340], [570, 340], [30, 900], [570, 900]];
  return (
    <>
      <Photo src={line.photos[0]} duration={line.duration + 6} index={6} zoom={0.04} objectPosition="50% 50%" />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.82),rgba(9,20,42,0.35) 38%,rgba(9,20,42,0.92))"}} />
      {labels.map((label, i) => (
        <VehicleCard key={label} src={line.photos[i]} label={label} left={pos[i][0]} top={pos[i][1]} start={wordStart(label)} />
      ))}
    </>
  );
};

const ResultPhone: React.FC<{readonly line: Timed}> = ({line}) => {
  const phoneW = 560, phoneH = 1010, bezel = 24, screenW = 512, screenH = 962;
  return (
    <>
      <Img src={staticFile("real/taxi-family/scene03-private-sedan.png")} style={{width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px) brightness(0.4)", transform: "scale(1.14)"}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.86),rgba(9,20,42,0.36) 42%,rgba(9,20,42,0.94))"}} />
      <div style={{position: "absolute", left: 36, top: 280, width: phoneW, height: phoneH, borderRadius: 86, background: "linear-gradient(145deg,#1B1E24,#050608)", boxShadow: "0 0 0 3px #6B7280, 0 0 0 5px #2A2D33, 0 50px 100px rgba(0,0,0,0.65)", zIndex: 22}}>
        <div style={{position: "absolute", left: bezel, top: bezel, width: screenW, height: screenH, borderRadius: 66, overflow: "hidden", background: "#F7FAFA"}}>
          <Img src={staticFile(line.photos[0])} style={{position: "absolute", left: 0, top: 44, width: screenW, height: "auto", display: "block"}} />
          <div style={{position: "absolute", left: 0, right: 0, bottom: 28, textAlign: "center", fontFamily: geistFamily, fontSize: 20, fontWeight: 700, color: "#8A97A8"}}>vehabooking.com</div>
          <div style={{position: "absolute", left: (screenW - 130) / 2, top: 14, width: 130, height: 32, borderRadius: 16, background: "#050608", zIndex: 30}} />
        </div>
      </div>
      <div style={{position: "absolute", right: 56, top: 500, width: 430, zIndex: 28}}>
        <div style={{fontFamily: geistFamily, fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: 1.2}}>from</div>
        <div style={{fontFamily: geistFamily, fontSize: 166, fontWeight: 900, lineHeight: 0.9, color: teal, ...outline(10)}}>$65</div>
        <div style={{fontFamily: geistFamily, fontSize: 30, fontWeight: 800, color: "#fff", marginTop: 10, lineHeight: 1.3}}>Phnom Penh → Siem Reap</div>
      </div>
    </>
  );
};

const MapPin: React.FC<{readonly line: Timed; readonly index: number}> = ({line, index}) => {
  const f = useCurrentFrame();
  const drop = spring({frame: f - 10, fps: 30, config: {damping: 12, stiffness: 150, mass: 0.8}});
  const bounce = Math.sin((f - 10) / 8) * 8 * Math.min(1, drop);
  return (
    <>
      <Photo src={line.photos[0]} duration={line.duration + 6} index={index} zoom={0.08} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.72),rgba(9,20,42,0.1) 38%,rgba(9,20,42,0.9))"}} />
      <div style={{position: "absolute", left: 420, top: 620, translate: `0 ${(1 - drop) * -220 + bounce}px`, scale: String(Math.max(0.1, drop)), zIndex: 27, textAlign: "center"}}>
        <svg width={120} height={150} viewBox="0 0 100 130">
          <path d="M50 4 C25 4 8 22 8 47 C8 78 50 124 50 124 C50 124 92 78 92 47 C92 22 75 4 50 4Z" fill={teal} stroke="#fff" strokeWidth={7} />
          <circle cx={50} cy={44} r={16} fill="#fff" />
        </svg>
        <div style={{marginTop: -4, display: "inline-block", padding: "10px 18px", borderRadius: 999, background: "rgba(7,20,40,0.84)", border: "2px solid rgba(255,255,255,0.6)", fontFamily: geistFamily, fontSize: 28, fontWeight: 900, color: "#fff"}}>Phnom Penh</div>
      </div>
    </>
  );
};

const EndCard: React.FC = () => (
  <AbsoluteFill style={{background: "linear-gradient(140deg,#111F40,#00786C)"}}>
    <div style={{position: "absolute", left: 0, right: 0, top: 760, display: "flex", flexDirection: "column", alignItems: "center", gap: 26}}>
      <Logo size={172} light />
      <div style={{fontFamily: geistFamily, fontSize: 68, fontWeight: 800, color: "#fff", letterSpacing: 0.5}}>vehabooking.com</div>
      <div style={{fontFamily: geistFamily, fontSize: 38, fontWeight: 700, color: "#fff", letterSpacing: 1.2}}>095 255 577</div>
    </div>
  </AbsoluteFill>
);

const PhoneEnd: React.FC<{readonly line: Timed}> = ({line}) => {
  const f = useCurrentFrame();
  const {duration} = line;
  const endP = interpolate(f, [duration * 0.62, duration * 0.76], [0, 1], {...clamp, easing: ease});
  const tapFrame = 54;
  const tap = f >= tapFrame;
  const pulse = 1 + Math.sin((f - tapFrame) / 5) * 0.18;
  const phoneW = 620, phoneH = 1100, bezel = 28, screenW = 564, screenH = 1044;
  const touchX = 474, touchY = 600;
  return (
    <>
      <Img src={staticFile("real/taxi-family/scene10-home-pin-bg.png")} style={{width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px) brightness(0.4)", transform: "scale(1.14)"}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.84),rgba(9,20,42,0.36) 42%,rgba(9,20,42,0.92))"}} />
      <div style={{position: "absolute", left: 190, top: 300, width: phoneW, height: phoneH, borderRadius: 90, background: "linear-gradient(145deg,#1B1E24,#050608)", boxShadow: "0 0 0 3px #6B7280, 0 0 0 5px #2A2D33, 0 50px 100px rgba(0,0,0,0.65)", zIndex: 22}}>
        <div style={{position: "absolute", left: bezel, top: bezel, width: screenW, height: screenH, borderRadius: 70, overflow: "hidden", background: "#F7FAFA"}}>
          <Img src={staticFile(line.photos[0])} style={{position: "absolute", left: 0, top: 44, width: screenW, height: "auto", display: "block"}} />
          <div style={{position: "absolute", left: 0, right: 0, bottom: 28, textAlign: "center", fontFamily: geistFamily, fontSize: 20, fontWeight: 700, color: "#8A97A8"}}>vehabooking.com</div>
          {tap && (
            <>
              <div style={{position: "absolute", left: touchX - 42, top: touchY - 42, width: 84, height: 84, borderRadius: 999, border: "4px solid #00B39F", boxShadow: "0 0 30px rgba(0,179,159,0.9)", opacity: 0.9, scale: String(pulse)}} />
              <div style={{position: "absolute", left: touchX - 25, top: touchY - 25, width: 50, height: 50, borderRadius: 999, background: "rgba(0,179,159,0.34)"}} />
            </>
          )}
          <div style={{position: "absolute", left: (screenW - 140) / 2, top: 14, width: 140, height: 34, borderRadius: 17, background: "#050608", zIndex: 30}} />
        </div>
      </div>
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
    if (line.kind === "homeAngkor") return <HomeAngkor line={line} index={index} />;
    if (line.kind === "vehicles") return <Vehicles line={line} />;
    if (line.kind === "resultPhone") return <ResultPhone line={line} />;
    if (line.kind === "mapPin") return <MapPin line={line} index={index} />;
    if (line.kind === "phoneEnd") return <PhoneEnd line={line} />;
    if (line.kind === "pickupHotel") {
      const cross = interpolate(f, [visualDuration * 0.42, visualDuration * 0.58], [0, 1], clamp);
      return (
        <>
          <Photo src={line.photos[0]} duration={visualDuration} index={index} zoom={0.07} />
          <AbsoluteFill style={{opacity: cross}}><Photo src={line.photos[1]} duration={visualDuration} index={index + 1} zoom={0.07} /></AbsoluteFill>
        </>
      );
    }
    return <Photo src={line.photos[0]} duration={visualDuration} index={index} zoom={line.kind === "zoom" ? 0.18 : 0.08} />;
  };

  return (
    <AbsoluteFill style={{opacity, transform: `translateX(${slide}px)`}}>
      {renderVisual()}
      {line.kind !== "phoneEnd" && line.kind !== "vehicles" && (
        <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.68) 0%,rgba(9,20,42,0.1) 34%,transparent 52%,rgba(9,20,42,0.22) 68%,rgba(9,20,42,0.88) 100%)"}} />
      )}
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 45%, transparent 42%, rgba(9,20,42,0.38) 100%)"}} />
      {line.kind === "privateTaxi" && (
        <div style={{position: "absolute", right: 54, top: 610, zIndex: 28, textAlign: "right"}}>
          <div style={{fontFamily: geistFamily, fontSize: 72, fontWeight: 900, color: teal, ...outline(10)}}>Private Taxi</div>
          <div style={{fontFamily: khmerFamily, fontSize: 34, fontWeight: 800, color: "#fff", marginTop: 10, ...outline(8)}}>ជិះតែគ្រួសារយើង</div>
        </div>
      )}
      {line.kind === "roadside" && (
        <>
          <StopPill icon="🍜" label="ញ៉ាំបាយ" left={62} top={560} />
          <StopPill icon="🚻" label="បន្ទប់ទឹក" left={62} top={700} />
        </>
      )}
      {line.kind === "priceQuestion" && (
        <div style={{position: "absolute", right: 54, top: 560, zIndex: 28, fontFamily: geistFamily, fontSize: 220, fontWeight: 900, color: teal, lineHeight: 0.9, ...outline(12)}}>$?</div>
      )}
      <Title line={line} />
      {line.id !== "t07" && <PersonSticker line={line} />}
    </AbsoluteFill>
  );
};

const Sfx: React.FC = () => {
  const cues: SfxCue[] = timeline.flatMap((l, i) => {
    const out: SfxCue[] = [];
    if (i > 0) out.push({frame: l.from, sfx: "whoosh", note: `to ${l.id}`, volume: 0.4});
    if (l.id !== "t07") out.push({frame: l.from + 8, sfx: "pop", note: `sticker ${l.sticker}`, volume: 0.52});
    if (l.kind === "vehicles") {
      for (const label of ["Sedan", "SUV", "MPV", "Van"]) {
        const found = l.segs.find(([w]) => w.replace(/[!,.]/g, "") === label);
        if (found) out.push({frame: l.from + Math.round(found[1] * 30), sfx: "pop", note: `car ${label}`, volume: 0.5});
      }
    }
    if (l.id === "t09") out.push({frame: l.from + 20, sfx: "coin", note: "from $65", volume: 0.45});
    if (l.id === "t12") out.push({frame: l.from + 54, sfx: "tap", note: "Book Now", volume: 0.75});
    return out;
  });
  return <SfxTrack cues={cues} />;
};

const Film: React.FC = () => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const t12 = timeline.find((l) => l.id === "t12")!;
  const endCardStart = t12.from + t12.duration * 0.62;
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
          <Audio src={staticFile(`voice/taxi-family/${l.id}.mp3`)} />
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

export const TaxiFamilyKhVideo: React.FC = () => <Film />;
