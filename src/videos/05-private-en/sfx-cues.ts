import type {SfxCue} from "../sfx";
import {timeline} from "./narration";

// Derived from the timeline: whoosh on every scene change, pop when the sticker lands, extra accents per scene.
const extra: Record<string, ReadonlyArray<[number, SfxCue["sfx"], number?]>> = {
  "01": [[2, "whoosh", 0.8], [36, "paper", 0.7]],
  "02": [[4, "ding", 0.7]],
  "03": [[30, "tap", 0.8], [50, "tap", 0.8], [70, "tap", 0.8]],
  "04": [[10, "pop"], [120, "coin", 0.8]],
  "05": [[20, "tick"], [46, "tick"], [72, "tick"], [98, "tick"]],
  "06": [[30, "tick"], [44, "tick"], [58, "tick"]],
  "07": [[0, "whoosh", 0.9]],
  "08": [[40, "coin", 0.8], [125, "coin", 0.8]],
  "09": [[18, "tick"], [36, "tick"], [54, "tick"], [72, "tick"]],
  "10": [[14, "type", 0.6], [34, "type", 0.6], [54, "type", 0.6], [72, "tap"]],
  "11": [[12, "ding", 0.8]],
  "12": [[2, "pop"], [20, "tap", 0.7], [120, "scan", 0.5]],
};

export const cues: readonly SfxCue[] = timeline.flatMap((l, i) => {
  const base = l.from + (i === 0 ? 10 : 0);
  const list: SfxCue[] = [];
  if (i > 0) list.push({frame: l.from, sfx: "whoosh", note: `to scene ${l.id}`, volume: 0.5});
  list.push({frame: l.from + 12, sfx: "pop", note: `sticker ${l.sticker}`, volume: 0.7});
  for (const [d, sfx, v] of extra[l.id] ?? []) list.push({frame: base + d, sfx, note: `scene ${l.id}`, volume: v ?? 0.7});
  return list;
});
