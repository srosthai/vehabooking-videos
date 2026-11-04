import React from "react";
import {AbsoluteFill, Audio, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {clamp, ease, Kh, khmerFamily, LangContext, Logo, navy, paper, Sticker, teal, tealDeep} from "../brand";
import {SfxTrack, type SfxCue} from "../sfx";
import {kh, type Timed} from "./narration";

const isStem = (s: unknown) => s === "music" || s === "sfx";

const extra: Record<string, ReadonlyArray<[number, SfxCue["sfx"], number?]>> = {
  g02: [[22, "ding", 0.7]], g03: [[20, "whoosh", 0.7]], g04: [[16, "whoosh", 0.8]], g05: [[20, "coin", 0.8]],
  g06: [[12, "tick"], [24, "tick"], [36, "tick"]], g07: [[20, "pop", 0.6], [34, "pop", 0.6]],
  g08: [[28, "ding", 0.8]], g09: [[52, "tap", 0.9]], g10: [[2, "pop"], [40, "scan", 0.5]],
};
const sfxCues = (tl: readonly Timed[]): SfxCue[] =>
  tl.flatMap((l, i) => {
    const list: SfxCue[] = [];
    if (i > 0) list.push({frame: l.from, sfx: "whoosh", note: `to ${l.id}`, volume: 0.45});
    list.push({frame: l.from + 8, sfx: "pop", note: `sticker ${l.sticker}`, volume: 0.6});
    for (const [d, s, v] of extra[l.id] ?? []) list.push({frame: l.from + d, sfx: s, note: l.id, volume: v ?? 0.7});
    return list;
  });

// No-box text: white fill, thick navy outline + soft shadow, painted stroke behind fill.
const outline = (w: number): React.CSSProperties => ({WebkitTextStroke: `${w}px ${navy}`, paintOrder: "stroke fill", textShadow: "0 6px 18px rgba(0,0,0,0.35)"});
const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: paper, overflow: "hidden"}}>
      <AbsoluteFill style={{backgroundImage: "radial-gradient(circle, rgba(27,49,96,0.10) 2.4px, transparent 2.9px)", backgroundSize: "52px 52px", backgroundPosition: `0px ${-f * 0.4}px`}} />
      <div style={{position: "absolute", left: width * 0.7 - 600, top: height * 0.2 - 600, width: 1200, height: 1200, borderRadius: 999, background: "radial-gradient(circle, rgba(43,168,216,0.22), rgba(43,168,216,0) 70%)", scale: String(1 + Math.sin(f / 40) * 0.06)}} />
    </AbsoluteFill>
  );
};

const Scene: React.FC<{readonly line: Timed; readonly index: number}> = ({line, index}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const vertical = height > width;
  const Stage = line.stage;
  const inT = interpolate(f, [0, 8], [0, 1], {...clamp, easing: ease});
  const out = interpolate(f, [line.duration - 5, line.duration], [1, 0], clamp);
  const sc = vertical ? 0.98 : 0.8;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{...(vertical ? {position: "absolute", left: 60, right: 60, top: 190, textAlign: "center"} : {position: "absolute", left: 1000, width: 820, top: 150}), opacity: inT, translate: `0px ${(1 - inT) * 24}px`}}>
        <div style={{fontFamily: "sans-serif", fontWeight: 800, fontSize: 30, letterSpacing: 4, color: "#fff", ...outline(8)}}>{String(index + 1).padStart(2, "0")} · FERRY</div>
        <Kh size={vertical ? 86 : 92} color="#fff" style={{marginTop: 4, ...outline(14)}}>{line.title}</Kh>
      </div>
      <div style={{position: "absolute", left: vertical ? (width - 1000 * sc) / 2 : 110, top: vertical ? 400 : 70, width: 1000, height: 1000, scale: String(sc * (0.95 + 0.05 * inT)), transformOrigin: "0 0"}}><Stage /></div>
      <div style={vertical ? {position: "absolute", right: 10, top: 1080} : {position: "absolute", left: 1240, top: 420}}>
        <Sticker key={line.id} name={line.sticker} size={vertical ? 300 : 440} delay={5} tilt={index % 2 ? 10 : -10} />
      </div>
    </AbsoluteFill>
  );
};

const Captions: React.FC<{readonly tl: readonly Timed[]; readonly vertical: boolean}> = ({tl, vertical}) => {
  const frame = useCurrentFrame();
  const line = tl.find((l) => frame >= l.voiceFrom - 3 && frame < l.voiceFrom + l.audioFrames + 5);
  if (!line) return null;
  const local = frame - line.voiceFrom;
  const opacity = interpolate(local, [-3, 1, line.audioFrames + 1, line.audioFrames + 5], [0, 1, 1, 0], clamp);
  return (
    <div style={{position: "absolute", left: vertical ? 50 : 200, right: vertical ? 50 : 200, bottom: vertical ? 250 : 40, textAlign: "center", opacity, zIndex: 50}}>
      <div style={{fontFamily: khmerFamily, fontWeight: 800, fontSize: vertical ? 56 : 44, lineHeight: 1.75, color: "#fff", ...outline(12)}}>
        {line.segs.map(([w, st], i) => {
          const s = st * 30;
          const pop = interpolate(local, [s, s + 3, s + 7], [1, 1.12, 1], clamp);
          return <span key={i} style={{color: local >= s ? teal : "#fff", display: "inline-block", whiteSpace: "pre", scale: String(pop)}}>{w}</span>;
        })}
      </div>
    </div>
  );
};

const Film: React.FC<{readonly track: {readonly timeline: readonly Timed[]; readonly totalFrames: number}}> = ({track}) => {
  const {width, height, fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const vertical = height > width;
  const {timeline, totalFrames} = track;
  const cues = React.useMemo(() => sfxCues(timeline), [timeline]);
  const stem = getInputProps().stem;
  return (
    <LangContext.Provider value="kh">
      <AbsoluteFill style={{background: paper}}>
        <Backdrop />
        {stem !== "sfx" && (
          <Audio src={staticFile("music/veha-bed.wav")} loop volume={(f) => {
            const duck = timeline.reduce((g, l) => Math.min(g, interpolate(f, [l.voiceFrom - 4, l.voiceFrom, l.voiceFrom + l.audioFrames, l.voiceFrom + l.audioFrames + 6], [1, 0.5, 0.5, 1], clamp)), 1);
            return interpolate(f, [0, fps * 0.5, totalFrames - fps, totalFrames - 1], [0, 0.22, 0.22, 0], clamp) * duck;
          }} />
        )}
        {!isStem(stem) && timeline.map((l) => (
          <Sequence key={`v${l.id}`} from={l.voiceFrom} durationInFrames={l.audioFrames + 3} layout="none"><Audio src={staticFile(`voice/${l.src}.mp3`)} /></Sequence>
        ))}
        <SfxTrack cues={cues} />
        {timeline.map((l, i) => (
          <Sequence key={l.id} from={l.from} durationInFrames={l.duration} name={`${l.id} · ${l.title}`} premountFor={20}><Scene line={l} index={i} /></Sequence>
        ))}
        <div style={{position: "absolute", left: vertical ? 60 : 70, top: vertical ? 60 : 30, scale: vertical ? "1" : "0.8", transformOrigin: "0 0"}}><Logo size={80} /></div>
        <div style={{position: "absolute", right: vertical ? 60 : 70, top: vertical ? 78 : 40, fontFamily: "sans-serif", fontWeight: 700, fontSize: 26, color: tealDeep}}>vehabooking.com</div>
        <Captions tl={timeline} vertical={vertical} />
        <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 10, background: "rgba(27,49,96,0.12)", zIndex: 60}}>
          <div style={{width: `${(frame / totalFrames) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${teal}, ${navy})`}} />
        </div>
      </AbsoluteFill>
    </LangContext.Provider>
  );
};

export const Ferry03KhVideo: React.FC = () => <Film track={kh} />;
