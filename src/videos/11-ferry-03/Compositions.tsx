import type React from "react";
import {Composition, Folder} from "remotion";
import {Ferry03KhVideo} from "./PrivateFerry03Video";
import {totalFrames} from "./narration";

export const Ferry03PrivateCompositions: React.FC = () => (
  <Folder name="11-ferry-03">
    <Composition id="Ferry03KhVertical" component={Ferry03KhVideo} durationInFrames={totalFrames} fps={30} width={1080} height={1920} />
  </Folder>
);
