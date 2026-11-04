import type React from "react";
import {Composition, Folder} from "remotion";
import {kh} from "./narration";
import {Ferry03KhVideo} from "./Ferry03Video";

export const Ferry03Compositions: React.FC = () => (
  <Folder name="08-ferry-03">
    <Composition id="Ferry03LegacyKhVertical" component={Ferry03KhVideo} durationInFrames={kh.totalFrames} fps={30} width={1080} height={1920} />
    <Composition id="Ferry03LegacyKhHorizontal" component={Ferry03KhVideo} durationInFrames={kh.totalFrames} fps={30} width={1920} height={1080} />
  </Folder>
);
