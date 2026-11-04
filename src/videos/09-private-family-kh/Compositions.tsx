import type React from "react";
import {Composition, Folder} from "remotion";
import {CharacterTest} from "./CharacterTest";
import {PrivateFamilyKhVideo} from "./PrivateFamilyVideo";
import {totalFrames} from "./narration";

export const PrivateFamilyCompositions: React.FC = () => (
  <Folder name="09-private-family">
    <Composition id="PrivateFamilyKhVertical" component={PrivateFamilyKhVideo} durationInFrames={totalFrames} fps={30} width={1080} height={1920} />
    <Composition id="PrivateFamilyCharacterTest" component={CharacterTest} durationInFrames={90} fps={30} width={1080} height={1920} />
  </Folder>
);
