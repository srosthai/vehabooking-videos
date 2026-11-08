import React from "react";
import {AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {clamp, ease, geistFamily, khmerFamily, Logo, navy, PlaneIcon, teal, tealDeep} from "../brand";
import {SfxTrack, type SfxCue} from "../sfx";
import {scenes, timeline, totalFrames, type Timed} from "./narration";

const gold = "#FFC83D";
const outline = (w: number): React.CSSProperties => ({WebkitTextStroke: `${w}px ${navy}`, paintOrder: "stroke fill", textShadow: "0 5px 16px rgba(0,0,0,0.5)"});
const photoSrc = (src: string) => (src.includes("/") || src.includes(".") ? src : `real/${src}.jpg`);
const stickerDir = (s: Timed["speaker"]) => (s === "A" ? "a" : s === "B" ? "b" : "woman");

const Photo: React.FC<{readonly src: string; readonly elapsed: number; readonly total: number; readonly index: number; readonly zoom?: number; readonly pan?: number; readonly objectPosition?: string}> = ({src, elapsed, total, index, zoom = 0.1, pan = 18, objectPosition = "50% 50%"}) => {
  const p = interpolate(elapsed, [0, Math.max(1, total)], [0, 1], {...clamp, easing: ease});
  const scale = 1.045 + p * zoom;
  const dir = index % 2 ? 1 : -1;
  const x = dir * interpolate(p, [0, 1], [-pan, pan], clamp);
  const y = interpolate(p, [0, 1], [-8, 14], clamp);
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <Img src={staticFile(photoSrc(src))} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition, transform: `scale(${scale}) translate(${x}px,${y}px)`}} />
    </AbsoluteFill>
  );
};

const InfoCard: React.FC<{readonly style?: React.CSSProperties; readonly children: React.ReactNode}> = ({style, children}) => (
  <div style={{padding: 30, borderRadius: 34, background: "rgba(255,255,255,0.97)", boxShadow: "0 28px 64px rgba(5,20,40,0.3), inset 0 1px 0 #fff", border: "1px solid rgba(0,179,159,0.18)", borderTop: `6px solid ${teal}`, ...style}}>{children}</div>
);

const LuggageCutout: React.FC<{readonly src: string; readonly left: number; readonly top: number; readonly width: number; readonly delay?: number; readonly rotate?: number; readonly zIndex?: number}> = ({src, left, top, width, delay = 4, rotate = 0, zIndex = 16}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 12, stiffness: 150, mass: 0.8}});
  return <Img src={staticFile(src)} style={{position: "absolute", left, top, width, rotate: `${rotate}deg`, scale: String(Math.max(0, s)), filter: "drop-shadow(0 22px 24px rgba(0,0,0,0.38))", zIndex}} />;
};

const MorningScene: React.FC<{readonly duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const reveal = interpolate(f, [45, 60], [0, 1], clamp);
  const minute = interpolate(f, [0, 55], [39, 40], clamp);
  const hour = 7 + minute / 60;
  const minuteAngle = minute * 6;
  const hourAngle = (hour % 12) * 30;
  const secondAngle = Math.floor(f / 15) * 6;
  const label = f < 30 ? "07:39" : "07:40";
  const tick = interpolate(f, [28, 30, 33], [1, 1.06, 1], clamp);
  return (
    <AbsoluteFill style={{background: "#07111F"}}>
      <AbsoluteFill style={{opacity: reveal}}>
        <Photo src="real/airport-couple-user/wooden-house.png" elapsed={f} total={duration} index={0} zoom={0.08} objectPosition="28% 50%" />
      </AbsoluteFill>
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(7,17,34,0.58),rgba(7,17,34,0.12) 42%,rgba(7,17,34,0.82))"}} />
      <div style={{position: "absolute", left: 84, right: 84, top: 300, padding: "28px 30px 30px", borderRadius: 38, background: "rgba(7,20,40,0.78)", border: "1px solid rgba(255,255,255,0.28)", boxShadow: "0 30px 70px rgba(0,0,0,0.4)", backdropFilter: "blur(12px)", zIndex: 8}}>
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 18}}>
          <svg width={182} height={182} viewBox="0 0 220 220">
            <circle cx={110} cy={110} r={104} fill="rgba(255,255,255,0.96)" stroke="rgba(0,179,159,0.35)" strokeWidth={4} />
            {Array.from({length: 12}).map((_, i) => (
              <line key={i} x1={110} y1={16} x2={110} y2={i % 3 === 0 ? 30 : 24} stroke={i % 3 === 0 ? navy : "#7A8A9B"} strokeWidth={i % 3 === 0 ? 4 : 2} transform={`rotate(${i * 30} 110 110)`} />
            ))}
            <line x1={110} y1={110} x2={110} y2={58} stroke={navy} strokeWidth={11} strokeLinecap="round" transform={`rotate(${hourAngle} 110 110)`} />
            <line x1={110} y1={110} x2={110} y2={30} stroke={navy} strokeWidth={7} strokeLinecap="round" transform={`rotate(${minuteAngle} 110 110)`} />
            <line x1={110} y1={110} x2={110} y2={24} stroke={teal} strokeWidth={3} strokeLinecap="round" transform={`rotate(${secondAngle} 110 110)`} />
            <circle cx={110} cy={110} r={8} fill={teal} />
          </svg>
          <div style={{textAlign: "left"}}>
            <div style={{fontFamily: geistFamily, fontWeight: 900, fontSize: 102, letterSpacing: 3, color: "#fff", scale: String(tick), transformOrigin: "0 50%", textShadow: "0 10px 30px rgba(0,0,0,0.4)"}}>{label}</div>
            <div style={{display: "inline-flex", marginTop: 10, padding: "10px 22px", borderRadius: 999, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.3)", fontFamily: khmerFamily, fontSize: 28, fontWeight: 700, color: "#fff"}}>ជើងហោះ 10:00</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const RouteScene: React.FC<{readonly duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 8, fps, config: {damping: 12, stiffness: 150, mass: 0.8}});
  return (
    <AbsoluteFill>
      <Photo src="real/airport/siemreap-city.jpg" elapsed={f} total={duration} index={1} zoom={0.1} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(7,17,34,0.82),rgba(7,17,34,0.34) 42%,rgba(7,17,34,0.9))"}} />
      <InfoCard style={{position: "absolute", left: 76, top: 440, width: 928, scale: String(Math.max(0, s))}}>
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20}}>
          <div style={{display: "flex", alignItems: "center", gap: 14}}>
            <div style={{width: 12, height: 12, borderRadius: 999, background: teal, boxShadow: "0 0 0 8px rgba(0,179,159,0.14)"}} />
            <div style={{fontFamily: khmerFamily, fontSize: 32, fontWeight: 800, color: navy}}>ផ្ទះ</div>
          </div>
          <div style={{flex: 1, height: 3, margin: "0 10px", background: "repeating-linear-gradient(90deg,#00B39F 0 12px,transparent 12px 22px)"}} />
          <div style={{display: "flex", alignItems: "center", gap: 14}}>
            <PlaneIcon size={44} color={teal} />
            <div style={{fontFamily: khmerFamily, fontSize: 28, fontWeight: 800, color: navy, maxWidth: 380, lineHeight: 1.35}}>ព្រលានយន្តហោះ<br/>សៀមរាប</div>
          </div>
        </div>
      </InfoCard>
      <LuggageCutout src="images/airport-couple/suitcase-black.png" left={245} top={760} width={155} delay={10} rotate={-5} />
      <LuggageCutout src="images/airport-couple/suitcase-blue.png" left={445} top={720} width={205} delay={16} rotate={5} />
    </AbsoluteFill>
  );
};

const BookingScene: React.FC<{readonly duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 8, fps, config: {damping: 13, stiffness: 150, mass: 0.85}});
  return (
    <AbsoluteFill>
      <Img src={staticFile("real/airport/siemreap-city.jpg")} style={{width: "100%", height: "100%", objectFit: "cover", filter: "blur(26px) brightness(0.4)", transform: "scale(1.18)"}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(7,17,34,0.86),rgba(7,17,34,0.34) 44%,rgba(7,17,34,0.92))"}} />
      <div style={{position: "absolute", left: 430, top: 260, width: 600, height: 800, borderRadius: 72, background: "linear-gradient(145deg,#252A31,#050608)", boxShadow: "0 0 0 3px #6B7280, 0 0 0 5px #2A2D33, 0 46px 95px rgba(0,0,0,0.6), inset 0 0 0 2px rgba(255,255,255,0.12)", scale: String(Math.max(0, s)), zIndex: 20}}>
        <div style={{position: "absolute", left: 18, top: 18, width: 564, height: 764, borderRadius: 56, overflow: "hidden", background: "#F7FAFA"}}>
          <div style={{padding: "56px 24px 0", display: "flex", alignItems: "center", gap: 10}}>
            <div style={{width: 38, height: 38, borderRadius: 11, background: "#fff", boxShadow: "0 5px 14px rgba(17,31,64,0.13)", display: "flex", alignItems: "center", justifyContent: "center"}}><Img src={staticFile("veha-logo-cut.png")} style={{width: 30}} /></div>
            <div style={{fontFamily: geistFamily, fontSize: 24, fontWeight: 800, color: navy}}>Veha <span style={{color: teal}}>Booking</span></div>
          </div>
          <div style={{margin: "22px 18px 0", borderRadius: 22, overflow: "hidden", border: "1px solid #E5ECEF", boxShadow: "0 10px 26px rgba(17,31,64,0.1)"}}>
            <Img src={staticFile("images/airport-couple/sedan-18-card.png")} style={{width: "100%", display: "block"}} />
          </div>
          <div style={{margin: "18px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <div style={{fontFamily: khmerFamily, fontSize: 25, fontWeight: 800, color: navy}}>Sedan · $18</div>
            <div style={{padding: "7px 16px", borderRadius: 999, background: "rgba(0,179,159,0.14)", color: tealDeep, fontFamily: khmerFamily, fontSize: 20, fontWeight: 800}}>ការកក់របស់បង</div>
          </div>
          <div style={{margin: "16px 24px 0", height: 4, borderRadius: 999, background: "linear-gradient(90deg,#00B39F,#FFC83D)"}} />
          <div style={{margin: "22px 24px 0", display: "flex", flexDirection: "column", gap: 14}}>
            <div style={{display: "flex", alignItems: "center", gap: 12}}>
              <div style={{width: 42, height: 42, borderRadius: 14, background: "rgba(0,179,159,0.12)", display: "flex", alignItems: "center", justifyContent: "center"}}><PlaneIcon size={26} color={teal} /></div>
              <div style={{fontFamily: khmerFamily, fontSize: 22, fontWeight: 700, color: navy}}>ភ្នំពេញ → សៀមរាប</div>
            </div>
            <div style={{display: "flex", alignItems: "center", gap: 12}}>
              <div style={{width: 42, height: 42, borderRadius: 14, background: "rgba(0,179,159,0.12)", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <svg width={24} height={24} viewBox="0 0 48 48"><circle cx={24} cy={24} r={18} fill={teal}/><path d="M14 24 L21 31 L34 17" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{fontFamily: khmerFamily, fontSize: 22, fontWeight: 700, color: navy}}>ទទួលដល់មុខផ្ទះ</div>
            </div>
          </div>
          <div style={{position: "absolute", left: 0, right: 0, bottom: 24, textAlign: "center", fontFamily: geistFamily, fontSize: 20, fontWeight: 700, color: "#8A97A8"}}>vehabooking.com</div>
          <div style={{position: "absolute", left: (564 - 120) / 2, top: 14, width: 120, height: 30, borderRadius: 15, background: "#050608"}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ArrivalScene: React.FC<{readonly duration: number; readonly loading: boolean; readonly suitcaseFrom: number}> = ({duration, loading, suitcaseFrom}) => {
  const f = useCurrentFrame();
  const drive = loading ? 1 : interpolate(f, [18, 62], [0, 1], {...clamp, easing: ease});
  const carX = 410 + (1 - drive) * 1000;
  const carScale = 0.9 + 0.1 * drive;
  const dust = interpolate(f, [56, 63, 82], [0, 0.65, 0], clamp);
  const carIn = loading ? 1 : interpolate(f, [14, 20], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Photo src="real/airport-couple-user/wooden-house.png" elapsed={f} total={duration} index={2} zoom={0.06} objectPosition="28% 50%" />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(7,17,34,0.58),rgba(7,17,34,0.1) 38%,rgba(7,17,34,0.84))"}} />
      <div style={{position: "absolute", left: 520, top: 545, fontFamily: geistFamily, fontWeight: 900, fontSize: 44, color: gold, letterSpacing: 2, textShadow: "0 6px 20px rgba(0,0,0,0.4)", zIndex: 20}}>ទីត! ទីត!</div>
      <div style={{position: "absolute", left: 440 + (1 - drive) * 1000, top: 1448, width: 600, height: 44, borderRadius: 999, background: "rgba(0,0,0,0.52)", filter: "blur(14px)", opacity: carIn * 0.72, zIndex: 10}} />
      <Img src={staticFile("real/cars/sedan.png")} style={{position: "absolute", left: carX, top: 1120, width: 700, objectFit: "contain", scale: String(carScale), opacity: carIn, filter: "drop-shadow(0 32px 30px rgba(0,0,0,0.5))", zIndex: 12}} />
      <div style={{position: "absolute", left: 900, top: 1428, width: 190, height: 34, borderRadius: 999, background: "rgba(214,202,176,0.34)", filter: "blur(12px)", opacity: dust, zIndex: 14}} />
      <div style={{position: "absolute", left: 940, top: 1418, width: 140, height: 28, borderRadius: 999, background: "rgba(214,202,176,0.25)", filter: "blur(10px)", opacity: dust * 0.9, zIndex: 14}} />
      <div style={{position: "absolute", left: 850, top: 1432, width: 110, height: 24, borderRadius: 999, background: "rgba(214,202,176,0.2)", filter: "blur(9px)", opacity: dust * 0.7, zIndex: 14}} />
      <div style={{position: "absolute", left: 965, top: 1408, width: 90, height: 22, borderRadius: 999, background: "rgba(232,220,190,0.45)", filter: "blur(8px)", opacity: dust * 0.85, zIndex: 15}} />
      <div style={{position: "absolute", left: 990, top: 1388, width: 92, height: 38, borderRadius: 999, background: "rgba(230,218,190,0.5)", filter: "blur(11px)", opacity: dust * 0.9, zIndex: 15}} />
      <LuggageCutout src="images/airport-couple/suitcase-black.png" left={780} top={1237} width={120} delay={loading ? 4 : Math.max(0, suitcaseFrom - 6)} rotate={-4} />
      <LuggageCutout src="images/airport-couple/suitcase-blue.png" left={915} top={1175} width={145} delay={loading ? 8 : Math.max(0, suitcaseFrom - 2)} rotate={4} />
    </AbsoluteFill>
  );
};

const PriceCard: React.FC<{readonly show: number}> = ({show}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - show, fps, config: {damping: 12, stiffness: 150, mass: 0.8}});
  return (
    <InfoCard style={{position: "absolute", left: 60, top: 470, width: 540, scale: String(Math.max(0, s))}}>
      <div style={{fontFamily: geistFamily, fontSize: 20, fontWeight: 800, color: "#5A6B85", letterSpacing: 1.2}}>SEDAN · PRIVATE CAR</div>
      <div style={{display: "flex", alignItems: "flex-end", gap: 12, marginTop: 10}}>
        <div style={{fontFamily: geistFamily, fontSize: 112, fontWeight: 900, lineHeight: 0.9, color: teal}}>$18</div>
        <div style={{fontFamily: khmerFamily, fontSize: 26, fontWeight: 700, color: "#5A6B85", paddingBottom: 10}}>ក្នុងមួយឡាន</div>
      </div>
      <div style={{height: 4, borderRadius: 999, background: "linear-gradient(90deg,#00B39F,#FFC83D)", marginTop: 16}} />
    </InfoCard>
  );
};

const RideScene: React.FC<{readonly duration: number; readonly sceneFrom: number; readonly priceFrom: number}> = ({duration, sceneFrom, priceFrom}) => {
  const f = useCurrentFrame();
  const reveal = Math.max(0, priceFrom - sceneFrom);
  return (
    <AbsoluteFill>
      <Photo src="real/sedan.jpg" elapsed={f} total={duration} index={4} zoom={0.08} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(7,17,34,0.82),rgba(7,17,34,0.24) 42%,rgba(7,17,34,0.9))"}} />
      <PriceCard show={reveal} />
    </AbsoluteFill>
  );
};

const AirportEndScene: React.FC<{readonly duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const endP = interpolate(f, [duration * 0.5, duration * 0.62], [0, 1], clamp);
  const pulse = 1 + Math.sin(f / 8) * 0.035;
  return (
    <AbsoluteFill>
      <Photo src="real/airport/siemreap-airport.png" elapsed={f} total={duration} index={6} zoom={0.08} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(7,17,34,0.74),rgba(7,17,34,0.22) 40%,rgba(7,17,34,0.9))"}} />
      <AbsoluteFill style={{opacity: endP}}>
        <AbsoluteFill style={{background: "linear-gradient(150deg,rgba(6,20,36,0.93),rgba(0,120,108,0.9))"}} />
        <div style={{position: "absolute", left: 62, top: 250, width: 430, height: 820, borderRadius: 68, background: "linear-gradient(145deg,#252A31,#050608)", boxShadow: "0 0 0 3px #6B7280, 0 0 0 5px #2A2D33, 0 44px 90px rgba(0,0,0,0.58), inset 0 0 0 2px rgba(255,255,255,0.12)", zIndex: 22}}>
          <div style={{position: "absolute", left: 18, top: 18, width: 394, height: 784, borderRadius: 50, overflow: "hidden", background: "#F7FAFA"}}>
            <Img src={staticFile("real/airport/app-airport-search.png")} style={{width: 394, height: "auto", display: "block", objectFit: "cover", objectPosition: "top"}} />
            <div style={{position: "absolute", left: (394 - 110) / 2, top: 12, width: 110, height: 28, borderRadius: 14, background: "#050608", zIndex: 5}} />
          </div>
        </div>
        <div style={{position: "absolute", left: 520, top: 300, width: 500, padding: "30px 30px 32px", borderRadius: 38, background: "rgba(255,255,255,0.97)", borderTop: `7px solid ${teal}`, boxShadow: "0 34px 80px rgba(0,0,0,0.4)", zIndex: 24}}>
          <div style={{display: "flex", justifyContent: "center"}}><Logo size={94} /></div>
          <div style={{fontFamily: geistFamily, fontSize: 22, fontWeight: 800, color: "#5A6B85", letterSpacing: 1.5, marginTop: 22, textAlign: "center"}}>SEDAN · $18</div>
          <div style={{fontFamily: khmerFamily, fontSize: 32, fontWeight: 800, color: navy, marginTop: 2, textAlign: "center"}}>ក្នុងមួយឡាន</div>
          <div style={{height: 4, width: 140, borderRadius: 999, background: `linear-gradient(90deg,${teal},${gold})`, margin: "18px auto"}} />
          <div style={{fontFamily: geistFamily, fontSize: 46, fontWeight: 800, color: navy, textAlign: "center"}}>vehabooking.com</div>
          <div style={{fontFamily: geistFamily, fontSize: 32, fontWeight: 700, color: "#5A6B85", marginTop: 8, textAlign: "center"}}>095 255 577</div>
          <div style={{marginTop: 22, display: "flex", justifyContent: "center"}}>
            <div style={{scale: String(pulse), padding: "14px 34px", borderRadius: 999, background: teal, color: "#fff", fontFamily: geistFamily, fontSize: 28, fontWeight: 900, border: "4px solid #fff", boxShadow: "0 18px 38px rgba(0,179,159,0.45)"}}>Book Now</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneBackground: React.FC<{readonly scene: (typeof scenes)[number]}> = ({scene}) => {
  const f = useCurrentFrame();
  const inP = scene.id === "s1" ? 1 : interpolate(f, [0, 10], [0, 1], {...clamp, easing: ease});
  const outP = scene.id === "s7" ? 1 : interpolate(f, [scene.duration - 8, scene.duration + 8], [1, 0], {...clamp, easing: ease});
  const opacity = Math.min(inP, outP);
  return (
    <AbsoluteFill style={{opacity}}>
      {scene.id === "s1" ? <MorningScene duration={scene.duration} /> :
       scene.id === "s2" ? <RouteScene duration={scene.duration} /> :
       scene.id === "s3" ? <BookingScene duration={scene.duration} /> :
       scene.id === "s4" ? <ArrivalScene duration={scene.duration} loading={false} suitcaseFrom={timeline.find((l) => l.id === "c08")!.from - scene.from} /> :
       scene.id === "s5" ? <ArrivalScene duration={scene.duration} loading={true} suitcaseFrom={0} /> :
       scene.id === "s6" ? <RideScene duration={scene.duration} sceneFrom={scene.from} priceFrom={timeline.find((l) => l.id === "c11")!.from} /> :
       <AirportEndScene duration={scene.duration} />}
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 44%, transparent 46%, rgba(7,17,34,0.34) 100%)"}} />
    </AbsoluteFill>
  );
};

const StickerFrame: React.FC<{readonly line: Timed}> = ({line}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 12, stiffness: 155, mass: 0.8}});
  const width = 390;
  const height = 460;
  const side: React.CSSProperties = line.id === "c04" ? {left: 22} : line.speaker === "B" ? {right: 22} : {left: 22};
  const sampeahStart = line.voiceFrom - line.from;
  const sampeahEnd = sampeahStart + Math.round(3.49 * 30);
  const sampeah = line.id === "c08" && f >= sampeahStart && f < sampeahEnd ? 1 : 0;
  const reveal = line.id === "c01" ? interpolate(f, [48, 56], [0, 1], clamp) : 1;
  const top = line.id === "c04" ? 680 : 930;
  return (
    <div style={{position: "absolute", top, width, height, ...side, scale: String(Math.max(0, s)), opacity: reveal, zIndex: 24}}>
      <div style={{position: "absolute", left: 12, right: 12, bottom: 0, height: 420}}>
        <div style={{position: "absolute", left: "50%", bottom: 0, translate: "-50% 0", opacity: 1 - sampeah}}>
          <Img src={staticFile(`stickers/people/${stickerDir(line.speaker)}/${line.sticker}.png`)} style={{width: 360, maxHeight: 420, objectFit: "contain", filter: "drop-shadow(0 16px 24px rgba(0,0,0,0.42))"}} />
        </div>
        {line.id === "c08" && (
          <div style={{position: "absolute", left: "50%", bottom: 0, translate: "-50% 0", opacity: sampeah}}>
            <Img src={staticFile("stickers/people/a/sampeah.png")} style={{width: 360, maxHeight: 420, objectFit: "contain", filter: "drop-shadow(0 16px 24px rgba(0,0,0,0.42))"}} />
          </div>
        )}
      </div>
    </div>
  );
};

const CAPTION_BREAK_AFTER: Record<string, string> = {
  c03: "បង!",
  c13: "សៀមរាប",
};
const CAPTION_FONT_SIZE: Record<string, number> = {
  c03: 40,
  c04: 38,
  c13: 40,
};

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const line = timeline.find((l) => frame >= l.voiceFrom - 3 && frame < l.voiceFrom + l.audioFrames + 5);
  if (!line) return null;
  const local = frame - line.voiceFrom;
  const opacity = interpolate(local, [-3, 2, line.audioFrames + 1, line.audioFrames + 5], [0, 1, 1, 0], clamp);
  const size = CAPTION_FONT_SIZE[line.id] ?? (line.speaker === "N" ? 48 : 50);
  return (
    <div style={{position: "absolute", left: 42, right: 42, bottom: 188, textAlign: "center", opacity, zIndex: 55}}>
      <div style={{fontFamily: khmerFamily, fontWeight: line.speaker === "N" ? 700 : 800, fontSize: size, lineHeight: 1.55, color: "#fff", ...outline(10)}}>
        {(() => { let breakDone = false; return line.segs.map(([w, st], i) => {
          const s = st * 30;
          const base = "#FFFFFF";
          return (
            <React.Fragment key={i}>
              <span style={{color: local >= s ? teal : base, display: "inline-block", whiteSpace: "pre"}}>{w}</span>
              {!breakDone && CAPTION_BREAK_AFTER[line.id] && w.trim() === CAPTION_BREAK_AFTER[line.id] ? (() => { breakDone = true; return <br />; })() : null}
            </React.Fragment>
          );
        }); })()}
      </div>
    </div>
  );
};

const Sfx: React.FC = () => {
  const cues: SfxCue[] = [];
  for (const s of scenes) {
    cues.push({frame: s.from, sfx: "whoosh", note: `to ${s.id}`, volume: 0.35});
    for (const l of s.lines) if (l.showSticker) cues.push({frame: l.from + 4, sfx: "pop", note: `sticker ${l.sticker}`, volume: 0.45});
  }
  for (const tickFrame of [0, 15, 30, 45]) cues.push({frame: tickFrame, sfx: "tick", note: "clock tick", volume: 0.34});
  cues.push({frame: timeline.find((l) => l.id === "c11")!.from + 4, sfx: "coin", note: "price $18", volume: 0.45});
  cues.push({frame: timeline.find((l) => l.id === "c13")!.from + 70, sfx: "ding", note: "end card", volume: 0.4});
  return <SfxTrack cues={cues} />;
};

const Horn: React.FC = () => {
  const s4 = scenes.find((s) => s.id === "s4")!;
  return (
    <Sequence from={s4.from + 4} durationInFrames={30} layout="none" name="SFX · gentle car horn">
      <Audio src={staticFile("sfx/car-horn-gentle.wav")} volume={0.52} />
    </Sequence>
  );
};

const Film: React.FC = () => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: navy}}>
      {scenes.map((s, i) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.duration + 10} name={`${s.id} background`} premountFor={20}>
          <SceneBackground scene={s} />
        </Sequence>
      ))}
      {timeline.filter((l) => l.showSticker).map((l) => (
        <Sequence key={`st-${l.id}`} from={l.from} durationInFrames={l.duration} name={`sticker ${l.id}`} premountFor={10}>
          <StickerFrame line={l} />
        </Sequence>
      ))}
      <Audio src={staticFile("music/veha-bed.wav")} loop volume={(f) => {
        const duck = timeline.reduce((g, l) => Math.min(g, interpolate(f, [l.voiceFrom - 5, l.voiceFrom, l.voiceFrom + l.audioFrames, l.voiceFrom + l.audioFrames + 7], [1, 0.42, 0.42, 1], clamp)), 1);
        return interpolate(f, [0, fps * 0.6, totalFrames - fps, totalFrames - 1], [0, 0.09, 0.09, 0], clamp) * duck;
      }} />
      {timeline.map((l) => (
        <Sequence key={`v-${l.id}`} from={l.voiceFrom} durationInFrames={l.audioFrames + 3} layout="none" name={`voice ${l.id}`}>
          <Audio src={staticFile(`voice/airport-couple/${l.id}.mp3`)} />
        </Sequence>
      ))}
      <Sfx />
      <Horn />
      <div style={{position: "absolute", left: 56, top: 54, scale: "0.78", transformOrigin: "0 0", zIndex: 60}}><Logo size={80} light /></div>
      <div style={{position: "absolute", right: 56, top: 76, fontFamily: geistFamily, fontWeight: 700, fontSize: 25, color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.55)", zIndex: 60}}>vehabooking.com</div>
      <Captions />
      <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 6, background: "rgba(255,255,255,0.16)", zIndex: 70}}>
        <div style={{width: `${(frame / totalFrames) * 100}%`, height: "100%", borderRadius: "0 999px 999px 0", background: `linear-gradient(90deg,${teal},${gold})`}} />
      </div>
      <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 4, background: `linear-gradient(90deg,${teal},rgba(255,255,255,0.5),${gold})`, opacity: 0.85, zIndex: 70}} />
    </AbsoluteFill>
  );
};

export const AirportCoupleSedanKhVideo: React.FC = () => <Film />;
