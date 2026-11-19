import type React from "react";
import {Composition, Folder} from "remotion";
import {AirportHotelKhVideo} from "./PrivateAirportHotelVideo";
import {totalFrames} from "./narration";

export const AirportHotelCompositions: React.FC = () => (
  <Folder name="17-airport-hotel">
    <Composition id="AirportHotelKhVertical" component={AirportHotelKhVideo} durationInFrames={totalFrames} fps={30} width={1080} height={1920} />
  </Folder>
);
