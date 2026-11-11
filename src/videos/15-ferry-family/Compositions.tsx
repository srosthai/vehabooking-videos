import type React from "react";
import {Composition, Folder} from "remotion";
import {FerryFamilyKhVideo} from "./PrivateFerryFamilyVideo";
import {totalFrames} from "./narration";

export const FerryFamilyCompositions: React.FC = () => (
  <Folder name="15-ferry-family">
    <Composition id="FerryFamilyKhVertical" component={FerryFamilyKhVideo} durationInFrames={totalFrames} fps={30} width={1080} height={1920} />
  </Folder>
);
