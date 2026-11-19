import React from "react";
import {AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {CarIcon, clamp, ease, geistFamily, khmerFamily, Logo, navy, teal} from "../brand";
import {SfxTrack, type SfxCue} from "../sfx";
import {timeline, totalFrames, type Timed} from "./narration";

const gold = "#FFC83D";
const outline = (w: number): React.CSSProperties => ({WebkitTextStroke: `${w}px ${navy}`, paintOrder: "stroke fill", textShadow: "0 6px 18px rgba(0,0,0,0.45)"});
const photoSrc = (src: string) => (src.includes("/") || src.includes(".") ? src : `real/${src}.jpg`);
const sideFor = (line: Timed): React.CSSProperties => (line.speaker === "A" ? {left: 22} : {right: 22});

const Photo: React.FC<{readonly src: string; readonly duration: number; readonly index: number; readonly zoom?: number; readonly pan?: number}> = ({src, duration, index, zoom = 0.12, pan = 22}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, Math.max(1, duration - 1)], [0, 1], {...clamp, easing: ease});
  const scale = 1.05 + p * zoom;
  const dir = index % 2 ? 1 : -1;
  const x = dir * interpolate(p, [0, 1], [-pan, pan], clamp);
  const y = interpolate(p, [0, 1], [-8, 16], clamp);
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <Img src={staticFile(photoSrc(src))} style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale}) translate(${x}px,${y}px)`}} />
    </AbsoluteFill>
  );
};

const TitleCard: React.FC<{readonly line: Timed}> = ({line}) => {
  const size = line.id === "p11" ? 54 : line.title.length > 20 ? 58 : 68;
  return (
    <div style={{position: "absolute", left: 44, right: 44, top: 142, display: "flex", justifyContent: "center", zIndex: 35}}>
      <div style={{maxWidth: 960, padding: "14px 34px 16px", borderRadius: 30, background: "linear-gradient(180deg,rgba(7,17,34,0.72),rgba(7,17,34,0.46))", border: "1px solid rgba(255,255,255,0.22)", boxShadow: "0 24px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.16)", backdropFilter: "blur(12px)"}}>
        <div style={{height: 5, width: 76, margin: "0 auto 8px", borderRadius: 999, background: `linear-gradient(90deg,${teal},${gold})`}} />
        <div style={{fontFamily: khmerFamily, fontSize: size, fontWeight: 800, lineHeight: 1.3, color: "#fff", textAlign: "center", textShadow: "0 4px 18px rgba(0,0,0,0.45)"}}>{line.title}</div>
      </div>
    </div>
  );
};

const StickerFrame: React.FC<{readonly line: Timed}> = ({line}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 6, fps, config: {damping: 11, stiffness: 165, mass: 0.75}});
  const compact = line.kind === "finale";
  const width = compact ? 286 : 382;
  const height = compact ? 342 : 448;
  const top = compact ? 986 : 884;
  const color = line.speaker === "A" ? teal : gold;
  return (
    <div style={{position: "absolute", top, width, height, ...sideFor(line), borderRadius: 38, background: "linear-gradient(180deg,rgba(10,24,45,0.24),rgba(10,24,45,0.68))", border: "2px solid rgba(255,255,255,0.4)", boxShadow: "0 30px 72px rgba(0,0,0,0.46), inset 0 1px 0 rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", scale: String(Math.max(0, s)), rotate: `${(line.speaker === "A" ? -4 : 4) * (1 - s) * 0.5}deg`, zIndex: 22, overflow: "hidden"}}>
      <div style={{position: "absolute", left: 14, top: 14, padding: "5px 16px 6px", borderRadius: 999, background: color, color: line.speaker === "A" ? "#062A25" : "#3B2A00", fontFamily: geistFamily, fontWeight: 900, fontSize: 22, letterSpacing: 1.4, boxShadow: "0 8px 20px rgba(0,0,0,0.28)", zIndex: 3}}>{line.speaker === "A" ? "● A" : "● B"}</div>
      <div style={{position: "absolute", left: 12, right: 12, bottom: 0, height: 360, display: "flex", alignItems: "flex-end", justifyContent: "center"}}>
        <Img src={staticFile(`stickers/people/${line.speaker.toLowerCase()}/${line.sticker}.png`)} style={{width: compact ? 246 : 348, maxHeight: compact ? 300 : 400, objectFit: "contain", filter: "drop-shadow(0 18px 26px rgba(0,0,0,0.4))"}} />
      </div>
    </div>
  );
};

const CAPTION_BREAK_AFTER: Record<string, string> = {
  p01: "លេង",
  p08: "ផ្លូវ",
  p09: "ត្រង់ណា",
  p12: "Now",
};
const CAPTION_FONT_SIZE: Record<string, number> = {
  p12: 44,
};

const Captions: React.FC<{readonly tl: readonly Timed[]}> = ({tl}) => {
  const frame = useCurrentFrame();
  const line = tl.find((l) => frame >= l.voiceFrom - 3 && frame < l.voiceFrom + l.audioFrames + 5);
  if (!line) return null;
  const local = frame - line.voiceFrom;
  const opacity = interpolate(local, [-3, 1, line.audioFrames + 1, line.audioFrames + 5], [0, 1, 1, 0], clamp);
  return (
    <div style={{position: "absolute", left: 20, right: 20, bottom: 224, textAlign: "center", opacity, zIndex: 55}}>
      <div style={{fontFamily: khmerFamily, fontWeight: line.speaker === "A" ? 700 : 800, fontSize: CAPTION_FONT_SIZE[line.id] ?? (line.speaker === "A" ? 50 : 52), lineHeight: 1.68, color: "#fff", ...outline(11)}}>
        {line.segs.map(([w, st], i) => {
          const s = st * 30;
          const pop = interpolate(local, [s, s + 3, s + 7], [1, 1.11, 1], clamp);
          const base = line.speaker === "A" ? "#FFFFFF" : "#FFE7A3";
          return (
            <React.Fragment key={i}>
              <span style={{color: local >= s ? teal : base, display: "inline-block", whiteSpace: "pre", scale: String(pop)}}>{w}</span>
              {CAPTION_BREAK_AFTER[line.id] && w.trim() === CAPTION_BREAK_AFTER[line.id] ? <br /> : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const InfoCard: React.FC<{readonly x: number; readonly y: number; readonly width: number; readonly delay: number; readonly children: React.ReactNode; readonly accent?: string}> = ({x, y, width, delay, children, accent = teal}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 12, stiffness: 155, mass: 0.8}});
  return (
    <div style={{position: "absolute", left: x, top: y, width, padding: 28, borderRadius: 34, background: "rgba(255,255,255,0.97)", boxShadow: "0 28px 64px rgba(5,20,40,0.32), inset 0 1px 0 #fff", border: "1px solid rgba(0,179,159,0.2)", borderTop: `6px solid ${accent}`, scale: String(Math.max(0, s)), zIndex: 26}}>
      {children}
    </div>
  );
};

const PriceCard: React.FC = () => (
  <InfoCard x={76} y={520} width={560} delay={8}>
    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
      <div>
        <div style={{fontFamily: geistFamily, fontSize: 24, fontWeight: 800, color: "#5A6B85", letterSpacing: 1}}>PHNOM PENH → KAMPOT</div>
        <div style={{fontFamily: khmerFamily, fontSize: 30, fontWeight: 700, color: navy, marginTop: 6}}>ឡានឯកជន · គ្រួសារ</div>
      </div>
      <div style={{width: 60, height: 60, borderRadius: 18, background: "rgba(0,179,159,0.12)", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <CarIcon width={46} color={teal} kind="mpv" />
      </div>
    </div>
    <div style={{display: "flex", alignItems: "flex-end", gap: 14, marginTop: 18}}>
      <div style={{fontFamily: geistFamily, fontSize: 118, fontWeight: 900, lineHeight: 0.9, color: teal}}>$45</div>
      <div style={{fontFamily: khmerFamily, fontSize: 28, fontWeight: 700, color: "#5A6B85", paddingBottom: 10}}>សម្រាប់ឡានមួយ</div>
    </div>
    <div style={{height: 4, borderRadius: 999, background: "linear-gradient(90deg,#00B39F,#9BE8DC)", marginTop: 18}} />
  </InfoCard>
);

const CompareCard: React.FC = () => (
  <InfoCard x={76} y={520} width={600} delay={8} accent={gold}>
    <div style={{fontFamily: khmerFamily, fontSize: 32, fontWeight: 800, color: navy}}>ធូថ្លៃជាងឡានក្រុង</div>
    <div style={{display: "flex", gap: 14, marginTop: 20}}>
      <div style={{flex: 1, borderRadius: 24, background: "rgba(0,179,159,0.1)", padding: "18px 20px"}}>
        <div style={{fontFamily: geistFamily, fontSize: 18, fontWeight: 800, color: teal}}>VEHA BOOKING</div>
        <div style={{fontFamily: geistFamily, fontSize: 52, fontWeight: 900, color: navy, marginTop: 4}}>$45</div>
      </div>
      <div style={{flex: 1, borderRadius: 24, background: "rgba(90,107,133,0.1)", padding: "18px 20px"}}>
        <div style={{fontFamily: khmerFamily, fontSize: 22, fontWeight: 800, color: "#5A6B85"}}>ឡានក្រុង</div>
        <div style={{fontFamily: khmerFamily, fontSize: 24, fontWeight: 700, color: "#8290A6", marginTop: 10, lineHeight: 1.4}}>យូរ · ឈប់ច្រើន</div>
      </div>
    </div>
  </InfoCard>
);

const RouteCard: React.FC = () => (
  <InfoCard x={76} y={540} width={580} delay={8}>
    <div style={{display: "flex", alignItems: "center", gap: 16}}>
      <div style={{width: 58, height: 58, borderRadius: 18, background: teal, display: "flex", alignItems: "center", justifyContent: "center"}}>
        <CarIcon width={42} color="#fff" kind="sedan" />
      </div>
      <div>
        <div style={{fontFamily: khmerFamily, fontSize: 30, fontWeight: 800, color: navy}}>ភ្នំពេញ → កំពត</div>
        <div style={{fontFamily: geistFamily, fontSize: 20, fontWeight: 700, color: "#5A6B85", marginTop: 4}}>PRIVATE CAR · DOOR TO DOOR</div>
      </div>
    </div>
    <div style={{height: 4, borderRadius: 999, background: "linear-gradient(90deg,#00B39F,#FFC83D)", marginTop: 20}} />
  </InfoCard>
);

const HotelCard: React.FC = () => (
  <InfoCard x={76} y={540} width={580} delay={8}>
    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18}}>
      <div>
        <div style={{fontFamily: khmerFamily, fontSize: 31, fontWeight: 800, color: navy}}>ផ្ទះ → សណ្ឋាគារ</div>
        <div style={{fontFamily: khmerFamily, fontSize: 24, fontWeight: 600, color: "#5A6B85", marginTop: 8}}>មកយកដល់មុខផ្ទះ</div>
      </div>
      <div style={{width: 62, height: 62, borderRadius: 20, background: "rgba(0,179,159,0.12)", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <CarIcon width={48} color={teal} kind="suv" />
      </div>
    </div>
  </InfoCard>
);

const VehicleCard: React.FC<{readonly x: number; readonly y: number; readonly label: string; readonly seats: string; readonly src: string; readonly kind: "sedan" | "suv" | "mpv" | "van"; readonly delay: number; readonly width?: number}> = ({x, y, label, seats, src, kind, delay, width = 290}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 13, stiffness: 150, mass: 0.8}});
  const bob = Math.sin((f - delay) / 13) * 3;
  return (
    <div style={{position: "absolute", left: x, top: y, width, height: 244, borderRadius: 32, background: "rgba(255,255,255,0.98)", boxShadow: "0 26px 58px rgba(5,20,40,0.3), inset 0 1px 0 #fff", border: "1px solid rgba(0,179,159,0.18)", scale: String(Math.max(0, s)), zIndex: 24, padding: 16, overflow: "hidden"}}>
      <div style={{position: "absolute", right: 14, top: 12, opacity: 0.92, translate: `0px ${bob}px`}}><CarIcon width={44} color={teal} kind={kind} /></div>
      <div style={{height: 150, display: "flex", alignItems: "center", justifyContent: "center"}}>
        <Img src={staticFile(src)} style={{maxWidth: "100%", maxHeight: "100%", objectFit: "contain"}} />
      </div>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 4}}>
        <div style={{fontFamily: geistFamily, fontSize: 30, fontWeight: 900, color: navy}}>{label}</div>
        <div style={{fontFamily: khmerFamily, fontSize: 22, fontWeight: 700, color: "#5A6B85"}}>{seats}</div>
      </div>
      <div style={{height: 5, width: 58, borderRadius: 999, background: teal, marginTop: 8}} />
    </div>
  );
};

const LuggageBadge: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 34, fps, config: {damping: 12, stiffness: 150, mass: 0.8}});
  return (
    <div style={{position: "absolute", left: 320, top: 760, display: "flex", alignItems: "center", gap: 14, padding: "12px 22px", borderRadius: 999, background: "rgba(7,20,40,0.72)", border: "1px solid rgba(255,255,255,0.3)", boxShadow: "0 18px 42px rgba(0,0,0,0.3)", scale: String(Math.max(0, s)), zIndex: 27}}>
      <svg width={38} height={38} viewBox="0 0 48 48"><rect x={8} y={14} width={32} height={27} rx={7} fill={teal}/><rect x={15} y={8} width={18} height={7} rx={3.5} fill="none" stroke="#fff" strokeWidth={3}/><rect x={8} y={26} width={32} height={3} fill="rgba(255,255,255,0.45)"/></svg>
      <div style={{fontFamily: khmerFamily, fontSize: 24, fontWeight: 700, color: "#fff"}}>អីវ៉ាន់ច្រើន</div>
    </div>
  );
};

const FleetScene: React.FC<{readonly line: Timed; readonly index: number; readonly duration: number}> = ({line, index, duration}) => {
  const four = line.kind === "fleet4";
  return (
    <AbsoluteFill>
      <Photo src={line.photos[0]} duration={duration} index={index} zoom={0.08} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(7,17,34,0.8),rgba(7,17,34,0.3) 40%,rgba(7,17,34,0.9))"}} />
      {four ? (
        <>
          <VehicleCard x={50} y={344} label="Sedan" seats="៤ កៅអី" src="real/cars/sedan.png" kind="sedan" delay={8} />
          <VehicleCard x={360} y={344} label="SUV" seats="៤ កៅអី" src="real/cars/suv.png" kind="suv" delay={12} />
          <VehicleCard x={50} y={612} label="MPV" seats="៧ កៅអី" src="real/cars/mpv.png" kind="mpv" delay={16} />
          <VehicleCard x={360} y={612} label="Van" seats="១៥ កៅអី" src="real/cars/van.png" kind="van" delay={20} />
        </>
      ) : (
        <>
          <VehicleCard x={50} y={380} label="SUV" seats="៤ កៅអី" src="real/cars/suv.png" kind="suv" delay={8} width={300} />
          <VehicleCard x={372} y={380} label="MPV" seats="៧ កៅអី" src="real/cars/mpv.png" kind="mpv" delay={12} width={300} />
          <VehicleCard x={694} y={380} label="Van" seats="១៥ កៅអី" src="real/cars/van.png" kind="van" delay={16} width={300} />
          <LuggageBadge />
        </>
      )}
    </AbsoluteFill>
  );
};

const PhoneMockup: React.FC<{readonly left: number; readonly top: number; readonly width: number; readonly height: number; readonly progress: number}> = ({left, top, width, height, progress}) => {
  const bezel = 18;
  const sw = width - bezel * 2;
  const sh = height - bezel * 2;
  const imgH = Math.round((sw * 868) / 411);
  const maxScroll = Math.max(0, imgH * 2 - sh);
  const scroll = -maxScroll * ease(interpolate(progress, [0.12, 0.7], [0, 1], clamp));
  return (
    <div style={{position: "absolute", left, top, width, height, borderRadius: 60, background: "linear-gradient(145deg,#20242B,#040507)", boxShadow: "0 0 0 3px #6B7280, 0 0 0 5px #2A2D33, 0 42px 90px rgba(0,0,0,0.62), inset 0 0 0 2px rgba(255,255,255,0.12)", zIndex: 30}}>
      <div style={{position: "absolute", left: bezel, top: bezel, width: sw, height: sh, borderRadius: 48, overflow: "hidden", background: "#fff"}}>
        <div style={{position: "absolute", left: 0, top: 0, width: sw, height: imgH * 2, transform: `translateY(${scroll}px)`}}>
          <Img src={staticFile("real/airport/app-airport-search.png")} style={{width: sw, height: imgH, display: "block", objectFit: "cover"}} />
          <Img src={staticFile("real/airport/app-airport-results.png")} style={{width: sw, height: imgH, display: "block", objectFit: "cover"}} />
        </div>
        <div style={{position: "absolute", left: (sw - 96) / 2, top: 10, width: 96, height: 26, borderRadius: 13, background: "#050608", zIndex: 5}} />
      </div>
    </div>
  );
};

const FinaleScene: React.FC<{readonly duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, Math.max(1, duration - 1)], [0, 1], clamp);
  const bg = interpolate(p, [0.52, 0.8], [0, 1], clamp);
  const pulse = 1 + Math.sin(f / 7) * 0.035;
  return (
    <AbsoluteFill>
      <Img src={staticFile("real/airport/app-airport-search.png")} style={{width: "100%", height: "100%", objectFit: "cover", filter: "blur(26px) brightness(0.38)", transform: "scale(1.2)"}} />
      <AbsoluteFill style={{opacity: bg}}>
        <Photo src="real/kampot/kampot-kayak.jpg" duration={duration} index={4} zoom={0.12} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(7,17,34,0.86),rgba(7,17,34,0.28) 42%,rgba(7,17,34,0.92))"}} />
      <PhoneMockup left={48} top={352} width={430} height={780} progress={p} />
      <div style={{position: "absolute", left: 512, top: 382, width: 508, padding: "26px 28px 30px", borderRadius: 34, background: "linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,252,250,0.98))", boxShadow: "0 34px 78px rgba(0,0,0,0.4), inset 0 1px 0 #fff", borderTop: `6px solid ${teal}`, zIndex: 32}}>
        <div style={{display: "flex", alignItems: "center", gap: 12}}>
          <div style={{width: 54, height: 54, borderRadius: 16, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(17,31,64,0.14)"}}>
            <Img src={staticFile("veha-logo-cut.png")} style={{width: 42}} />
          </div>
          <div style={{fontFamily: geistFamily, fontSize: 32, fontWeight: 800, color: navy}}>Veha <span style={{color: teal}}>Booking</span></div>
        </div>
        <div style={{fontFamily: khmerFamily, fontSize: 28, fontWeight: 800, color: navy, marginTop: 16}}>កក់ឡានឯកជនឥឡូវ</div>
        <div style={{fontFamily: geistFamily, fontSize: 20, fontWeight: 700, color: "#5A6B85", marginTop: 4}}>vehabooking.com</div>
        <div style={{marginTop: 20, display: "flex", justifyContent: "center"}}>
          <div style={{scale: String(pulse), padding: "16px 38px", borderRadius: 999, background: teal, color: "#fff", fontFamily: geistFamily, fontSize: 30, fontWeight: 900, border: "4px solid #fff", boxShadow: "0 18px 38px rgba(0,179,159,0.45)"}}>Book Now</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Scene: React.FC<{readonly line: Timed; readonly index: number}> = ({line, index}) => {
  const f = useCurrentFrame();
  const vd = line.duration + 6;
  const inP = interpolate(f, [0, 8], [0, 1], {...clamp, easing: ease});
  const outP = interpolate(f, [vd - 8, vd], [1, 0], {...clamp, easing: ease});
  const opacity = Math.min(inP, outP);
  const slide = (1 - inP) * (line.speaker === "A" ? 18 : -18);
  const cross = interpolate(f, [vd * 0.45, vd * 0.58], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity, transform: `translateX(${slide}px)`}}>
      {line.kind === "finale" ? (
        <FinaleScene duration={vd} />
      ) : line.kind === "fleet3" || line.kind === "fleet4" ? (
        <FleetScene line={line} index={index} duration={vd} />
      ) : line.kind === "crossfade" ? (
        <>
          <Photo src={line.photos[0]} duration={vd} index={index} zoom={0.12} />
          <AbsoluteFill style={{opacity: cross}}><Photo src={line.photos[1] ?? line.photos[0]} duration={vd} index={index + 1} zoom={0.12} /></AbsoluteFill>
        </>
      ) : (
        <Photo src={line.photos[0]} duration={vd} index={index} zoom={line.kind === "price" || line.kind === "compare" ? 0.2 : 0.12} />
      )}
      {line.kind !== "finale" && <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(7,17,34,0.76) 0%,rgba(7,17,34,0.12) 35%,transparent 52%,rgba(7,17,34,0.2) 68%,rgba(7,17,34,0.9) 100%)"}} />}
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 44%, transparent 44%, rgba(7,17,34,0.4) 100%)"}} />
      {line.kind === "price" && <PriceCard />}
      {line.kind === "compare" && <CompareCard />}
      {line.kind === "route" && <RouteCard />}
      {line.kind === "hotel" && <HotelCard />}
      {line.kind === "bus" && (
        <InfoCard x={76} y={520} width={560} delay={8} accent={gold}>
          <div style={{fontFamily: khmerFamily, fontSize: 34, fontWeight: 800, color: navy}}>ជិះឡានក្រុង</div>
          <div style={{fontFamily: khmerFamily, fontSize: 26, fontWeight: 600, color: "#5A6B85", marginTop: 8}}>ឈប់ច្រើន · យូរ · នឿយ</div>
          <div style={{display: "flex", gap: 8, marginTop: 20}}>
            {["ឈប់", "រង់ចាំ", "យូរ"].map((t) => <div key={t} style={{padding: "8px 16px", borderRadius: 999, background: "rgba(255,200,61,0.18)", fontFamily: khmerFamily, fontSize: 22, fontWeight: 700, color: "#8A6200"}}>{t}</div>)}
          </div>
        </InfoCard>
      )}
      <TitleCard line={line} />
      <StickerFrame line={line} />
    </AbsoluteFill>
  );
};

const Sfx: React.FC = () => {
  const p12 = timeline[timeline.length - 1];
  const cues: SfxCue[] = timeline.flatMap((l, i) => {
    const list: SfxCue[] = [];
    if (i > 0) list.push({frame: l.from, sfx: "whoosh", note: `to ${l.id}`, volume: 0.4});
    list.push({frame: l.from + 8, sfx: "pop", note: `sticker ${l.sticker}`, volume: 0.55});
    if (l.id === "p05") list.push({frame: l.from + 30, sfx: "coin", note: "price $45", volume: 0.5});
    return list;
  });
  cues.push({frame: p12.from + Math.round(p12.duration * 0.72), sfx: "tap", note: "Book Now", volume: 0.75});
  return <SfxTrack cues={cues} />;
};

const Film: React.FC = () => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: navy}}>
      {timeline.map((l, i) => (
        <Sequence key={l.id} from={l.from} durationInFrames={l.duration + 6} name={`${l.id} · ${l.title}`} premountFor={20}>
          <Scene line={l} index={i} />
        </Sequence>
      ))}
      <Audio src={staticFile("music/veha-bed.wav")} loop volume={(f) => {
        const duck = timeline.reduce((g, l) => Math.min(g, interpolate(f, [l.voiceFrom - 4, l.voiceFrom, l.voiceFrom + l.audioFrames, l.voiceFrom + l.audioFrames + 6], [1, 0.4, 0.4, 1], clamp)), 1);
        return interpolate(f, [0, fps * 0.5, totalFrames - fps, totalFrames - 1], [0, 0.12, 0.12, 0], clamp) * duck;
      }} />
      {timeline.map((l) => (
        <Sequence key={`v-${l.id}`} from={l.voiceFrom} durationInFrames={l.audioFrames + 3} layout="none">
          <Audio src={staticFile(`voice/kampot/${l.id}.mp3`)} />
        </Sequence>
      ))}
      <Sfx />
      <div style={{position: "absolute", left: 56, top: 54, scale: "0.78", transformOrigin: "0 0", zIndex: 60}}><Logo size={80} light /></div>
      <div style={{position: "absolute", right: 56, top: 76, fontFamily: geistFamily, fontWeight: 700, fontSize: 25, color: "#fff", textShadow: "0 3px 12px rgba(0,0,0,0.55)", zIndex: 60}}>vehabooking.com</div>
      <Captions tl={timeline} />
      <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 8, background: "rgba(255,255,255,0.18)", zIndex: 70}}>
        <div style={{width: `${(frame / totalFrames) * 100}%`, height: "100%", borderRadius: "0 999px 999px 0", background: `linear-gradient(90deg,${teal},${gold})`, boxShadow: "0 0 18px rgba(0,179,159,0.65)"}} />
      </div>
      <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 5, background: `linear-gradient(90deg,${teal},${gold},${teal})`, opacity: 0.9, zIndex: 70}} />
    </AbsoluteFill>
  );
};

export const PrivateKampotKhVideo: React.FC = () => <Film />;
