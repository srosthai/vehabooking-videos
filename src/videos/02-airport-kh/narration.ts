import type React from "react";
import type {StickerName} from "../brand";
import {S01, S02, S03, S04, S05, S06, S09, S12} from "../01-private-airport-kh/scenes";
import {S10Air, S11Air, SAirports, SDrop} from "../kh-extra-scenes";

// Khmer voice: KiriTTS, cloned voice "My Voice", style "casual friendly Khmer conversation, natural, not reading".
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
  {id: "h01", audioFrames: 106, sticker: "sad", title: "ទើបចុះពីយន្តហោះ?", khmer: "ទើបចុះពីយន្តហោះ ហត់ហើយ អត់ដឹងជិះអីទៅសណ្ឋាគារទៀត... ធ្លាប់អត់?", src: "veha-new/h01", stage: S01, tag: "AIRPORT"},
  {id: "02", audioFrames: 63, sticker: "hi", title: "អត់អីទេណា៎!", khmer: "អត់អីទេណា៎! មាន Veha Booking ជួយហើយ។", src: "veha-01/02", stage: S02, tag: "AIRPORT"},
  {id: "03", audioFrames: 111, sticker: "ok", title: "កក់តាមអនឡាញ", khmer: "គ្រាន់តែកក់ឡានមកទទួលពីព្រលាន លើអនឡាញ ស្រួលៗ។", src: "veha-01/03", stage: S03, tag: "AIRPORT"},
  {id: "a2", audioFrames: 106, sticker: "really", title: "KTI និង SAI", khmer: "មានទាំងព្រលានតេជោ នៅភ្នំពេញ ហើយនឹងព្រលានសៀមរាប-អង្គរ។", src: "veha-new/a2", stage: SAirports, tag: "AIRPORT"},
  {id: "04", audioFrames: 197, sticker: "wow", title: "ទទួលដល់ច្រកចេញ", khmer: "អ្នកបើក ចាំទទួលបងដល់ច្រកចេញតែម្ដង។ ពីព្រលានតេជោ ចូលភ្នំពេញ តែដប់ប្រាំដុល្លារទេ!", src: "veha-01/04", stage: S04, tag: "AIRPORT"},
  {id: "ha1", audioFrames: 118, sticker: "happy", title: "សណ្ឋាគារ → ព្រលាន", khmer: "ដល់ពេលត្រូវហោះទៅវិញ យើងក៏ទៅយកដល់សណ្ឋាគារ ជូនទៅព្រលានទាន់ម៉ោងដែរ។", src: "veha-new/ha1", stage: SDrop, tag: "AIRPORT"},
  {id: "05", audioFrames: 178, sticker: "really", title: "ឡានតាមចិត្ត", khmer: "ចង់បានឡានធំតូចប៉ុណ្ណាក៏មាន Sedan, SUV, MPV ឬ Van ពីបួនកៅអី ដល់ដប់ប្រាំកៅអី។", src: "veha-01/05", stage: S05, tag: "AIRPORT"},
  {id: "06", audioFrames: 82, sticker: "love", title: "ស្រួលគ្រប់គ្នា", khmer: "មកជាមួយគ្រួសារ ជាមួយគ្នីគ្នា ឬមកធ្វើការ ក៏ស្រួលដែរ។", src: "veha-01/06", stage: S06, tag: "AIRPORT"},
  {id: "09", audioFrames: 111, sticker: "ok", title: "ស្អាត ត្រជាក់ ស្រួល", khmer: "ឡានស្អាត ត្រជាក់ អង្គុយស្រួល អ្នកបើកក៏ចេះផ្លូវច្បាស់ទៀត។", src: "veha-01/09", stage: S09, tag: "AIRPORT"},
  {id: "10", audioFrames: 101, sticker: "thinking", title: "កក់ ៣ ជំហាន", khmer: "ចឹង គ្រាន់តែរើសកន្លែង រើសថ្ងៃ ហើយចុច Book Now ប៉ុណ្ណឹងឯង!", src: "veha-01/10", stage: S10Air, tag: "BOOKING"},
  {id: "11", audioFrames: 82, sticker: "love", title: "បញ្ជាក់ភ្លាម", khmer: "កក់ហើយបានបញ្ជាក់ភ្លាម តម្លៃច្បាស់ អត់មានលាក់លុយអីទេ។", src: "veha-01/11", stage: S11Air, tag: "BOOKING"},
  {id: "e1", audioFrames: 96, sticker: "hi", title: "កក់ឥឡូវទៅ!", khmer: "ចូលកក់ឥឡូវតែម្ដងទៅណា៎ នៅ vehabooking.com!", src: "veha-new/e1", stage: S12, tag: "BOOKING"},
];

export const LEAD = 10; // frames before the first scene's voice timing starts
export const VOICE_IN = 8; // voice starts this many frames into each scene
export const TAIL = 6; // frames after a line before the next scene
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
