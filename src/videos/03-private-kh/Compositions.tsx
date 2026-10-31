import type React from "react";
import {Composition, Folder} from "remotion";
import {totalFrames} from "./narration";
import {PrivateKhVideo} from "./PrivateKhVideo";

export const PrivateKhCompositions: React.FC = () => (
  <Folder name="03-private-kh">
    <Composition id="PrivateKhVertical" component={PrivateKhVideo} durationInFrames={totalFrames} fps={30} width={1080} height={1920} />
    <Composition id="PrivateKhHorizontal" component={PrivateKhVideo} durationInFrames={totalFrames} fps={30} width={1920} height={1080} />
  </Folder>
);
