import timingJson from "./timing.json";

type TimingEntry = {readonly audioFrames: number; readonly segs: ReadonlyArray<readonly [string, number]>};
const timing = timingJson as unknown as Record<string, TimingEntry>;

export type Speaker = "B" | "C";
export type PersonSticker = "happy" | "thinking" | "wow" | "what" | "thumbsup" | "point-right";
export type SceneKind =
  | "homeIsland"
  | "photo"
  | "free"
  | "zoom"
  | "kidsPrice"
  | "fare"
  | "pier"
  | "kidsFerry"
  | "checks"
  | "coast"
  | "split"
  | "phoneEnd";

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

export const LEAD = 4, VOICE_IN = 2, TAIL = 2, END_HOLD = 30;

export const lines: readonly Line[] = [
  {id: "f01", speaker: "C", sticker: "happy", title: "ចុងសប្ដាហ៍ទៅកោះ", photos: ["real/ferry-family/scene01-home-family.png", "real/ferry-family/scene11-kohrong.png"], audioFrames: timing.f01.audioFrames, segs: timing.f01.segs, kind: "homeIsland"},
  {id: "f02", speaker: "C", sticker: "thinking", title: "ខ្លាចសំបុត្រថ្លៃ", photos: ["real/ferry03/speed-ferry-skyline.jpg"], audioFrames: timing.f02.audioFrames, segs: timing.f02.segs, kind: "photo"},
  {id: "f03", speaker: "B", sticker: "point-right", title: "កូនក្រោម ៥ ឆ្នាំ ហ្វ្រី", photos: ["real/ferry-family/scene03-toddler.png"], audioFrames: timing.f03.audioFrames, segs: timing.f03.segs, kind: "free"},
  {id: "f04", speaker: "C", sticker: "wow", title: "ហ្វ្រីមែនហី!", photos: ["real/ferry-family/scene11-kohrong.png"], audioFrames: timing.f04.audioFrames, segs: timing.f04.segs, kind: "zoom"},
  {id: "f05", speaker: "B", sticker: "happy", title: "$8.50 · អាយុ ៥–១៣", photos: ["real/ferry-family/scene05-older-kids.png"], audioFrames: timing.f05.audioFrames, segs: timing.f05.segs, kind: "kidsPrice"},
  {id: "f06", speaker: "C", sticker: "happy", title: "គ្រួសារមួយ តម្លៃប៉ុន្មាន?", photos: ["real/ferry-family/scene11-kohrong.png"], audioFrames: timing.f06.audioFrames, segs: timing.f06.segs, kind: "fare"},
  {id: "f07", speaker: "B", sticker: "thumbsup", title: "កក់មួយគ្រួសារ", photos: ["real/ferry-family/scene07-family-pier.png"], audioFrames: timing.f07.audioFrames, segs: timing.f07.segs, kind: "pier"},
  {id: "f08", speaker: "C", sticker: "thinking", title: "សុវត្ថិភាព?", photos: ["real/ferry-family/scene08-kids-on-ferry.png"], audioFrames: timing.f08.audioFrames, segs: timing.f08.segs, kind: "kidsFerry"},
  {id: "f09", speaker: "B", sticker: "thumbsup", title: "អាវពោង · បន្ទប់ទឹក", photos: ["real/ferry-family/scene09-lifejackets.png", "real/ferry-family/scene09-cabin.png"], audioFrames: timing.f09.audioFrames, segs: timing.f09.segs, kind: "checks"},
  {id: "f10", speaker: "C", sticker: "happy", title: "ទៅកោះណាល្អ?", photos: ["real/ferry-family/scene10-coast.png"], audioFrames: timing.f10.audioFrames, segs: timing.f10.segs, kind: "coast"},
  {id: "f11", speaker: "B", sticker: "happy", title: "កោះរ៉ុង · កោះរ៉ុងសន្លឹម", photos: ["real/ferry-family/scene11-kohrong.png", "real/ferry-family/scene11-kohrongsanloem.png"], audioFrames: timing.f11.audioFrames, segs: timing.f11.segs, kind: "split"},
  {id: "f12", speaker: "B", sticker: "thumbsup", title: "Book Now នៅ vehabooking.com", photos: ["real/ferry03/booking-screenshot.png"], audioFrames: timing.f12.audioFrames, segs: timing.f12.segs, kind: "phoneEnd"},
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
