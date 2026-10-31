import type React from "react";
import {Audio, getInputProps, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {clamp, ease, geistFamily, navy, sun, teal} from "../brand";
import {timeline, totalFrames} from "./narration";
import {chunkStarts} from "../01-private-airport-kh/voice-cues";

const isStem = (s: unknown) => s === "music" || s === "sfx";

export const VoiceTracks: React.FC = () => {
  if (isStem(getInputProps().stem)) return null;
  return (
    <>
      {timeline.map((l) => (
        <Sequence key={l.id} from={l.voiceFrom} durationInFrames={l.audioFrames + 4} name={`Voice ${l.id}`} layout="none">
          <Audio src={staticFile(`voice/${l.src}.mp3`)} />
        </Sequence>
      ))}
    </>
  );
};

// Music bed (copied from Rentmee's reel bed), low under voice, ducked further while she talks.
const bedLevel = 0.2;
const underVoice = 0.45;
export const MusicBed: React.FC = () => {
  const {fps} = useVideoConfig();
  if (getInputProps().stem === "sfx") return null;
  return (
    <Audio
      src={staticFile("music/veha-bed.wav")}
      loop
      volume={(f) => {
        const duck = timeline.reduce(
          (g, l) => Math.min(g, interpolate(f, [l.voiceFrom - 6, l.voiceFrom, l.voiceFrom + l.audioFrames, l.voiceFrom + l.audioFrames + 10], [1, underVoice, underVoice, 1], clamp)),
          1,
        );
        return interpolate(f, [0, fps * 0.5, totalFrames - fps, totalFrames - 1], [0, bedLevel, bedLevel, 0], clamp) * duck;
      }}
    />
  );
};

// Caption = whole spoken line; phrases light up on KiriTTS forced-alignment timings (voice-cues.ts).
export const Captions: React.FC<{readonly vertical: boolean}> = ({vertical}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const line = timeline.find((l) => frame >= l.voiceFrom - 4 && frame < l.voiceFrom + l.audioFrames + 8);
  if (!line) return null;
  const words = line.khmer.split(" ");
  const local = frame - line.voiceFrom;
  const opacity = interpolate(local, [-4, 2, line.audioFrames + 2, line.audioFrames + 8], [0, 1, 1, 0], clamp);
  const lift = interpolate(local, [-4, 6], [24, 0], {...clamp, easing: ease});
  const starts = chunkStarts(line.id, line.khmer, fps);
  return (
    <div style={{position: "absolute", left: vertical ? 50 : 200, right: vertical ? 50 : 200, bottom: vertical ? 270 : 40, display: "flex", justifyContent: "center", opacity, translate: `0px ${lift}px`, zIndex: 50}}>
      <div style={{padding: vertical ? "16px 34px 18px" : "10px 34px 12px", borderRadius: 28, background: "rgba(17,31,64,0.93)", boxShadow: "0 18px 44px rgba(17,31,64,0.3)", textAlign: "center", borderBottom: `6px solid ${teal}`}}>
        <div style={{fontFamily: geistFamily, fontWeight: 700, fontSize: vertical ? 44 : 38, lineHeight: 1.6, color: "#fff"}}>
          {words.map((w, i) => (
            <span key={i} style={{color: local >= starts[i] ? (/dollars|fifteen|forty-five|sixty-five|vehabooking|dot|com/.test(w) ? sun : "#FFFFFF") : "rgba(255,255,255,0.4)"}}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProgressRail: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 10, background: "rgba(27,49,96,0.12)", zIndex: 60}}>
      <div style={{width: `${(frame / totalFrames) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${teal}, ${navy})`}} />
    </div>
  );
};
