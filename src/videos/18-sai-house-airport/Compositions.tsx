import type React from "react";
import {Composition, Folder} from "remotion";
import {SaiHouseAirportKhVideo} from "./SaiHouseAirportVideo";
import {totalFrames} from "./narration";

export const SaiHouseAirportCompositions: React.FC = () => (
  <Folder name="18-sai-house-airport">
    <Composition id="SaiHouseAirportKhVertical" component={SaiHouseAirportKhVideo} durationInFrames={totalFrames} fps={30} width={1080} height={1920} />
  </Folder>
);
