import type React from "react";
import {Composition, Folder} from "remotion";
import {totalFrames} from "./narration";
import {PrivateAirportKhVideo} from "./PrivateAirportKhVideo";

export const PrivateAirportKhCompositions: React.FC = () => (
  <Folder name="01-private-airport-kh">
    <Composition id="PrivateAirportKhVertical" component={PrivateAirportKhVideo} durationInFrames={totalFrames} fps={30} width={1080} height={1920} />
    <Composition id="PrivateAirportKhHorizontal" component={PrivateAirportKhVideo} durationInFrames={totalFrames} fps={30} width={1920} height={1080} />
  </Folder>
);
