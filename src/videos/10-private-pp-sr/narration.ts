import timingJson from "./timing.json";

type TimingEntry = {readonly audioFrames: number; readonly segs: ReadonlyArray<readonly [string, number]>};
const timing = timingJson as unknown as Record<string, TimingEntry>;

export type Speaker = "A" | "B";
export type PersonSticker = "laugh" | "thinking" | "what" | "hah" | "wow" | "thumbsup" | "happy";
export type SceneKind = "photo" | "zoom" | "price" | "door" | "food" | "cars" | "end";

export type Line = {
  readonly id: string;
  readonly speaker: Speaker;
  readonly sticker: PersonSticker;
  readonly title: string;
  readonly photos: readonly string[];
  readonly audioFrames: number;
  readonly segs: ReadonlyArray<readonly [string, number]>;
  readonly kind: SceneKind;
};

export type Timed = Line & {readonly from: number; readonly duration: number; readonly voiceFrom: number};

export const LEAD = 6, VOICE_IN = 3, TAIL = 4, END_HOLD = 36;

export const lines: readonly Line[] = [
  {id: "p01", speaker: "A", sticker: "thinking", title: "ចង់ទៅសៀមរាប!", photos: ["siemreap"], audioFrames: timing.p01.audioFrames, segs: timing.p01.segs, kind: "photo"},
  {id: "p02", speaker: "A", sticker: "what", title: "ឡានក្រុង? ធុញហើយ!", photos: ["bus-coach.png"], audioFrames: timing.p02.audioFrames, segs: timing.p02.segs, kind: "photo"},
  {id: "p03", speaker: "B", sticker: "laugh", title: "ឡានឯកជន", photos: ["cars/sedan"], audioFrames: timing.p03.audioFrames, segs: timing.p03.segs, kind: "photo"},
  {id: "p04", speaker: "A", sticker: "laugh", title: "ថ្លៃអត់?", photos: ["cars/sedan"], audioFrames: timing.p04.audioFrames, segs: timing.p04.segs, kind: "zoom"},
  {id: "p05", speaker: "B", sticker: "laugh", title: "ចាប់ពី $65", photos: ["nr6"], audioFrames: timing.p05.audioFrames, segs: timing.p05.segs, kind: "price"},
  {id: "p06", speaker: "A", sticker: "laugh", title: "ថោកម្ល៉េះ!", photos: ["nr6"], audioFrames: timing.p06.audioFrames, segs: timing.p06.segs, kind: "photo"},
  {id: "p07", speaker: "B", sticker: "laugh", title: "Door to door", photos: ["hotel"], audioFrames: timing.p07.audioFrames, segs: timing.p07.segs, kind: "door"},
  {id: "p08", speaker: "A", sticker: "thinking", title: "ឈប់ញ៉ាំបាន?", photos: ["restaurant"], audioFrames: timing.p08.audioFrames, segs: timing.p08.segs, kind: "photo"},
  {id: "p09", speaker: "B", sticker: "laugh", title: "ឈប់ញ៉ាំ · ថតរូប", photos: ["restaurant2", "ricefield"], audioFrames: timing.p09.audioFrames, segs: timing.p09.segs, kind: "food"},
  {id: "p10", speaker: "A", sticker: "what", title: "ឡានធំ?", photos: ["cars/suv"], audioFrames: timing.p10.audioFrames, segs: timing.p10.segs, kind: "photo"},
  {id: "p11", speaker: "B", sticker: "thumbsup", title: "Sedan · SUV · MPV · Van", photos: ["sedan", "suv", "mpv", "van"], audioFrames: timing.p11.audioFrames, segs: timing.p11.segs, kind: "cars"},
  {id: "p12", speaker: "A", sticker: "happy", title: "ទៅអង្គរវត្ត!", photos: ["angkor"], audioFrames: timing.p12.audioFrames, segs: timing.p12.segs, kind: "photo"},
  {id: "p13", speaker: "B", sticker: "laugh", title: "កក់ឥឡូវទៅ!", photos: ["bayon"], audioFrames: timing.p13.audioFrames, segs: timing.p13.segs, kind: "end"},
];

export const timeline: readonly Timed[] = (() => {
  let t = 0;
  return lines.map((l, i) => {
    const lead = i === 0 ? LEAD : 0;
    const duration = lead + VOICE_IN + l.audioFrames + TAIL + (i === lines.length - 1 ? END_HOLD : 0);
    const from = t;
    t += duration;
    return {...l, from, duration, voiceFrom: from + lead + VOICE_IN};
  });
})();

const last = timeline[timeline.length - 1];
export const totalFrames = last.from + last.duration;
