import timingJson from "./timing.json";

type TimingEntry = {readonly audioFrames: number; readonly segs: ReadonlyArray<readonly [string, number, number]>};
const timing = timingJson as unknown as Record<string, TimingEntry>;

// B = husband (KiriTTS clone "Veha", stickers/people/b) · C = wife (KiriTTS clone "Sokhom", stickers/people/woman)
export type Speaker = "B" | "C";
export type LineId = "s01" | "s02" | "s03" | "s04" | "s05" | "s06" | "s07";

export type Line = {
  readonly id: LineId;
  readonly speaker: Speaker;
  readonly sticker: string;
  // optional sticker swap: [seconds into the voice, sticker]
  readonly swap?: readonly [number, string];
  readonly audioFrames: number;
  readonly segs: ReadonlyArray<readonly [string, number, number]>;
};

export type Timed = Line & {readonly from: number; readonly duration: number; readonly voiceFrom: number};

export const LEAD = 6, VOICE_IN = 4, TAIL = 8;
// End-card narrator (KiriTTS library voice "Oudom"): starts NARR_IN frames into the end card, card holds END_HOLD frames after it ends.
export const NARR_IN = 24, END_HOLD = 100;
export const narrationFrames = timing.n01.audioFrames;
export const END_CARD = NARR_IN + narrationFrames + END_HOLD;

const t = (id: LineId) => ({audioFrames: timing[id].audioFrames, segs: timing[id].segs});

export const lines: readonly Line[] = [
  {id: "s01", speaker: "C", sticker: "thinking", ...t("s01")},
  {id: "s02", speaker: "B", sticker: "hah", ...t("s02")},
  {id: "s03", speaker: "C", sticker: "worried", ...t("s03")},
  {id: "s04", speaker: "B", sticker: "scratch-head", ...t("s04")},
  {id: "s05", speaker: "C", sticker: "show-phone", ...t("s05")},
  {id: "s06", speaker: "B", sticker: "wow", ...t("s06")},
  {id: "s07", speaker: "C", sticker: "happy", swap: [9.29, "thumbsup"], ...t("s07")},
];

export const timeline: readonly Timed[] = (() => {
  let at = 0;
  return lines.map((l, i) => {
    const lead = i === 0 ? LEAD : 0;
    const duration = lead + VOICE_IN + l.audioFrames + TAIL;
    const from = at;
    at += duration;
    return {...l, from, duration, voiceFrom: from + lead + VOICE_IN};
  });
})();

const last = timeline[timeline.length - 1];
export const endCardFrom = last.from + last.duration;
export const totalFrames = endCardFrom + END_CARD;
export const narrationFrom = endCardFrom + NARR_IN;
