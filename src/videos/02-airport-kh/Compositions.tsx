import type React from "react";
import {Composition, Folder} from "remotion";
import {totalFrames} from "./narration";
import {AirportKhVideo} from "./AirportKhVideo";

export const AirportKhCompositions: React.FC = () => (
  <Folder name="02-airport-kh">
    <Composition id="AirportKhVertical" component={AirportKhVideo} durationInFrames={totalFrames} fps={30} width={1080} height={1920} />
    <Composition id="AirportKhHorizontal" component={AirportKhVideo} durationInFrames={totalFrames} fps={30} width={1920} height={1080} />
  </Folder>
);
