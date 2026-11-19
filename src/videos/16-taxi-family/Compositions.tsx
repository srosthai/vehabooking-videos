import type React from "react";
import {Composition, Folder} from "remotion";
import {TaxiFamilyKhVideo} from "./PrivateTaxiFamilyVideo";
import {totalFrames} from "./narration";

export const TaxiFamilyCompositions: React.FC = () => (
  <Folder name="16-taxi-family">
    <Composition id="TaxiFamilyKhVertical" component={TaxiFamilyKhVideo} durationInFrames={totalFrames} fps={30} width={1080} height={1920} />
  </Folder>
);
