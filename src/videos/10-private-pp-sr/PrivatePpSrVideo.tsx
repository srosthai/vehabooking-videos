import React from "react";
import {AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {Card, clamp, geistFamily, khmerFamily, Logo, navy, teal} from "../brand";
import {SfxTrack, type SfxCue} from "../sfx";
import {timeline, totalFrames, type Timed} from "./narration";

const outline = (w: number): React.CSSProperties => ({WebkitTextStroke: `${w}px ${navy}`, paintOrder: "stroke fill", textShadow: "0 6px 18px rgba(0,0,0,0.45)"});

const Photo: React.FC<{readonly src: string; readonly duration: number; readonly index: number; readonly zoom?: number; readonly pan?: number}> = ({src, duration, index, zoom = 0.1, pan = 18}) => {
  const f = useCurrentFrame();
  const p = Math.min(1, Math.max(0, f / Math.max(1, duration - 1)));
  const scale = 1.08 + p * zoom;
  const dir = index % 2 ? 1 : -1;
  const x = dir * interpolate(p, [0, 1], [-pan, pan]);
  const y = interpolate(p, [0, 1], [-10, 14]);
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      {src.startsWith("cars/") ? (
        <>
          <Img src={staticFile("real/nr6.jpg")} style={{width: "100%", height: "100%", objectFit: "cover", filter: "blur(6px) brightness(0.85)", transform: `scale(${scale + 0.05})`}} />
          <Img src={staticFile(`real/${src}.png`)} style={{position: "absolute", left: "4%", width: "92%", top: "38%", height: "34%", objectFit: "contain", filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.5))", transform: `scale(${scale}) translate(${x}px,0px)`}} />
        </>
      ) : src === "bus-coach.png" ? (
        <>
          <Img src={staticFile("real/bus-coach.png")} style={{width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px) brightness(0.7)", transform: `scale(${scale + 0.1})`}} />
          <Img src={staticFile("real/bus-coach.png")} style={{position: "absolute", left: "-14%", width: "128%", top: "30%", height: "auto", borderRadius: 0, filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.5))", transform: `scale(${scale}) translate(${-60 + x * 0.5}px,0px)`}} />
        </>
      ) : (
        <Img src={staticFile(src.includes(".") ? `real/${src}` : `real/${src}.jpg`)} style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale}) translate(${x}px,${y}px)`}} />
      )}
    </AbsoluteFill>
  );
};

const PersonSticker: React.FC<{readonly line: Timed}> = ({line}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 6, fps, config: {damping: 10, stiffness: 170, mass: 0.7}});
  const tilt = line.speaker === "A" ? -6 : 6;
  const bob = Math.sin(f / 14) * 8;
  const side: React.CSSProperties = line.speaker === "A" ? {left: 20} : {right: 20};
  return (
    <div style={{position: "absolute", top: 960, width: 420, ...side, scale: String(Math.max(0, s)), rotate: `${tilt * (1 - s) + tilt * 0.4}deg`, translate: `0px ${bob}px`, filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.38))", zIndex: 20}}>
      <Img src={staticFile(`stickers/people/${line.speaker.toLowerCase()}/${line.sticker}.png`)} style={{width: "100%"}} />
    </div>
  );
};

const Title: React.FC<{readonly line: Timed}> = ({line}) => (
  <div style={{position: "absolute", left: 50, right: 50, top: 170, textAlign: "center", zIndex: 30}}>
    <div style={{fontFamily: khmerFamily, fontSize: 84, fontWeight: 800, lineHeight: 1.32, color: "#fff", ...outline(14)}}>{line.title}</div>
  </div>
);

const priceFragment = (s: string) => /^\s*(ប្រាំ|ដុល្លារ|ប្រាំដុល្លារ)/.test(s);

type CaptionSeg = {text: string; start: number};

const buildCaptionSegs = (segs: ReadonlyArray<readonly [string, number]>): CaptionSeg[] => {
  const out: CaptionSeg[] = [];
  const push = (text: string, start: number) => {
    if (text) out.push({text, start});
  };
  for (let i = 0; i < segs.length; i++) {
    const [raw, st] = segs[i];
    if (raw.includes("ហុកសិប")) {
      const at = raw.indexOf("ហុកសិប");
      const prefix = raw.slice(0, at);
      if (prefix) {
        push(prefix, st);
        if (!/\s$/.test(prefix)) out[out.length - 1].text += " ";
      } else if (out.length && !/\s$/.test(out[out.length - 1].text)) {
        out[out.length - 1].text += " ";
      }
      push("$65 ", st);
      let j = i + 1;
      while (j < segs.length && priceFragment(segs[j][0])) j++;
      i = j - 1;
      continue;
    }
    push(raw, st);
  }
  return out
    .map(({text, start}) => ({
      text: /^\s*(ដត|ខម)[!។]?\s*$/.test(text) ? "" : text.replace(/vehabooking(\.com|\s*ដត\s*ខម)?/i, "vehabooking.com"),
      start,
    }))
    .filter((x) => x.text);
};

const Captions: React.FC<{readonly tl: readonly Timed[]}> = ({tl}) => {
  const frame = useCurrentFrame();
  const line = tl.find((l) => frame >= l.voiceFrom - 3 && frame < l.voiceFrom + l.audioFrames + 5);
  if (!line) return null;
  const local = frame - line.voiceFrom;
  const opacity = interpolate(local, [-3, 1, line.audioFrames + 1, line.audioFrames + 5], [0, 1, 1, 0], clamp);
  const display = buildCaptionSegs(line.segs);
  return (
    <div style={{position: "absolute", left: 50, right: 50, bottom: 260, textAlign: "center", opacity, zIndex: 50}}>
      <div style={{fontFamily: geistFamily, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: line.speaker === "A" ? "#7FE3D7" : "#FFC83D", marginBottom: 4, ...outline(8)}}>{line.speaker === "A" ? "● THAI" : "● VEHA"}</div>
      <div style={{fontFamily: khmerFamily, fontWeight: line.speaker === "A" ? 700 : 800, fontStyle: "normal", fontSize: line.speaker === "A" ? 56 : 60, lineHeight: 1.75, color: "#fff", ...outline(12)}}>
        {display.map(({text: w, start: st}, i) => {
          const s = st * 30;
          const pop = interpolate(local, [s, s + 3, s + 7], [1, 1.12, 1], clamp);
          const base = line.speaker === "A" ? "#FFFFFF" : "#FFE7A3";
          return (
            <React.Fragment key={i}>
              <span style={{color: local >= s ? teal : base, display: "inline-block", whiteSpace: "pre", scale: String(pop)}}>{w}</span>
              {(line.id === "p01" && w.startsWith("នេះ")) || (line.id === "p02" && w.startsWith("ណាស់")) || (line.id === "p07" && w.startsWith("ផ្ទះ")) || (line.id === "p08" && w.startsWith("បាយ")) || (line.id === "p09" && w.startsWith("រូប")) || (line.id === "p12" && w.startsWith("អញ្ចឹង")) ? <br /> : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const PriceCallout: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: f - 8, fps, config: {damping: 11, stiffness: 170, mass: 0.7}});
  return (
    <div style={{position: "absolute", left: "50%", top: 690, translate: "-50% 0", scale: String(Math.max(0, pop)), zIndex: 25}}>
      <div style={{display: "flex", alignItems: "center", gap: 18, padding: "24px 48px", borderRadius: 999, background: teal, border: "8px solid #fff", boxShadow: "0 30px 70px rgba(0,0,0,0.38)"}}>
        <span style={{fontFamily: khmerFamily, fontSize: 40, fontWeight: 800, color: navy}}>ចាប់ពី</span>
        <span style={{fontFamily: geistFamily, fontSize: 96, fontWeight: 900, color: navy, lineHeight: 1}}>$65</span>
      </div>
      <div style={{marginTop: 16, textAlign: "center", fontFamily: khmerFamily, fontSize: 28, fontWeight: 700, color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.6)"}}>ភ្នំពេញ → សៀមរាប</div>
    </div>
  );
};

const DoorChip: React.FC = () => (
  <div style={{position: "absolute", left: 50, right: 50, top: 540, display: "flex", justifyContent: "center", zIndex: 25}}>
    <div style={{padding: "14px 30px", borderRadius: 999, background: "rgba(255,255,255,0.92)", color: navy, fontFamily: khmerFamily, fontSize: 30, fontWeight: 800, boxShadow: "0 16px 34px rgba(0,0,0,0.25)"}}>ផ្ទះ → សណ្ឋាគារ</div>
  </div>
);

const CarCards: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rows: ReadonlyArray<readonly [string, string, string]> = [["sedan", "Sedan", "៤ កៅអី"], ["suv", "SUV", "៧ កៅអី"], ["mpv", "MPV", "៧ កៅអី"], ["van", "Van", "១៥ កៅអី"]];
  return (
    <>
      <AbsoluteFill style={{background: "linear-gradient(150deg,#111F40,#00877A)"}} />
      <Img src={staticFile("real/siemreap.jpg")} style={{width: "100%", height: "100%", objectFit: "cover", opacity: 0.18}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.55),rgba(9,20,42,0.25) 45%,rgba(9,20,42,0.75))"}} />
      {rows.map(([photo, label, seats], i) => {
        const s = spring({frame: f - (10 + i * 9), fps, config: {damping: 12, stiffness: 170, mass: 0.7}});
        return (
          <Card key={label} style={{position: "absolute", left: 70, top: 440 + i * 260, width: 560, height: 230, borderRadius: 28, overflow: "hidden", display: "flex", opacity: Math.min(1, s * 1.4), translate: `${(1 - s) * 140}px 0px`, scale: String(0.96 + s * 0.04), boxShadow: "0 24px 50px rgba(0,0,0,0.3)", zIndex: 20}}>
            <div style={{width: 250, height: "100%", background: "#EEF3F8", display: "flex", alignItems: "center", justifyContent: "center"}}><Img src={staticFile(`real/cars/${photo}.png`)} style={{width: 236, height: "90%", objectFit: "contain"}} /></div>
            <div style={{padding: "24px 26px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 8}}>
              <div style={{fontFamily: geistFamily, fontSize: 38, fontWeight: 900, color: navy}}>{label}</div>
              <div style={{fontFamily: khmerFamily, fontSize: 24, fontWeight: 700, color: "#5A6B85"}}>{seats}</div>
            </div>
          </Card>
        );
      })}
    </>
  );
};

const EndCard: React.FC = () => (
  <>
    <AbsoluteFill style={{background: "linear-gradient(140deg,rgba(17,31,64,0.95),rgba(0,135,122,0.88))"}} />
    <div style={{position: "absolute", left: 70, right: 70, top: 280, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, zIndex: 25}}>
      <Logo size={150} light />
      <div style={{fontFamily: geistFamily, fontSize: 58, fontWeight: 800, color: "#fff", letterSpacing: 0.5}}>vehabooking.com</div>
      <div style={{fontFamily: geistFamily, fontSize: 42, fontWeight: 700, color: "#fff"}}>+855 95 255 577</div>
      <div style={{marginTop: 8, padding: "20px 46px", borderRadius: 999, background: "#fff", color: navy, fontFamily: khmerFamily, fontSize: 40, fontWeight: 800, boxShadow: "0 20px 44px rgba(0,0,0,0.28)"}}>កក់ឥឡូវទៅ!</div>
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
      {line.kind === "cars" ? (
        <CarCards />
      ) : line.kind === "end" ? (
        <>
          <Photo src="bayon" duration={visualDuration} index={index} zoom={0.08} />
          <EndCard />
        </>
      ) : line.kind === "food" ? (
        <>
          <Photo src={line.photos[0]} duration={visualDuration} index={index} zoom={0.1} />
          <AbsoluteFill style={{opacity: cross}}><Photo src={line.photos[1] ?? "ricefield"} duration={visualDuration} index={index + 1} zoom={0.1} /></AbsoluteFill>
        </>
      ) : (
        <Photo src={line.photos[0]} duration={visualDuration} index={index} zoom={line.kind === "zoom" ? 0.18 : 0.1} />
      )}
      {line.kind !== "cars" && line.kind !== "end" && (
        <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.72) 0%,rgba(9,20,42,0.12) 34%,transparent 52%,rgba(9,20,42,0.2) 68%,rgba(9,20,42,0.86) 100%)"}} />
      )}
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 45%, transparent 42%, rgba(9,20,42,0.38) 100%)"}} />
      {line.kind === "price" && <PriceCallout />}
      {line.kind === "door" && <DoorChip />}
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
        return interpolate(f, [0, fps * 0.5, totalFrames - fps, totalFrames - 1], [0, 0.16, 0.16, 0], clamp) * duck;
      }} />
      {timeline.map((l) => (
        <Sequence key={`v-${l.id}`} from={l.voiceFrom} durationInFrames={l.audioFrames + 3} layout="none">
          <Audio src={staticFile(`voice/pp-sr/${l.id}.mp3`)} />
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

export const PrivatePpSrKhVideo: React.FC = () => <Film />;
