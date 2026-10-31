import type React from "react";
import {Composition, Folder} from "remotion";
import {totalFrames} from "./narration";
import {PrivateEnVideo} from "./PrivateEnVideo";

export const PrivateEnCompositions: React.FC = () => (
  <Folder name="05-private-en">
    <Composition id="PrivateEnVertical" component={PrivateEnVideo} durationInFrames={totalFrames} fps={30} width={1080} height={1920} />
    <Composition id="PrivateEnHorizontal" component={PrivateEnVideo} durationInFrames={totalFrames} fps={30} width={1920} height={1080} />
  </Folder>
);
