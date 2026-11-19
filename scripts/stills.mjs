import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import path from "path";
const serveUrl = await bundle({entryPoint: path.resolve("src/index.ts")});
const ids = process.argv[2].split(",");
const frames = process.argv[3].split(",").map(Number);
for (const id of ids) {
  const composition = await selectComposition({serveUrl, id});
  console.log(id, composition.durationInFrames);
  for (const f of frames) await renderStill({serveUrl, composition, frame: f, output: `out/${id}-${f}.jpg`, imageFormat: "jpeg", jpegQuality: 70});
}
