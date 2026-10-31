import type React from "react";
import {Audio, getInputProps, Sequence, staticFile} from "remotion";

export type SfxName = "tap" | "pop" | "whoosh" | "type" | "tick" | "ding" | "coin" | "scan" | "key" | "paper" | "scribble" | "buzz";
// Absolute frame in the full film, the effect, what it marks.
export type SfxCue = {readonly frame: number; readonly sfx: SfxName; readonly note: string; readonly volume?: number};

const level: Record<SfxName, number> = {tap: 1, pop: 0.95, whoosh: 0.75, type: 0.75, tick: 0.75, ding: 1, coin: 1, scan: 0.9, key: 0.9, paper: 0.8, scribble: 0.85, buzz: 0.9};

export const SfxTrack: React.FC<{readonly cues: readonly SfxCue[]}> = ({cues}) =>
  getInputProps().stem === "music" ? null : (
    <>
      {cues.map((c, i) => (
        <Sequence key={`${c.frame}-${c.sfx}-${i}`} from={c.frame} durationInFrames={36} name={`SFX ${c.sfx} · ${c.note}`} layout="none">
          <Audio src={staticFile(`sfx/${c.sfx}.wav`)} volume={(c.volume ?? 1) * level[c.sfx]} />
        </Sequence>
      ))}
    </>
  );
