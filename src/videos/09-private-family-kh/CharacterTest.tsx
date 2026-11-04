import React from "react";
import {AbsoluteFill} from "remotion";
import {Character} from "./characters";

export const CharacterTest: React.FC = () => (
  <AbsoluteFill style={{background: "#F1FAF8", flexDirection: "row", justifyContent: "center", alignItems: "flex-end", gap: 10, paddingBottom: 120}}>
    <Character kind="mom" pose="phone" speaking offset={4} style={{width: 320, height: 746}} />
    <Character kind="dad" pose="hands" offset={22} style={{width: 320, height: 746}} />
    <Character kind="girl" pose="wave" offset={44} style={{width: 320, height: 746}} />
  </AbsoluteFill>
);
