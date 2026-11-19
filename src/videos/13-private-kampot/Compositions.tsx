import type React from "react";
import {Composition, Folder} from "remotion";
import {PrivateKampotKhVideo} from "./PrivateKampotVideo";
import {totalFrames} from "./narration";

export const PrivateKampotCompositions: React.FC = () => (
  <Folder name="13-private-kampot">
    <Composition id="PrivateKampotKhVertical" component={PrivateKampotKhVideo} durationInFrames={totalFrames} fps={30} width={1080} height={1920} />
  </Folder>
);
