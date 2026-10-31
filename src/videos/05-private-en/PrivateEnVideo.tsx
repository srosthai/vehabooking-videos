import type React from "react";
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig} from "remotion";
import {clamp, ease, Kh, LangContext, Logo, navy, paper, Sticker, teal, tealDeep} from "../brand";
import {SfxTrack} from "../sfx";
import {Captions, MusicBed, ProgressRail, VoiceTracks} from "./layers";
import {timeline, type Timed} from "./narration";
import {cues} from "./sfx-cues";

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: paper, overflow: "hidden"}}>
      <AbsoluteFill style={{backgroundImage: "radial-gradient(circle, rgba(27,49,96,0.10) 2.4px, transparent 2.9px)", backgroundSize: "52px 52px", backgroundPosition: `0px ${-f * 0.4}px`}} />
      <div style={{position: "absolute", left: width * 0.7 - 600, top: height * 0.2 - 600, width: 1200, height: 1200, borderRadius: 999, background: "radial-gradient(circle, rgba(0,179,159,0.22), rgba(0,179,159,0) 70%)", scale: String(1 + Math.sin(f / 40) * 0.06)}} />
      <div style={{position: "absolute", left: -400, top: height - 500, width: 1000, height: 1000, borderRadius: 999, background: "radial-gradient(circle, rgba(27,49,96,0.14), rgba(27,49,96,0) 70%)"}} />
    </AbsoluteFill>
  );
};

const Scene: React.FC<{readonly line: Timed; readonly index: number}> = ({line, index}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const vertical = height > width;
  const Stage = line.stage;
  const inT = interpolate(f, [0, 12], [0, 1], {...clamp, easing: ease});
  const out = interpolate(f, [line.duration - 8, line.duration], [1, 0], clamp);
  const stageScale = vertical ? 0.98 : 0.8;
  const stageLeft = vertical ? (width - 1000 * stageScale) / 2 : 110;
  const stageTop = vertical ? 400 : 70;
  const titleStyle: React.CSSProperties = vertical
    ? {position: "absolute", left: 60, right: 60, top: 190, textAlign: "center"}
    : {position: "absolute", left: 1000, width: 820, top: 150};
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{...titleStyle, opacity: inT, translate: `0px ${(1 - inT) * 30}px`}}>
        <div style={{display: "inline-block", padding: "4px 22px", borderRadius: 999, background: teal, color: "#fff", fontFamily: "sans-serif", fontWeight: 700, fontSize: 26, letterSpacing: 3}}>
          {String(index + 1).padStart(2, "0")} · {line.tag}
        </div>
        <Kh size={vertical ? 84 : 92} color={navy} style={{marginTop: 4}}>{line.title}</Kh>
      </div>
      <div style={{position: "absolute", left: stageLeft, top: stageTop, width: 1000, height: 1000, scale: String(stageScale * (0.94 + 0.06 * inT)), transformOrigin: "0 0"}}>
        <Stage />
      </div>
      <div style={vertical ? {position: "absolute", right: 30, top: 1030} : {position: "absolute", left: 1240, top: 420}}>
        <Sticker key={line.id} name={line.sticker} size={vertical ? 330 : 440} delay={10} tilt={index % 2 ? 10 : -10} />
      </div>
    </AbsoluteFill>
  );
};

export const PrivateEnVideo: React.FC = () => {
  const {width, height} = useVideoConfig();
  const vertical = height > width;
  return (
    <LangContext.Provider value="en">
    <AbsoluteFill style={{background: paper}}>
      <Backdrop />
      <MusicBed />
      <VoiceTracks />
      <SfxTrack cues={cues} />
      {timeline.map((l, i) => (
        <Sequence key={l.id} from={l.from} durationInFrames={l.duration} name={`${l.id} · ${l.title}`} premountFor={30}>
          <Scene line={l} index={i} />
        </Sequence>
      ))}
      <div style={{position: "absolute", left: vertical ? 60 : 70, top: vertical ? 60 : 30, scale: vertical ? "1" : "0.8", transformOrigin: "0 0"}}>
        <Logo size={80} />
      </div>
      <div style={{position: "absolute", right: vertical ? 60 : 70, top: vertical ? 78 : 40, fontFamily: "sans-serif", fontWeight: 700, fontSize: 26, color: tealDeep}}>vehabooking.com</div>
      <Captions vertical={vertical} />
      <ProgressRail />
    </AbsoluteFill>
    </LangContext.Provider>
  );
};
