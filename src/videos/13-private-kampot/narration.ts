import timingJson from "./timing.json";

type TimingEntry = {readonly audioFrames: number; readonly segs: ReadonlyArray<readonly [string, number]>};
const timing = timingJson as unknown as Record<string, TimingEntry>;

export type Speaker = "A" | "B";
export type PersonSticker = "hah" | "happy" | "laugh" | "thinking" | "thumbsup" | "what" | "wow";
export type SceneKind = "photo" | "bus" | "car" | "route" | "price" | "compare" | "hotel" | "crossfade" | "fleet3" | "fleet4" | "finale";

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

export const LEAD = 6, VOICE_IN = 3, TAIL = 4, END_HOLD = 42;

export const lines: readonly Line[] = [
  {id: "p01", speaker: "A", sticker: "thinking", title: "គ្រួសារទៅកំពត", photos: ["real/kampot/kampot-seahorse.jpg"], audioFrames: timing.p01.audioFrames, segs: timing.p01.segs, kind: "photo"},
  {id: "p02", speaker: "A", sticker: "what", title: "ឡានក្រុងពិបាក", photos: ["real/bus-coach.png"], audioFrames: timing.p02.audioFrames, segs: timing.p02.segs, kind: "bus"},
  {id: "p03", speaker: "B", sticker: "happy", title: "ឡានឯកជន Veha Booking", photos: ["real/sedan.jpg"], audioFrames: timing.p03.audioFrames, segs: timing.p03.segs, kind: "car"},
  {id: "p04", speaker: "A", sticker: "what", title: "តម្លៃប៉ុន្មាន?", photos: ["real/phnompenh.jpg"], audioFrames: timing.p04.audioFrames, segs: timing.p04.segs, kind: "route"},
  {id: "p05", speaker: "B", sticker: "happy", title: "ត្រឹម $45", photos: ["real/kampot/kampot-river-resort.jpg"], audioFrames: timing.p05.audioFrames, segs: timing.p05.segs, kind: "price"},
  {id: "p06", speaker: "A", sticker: "wow", title: "ធូថ្លៃជាង!", photos: ["real/kampot/kampot-river-resort.jpg"], audioFrames: timing.p06.audioFrames, segs: timing.p06.segs, kind: "compare"},
  {id: "p07", speaker: "B", sticker: "thumbsup", title: "ដល់មុខផ្ទះ", photos: ["real/hotel.jpg"], audioFrames: timing.p07.audioFrames, segs: timing.p07.segs, kind: "hotel"},
  {id: "p08", speaker: "A", sticker: "what", title: "ឈប់តាមផ្លូវ", photos: ["real/kampot/kampot-durian.jpg"], audioFrames: timing.p08.audioFrames, segs: timing.p08.segs, kind: "photo"},
  {id: "p09", speaker: "B", sticker: "happy", title: "ប្រាប់អ្នកបើកឡាន", photos: ["real/kampot/kampot-durian.jpg", "real/roadsidefood.jpg"], audioFrames: timing.p09.audioFrames, segs: timing.p09.segs, kind: "crossfade"},
  {id: "p10", speaker: "A", sticker: "thinking", title: "ឡានធំមានអត់?", photos: ["real/kampot/kampot-river-resort.jpg"], audioFrames: timing.p10.audioFrames, segs: timing.p10.segs, kind: "fleet3"},
  {id: "p11", speaker: "B", sticker: "thumbsup", title: "Sedan · SUV · MPV · Van", photos: ["real/kampot/kampot-river-resort.jpg"], audioFrames: timing.p11.audioFrames, segs: timing.p11.segs, kind: "fleet4"},
  {id: "p12", speaker: "B", sticker: "thumbsup", title: "Book Now", photos: ["real/airport/app-airport-search.png"], audioFrames: timing.p12.audioFrames, segs: timing.p12.segs, kind: "finale"},
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
