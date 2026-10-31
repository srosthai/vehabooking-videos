import type React from "react";
import {Composition, Folder} from "remotion";
import {en, kh} from "./narration";
import {FerryEnVideo, FerryKhVideo} from "./FerryVideo";

export const FerryCompositions: React.FC = () => (
  <Folder name="06-ferry">
    <Composition id="FerryKhVertical" component={FerryKhVideo} durationInFrames={kh.totalFrames} fps={30} width={1080} height={1920} />
    <Composition id="FerryKhHorizontal" component={FerryKhVideo} durationInFrames={kh.totalFrames} fps={30} width={1920} height={1080} />
    <Composition id="FerryEnVertical" component={FerryEnVideo} durationInFrames={en.totalFrames} fps={30} width={1080} height={1920} />
    <Composition id="FerryEnHorizontal" component={FerryEnVideo} durationInFrames={en.totalFrames} fps={30} width={1920} height={1080} />
  </Folder>
);
