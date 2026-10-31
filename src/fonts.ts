import {loadFont as loadCaveat} from "@remotion/google-fonts/Caveat";
import {loadFont as loadGeist} from "@remotion/google-fonts/Geist";
import {loadFont as loadKhmer} from "@remotion/google-fonts/KantumruyPro";

const geist = loadGeist("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

const khmer = loadKhmer("normal", {
  weights: ["500", "600", "700"],
  subsets: ["khmer", "latin"],
});

const caveat = loadCaveat("normal", {
  weights: ["600"],
  subsets: ["latin"],
});

export const geistFamily = geist.fontFamily;
export const khmerFamily = `${khmer.fontFamily}, ${geist.fontFamily}`;
export const handFamily = caveat.fontFamily;
