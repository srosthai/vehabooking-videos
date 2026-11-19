import timingJson from "./timing.json";

type TimingEntry = {readonly audioFrames: number; readonly segs: ReadonlyArray<readonly [string, number]>};
const timing = timingJson as unknown as Record<string, TimingEntry>;

export type Speaker = "B" | "C";
export type PersonSticker = "happy" | "thinking" | "wow" | "what" | "thumbsup" | "point-right";
export type SceneKind =
  | "homeAngkor"
  | "photo"
  | "privateTaxi"
  | "zoom"
  | "roadside"
  | "vehicles"
  | "priceQuestion"
  | "resultPhone"
  | "mapPin"
  | "pickupHotel"
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
  {id: "t01", speaker: "C", sticker: "happy", title: "ចូលឆ្នាំនេះទៅសៀមរាប", photos: ["real/taxi-family/scene01-home-family.png", "real/taxi-family/scene01-angkorwat.png"], audioFrames: timing.t01.audioFrames, segs: timing.t01.segs, kind: "homeAngkor"},
  {id: "t02", speaker: "C", sticker: "thinking", title: "ឡានក្រុងច្រើនមនុស្ស", photos: ["real/taxi-family/scene02-crowded-bus.png"], audioFrames: timing.t02.audioFrames, segs: timing.t02.segs, kind: "photo"},
  {id: "t03", speaker: "B", sticker: "point-right", title: "កក់ឡានឯកជន", photos: ["real/taxi-family/scene03-private-sedan.png"], audioFrames: timing.t03.audioFrames, segs: timing.t03.segs, kind: "privateTaxi"},
  {id: "t04", speaker: "C", sticker: "wow", title: "ឡានតែគ្រួសារ", photos: ["real/taxi-family/scene04-family-car.png"], audioFrames: timing.t04.audioFrames, segs: timing.t04.segs, kind: "zoom"},
  {id: "t05", speaker: "B", sticker: "thumbsup", title: "ឈប់តាមចិត្ត", photos: ["real/taxi-family/scene05-roadside-stop.png"], audioFrames: timing.t05.audioFrames, segs: timing.t05.segs, kind: "roadside"},
  {id: "t06", speaker: "C", sticker: "what", title: "ឡានអីខ្លះ?", photos: ["real/taxi-family/scene06-luggage.png"], audioFrames: timing.t06.audioFrames, segs: timing.t06.segs, kind: "photo"},
  {id: "t07", speaker: "B", sticker: "happy", title: "Sedan · SUV · MPV · Van", photos: ["real/taxi-family/scene07-sedan.png", "real/taxi-family/scene07-suv.png", "real/taxi-family/scene07-mpv.png", "real/taxi-family/scene07-van.png"], audioFrames: timing.t07.audioFrames, segs: timing.t07.segs, kind: "vehicles"},
  {id: "t08", speaker: "C", sticker: "thinking", title: "តម្លៃប៉ុន្មាន?", photos: ["real/taxi-family/scene07-sedan.png"], audioFrames: timing.t08.audioFrames, segs: timing.t08.segs, kind: "priceQuestion"},
  {id: "t09", speaker: "B", sticker: "happy", title: "from $65", photos: ["images/taxi-family/vehabooking-pp-sr-phone.png"], audioFrames: timing.t09.audioFrames, segs: timing.t09.segs, kind: "resultPhone"},
  {id: "t10", speaker: "C", sticker: "happy", title: "មកយកនៅណា?", photos: ["real/taxi-family/scene10-home-pin-bg.png"], audioFrames: timing.t10.audioFrames, segs: timing.t10.segs, kind: "mapPin"},
  {id: "t11", speaker: "B", sticker: "thumbsup", title: "ដល់មុខផ្ទះ → សណ្ឋាគារ", photos: ["real/taxi-family/scene11-driver-door.png", "real/taxi-family/scene11-siemreap-hotel.png"], audioFrames: timing.t11.audioFrames, segs: timing.t11.segs, kind: "pickupHotel"},
  {id: "t12", speaker: "B", sticker: "thumbsup", title: "Book Now នៅ vehabooking.com", photos: ["images/taxi-family/vehabooking-pp-sr-phone.png"], audioFrames: timing.t12.audioFrames, segs: timing.t12.segs, kind: "phoneEnd"},
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
