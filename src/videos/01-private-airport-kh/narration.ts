import type {StickerName} from "../brand";

// Khmer voice: KiriTTS, cloned voice "My Voice", style "casual friendly Khmer conversation, natural, not reading".
// Files: public/voice/veha-01/NN.mp3. audioFrames = ceil(ffprobe duration * 30).
export type Line = {
  readonly id: string;
  readonly audioFrames: number;
  readonly khmer: string;
  readonly title: string;
  readonly sticker: StickerName;
};

export const lines: readonly Line[] = [
  {id: "01", audioFrames: 96, sticker: "sad", title: "ទើបចុះពីយន្តហោះ?", khmer: "ទើបចុះពីយន្តហោះ ហត់ហើយ មិនដឹងជិះអីទៅផ្ទះទៀត... ធ្លាប់អត់?"},
  {id: "02", audioFrames: 63, sticker: "hi", title: "អត់អីទេណា៎!", khmer: "អត់អីទេណា៎! មាន Veha Booking ជួយហើយ។"},
  {id: "03", audioFrames: 111, sticker: "ok", title: "កក់តាមអនឡាញ", khmer: "គ្រាន់តែកក់ឡានទទួលពីព្រលានយន្តហោះ តាមអនឡាញ ស្រួលៗ។"},
  {id: "04", audioFrames: 197, sticker: "wow", title: "ទទួលដល់ច្រកចេញ", khmer: "អ្នកបើកបរ ចាំទទួលបងដល់ច្រកចេញតែម្តង។ ពីព្រលានយន្តហោះតេជោ ចូលភ្នំពេញ ចាប់ពីដប់ប្រាំដុល្លារប៉ុណ្ណោះ!"},
  {id: "05", audioFrames: 178, sticker: "really", title: "ឡានតាមចិត្ត", khmer: "ចង់បានឡានប៉ុណ្ណាក៏មានដែរ Sedan, SUV, MPV ឬ Van ពីបួនកៅអី ដល់ដប់ប្រាំកៅអី។"},
  {id: "06", audioFrames: 82, sticker: "love", title: "សម្រាប់គ្រប់គ្នា", khmer: "មកជាមួយគ្រួសារ មិត្តភក្តិ ឬមកធ្វើការ ក៏ស័ក្តិសមទាំងអស់។"},
  {id: "07", audioFrames: 92, sticker: "happy", title: "ទៅលេងខេត្ត", khmer: "ចង់ទៅលេងខេត្តមែនទេ? កក់ឡានឯកជន ទៅដល់មុខទ្វារតែម្តង!"},
  {id: "08", audioFrames: 192, sticker: "wow", title: "តម្លៃថោកៗ", khmer: "ភ្នំពេញទៅកំពត ចាប់ពីសែសិបប្រាំដុល្លារ ទៅសៀមរាប ចាប់ពីហុកសិបប្រាំដុល្លារ... ថោកមែនទែនហ្នឹង!"},
  {id: "09", audioFrames: 111, sticker: "ok", title: "ស្អាត ត្រជាក់ ស្រួល", khmer: "ឡានស្អាត ត្រជាក់ អង្គុយស្រួល អ្នកបើកបរក៏ចេះច្បាស់ផ្លូវទៀត។"},
  {id: "10", audioFrames: 101, sticker: "thinking", title: "កក់ ៣ ជំហាន", khmer: "ចឹង គ្រាន់តែរើសកន្លែង រើសថ្ងៃ ហើយចុច Book Now ប៉ុណ្ណឹងឯង!"},
  {id: "11", audioFrames: 82, sticker: "love", title: "បញ្ជាក់ភ្លាមៗ", khmer: "បញ្ជាក់ភ្លាមៗ តម្លៃច្បាស់លាស់ អត់មានលាក់លុយអីទេ។"},
  {id: "12", audioFrames: 260, sticker: "hi", title: "កក់ឥឡូវនេះ!", khmer: "ចូលកក់ឥឡូវនេះណា៎ នៅ vehabooking.com ឬខលមកលេខ ០៩៥ ២៥៥ ៥៧៧។"},
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
