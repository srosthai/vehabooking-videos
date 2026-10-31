import type React from "react";
import type {StickerName} from "../brand";
import {S02, S05, S06, S07, S08, S09, S10, S11, S12} from "../01-private-airport-kh/scenes";
import {SBus, SStops} from "../kh-extra-scenes";

// English voice: KiriTTS "Ethan", style "friendly, casual, conversational, natural, not reading"; clips sped 1.05x. Caption text lives in `khmer` (shared field name).
// Files: public/voice/<src>.mp3 (veha-01 reused clips, veha-new new clips). audioFrames = ceil(ffprobe duration * 30).
export type Line = {
  readonly id: string;
  readonly audioFrames: number;
  readonly khmer: string;
  readonly title: string;
  readonly sticker: StickerName;
  readonly src: string;
  readonly stage: React.FC;
  readonly tag: string;
};

export const lines: readonly Line[] = [
  {id: "ep01", audioFrames: 151, sticker: "sad", title: "Bus? So tiring!", khmer: "Heading out to the provinces, but the bus takes forever and stops everywhere? So tiring!", src: "veha-en/ep01", stage: SBus, tag: "PRIVATE CAR"},
  {id: "b02", audioFrames: 92, sticker: "hi", title: "No worries!", khmer: "No worries! Veha Booking has you covered.", src: "veha-en/b02", stage: S02, tag: "PRIVATE CAR"},
  {id: "ep03", audioFrames: 83, sticker: "happy", title: "Door to door", khmer: "Book a private car instead, and go door to door!", src: "veha-en/ep03", stage: S07, tag: "PRIVATE CAR"},
  {id: "b05", audioFrames: 220, sticker: "really", title: "Any size", khmer: "Need any size? Sedan, SUV, MPV or van, from four seats all the way up to fifteen.", src: "veha-en/b05", stage: S05, tag: "PRIVATE CAR"},
  {id: "b06", audioFrames: 110, sticker: "love", title: "For everyone", khmer: "Family, friends, or a work trip, it all fits.", src: "veha-en/b06", stage: S06, tag: "PRIVATE CAR"},
  {id: "ep06", audioFrames: 197, sticker: "wow", title: "Great prices", khmer: "Phnom Penh to Kampot from forty-five dollars, Siem Reap from sixty-five. Seriously good value!", src: "veha-en/ep06", stage: S08, tag: "PRIVATE CAR"},
  {id: "ep07", audioFrames: 156, sticker: "happy", title: "Stop anytime", khmer: "Want to stop for coffee or photos along the way? Sure, the car's just for your group.", src: "veha-en/ep07", stage: SStops, tag: "PRIVATE CAR"},
  {id: "b09", audioFrames: 147, sticker: "ok", title: "Clean, cool, comfy", khmer: "Clean, cool cars, comfy seats, and drivers who really know the roads.", src: "veha-en/b09", stage: S09, tag: "PRIVATE CAR"},
  {id: "ep10", audioFrames: 119, sticker: "thinking", title: "Book in 3 steps", khmer: "Just pick your route, pick your date, and tap Book Now. That's it!", src: "veha-en/ep10", stage: S10, tag: "BOOKING"},
  {id: "b11", audioFrames: 128, sticker: "love", title: "Instant confirmation", khmer: "Instant confirmation, clear prices, no hidden fees.", src: "veha-en/b11", stage: S11, tag: "BOOKING"},
  {id: "b12", audioFrames: 78, sticker: "hi", title: "Book now!", khmer: "So go book now at vehabooking dot com!", src: "veha-en/b12", stage: S12, tag: "BOOKING"},
];

export const LEAD = 10; // frames before the first scene's voice timing starts
export const VOICE_IN = 6; // voice starts this many frames into each scene
export const TAIL = 4; // frames after a line before the next scene
export const END_HOLD = 30;

export type Timed = Line & {readonly from: number; readonly duration: number; readonly voiceFrom: number};

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
