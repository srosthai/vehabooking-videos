import type React from "react";
import {PrivateAirportKhCompositions} from "./videos/01-private-airport-kh/Compositions";
import {AirportKhCompositions} from "./videos/02-airport-kh/Compositions";
import {PrivateKhCompositions} from "./videos/03-private-kh/Compositions";
import {AirportEnCompositions} from "./videos/04-airport-en/Compositions";
import {FerryCompositions} from "./videos/06-ferry/Compositions";
import {PrivateEnCompositions} from "./videos/05-private-en/Compositions";

export const RemotionRoot: React.FC = () => (
  <>
    <PrivateAirportKhCompositions />
    <AirportKhCompositions />
    <PrivateKhCompositions />
    <AirportEnCompositions />
    <PrivateEnCompositions />
    <FerryCompositions />
  </>
);
