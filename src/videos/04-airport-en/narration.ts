import type React from "react";
import type {StickerName} from "../brand";
import {S01, S02, S03, S04, S05, S06, S09, S12} from "../01-private-airport-kh/scenes";
import {S10Air, S11Air, SAirports, SDrop} from "../kh-extra-scenes";

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
  {id: "eh01", audioFrames: 179, sticker: "sad", title: "Just landed?", khmer: "Just landed, super tired, and no idea how you're getting to your hotel? Been there?", src: "veha-en/eh01", stage: S01, tag: "AIRPORT"},
  {id: "b02", audioFrames: 92, sticker: "hi", title: "No worries!", khmer: "No worries! Veha Booking has you covered.", src: "veha-en/b02", stage: S02, tag: "AIRPORT"},
  {id: "ea03", audioFrames: 96, sticker: "ok", title: "Book online", khmer: "Just book your airport pickup online. Super easy.", src: "veha-en/ea03", stage: S03, tag: "AIRPORT"},
  {id: "ea04", audioFrames: 160, sticker: "really", title: "KTI & SAI", khmer: "We cover both Techo International in Phnom Penh, and Siem Reap Angkor airport.", src: "veha-en/ea04", stage: SAirports, tag: "AIRPORT"},
  {id: "ea05", audioFrames: 197, sticker: "wow", title: "Met at arrivals", khmer: "Your driver waits right at arrivals with your name. KTI to Phnom Penh starts from just fifteen dollars!", src: "veha-en/ea05", stage: S04, tag: "AIRPORT"},
  {id: "eh06", audioFrames: 163, sticker: "happy", title: "Hotel → Airport", khmer: "Flying out? We'll pick you up at your hotel and get you to the airport on time.", src: "veha-en/eh06", stage: SDrop, tag: "AIRPORT"},
  {id: "b05", audioFrames: 220, sticker: "really", title: "Any size", khmer: "Need any size? Sedan, SUV, MPV or van, from four seats all the way up to fifteen.", src: "veha-en/b05", stage: S05, tag: "AIRPORT"},
  {id: "b06", audioFrames: 110, sticker: "love", title: "For everyone", khmer: "Family, friends, or a work trip, it all fits.", src: "veha-en/b06", stage: S06, tag: "AIRPORT"},
  {id: "b09", audioFrames: 147, sticker: "ok", title: "Clean, cool, comfy", khmer: "Clean, cool cars, comfy seats, and drivers who really know the roads.", src: "veha-en/b09", stage: S09, tag: "AIRPORT"},
  {id: "ea10", audioFrames: 124, sticker: "thinking", title: "Book in 3 steps", khmer: "Just pick your airport, pick your date, and tap Book Now. That's it!", src: "veha-en/ea10", stage: S10Air, tag: "BOOKING"},
  {id: "b11", audioFrames: 128, sticker: "love", title: "Instant confirmation", khmer: "Instant confirmation, clear prices, no hidden fees.", src: "veha-en/b11", stage: S11Air, tag: "BOOKING"},
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
