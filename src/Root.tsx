import type React from "react";
import {PrivateAirportKhCompositions} from "./videos/01-private-airport-kh/Compositions";
import {AirportKhCompositions} from "./videos/02-airport-kh/Compositions";
import {PrivateKhCompositions} from "./videos/03-private-kh/Compositions";
import {AirportEnCompositions} from "./videos/04-airport-en/Compositions";
import {FerryCompositions} from "./videos/06-ferry/Compositions";
import {Ferry02Compositions} from "./videos/07-ferry-02/Compositions";
import {Ferry03Compositions} from "./videos/08-ferry-03/Compositions";
import {PrivateFamilyCompositions} from "./videos/09-private-family-kh/Compositions";
import {PrivatePpSrCompositions} from "./videos/10-private-pp-sr/Compositions";
import {Ferry03PrivateCompositions} from "./videos/11-ferry-03/Compositions";
import {PrivateEnCompositions} from "./videos/05-private-en/Compositions";

export const RemotionRoot: React.FC = () => (
  <>
    <PrivateAirportKhCompositions />
    <AirportKhCompositions />
    <PrivateKhCompositions />
    <AirportEnCompositions />
    <PrivateEnCompositions />
    <FerryCompositions />
    <Ferry02Compositions />
    <Ferry03Compositions />
    <PrivateFamilyCompositions />
    <PrivatePpSrCompositions />
    <Ferry03PrivateCompositions />
  </>
);
