import timingJson from "./timing.json";

type TimingEntry = {readonly audioFrames: number; readonly segs: ReadonlyArray<readonly [string, number]>};
const timing = timingJson as unknown as Record<string, TimingEntry>;

export type Speaker = "A" | "B" | "C" | "N";
export type StickerName = "hah" | "happy" | "thinking" | "thumbsup" | "what" | "wow";
export type SceneId = "s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7";

export type Line = {
  readonly id: string;
  readonly speaker: Speaker;
  readonly sticker: StickerName;
  readonly scene: SceneId;
  readonly showSticker: boolean;
  readonly preDelay?: number;
  readonly audioFrames: number;
  readonly segs: ReadonlyArray<readonly [string, number]>;
};

export type Timed = Line & {
  readonly from: number;
  readonly duration: number;
  readonly voiceFrom: number;
  readonly sceneStart: number;
  readonly sceneEnd: number;
};

export const LEAD = 6, VOICE_IN = 3, TAIL = 4, END_HOLD = 90;

export const lines: readonly Line[] = [
  {id: "c01", speaker: "C", sticker: "thinking", scene: "s1", showSticker: true, preDelay: 51, audioFrames: timing.c01.audioFrames, segs: timing.c01.segs},
  {id: "c02", speaker: "B", sticker: "happy", scene: "s1", showSticker: true, audioFrames: timing.c02.audioFrames, segs: timing.c02.segs},
  {id: "c03", speaker: "C", sticker: "what", scene: "s2", showSticker: true, audioFrames: timing.c03.audioFrames, segs: timing.c03.segs},
  {id: "c04", speaker: "B", sticker: "what", scene: "s3", showSticker: true, audioFrames: timing.c04.audioFrames, segs: timing.c04.segs},
  {id: "c05", speaker: "C", sticker: "what", scene: "s4", showSticker: true, preDelay: 26, audioFrames: timing.c05.audioFrames, segs: timing.c05.segs},
  {id: "c06", speaker: "B", sticker: "happy", scene: "s4", showSticker: true, audioFrames: timing.c06.audioFrames, segs: timing.c06.segs},
  {id: "c07", speaker: "C", sticker: "wow", scene: "s4", showSticker: true, audioFrames: timing.c07.audioFrames, segs: timing.c07.segs},
  {id: "c08", speaker: "A", sticker: "happy", scene: "s4", showSticker: true, audioFrames: timing.c08.audioFrames, segs: timing.c08.segs},
  {id: "c09", speaker: "C", sticker: "happy", scene: "s5", showSticker: true, audioFrames: timing.c09.audioFrames, segs: timing.c09.segs},
  {id: "c10", speaker: "C", sticker: "thinking", scene: "s6", showSticker: true, audioFrames: timing.c10.audioFrames, segs: timing.c10.segs},
  {id: "c11", speaker: "B", sticker: "happy", scene: "s6", showSticker: true, audioFrames: timing.c11.audioFrames, segs: timing.c11.segs},
  {id: "c12", speaker: "C", sticker: "wow", scene: "s6", showSticker: true, audioFrames: timing.c12.audioFrames, segs: timing.c12.segs},
  {id: "c13", speaker: "N", sticker: "happy", scene: "s7", showSticker: false, preDelay: 10, audioFrames: timing.c13.audioFrames, segs: timing.c13.segs},
];

const base: Array<Line & {from: number; duration: number; voiceFrom: number}> = (() => {
  let t = 0;
  return lines.map((l, i) => {
    const lead = i === 0 ? LEAD : 0;
    const duration = lead + (l.preDelay ?? 0) + VOICE_IN + l.audioFrames + TAIL + (i === lines.length - 1 ? END_HOLD : 0);
    const from = t;
    t += duration;
    return {...l, from, duration, voiceFrom: from + lead + (l.preDelay ?? 0) + VOICE_IN};
  });
})();

export const timeline: readonly Timed[] = base.map((l) => {
  const sceneLines = base.filter((x) => x.scene === l.scene);
  const first = sceneLines[0];
  const last = sceneLines[sceneLines.length - 1];
  return {...l, sceneStart: first.from, sceneEnd: last.from + last.duration};
});

export const totalFrames = timeline[timeline.length - 1].from + timeline[timeline.length - 1].duration;

export const scenes = (["s1", "s2", "s3", "s4", "s5", "s6", "s7"] as const).map((id) => {
  const ls = timeline.filter((l) => l.scene === id);
  return {id, from: ls[0].sceneStart, to: ls[0].sceneEnd, duration: ls[0].sceneEnd - ls[0].sceneStart, lines: ls};
});
