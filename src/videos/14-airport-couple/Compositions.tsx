import type React from "react";
import {Composition, Folder} from "remotion";
import {AirportCoupleSedanKhVideo} from "./PrivateAirportCoupleVideo";
import {totalFrames} from "./narration";

export const AirportCoupleSedanCompositions: React.FC = () => (
  <Folder name="14-airport-couple">
    <Composition id="AirportCoupleSedanVertical" component={AirportCoupleSedanKhVideo} durationInFrames={totalFrames} fps={30} width={1080} height={1920} />
  </Folder>
);
