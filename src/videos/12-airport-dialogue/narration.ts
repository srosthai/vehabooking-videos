import timingJson from "./timing.json";

type TimingEntry = {readonly audioFrames: number; readonly segs: ReadonlyArray<readonly [string, number]>};
const timing = timingJson as unknown as Record<string, TimingEntry>;

export type Speaker = "A" | "B";
export type PersonSticker = "hah" | "happy" | "laugh" | "thinking" | "thumbsup" | "what" | "wow";
export type SceneKind = "photo" | "price" | "crossfade" | "car" | "fleet" | "phone";

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
  {id: "p01", speaker: "A", sticker: "thinking", title: "ដល់ភ្នំពេញហើយ!", photos: ["real/airport/techo-airport.jpg"], audioFrames: timing.p01.audioFrames, segs: timing.p01.segs, kind: "photo"},
  {id: "p02", speaker: "B", sticker: "happy", title: "កក់ឡាន Veha Booking", photos: ["real/airport/techo-airport.jpg"], audioFrames: timing.p02.audioFrames, segs: timing.p02.segs, kind: "photo"},
  {id: "p03", speaker: "A", sticker: "thinking", title: "ចាំយូរអត់?", photos: ["real/airport/techo-airport.jpg"], audioFrames: timing.p03.audioFrames, segs: timing.p03.segs, kind: "photo"},
  {id: "p04", speaker: "B", sticker: "what", title: "អ្នកបើកឡានចាំទទួល", photos: ["real/airport/techo-airport.jpg"], audioFrames: timing.p04.audioFrames, segs: timing.p04.segs, kind: "photo"},
  {id: "p05", speaker: "A", sticker: "happy", title: "តម្លៃប៉ុន្មាន?", photos: ["real/airport/phnompenh-city.jpg"], audioFrames: timing.p05.audioFrames, segs: timing.p05.segs, kind: "photo"},
  {id: "p06", speaker: "B", sticker: "thumbsup", title: "ត្រឹម $15", photos: ["real/airport/techo-airport.jpg"], audioFrames: timing.p06.audioFrames, segs: timing.p06.segs, kind: "price"},
  {id: "p07", speaker: "A", sticker: "wow", title: "សៀមរាបមានដែរអត់?", photos: ["real/airport/siemreap-airport.png"], audioFrames: timing.p07.audioFrames, segs: timing.p07.segs, kind: "photo"},
  {id: "p08", speaker: "B", sticker: "happy", title: "មានទាំងពីរកន្លែង", photos: ["real/airport/siemreap-airport.png", "real/airport/siemreap-city.jpg"], audioFrames: timing.p08.audioFrames, segs: timing.p08.segs, kind: "crossfade"},
  {id: "p09", speaker: "A", sticker: "happy", title: "ឡានធំសម្រាប់ក្រុម", photos: ["real/cars/van.png"], audioFrames: timing.p09.audioFrames, segs: timing.p09.segs, kind: "car"},
  {id: "p10", speaker: "B", sticker: "thumbsup", title: "Sedan · SUV · MPV · Van", photos: ["real/cars/sedan.png", "real/cars/suv.png", "real/cars/mpv.png", "real/cars/van.png"], audioFrames: timing.p10.audioFrames, segs: timing.p10.segs, kind: "fleet"},
  {id: "p11", speaker: "A", sticker: "happy", title: "ត្រឡប់ទៅព្រលាន", photos: ["real/airport/phnompenh-city.jpg", "real/airport/techo-airport.jpg"], audioFrames: timing.p11.audioFrames, segs: timing.p11.segs, kind: "crossfade"},
  {id: "p12", speaker: "B", sticker: "thumbsup", title: "Book Now", photos: ["real/airport/app-airport-search.png"], audioFrames: timing.p12.audioFrames, segs: timing.p12.segs, kind: "phone"},
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
