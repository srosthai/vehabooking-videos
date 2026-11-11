import React from "react";
import {AbsoluteFill, Img, staticFile} from "remotion";
import {geistFamily, khmerFamily, Logo, navy, PlaneIcon, teal} from "../brand";

const gold = "#FFC83D";
const PRICE = "$15";

const Person: React.FC<{
  readonly src: string;
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly zIndex: number;
}> = ({src, left, top, width, zIndex}) => (
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute",
      left,
      top,
      width,
      height: "auto",
      zIndex,
      filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.5))",
    }}
  />
);

export const AirportCoupleThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{background: "#07111F", overflow: "hidden"}}>
      <Img
        src={staticFile("real/airport-couple-user/home-warm-reference.png")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 46%",
          transform: "scale(1.12)",
          filter: "blur(4px) brightness(0.62) saturate(1.05)",
        }}
      />
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 42%, rgba(255,174,80,0.24), transparent 58%)"}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(7,17,34,0.74),rgba(7,17,34,0.2) 32%,rgba(7,17,34,0.86))"}} />

      <div style={{position: "absolute", left: 58, top: 86, zIndex: 30}}>
        <Logo size={92} light />
      </div>

      <div
        style={{
          position: "absolute",
          left: 708,
          top: 88,
          width: 314,
          height: 182,
          borderRadius: 30,
          overflow: "hidden",
          border: "2px solid rgba(255,255,255,0.55)",
          boxShadow: "0 24px 50px rgba(0,0,0,0.4)",
          zIndex: 30,
        }}
      >
        <Img
          src={staticFile("real/airport/siemreap-airport.png")}
          style={{width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7) saturate(0.9)"}}
        />
        <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(7,17,34,0.05),rgba(7,17,34,0.86))"}} />
        <div style={{position: "absolute", left: 18, right: 18, bottom: 16, display: "flex", alignItems: "center", gap: 10}}>
          <PlaneIcon size={25} color="#FFFFFF" />
          <div style={{fontFamily: geistFamily, fontSize: 20, fontWeight: 800, letterSpacing: 1.2, color: "#FFFFFF"}}>AIRPORT TRANSFER</div>
        </div>
      </div>

      <Person src="stickers/people/woman/happy.png" left={18} top={478} width={330} zIndex={21} />
      <Person src="stickers/people/b/happy.png" left={360} top={500} width={355} zIndex={22} />
      <Person src="stickers/people/a/sampeah.png" left={705} top={472} width={340} zIndex={21} />

      <div
        style={{
          position: "absolute",
          left: 56,
          top: 1242,
          width: 374,
          padding: "26px 26px 30px",
          borderRadius: 34,
          background: "rgba(255,255,255,0.98)",
          borderTop: `7px solid ${teal}`,
          boxShadow: "0 34px 70px rgba(0,0,0,0.45)",
          zIndex: 34,
        }}
      >
        <div style={{display: "flex", alignItems: "center", gap: 9}}>
          <PlaneIcon size={22} color={teal} />
          <div style={{fontFamily: geistFamily, fontSize: 18, fontWeight: 800, letterSpacing: 1.2, color: "#5A6B85"}}>AIRPORT TRANSFER</div>
        </div>
        <div style={{fontFamily: geistFamily, fontSize: 150, fontWeight: 900, lineHeight: 0.88, color: teal, marginTop: 8}}>{PRICE}</div>
        <div style={{fontFamily: khmerFamily, fontSize: 28, fontWeight: 800, color: navy, marginTop: 2}}>ក្នុងមួយឡាន</div>
        <div style={{height: 4, width: 130, borderRadius: 999, background: `linear-gradient(90deg,${teal},${gold})`, margin: "16px 0 12px"}} />
        <div style={{fontFamily: geistFamily, fontSize: 19, fontWeight: 800, letterSpacing: 1.2, color: navy}}>SEDAN · SIEM REAP</div>
      </div>

      <div style={{position: "absolute", left: 450, top: 1320, width: 520, height: 38, borderRadius: 999, background: "rgba(0,0,0,0.5)", filter: "blur(16px)", zIndex: 20}} />
      <Img
        src={staticFile("real/cars/sedan.png")}
        style={{
          position: "absolute",
          left: 410,
          top: 1072,
          width: 620,
          height: "auto",
          zIndex: 24,
          filter: "drop-shadow(0 30px 34px rgba(0,0,0,0.55))",
        }}
      />

      <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 5, background: `linear-gradient(90deg,${teal},rgba(255,255,255,0.5),${gold})`, opacity: 0.9, zIndex: 40}} />
    </AbsoluteFill>
  );
};
