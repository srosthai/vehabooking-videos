import type React from "react";
import {Composition, Folder} from "remotion";
import {AirportDialogueKhVideo} from "./AirportDialogueVideo";
import {totalFrames} from "./narration";

export const AirportDialogueCompositions: React.FC = () => (
  <Folder name="12-airport-dialogue">
    <Composition id="AirportDialogueKhVertical" component={AirportDialogueKhVideo} durationInFrames={totalFrames} fps={30} width={1080} height={1920} />
  </Folder>
);
