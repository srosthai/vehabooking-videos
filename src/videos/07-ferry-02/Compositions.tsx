import type React from "react";
import {Composition, Folder} from "remotion";
import {en, kh} from "./narration";
import {Ferry02EnVideo, Ferry02KhVideo} from "./Ferry02Video";

export const Ferry02Compositions: React.FC = () => (
  <Folder name="07-ferry-02">
    <Composition id="Ferry02KhVertical" component={Ferry02KhVideo} durationInFrames={kh.totalFrames} fps={30} width={1080} height={1920} />
    <Composition id="Ferry02EnVertical" component={Ferry02EnVideo} durationInFrames={en.totalFrames} fps={30} width={1080} height={1920} />
  </Folder>
);
