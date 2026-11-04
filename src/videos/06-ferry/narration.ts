import type {StickerName} from "../brand";
import type React from "react";
import {FBoard, FBook, FDone, FEnd, FIsland, FKids, FOps, FPier, FRound, FRoute, FSafety, FSpeed, FTab} from "./scenes";

// Voice KH: KiriTTS "My Voice" (voice_matching natural); EN: "Ethan". Silence trimmed (ffmpeg silenceremove). audioFrames = ceil(dur*30).
export type Line = {readonly id: string; readonly audioFrames: number; readonly text: string; readonly title: string; readonly sticker: StickerName; readonly src: string; readonly stage: React.FC};
export type Timed = Line & {readonly from: number; readonly duration: number; readonly voiceFrom: number};
export const LEAD = 6, VOICE_IN = 3, TAIL = 5, END_HOLD = 36;
const build = (lines: readonly Line[]) => { let t = 0; const tl: Timed[] = lines.map((l, i) => { const lead = i === 0 ? LEAD : 0; const duration = lead + VOICE_IN + l.audioFrames + TAIL + (i === lines.length - 1 ? END_HOLD : 0); const from = t; t += duration; return {...l, from, duration, voiceFrom: from + lead + VOICE_IN}; }); return {timeline: tl, totalFrames: t}; };
export const kh = build([
  {id: "f01", audioFrames: 86, sticker: "thinking", title: "ទៅលេងកោះ?", text: "ចង់ទៅលេងកោះ តែអត់ដឹងកក់សំបុត្រទូកនៅណាមែនទេ?", src: "ferry-kh/f01", stage: FIsland},
  {id: "f02", audioFrames: 59, sticker: "hi", title: "អត់អីទេ!", text: "អត់អីទេ! មាន Veha Booking ជួយហើយណា៎។", src: "ferry-kh/f02", stage: FPier},
  {id: "f03", audioFrames: 67, sticker: "ok", title: "កក់អនឡាញ", text: "កក់សំបុត្រទូកលើអនឡាញ ងាយៗសោះ។", src: "ferry-kh/f03", stage: FTab},
  {id: "f04", audioFrames: 81, sticker: "wow", title: "ព្រះសីហនុ → កោះ", text: "ពីព្រះសីហនុ ទៅកោះរ៉ុង ឬកោះរ៉ុងសន្លឹមក៏បាន។", src: "ferry-kh/f04", stage: FRoute},
  {id: "f05", audioFrames: 52, sticker: "wow", title: "៣៥ នាទី", text: "ជិះតែសាមសិបប្រាំនាទី ដល់កោះហើយ!", src: "ferry-kh/f05", stage: FSpeed},
  {id: "f06", audioFrames: 86, sticker: "ok", title: "១៤ ជើង/ថ្ងៃ", text: "មួយថ្ងៃមានដប់បួនជើង ចង់ទៅម៉ោងណាក៏បាន។", src: "ferry-kh/f06", stage: FBoard},
  {id: "f07", audioFrames: 86, sticker: "happy", title: "សន្សំ $4", text: "កក់ទៅមកតែម្ដងទៅ សន្សំបានបួនដុល្លារទៀត!", src: "ferry-kh/f07", stage: FRound},
  {id: "f08", audioFrames: 66, sticker: "love", title: "ក្មេង $8.50", text: "ក្មេងៗ ថោកជាងទៀត តែប្រាំបីដុល្លារកន្លះទេ។", src: "ferry-kh/f08", stage: FKids},
  {id: "f09", audioFrames: 57, sticker: "ok", title: "សុវត្ថិភាព", text: "មានអាវពោងឲ្យ ហើយអ្នកបើកក៏ជំនាញដែរ។", src: "ferry-kh/f09", stage: FSafety},
  {id: "f10", audioFrames: 78, sticker: "really", title: "ក្រុមហ៊ុនទូក", text: "មានក្រុមហ៊ុនទូកច្រើន មើលប្រៀបធៀបនៅកន្លែងតែមួយ។", src: "ferry-kh/f10", stage: FOps},
  {id: "f11", audioFrames: 84, sticker: "thinking", title: "៣ ជំហាន", text: "គ្រាន់តែរើសកោះ រើសថ្ងៃ ចុចកក់ ចប់ហើយ!", src: "ferry-kh/f11", stage: FBook},
  {id: "f12", audioFrames: 80, sticker: "love", title: "បញ្ជាក់ភ្លាម", text: "កក់ហើយបានបញ្ជាក់ភ្លាម តម្លៃច្បាស់ អត់មានលាក់អីទេ។", src: "ferry-kh/f12", stage: FDone},
  {id: "f13", audioFrames: 123, sticker: "hi", title: "កក់ឥឡូវទៅ!", text: "ទៅកោះស្រួលៗ កក់ឥឡូវតែម្ដងទៅ នៅ vehabooking ដត ខម!", src: "ferry-kh/f13", stage: FEnd},
]);
export const en = build([
  {id: "f01", audioFrames: 99, sticker: "thinking", title: "Island trip?", text: "Island trip, but no idea where to book the boat?", src: "ferry-en/f01", stage: FIsland},
  {id: "f02", audioFrames: 78, sticker: "hi", title: "Don't worry!", text: "Don't worry! Veha Booking's got you.", src: "ferry-en/f02", stage: FPier},
  {id: "f03", audioFrames: 113, sticker: "ok", title: "Book online", text: "Book your speed ferry online. Easy.", src: "ferry-en/f03", stage: FTab},
  {id: "f04", audioFrames: 117, sticker: "wow", title: "To the islands", text: "Sihanoukville to Koh Rong and Koh Rong Sanloem.", src: "ferry-en/f04", stage: FRoute},
  {id: "f05", audioFrames: 88, sticker: "wow", title: "35 minutes", text: "Super quick, just thirty-five minutes!", src: "ferry-en/f05", stage: FSpeed},
  {id: "f06", audioFrames: 110, sticker: "ok", title: "14 sailings/day", text: "Fourteen sailings a day. Pick any time.", src: "ferry-en/f06", stage: FBoard},
  {id: "f07", audioFrames: 88, sticker: "happy", title: "Save $4", text: "Book a round trip and save four bucks!", src: "ferry-en/f07", stage: FRound},
  {id: "f08", audioFrames: 65, sticker: "love", title: "Kids $8.50", text: "Kids ride for just eight-fifty.", src: "ferry-en/f08", stage: FKids},
  {id: "f09", audioFrames: 72, sticker: "ok", title: "Safety first", text: "Life jackets and trained captains.", src: "ferry-en/f09", stage: FSafety},
  {id: "f10", audioFrames: 98, sticker: "really", title: "Operators", text: "Compare ferry operators, all in one place.", src: "ferry-en/f10", stage: FOps},
  {id: "f11", audioFrames: 98, sticker: "thinking", title: "3 steps", text: "Pick the island, pick a date, tap book. Done!", src: "ferry-en/f11", stage: FBook},
  {id: "f12", audioFrames: 126, sticker: "love", title: "Instant confirmation", text: "Instant confirmation, clear prices, no hidden fees.", src: "ferry-en/f12", stage: FDone},
  {id: "f13", audioFrames: 120, sticker: "hi", title: "Book now!", text: "Island trips made easy. Book now at vehabooking dot com!", src: "ferry-en/f13", stage: FEnd},
]);
