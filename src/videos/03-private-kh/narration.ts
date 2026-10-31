import type React from "react";
import type {StickerName} from "../brand";
import {S02, S05, S06, S07, S08, S09, S10, S11, S12} from "../01-private-airport-kh/scenes";
import {SBus, SStops} from "../kh-extra-scenes";

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
  {id: "p1", audioFrames: 144, sticker: "sad", title: "ជិះឡានក្រុង ធុញ!", khmer: "ចង់ទៅលេងខេត្ត តែជិះឡានក្រុង ចាំយូរ ឈប់ច្រើនកន្លែង... ធុញមែនទែន!", src: "veha-new/p1", stage: SBus, tag: "PRIVATE CAR"},
  {id: "02", audioFrames: 63, sticker: "hi", title: "អត់អីទេណា៎!", khmer: "អត់អីទេណា៎! មាន Veha Booking ជួយហើយ។", src: "veha-01/02", stage: S02, tag: "PRIVATE CAR"},
  {id: "07", audioFrames: 92, sticker: "happy", title: "ទៅលេងខេត្ត", khmer: "ចង់ទៅលេងខេត្តមែនទេ? កក់ឡានឯកជន ទៅដល់មុខទ្វារតែម្តង!", src: "veha-01/07", stage: S07, tag: "PRIVATE CAR"},
  {id: "05", audioFrames: 178, sticker: "really", title: "ឡានតាមចិត្ត", khmer: "ចង់បានឡានប៉ុណ្ណាក៏មានដែរ Sedan, SUV, MPV ឬ Van ពីបួនកៅអី ដល់ដប់ប្រាំកៅអី។", src: "veha-01/05", stage: S05, tag: "PRIVATE CAR"},
  {id: "06", audioFrames: 82, sticker: "love", title: "សម្រាប់គ្រប់គ្នា", khmer: "មកជាមួយគ្រួសារ មិត្តភក្តិ ឬមកធ្វើការ ក៏ស័ក្តិសមទាំងអស់។", src: "veha-01/06", stage: S06, tag: "PRIVATE CAR"},
  {id: "08", audioFrames: 192, sticker: "wow", title: "តម្លៃថោកៗ", khmer: "ភ្នំពេញទៅកំពត ចាប់ពីសែសិបប្រាំដុល្លារ ទៅសៀមរាប ចាប់ពីហុកសិបប្រាំដុល្លារ... ថោកមែនទែនហ្នឹង!", src: "veha-01/08", stage: S08, tag: "PRIVATE CAR"},
  {id: "p2", audioFrames: 130, sticker: "happy", title: "ឈប់តាមចិត្ត", khmer: "ចង់ឈប់ផឹកកាហ្វេ ឬថតរូបតាមផ្លូវ ក៏បានដែរ ព្រោះឡានហ្នឹង សម្រាប់តែក្រុមបងទេ។", src: "veha-new/p2", stage: SStops, tag: "PRIVATE CAR"},
  {id: "09", audioFrames: 111, sticker: "ok", title: "ស្អាត ត្រជាក់ ស្រួល", khmer: "ឡានស្អាត ត្រជាក់ អង្គុយស្រួល អ្នកបើកបរក៏ចេះច្បាស់ផ្លូវទៀត។", src: "veha-01/09", stage: S09, tag: "PRIVATE CAR"},
  {id: "10", audioFrames: 101, sticker: "thinking", title: "កក់ ៣ ជំហាន", khmer: "ចឹង គ្រាន់តែរើសកន្លែង រើសថ្ងៃ ហើយចុច Book Now ប៉ុណ្ណឹងឯង!", src: "veha-01/10", stage: S10, tag: "BOOKING"},
  {id: "11", audioFrames: 82, sticker: "love", title: "បញ្ជាក់ភ្លាមៗ", khmer: "បញ្ជាក់ភ្លាមៗ តម្លៃច្បាស់លាស់ អត់មានលាក់លុយអីទេ។", src: "veha-01/11", stage: S11, tag: "BOOKING"},
  {id: "e1", audioFrames: 96, sticker: "hi", title: "កក់ឥឡូវនេះ!", khmer: "ចូលកក់ឥឡូវនេះណា៎ នៅ vehabooking.com!", src: "veha-new/e1", stage: S12, tag: "BOOKING"},
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
