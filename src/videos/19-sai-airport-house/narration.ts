import timingJson from "./timing.json";

type TimingEntry = {readonly audioFrames: number; readonly segs: ReadonlyArray<readonly [string, number, number, boolean]>};
const timing = timingJson as unknown as Record<string, TimingEntry>;

// B = husband (KiriTTS clone "Veha") · C = wife (KiriTTS clone "Sokhom").
export type Speaker = "B" | "C";
export type LineId = "s01" | "s02" | "s03" | "s04" | "s05" | "s06" | "s07" | "s08" | "s09";

export type Line = {
  readonly id: LineId;
  readonly speaker: Speaker;
  readonly sticker: string;
  // optional sticker swap: [seconds into the voice, sticker]
  readonly swap?: readonly [number, string];
  readonly audioFrames: number;
  readonly segs: ReadonlyArray<readonly [string, number, number, boolean]>;
};

export type Timed = Line & {readonly from: number; readonly duration: number; readonly voiceFrom: number};

const segSec = (id: LineId, text: string) => timing[id].segs.find((s) => s[0] === text)?.[1] ?? 0;

export const LEAD = 4, VOICE_IN = 3, TAIL = 6;
// End-card narrator (KiriTTS library voice "Oudom"): starts NARR_IN frames into the end card, card holds END_HOLD frames after it ends.
export const NARR_IN = 24, END_HOLD = 100;
export const narrationFrames = timing.n01.audioFrames;
export const END_CARD = NARR_IN + narrationFrames + END_HOLD;

const t = (id: LineId) => ({audioFrames: timing[id].audioFrames, segs: timing[id].segs});

export const lines: readonly Line[] = [
  {id: "s01", speaker: "B", sticker: "arrive-look", ...t("s01")},
  {id: "s02", speaker: "C", sticker: "shrug-casual", ...t("s02")},
  {id: "s03", speaker: "B", sticker: "worried-queue", ...t("s03")},
  {id: "s04", speaker: "C", sticker: "tired-sigh", ...t("s04")},
  {id: "s05", speaker: "B", sticker: "show-phone-dark", ...t("s05")},
  {id: "s06", speaker: "C", sticker: "hopeful-clasp", ...t("s06")},
  {id: "s07", speaker: "B", sticker: "explain-welcome", swap: [segSec("s07", "គឺ"), "ok-done"], ...t("s07")},
  {id: "s08", speaker: "C", sticker: "spot-point", swap: [segSec("s08", "ស្រួលខ្លួន"), "relieved-smile"], ...t("s08")},
  {id: "s09", speaker: "B", sticker: "relaxed-thumbsup", ...t("s09")},
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
