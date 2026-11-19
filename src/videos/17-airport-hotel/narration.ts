import timingJson from "./timing.json";

type TimingEntry = {readonly audioFrames: number; readonly segs: ReadonlyArray<readonly [string, number]>};
const timing = timingJson as unknown as Record<string, TimingEntry>;

export type Speaker = "B" | "C";
export type PersonSticker = "happy" | "thinking" | "wow" | "what" | "thumbsup" | "point-right";
export type SceneKind =
  | "arrivalNight"
  | "photo"
  | "searchPhone"
  | "flightTracking"
  | "nameboard"
  | "airportsSplit"
  | "twoCities"
  | "priceQuestion"
  | "prices"
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
  {id: "a01", speaker: "C", sticker: "thinking", title: "ដល់ព្រលានហើយ", photos: ["real/airport-hotel/scene01-arrival-night.png"], audioFrames: timing.a01.audioFrames, segs: timing.a01.segs, kind: "arrivalNight"},
  {id: "a02", speaker: "C", sticker: "thinking", title: "រកឡានពិបាក", photos: ["real/airport-hotel/scene02-taxi-queue.png"], audioFrames: timing.a02.audioFrames, segs: timing.a02.segs, kind: "photo"},
  {id: "a03", speaker: "B", sticker: "point-right", title: "កក់រួចហើយ", photos: ["real/airport-hotel/scene03-husband-phone.png", "images/airport-hotel/transport-search-phone.png"], audioFrames: timing.a03.audioFrames, segs: timing.a03.segs, kind: "searchPhone"},
  {id: "a04", speaker: "C", sticker: "wow", title: "កក់ពីពេលណា?", photos: ["real/airport-hotel/scene03-husband-phone.png"], audioFrames: timing.a04.audioFrames, segs: timing.a04.segs, kind: "photo"},
  {id: "a05", speaker: "B", sticker: "thumbsup", title: "យន្តហោះមកយឺត", photos: ["real/airport-hotel/scene05-plane-landing.png"], audioFrames: timing.a05.audioFrames, segs: timing.a05.segs, kind: "flightTracking"},
  {id: "a06", speaker: "C", sticker: "what", title: "ចំណាំយើងម៉េច?", photos: ["real/airport-hotel/scene01-arrival-night.png"], audioFrames: timing.a06.audioFrames, segs: timing.a06.segs, kind: "photo"},
  {id: "a07", speaker: "B", sticker: "happy", title: "ផ្លាកឈ្មោះ · ជួយអីវ៉ាន់", photos: ["real/airport-hotel/scene07-driver-nameboard.png", "real/airport-hotel/scene07-luggage-help.png"], audioFrames: timing.a07.audioFrames, segs: timing.a07.segs, kind: "nameboard"},
  {id: "a08", speaker: "C", sticker: "happy", title: "ភ្នំពេញ · សៀមរាប", photos: ["real/airport-hotel/scene08-techo-airport.png", "real/airport-hotel/scene08-sai-airport.png"], audioFrames: timing.a08.audioFrames, segs: timing.a08.segs, kind: "airportsSplit"},
  {id: "a09", speaker: "B", sticker: "thumbsup", title: "Airport → Hotel", photos: ["real/airport-hotel/real-ui/pnh-sedan-booknow.png", "images/airport-hotel/sai-sedan-booknow.png", "real/airport-hotel/scene09-pp-hotel.png", "real/airport-hotel/scene09-sr-hotel.png"], audioFrames: timing.a09.audioFrames, segs: timing.a09.segs, kind: "twoCities"},
  {id: "a10", speaker: "C", sticker: "thinking", title: "តម្លៃប៉ុន្មាន?", photos: ["real/airport-hotel/real-ui/pnh-sedan-booknow.png"], audioFrames: timing.a10.audioFrames, segs: timing.a10.segs, kind: "priceQuestion"},
  {id: "a11", speaker: "B", sticker: "thumbsup", title: "$15 ភ្នំពេញ · $18 សៀមរាប", photos: ["real/airport-hotel/real-ui/pnh-sedan-booknow.png", "images/airport-hotel/sai-sedan-booknow.png", "real/airport-hotel/scene11-sedan-night.png"], audioFrames: timing.a11.audioFrames, segs: timing.a11.segs, kind: "prices"},
  {id: "a12", speaker: "B", sticker: "thumbsup", title: "Book Now នៅ vehabooking.com", photos: ["real/airport-hotel/real-ui/pnh-sedan-booknow.png", "real/airport-hotel/scene12-couple-hotel.png"], audioFrames: timing.a12.audioFrames, segs: timing.a12.segs, kind: "phoneEnd"},
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
