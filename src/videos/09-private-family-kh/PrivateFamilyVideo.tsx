import React from "react";
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {clamp, geistFamily, khmerFamily, paper, teal} from "../brand";
import {SfxTrack, type SfxCue} from "../sfx";
import {timeline, totalFrames, type Shot, type Timed} from "./narration";
import {CarLineupDad, CarLineupGirl, Confirm, HouseArrival, KampotDad, KampotEnd, LivingDad, LivingGirl, LivingMomPhone, LivingWide, PhoneBook, PhoneRoute, RoadStopGirl, RoadStopMom} from "./scenes";
import {TopBar} from "./world";

const SHOTS: Record<Shot, React.FC> = {
  LivingWide, LivingDad, LivingGirl, LivingMomPhone, PhoneRoute, CarLineupDad, CarLineupGirl,
  PhoneBook, Confirm, HouseArrival, RoadStopGirl, RoadStopMom, KampotDad, KampotEnd,
};
const PUSH: Record<Shot, number> = {
  LivingWide: 0.035, LivingDad: 0.065, LivingGirl: 0.06, LivingMomPhone: 0.06, PhoneRoute: 0.04,
  CarLineupDad: 0.055, CarLineupGirl: 0.06, PhoneBook: 0.04, Confirm: 0.045, HouseArrival: 0.045,
  RoadStopGirl: 0.04, RoadStopMom: 0.06, KampotDad: 0.045, KampotEnd: 0.035,
};

const extra: Record<string, ReadonlyArray<[number, SfxCue["sfx"], number?]>> = {
  m3: [[58, "coin", 0.6]],
  m4: [[42, "tap", 0.85]],
  d3: [[4, "ding", 0.5], [8, "scan", 0.3]],
  d4: [[2, "whoosh", 0.6]],
  c3: [[10, "scan", 0.55], [18, "pop", 0.5]],
  d5: [[2, "ding", 0.4]],
  m6: [[2, "pop", 0.5], [120, "scan", 0.35]],
};
const cues = (tl: readonly Timed[]): SfxCue[] =>
  tl.flatMap((l, i) => {
    const list: SfxCue[] = [{frame: l.from + 2, sfx: "pop", note: `line ${l.id}`, volume: 0.16}];
    if (i > 0 && l.scene !== tl[i - 1].scene) list.push({frame: l.from, sfx: "whoosh", note: `to ${l.scene}`, volume: 0.32});
    for (const [d, s, v] of extra[l.id] ?? []) list.push({frame: l.from + d, sfx: s, note: l.id, volume: v ?? 0.6});
    return list;
  });

const ShotFrame: React.FC<{readonly line: Timed; readonly visualDuration: number; readonly children: React.ReactNode}> = ({line, visualDuration, children}) => {
  const f = useCurrentFrame();
  const p = Math.min(1, Math.max(0, f / Math.max(1, visualDuration - 1)));
  const push = 1 + p * PUSH[line.shot];
  const dx = Math.sin(f / 47) * 5;
  const dy = Math.sin(f / 39) * 4;
  const opacity = interpolate(f, [0, 5, visualDuration - 8, visualDuration], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity, transform: `scale(${push}) translate(${dx}px, ${dy}px)`, transformOrigin: "50% 48%"}}>
      {children}
    </AbsoluteFill>
  );
};

const CaptionCard: React.FC<{readonly line: Timed}> = ({line}) => {
  const f = useCurrentFrame();
  const local = f - line.voiceFrom;
  const opacity = interpolate(local, [-3, 1, line.audioFrames + 1, line.audioFrames + 6], [0, 1, 1, 0], clamp);
  const accent = line.color;
  return (
    <div style={{position: "absolute", left: 50, right: 50, bottom: 70, opacity, zIndex: 80}}>
      <div style={{borderRadius: 34, padding: "24px 30px 28px", background: "linear-gradient(160deg,rgba(17,31,64,0.94),rgba(11,22,46,0.92))", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 30px 70px rgba(0,0,0,0.42)", backdropFilter: "blur(16px)"}}>
        <div style={{display: "flex", alignItems: "center", gap: 14, marginBottom: 12}}>
          <div style={{padding: "6px 18px", borderRadius: 999, background: accent, color: "#fff", fontFamily: khmerFamily, fontSize: 22, fontWeight: 800, boxShadow: `0 8px 20px ${accent}55`}}>{line.label}</div>
          <div style={{fontFamily: geistFamily, fontSize: 18, fontWeight: 800, letterSpacing: 2.4, color: "rgba(255,255,255,0.44)"}}>PRIVATE CAR · FAMILY</div>
        </div>
        <div style={{fontFamily: khmerFamily, fontSize: 45, lineHeight: 1.62, color: "#fff", fontWeight: 700}}>
          {line.segs.map(([w, st], i) => {
            const s = st * 30;
            const live = local >= s;
            const price = /\$|ដុល្លារ|vehabooking|Book|Now|Van|42|45|30/.test(w);
            return <span key={i} style={{color: live ? (price ? "#FFD36B" : teal) : "#fff", textShadow: live ? `0 0 22px ${price ? "#FFC83D" : teal}55` : undefined, display: "inline-block", whiteSpace: "pre", scale: String(interpolate(local, [s, s + 3, s + 7], [1, 1.04, 1], clamp))}}>{w}</span>;
          })}
        </div>
      </div>
    </div>
  );
};

const Film: React.FC = () => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const current = timeline.find((l) => frame >= l.from && frame < l.from + l.duration) ?? timeline[timeline.length - 1];
  const caption = timeline.find((l) => frame >= l.voiceFrom - 3 && frame < l.voiceFrom + l.audioFrames + 6);
  return (
    <AbsoluteFill style={{background: paper}}>
      <AbsoluteFill style={{background: "linear-gradient(180deg,#F9E7D2,#E8C8A8)"}} />
      {timeline.map((l) => {
        const Stage = SHOTS[l.shot];
        const visualDuration = l.duration + 8;
        return (
          <Sequence key={l.id} from={l.from} durationInFrames={visualDuration} name={`${l.id} · ${l.shot}`} premountFor={24}>
            <ShotFrame line={l} visualDuration={visualDuration}><Stage /></ShotFrame>
          </Sequence>
        );
      })}
      <Audio src={staticFile("music/veha-bed.wav")} loop volume={(f) => {
        const duck = timeline.reduce((g, l) => Math.min(g, interpolate(f, [l.voiceFrom - 5, l.voiceFrom, l.voiceFrom + l.audioFrames, l.voiceFrom + l.audioFrames + 8], [1, 0.42, 0.42, 1], clamp)), 1);
        return interpolate(f, [0, fps * 0.7, totalFrames - fps, totalFrames - 1], [0, 0.16, 0.16, 0], clamp) * duck;
      }} />
      {timeline.map((l) => (
        <Sequence key={`v-${l.id}`} from={l.voiceFrom} durationInFrames={l.audioFrames + 3} layout="none">
          <Audio src={staticFile(`voice/private-family/${l.id}.mp3`)} volume={1.06} />
        </Sequence>
      ))}
      <SfxTrack cues={cues(timeline)} />
      <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(255,200,120,0.08),rgba(17,31,64,0.1))", mixBlendMode: "overlay", pointerEvents: "none"}} />
      <div style={{position: "absolute", top: -200, bottom: -200, left: (((frame % 210) / 210) * 1500) - 450, width: 320, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)", transform: "rotate(12deg)", filter: "blur(24px)", mixBlendMode: "screen", pointerEvents: "none", opacity: 0.5}} />
      <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 190, background: "linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0))", pointerEvents: "none"}} />
      <TopBar location={current.sceneLabel} progress={(frame / totalFrames) * 100} />
      {caption && <CaptionCard line={caption} />}
      <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 420, background: "linear-gradient(0deg,rgba(9,20,42,0.30),transparent)", pointerEvents: "none"}} />
      <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: "rgba(9,20,42,0.22)", zIndex: 90}}>
        <div style={{width: `${(frame / totalFrames) * 100}%`, height: "100%", background: `linear-gradient(90deg,${teal},#FFC83D)`}} />
      </div>
    </AbsoluteFill>
  );
};

export const PrivateFamilyKhVideo: React.FC = () => <Film />;
