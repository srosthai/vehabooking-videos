import type React from "react";
import {Composition, Folder} from "remotion";
import {totalFrames} from "./narration";
import {AirportEnVideo} from "./AirportEnVideo";

export const AirportEnCompositions: React.FC = () => (
  <Folder name="04-airport-en">
    <Composition id="AirportEnVertical" component={AirportEnVideo} durationInFrames={totalFrames} fps={30} width={1080} height={1920} />
    <Composition id="AirportEnHorizontal" component={AirportEnVideo} durationInFrames={totalFrames} fps={30} width={1920} height={1080} />
  </Folder>
);
