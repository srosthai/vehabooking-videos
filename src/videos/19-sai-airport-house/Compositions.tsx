import type React from "react";
import {Composition, Folder} from "remotion";
import {SaiAirportHouseKhVideo} from "./SaiAirportHouseVideo";
import {totalFrames} from "./narration";

export const SaiAirportHouseCompositions: React.FC = () => (
  <Folder name="19-sai-airport-house">
    <Composition id="SaiAirportHouseKhVertical" component={SaiAirportHouseKhVideo} durationInFrames={totalFrames} fps={30} width={1080} height={1920} />
  </Folder>
);
