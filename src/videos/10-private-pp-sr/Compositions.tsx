import type React from "react";
import {Composition, Folder} from "remotion";
import {PrivatePpSrKhVideo} from "./PrivatePpSrVideo";
import {totalFrames} from "./narration";

export const PrivatePpSrCompositions: React.FC = () => (
  <Folder name="10-private-pp-sr">
    <Composition id="PrivatePpSrKhVertical" component={PrivatePpSrKhVideo} durationInFrames={totalFrames} fps={30} width={1080} height={1920} />
  </Folder>
);
