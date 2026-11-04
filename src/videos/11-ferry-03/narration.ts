import timingJson from "./timing.json";

type TimingEntry = {readonly audioFrames: number; readonly segs: ReadonlyArray<readonly [string, number]>};
const timing = timingJson as unknown as Record<string, TimingEntry>;

export type Speaker = "A" | "B";
export type PersonSticker = "hah" | "happy" | "laugh" | "thinking" | "thumbsup" | "what" | "wow";
export type SceneKind = "photo" | "zoom" | "speed" | "price" | "time" | "crossfade" | "phone" | "end";

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
  {id: "p01", speaker: "A", sticker: "what", title: "ចង់បានកន្លែងស្ងាត់?", photos: ["photos/ferry-03/s01-crowded-b.jpg"], audioFrames: timing.p01.audioFrames, segs: timing.p01.segs, kind: "photo"},
  {id: "p02", speaker: "B", sticker: "happy", title: "កោះរ៉ុងសន្លឹម", photos: ["real/ferry03/krs-swing-sign.jpg"], audioFrames: timing.p02.audioFrames, segs: timing.p02.segs, kind: "photo"},
  {id: "p03", speaker: "A", sticker: "hah", title: "ទៅម៉េច?", photos: ["real/ferry03/speed-ferry-skyline.jpg"], audioFrames: timing.p03.audioFrames, segs: timing.p03.segs, kind: "photo"},
  {id: "p04", speaker: "B", sticker: "thumbsup", title: "30 នាទី", photos: ["real/ferry03/yacht.jpg"], audioFrames: timing.p04.audioFrames, segs: timing.p04.segs, kind: "speed"},
  {id: "p05", speaker: "A", sticker: "thinking", title: "ថ្លៃអត់?", photos: ["real/ferry03/krs-beach-yellow-boat.jpg"], audioFrames: timing.p05.audioFrames, segs: timing.p05.segs, kind: "photo"},
  {id: "p06", speaker: "B", sticker: "happy", title: "$17 · ទៅមក $30", photos: ["real/ferry03/speedboat-red-seats.jpg"], audioFrames: timing.p06.audioFrames, segs: timing.p06.segs, kind: "price"},
  {id: "p07", speaker: "B", sticker: "thumbsup", title: "08:00 – 16:00", photos: ["real/ferry03/longtail-island.jpg"], audioFrames: timing.p07.audioFrames, segs: timing.p07.segs, kind: "time"},
  {id: "p08", speaker: "A", sticker: "thinking", title: "សុវត្ថិភាព?", photos: ["photos/ferry-03/s08-jackets.jpg"], audioFrames: timing.p08.audioFrames, segs: timing.p08.segs, kind: "photo"},
  {id: "p09", speaker: "B", sticker: "thumbsup", title: "អាវពោង · អ្នកបើកជំនាញ", photos: ["photos/ferry-03/s09-jackets.jpg"], audioFrames: timing.p09.audioFrames, segs: timing.p09.segs, kind: "zoom"},
  {id: "p10", speaker: "A", sticker: "laugh", title: "សម្រាកឲ្យពេញទី", photos: ["photos/ferry-03/s10-hammock.jpg", "photos/ferry-03/s10-sunset.jpg"], audioFrames: timing.p10.audioFrames, segs: timing.p10.segs, kind: "crossfade"},
  {id: "p11", speaker: "B", sticker: "happy", title: "ងាយៗ ៣ ជំហាន", photos: ["real/ferry03/booking-screenshot.png"], audioFrames: timing.p11.audioFrames, segs: timing.p11.segs, kind: "phone"},
  {id: "p12", speaker: "B", sticker: "laugh", title: "vehabooking.com", photos: ["real/ferry03/krs-swing-sign.jpg"], audioFrames: timing.p12.audioFrames, segs: timing.p12.segs, kind: "end"},
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
