import React from "react";
import {AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {clamp, coral, ease, geistFamily, khmerFamily, Logo, navy, teal} from "../brand";
import {SfxTrack, type SfxCue} from "../sfx";
import {endCardFrom, END_CARD, narrationFrames, narrationFrom, timeline, totalFrames, type Timed} from "./narration";

// Video 1 — House → SAI. Husband = People B (voice clone Veha) · Wife = People woman (voice clone Sokhom).
const FPS = 30;
const HOME = "real/airport-couple-user/home-warm-mirrored.png";
const SEDAN_PHOTO = "real/taxi-family/scene03-private-sedan.png";
const outline = (w: number): React.CSSProperties => ({WebkitTextStroke: `${w}px ${navy}`, paintOrder: "stroke fill", textShadow: "0 6px 18px rgba(0,0,0,0.45)"});
const isLatin = (s: string) => /^[\x20-\x7E]+$/.test(s);
const sec = (s: number) => Math.round(s * FPS);
const byId = (id: Timed["id"]) => timeline.find((l) => l.id === id) as Timed;
// frame (relative to the line's Sequence) when the voice reaches `s` seconds
const at = (line: Timed, s: number) => line.voiceFrom - line.from + sec(s);

const usePopAt = (start: number, damping = 12) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - start, fps, config: {damping, stiffness: 170, mass: 0.7}});
};

const Photo: React.FC<{readonly src: string; readonly duration: number; readonly zoom?: number; readonly pan?: number; readonly objectPosition?: string; readonly blur?: number; readonly dim?: number}> = ({src, duration, zoom = 0.08, pan = 16, objectPosition = "50% 50%", blur = 0, dim = 0}) => {
  const f = useCurrentFrame();
  const p = Math.min(1, Math.max(0, f / Math.max(1, duration - 1)));
  const scale = 1.04 + p * zoom + (blur ? 0.06 : 0);
  const x = interpolate(p, [0, 1], [-pan, pan], clamp);
  return (
    <AbsoluteFill style={{overflow: "hidden", background: "#0B1530"}}>
      <Img src={staticFile(src)} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition, transform: `scale(${scale}) translateX(${x}px)`, filter: blur ? `blur(${blur}px) brightness(${1 - dim})` : `brightness(${1 - dim})`}} />
    </AbsoluteFill>
  );
};

const Fade: React.FC<{readonly from: number; readonly to?: number; readonly len?: number; readonly children: React.ReactNode}> = ({from, to = 1e9, len = 8, children}) => {
  const f = useCurrentFrame();
  const o = Math.min(interpolate(f, [from, from + len], [0, 1], clamp), interpolate(f, [to - len, to], [1, 0], clamp));
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const Shade: React.FC = () => <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.6),rgba(9,20,42,0.05) 30%,transparent 50%,rgba(9,20,42,0.25) 66%,rgba(9,20,42,0.88))"}} />;

const Pill: React.FC<{readonly start: number; readonly children: React.ReactNode; readonly top: number; readonly left?: number; readonly bg?: string; readonly size?: number}> = ({start, children, top, left, bg = teal, size = 48}) => {
  const s = usePopAt(start);
  return (
    <div style={{position: "absolute", top, left: left ?? 0, right: left === undefined ? 0 : undefined, display: "flex", justifyContent: left === undefined ? "center" : "flex-start", zIndex: 30}}>
      <div style={{transform: `scale(${s})`, opacity: Math.min(1, s * 1.4), background: bg, color: "#fff", borderRadius: 999, padding: "16px 36px", fontFamily: khmerFamily, fontWeight: 800, fontSize: size, lineHeight: 1.35, boxShadow: "0 16px 40px rgba(0,0,0,0.35)", whiteSpace: "nowrap", border: "4px solid rgba(255,255,255,0.9)"}}>
        {children}
      </div>
    </div>
  );
};

const Latin: React.FC<{readonly children: React.ReactNode}> = ({children}) => <span style={{fontFamily: geistFamily, fontWeight: 800}}>{children}</span>;

const Suitcases: React.FC<{readonly start: number; readonly big?: boolean}> = ({start, big}) => {
  const a = usePopAt(start, 14);
  const b = usePopAt(start + 6, 14);
  const k = big ? 1.35 : 1;
  return (
    <>
      <Img src={staticFile("images/airport-couple/suitcase-blue-clean.png")} style={{position: "absolute", left: big ? 470 : 560, top: big ? 420 : 560, width: 230 * k, transform: `translateY(${(1 - a) * 500}px)`, filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.5))", zIndex: 20}} />
      <Img src={staticFile("images/airport-couple/suitcase-black-clean.png")} style={{position: "absolute", left: big ? 790 : 820, top: big ? 640 : 700, width: 170 * k, transform: `translateY(${(1 - b) * 500}px)`, filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.5))", zIndex: 21}} />
    </>
  );
};

// Real vehabooking.com mobile UI (screenshots 415×883) inside an iPhone frame.
type Ring = {readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly at: number};
type Screen = {readonly src: string; readonly from: number; readonly scroll?: number; readonly rings?: readonly Ring[]};
const SHOT_W = 415;

const TapRing: React.FC<{readonly ring: Ring; readonly k: number}> = ({ring, k}) => {
  const f = useCurrentFrame();
  const t = f - ring.at;
  if (t < 0) return null;
  const s = spring({frame: t, fps: FPS, config: {damping: 12, stiffness: 180}});
  const pulse = (t % 24) / 24;
  return (
    <>
      <div style={{position: "absolute", left: (ring.x - ring.w / 2) * k - 6, top: (ring.y - ring.h / 2) * k - 6, width: ring.w * k + 12, height: ring.h * k + 12, borderRadius: 18, border: `5px solid ${teal}`, boxShadow: `0 0 0 ${4 + pulse * 10}px rgba(0,179,159,${0.35 * (1 - pulse)})`, transform: `scale(${0.85 + 0.15 * s})`, opacity: Math.min(1, s * 1.5)}} />
      <div style={{position: "absolute", left: ring.x * k - 22, top: ring.y * k - 22, width: 44, height: 44, borderRadius: 999, background: "rgba(0,179,159,0.45)", border: "3px solid #fff", transform: `scale(${interpolate(t, [0, 6, 12], [1.4, 0.8, 1], clamp)})`, opacity: interpolate(t, [0, 4, 20, 30], [0, 1, 1, 0], clamp)}} />
    </>
  );
};

const UiPhone: React.FC<{readonly start: number; readonly left: number; readonly top: number; readonly screens: readonly Screen[]}> = ({start, left, top, screens}) => {
  const f = useCurrentFrame();
  const s = usePopAt(start, 14);
  const bezel = 18, screenW = 444, screenH = Math.round((screenW * 883) / SHOT_W), phoneW = screenW + bezel * 2, phoneH = screenH + bezel * 2;
  const k = screenW / SHOT_W;
  return (
    <div style={{position: "absolute", left, top, width: phoneW, height: phoneH, borderRadius: 72, background: "linear-gradient(145deg,#1B1E24,#050608)", boxShadow: "0 0 0 3px #6B7280, 0 44px 90px rgba(0,0,0,0.6)", zIndex: 22, transform: `translateY(${(1 - s) * 120}px) rotate(${(1 - s) * 6}deg)`, opacity: Math.min(1, s * 1.5)}}>
      <div style={{position: "absolute", left: bezel, top: bezel, width: screenW, height: screenH, borderRadius: 56, overflow: "hidden", background: "#F4F6F8"}}>
        {screens.map((sc, i) => {
          const next = screens[i + 1];
          const o = Math.min(interpolate(f, [sc.from, sc.from + 8], [i === 0 ? 1 : 0, 1], clamp), next ? interpolate(f, [next.from, next.from + 8], [1, 0], clamp) : 1);
          const y = sc.scroll ? -interpolate(f, [sc.from + 4, sc.from + 40], [0, sc.scroll], {...clamp, easing: ease}) : 0;
          const x = i === 0 ? 0 : interpolate(f, [sc.from, sc.from + 10], [60, 0], {...clamp, easing: ease});
          return (
            <div key={sc.src} style={{position: "absolute", left: 0, top: 0, width: screenW, height: screenH, opacity: o, transform: `translate(${x}px,${y}px)`}}>
              <Img src={staticFile(sc.src)} style={{width: screenW, height: screenH, display: "block"}} />
              {(sc.rings ?? []).map((r) => <TapRing key={`${r.x}-${r.y}-${r.at}`} ring={r} k={k} />)}
            </div>
          );
        })}
        <div style={{position: "absolute", left: (screenW - 116) / 2, top: 12, width: 116, height: 32, borderRadius: 16, background: "#050608", zIndex: 5}} />
      </div>
    </div>
  );
};

const UI_HOME = "real/sai/ui-transport-home.png";
const UI_RESULTS = "real/sai/ui-sai-results.png";

const models = [
  {name: "Sedan", price: 22, img: "real/cars/sedan.png"},
  {name: "SUV", price: 22, img: "real/cars/suv.png"},
  {name: "MPV", price: 30, img: "real/cars/mpv.png"},
  {name: "Van", price: 35, img: "real/cars/van.png"},
] as const;

// Prices: vehabooking.com airport schedules API (Siem Reap ⇄ SAI), checked 19 Nov 2026.
const PriceCard: React.FC<{readonly start: number; readonly top: number; readonly tileH?: number}> = ({start, top, tileH = 200}) => {
  const head = usePopAt(start);
  return (
    <div style={{position: "absolute", left: 70, right: 70, top, zIndex: 30}}>
      <div style={{display: "flex", justifyContent: "center", marginBottom: 18}}>
        <div style={{transform: `scale(${head})`, background: teal, color: "#fff", borderRadius: 999, padding: "10px 40px", fontFamily: khmerFamily, fontWeight: 800, fontSize: 50, border: "4px solid #fff", boxShadow: "0 14px 34px rgba(0,0,0,0.35)"}}>
          ចាប់ពី <Latin>$22</Latin>
        </div>
      </div>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18}}>
        {models.map((m, i) => <PriceTile key={m.name} start={start + 5 + i * 4} name={m.name} price={m.price} img={m.img} h={tileH} />)}
      </div>
    </div>
  );
};

const PriceTile: React.FC<{readonly start: number; readonly name: string; readonly price: number; readonly img: string; readonly h: number}> = ({start, name, price, img, h}) => {
  const s = usePopAt(start);
  return (
    <div style={{height: h, borderRadius: 30, background: "rgba(255,255,255,0.97)", boxShadow: "0 18px 40px rgba(0,0,0,0.3)", transform: `scale(${s})`, opacity: Math.min(1, s * 1.5), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 10}}>
      <Img src={staticFile(img)} style={{height: h * 0.46, maxWidth: "88%", objectFit: "contain"}} />
      <div style={{display: "flex", alignItems: "baseline", gap: 18, fontFamily: geistFamily, fontWeight: 800}}>
        <span style={{fontSize: h * 0.17, color: navy}}>{name}</span>
        <span style={{fontSize: h * 0.23, color: teal}}>${price}</span>
      </div>
    </div>
  );
};

const PersonSticker: React.FC<{readonly line: Timed}> = ({line}) => {
  const f = useCurrentFrame();
  const s = usePopAt(6, 10);
  const swapAt = line.swap ? at(line, line.swap[0]) : Infinity;
  const name = f >= swapAt ? line.swap?.[1] ?? line.sticker : line.sticker;
  const pop2 = line.swap ? spring({frame: f - swapAt, fps: FPS, config: {damping: 9, stiffness: 200}}) : 1;
  const dir = line.speaker === "B" ? "b" : "woman";
  // B on the right, wife on the left — except s02 (tuk-tuks are on the right of that photo)
  const onLeft = line.speaker === "C" || line.id === "s02";
  const width = line.id === "s04" ? 460 : 410;
  const bob = Math.sin(f / 14) * 6;
  const tilt = (onLeft ? -5 : 5) * (1 - s) + Math.sin(f / 22) * 1.5;
  const scale = s * (f >= swapAt ? 0.9 + 0.1 * pop2 : 1);
  return (
    <Img
      src={staticFile(`stickers/people/${dir}/${name}.png`)}
      style={{position: "absolute", top: line.id === "s04" ? 930 : 990, ...(onLeft ? {left: 24} : {right: 24}), width, transform: `translateY(${bob}px) rotate(${tilt}deg) scale(${scale})`, transformOrigin: "50% 100%", filter: "drop-shadow(0 18px 26px rgba(0,0,0,0.45))", zIndex: 40}}
    />
  );
};

const Captions: React.FC<{readonly line: Timed}> = ({line}) => {
  const f = useCurrentFrame();
  const local = f - (line.voiceFrom - line.from);
  const active = line.segs.filter(([, st]) => local >= st * FPS);
  const page = active.length ? active[active.length - 1][2] : 0;
  const show = line.segs.filter(([, , p]) => p === page);
  const o = interpolate(local, [-6, 0], [0, 1], clamp) * interpolate(local, [line.audioFrames + 2, line.audioFrames + 8], [1, 0], clamp);
  return (
    <div style={{position: "absolute", left: 50, right: 50, bottom: 240, textAlign: "center", opacity: o, zIndex: 50}}>
      <div style={{fontFamily: khmerFamily, fontWeight: 800, fontSize: 54, lineHeight: 1.55, color: "#fff", ...outline(11)}}>
        {show.map(([w, st], i) => {
          const on = local >= st * FPS;
          return (
            <span key={`${w}-${i}`} style={{color: on ? teal : "#fff", fontFamily: isLatin(w) ? geistFamily : khmerFamily, marginRight: 10, display: "inline-block"}}>
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const RouteCard: React.FC<{readonly start: number}> = ({start}) => {
  const f = useCurrentFrame();
  const s = usePopAt(start);
  const p = interpolate(f, [start + 6, start + 36], [0, 1], {...clamp, easing: ease});
  return (
    <div style={{position: "absolute", left: 60, right: 60, top: 300, zIndex: 30, transform: `scale(${s})`, opacity: Math.min(1, s * 1.5)}}>
      <div style={{background: "rgba(255,255,255,0.96)", borderRadius: 34, padding: "26px 34px", boxShadow: "0 18px 44px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", gap: 20}}>
        <div style={{fontFamily: khmerFamily, fontWeight: 800, fontSize: 44, color: navy, whiteSpace: "nowrap"}}>ក្រុងសៀមរាប</div>
        <div style={{flex: 1, position: "relative", height: 12}}>
          <div style={{position: "absolute", left: 0, right: 0, top: 4, height: 4, borderTop: "4px dashed #B8C4D6"}} />
          <div style={{position: "absolute", left: 0, width: `${p * 100}%`, top: 2, height: 8, borderRadius: 4, background: teal}} />
          <div style={{position: "absolute", left: `calc(${p * 100}% - 22px)`, top: -18, fontSize: 40}}>✈</div>
        </div>
        <div style={{fontFamily: geistFamily, fontWeight: 900, fontSize: 52, color: teal}}>SAI</div>
      </div>
    </div>
  );
};

const KhqrCard: React.FC<{readonly start: number; readonly scan: number; readonly done: number}> = ({start, scan, done}) => {
  const f = useCurrentFrame();
  const s = usePopAt(start);
  const d = usePopAt(done, 10);
  const scanY = interpolate((f - scan) % 30, [0, 30], [0, 1]);
  return (
    <div style={{position: "absolute", left: 200, right: 200, top: 330, zIndex: 30, transform: `scale(${s})`, opacity: Math.min(1, s * 1.5)}}>
      <div style={{position: "relative", background: "#fff", borderRadius: 40, padding: "40px 30px", boxShadow: "0 22px 50px rgba(0,0,0,0.45)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, border: "6px solid #E1232E"}}>
        <div style={{fontFamily: geistFamily, fontWeight: 900, fontSize: 110, color: "#E1232E", letterSpacing: 2}}>KHQR</div>
        <div style={{fontFamily: khmerFamily, fontWeight: 800, fontSize: 46, color: navy}}>បង់លុយភ្លាមៗ</div>
        {f < done && f >= scan ? <div style={{position: "absolute", left: 24, right: 24, top: 30 + scanY * 200, height: 6, borderRadius: 3, background: teal, boxShadow: `0 0 18px ${teal}`}} /> : null}
      </div>
      <div style={{display: "flex", justifyContent: "center", marginTop: 26}}>
        <div style={{transform: `scale(${d})`, display: "flex", alignItems: "center", gap: 14, background: teal, color: "#fff", borderRadius: 999, padding: "12px 34px", fontFamily: khmerFamily, fontWeight: 800, fontSize: 48, border: "4px solid #fff"}}>
          <svg width={44} height={44} viewBox="0 0 24 24"><path d="M5 12.5 10 17 19 7" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></svg>
          រួចរាល់!
        </div>
      </div>
    </div>
  );
};

const Visual: React.FC<{readonly line: Timed}> = ({line}) => {
  const D = line.duration + 8;
  const A = (s: number) => at(line, s);
  switch (line.id) {
    case "s01":
      return (
        <>
          <Photo src={HOME} duration={D} zoom={0.07} />
          <Shade />
          <Pill start={A(2.49)} top={300}>✈ ស្អែក <Latin>8:00</Latin></Pill>
        </>
      );
    case "s02":
      return (
        <>
          <Photo src="real/siemreap.jpg" duration={D} zoom={0.12} pan={-20} objectPosition="88% 50%" />
          <Shade />
        </>
      );
    case "s03":
      return (
        <>
          <Fade from={0} to={A(0.5) + 8}><Photo src="real/airport/siemreap-city.jpg" duration={D} zoom={0.06} /></Fade>
          <Fade from={A(0.5)} to={A(3.2) + 8}><Photo src="real/airport-hotel/scene08-sai-airport.png" duration={D} zoom={0.08} /></Fade>
          <Fade from={A(3.2)}><Photo src={HOME} duration={D} blur={10} dim={0.15} /></Fade>
          <Shade />
          <Fade from={0} to={A(3.2)} len={6}>
            <RouteCard start={A(0.84)} />
            <Pill start={A(1.93)} top={480}>≈ ១ ម៉ោង</Pill>
          </Fade>
          <Fade from={A(3.15)} len={4}>
            <Suitcases start={A(3.29)} big />
            <Pill start={A(6.92)} top={300} bg={coral}>⏰ ប្រយ័ត្នខកជើងយន្តហោះ!</Pill>
          </Fade>
        </>
      );
    case "s04":
      return (
        <>
          <Photo src={HOME} duration={D} blur={12} dim={0.25} />
          <Shade />
          <Pill start={A(1.81)} top={420} left={120} bg={navy} size={110}>?</Pill>
        </>
      );
    case "s05":
      return (
        <>
          <Fade from={0} to={A(3.41) + 8}>
            <Photo src={HOME} duration={D} blur={12} dim={0.2} />
            <UiPhone start={A(0.2)} left={560} top={240} screens={[{src: UI_HOME, from: 0, rings: [{x: 293, y: 117, w: 166, h: 42, at: A(0.96)}]}]} />
          </Fade>
          <Fade from={A(3.41)}>
            <Photo src={SEDAN_PHOTO} duration={D} zoom={0.06} />
          </Fade>
          <Shade />
          <PriceCard start={A(4.67)} top={260} />
        </>
      );
    case "s06":
      return <S06 line={line} />;
    case "s07":
      return (
        <>
          <Fade from={0} to={A(6.7) + 8}>
            <Photo src={HOME} duration={D} blur={12} dim={0.2} />
            <UiPhone
              start={A(0.6)}
              left={560}
              top={240}
              screens={[
                {src: UI_HOME, from: 0, rings: [{x: 160, y: 277, w: 250, h: 40, at: A(3.63)}, {x: 110, y: 232, w: 154, h: 38, at: A(4.13)}]},
                {src: UI_RESULTS, from: A(4.85), scroll: 40, rings: [{x: 207, y: 283, w: 346, h: 42, at: A(5.3)}, {x: 341, y: 391, w: 80, h: 34, at: A(5.89)}]},
              ]}
            />
            <Pill start={A(3.63)} top={330} left={50} size={42}>① រើសម៉ោង</Pill>
            <Pill start={A(4.13)} top={470} left={50} size={42}>② រើសទីតាំង</Pill>
            <Pill start={A(5.89)} top={610} left={50} size={42}>③ កក់</Pill>
          </Fade>
          <Fade from={A(6.7)} to={A(10.4) + 8}>
            <Photo src={HOME} duration={D} blur={14} dim={0.3} />
            <KhqrCard start={A(6.75)} scan={A(7.63)} done={A(9.54)} />
          </Fade>
          <Fade from={A(10.4)}>
            <Photo src="real/taxi-family/scene11-driver-door.png" duration={D} zoom={0.06} />
          </Fade>
          <Shade />
        </>
      );
    default:
      return null;
  }
};

const S06: React.FC<{readonly line: Timed}> = ({line}) => {
  const s = usePopAt(4, 16);
  return (
    <>
      <Photo src={SEDAN_PHOTO} duration={line.duration + 8} blur={10} dim={0.2} />
      <Shade />
      <Img src={staticFile("real/cars/sedan.png")} style={{position: "absolute", left: 60, top: 420, width: 760, transform: `translateX(${(1 - s) * -900}px)`, filter: "drop-shadow(0 30px 30px rgba(0,0,0,0.5))", zIndex: 20}} />
      <Pill start={14} top={300} left={140}><Latin>Sedan $22</Latin></Pill>
    </>
  );
};

const Scene: React.FC<{readonly line: Timed}> = ({line}) => {
  const f = useCurrentFrame();
  const total = line.duration + 8;
  const opacity = Math.min(interpolate(f, [0, 8], [0, 1], clamp), interpolate(f, [total - 8, total], [1, 0], clamp));
  return (
    <AbsoluteFill style={{opacity}}>
      <Visual line={line} />
      <PersonSticker line={line} />
      <Captions line={line} />
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const r = (d: number) => {
    const s = spring({frame: f - d, fps: FPS, config: {damping: 14, stiffness: 160}});
    return {opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 40}px)`};
  };
  const kh = (size: number, color = "#fff"): React.CSSProperties => ({fontFamily: khmerFamily, fontWeight: 800, fontSize: size, color, lineHeight: 1.45, textAlign: "center", ...outline(8)});
  return (
    <AbsoluteFill style={{opacity: interpolate(f, [0, 10], [0, 1], clamp)}}>
      <Photo src="real/airport-hotel/scene08-sai-airport.png" duration={END_CARD} blur={14} dim={0.45} zoom={0.04} />
      <AbsoluteFill style={{background: "linear-gradient(180deg,rgba(9,20,42,0.55),rgba(9,20,42,0.35) 45%,rgba(9,20,42,0.8))"}} />
      <div style={{position: "absolute", top: 150, left: 0, right: 0, display: "flex", justifyContent: "center", ...r(0)}}><Logo size={96} light /></div>
      <div style={{position: "absolute", top: 300, left: 60, right: 60, ...r(4)}}>
        <div style={kh(50)}>ជូនពីក្រុងសៀមរាប ➜</div>
        <div style={kh(50)}>អាកាសយានដ្ឋានអន្តរជាតិសៀមរាបអង្គរ <span style={{fontFamily: geistFamily}}>(SAI)</span></div>
      </div>
      <div style={{position: "absolute", top: 500, left: 40, right: 40, ...r(10)}}>
        <div style={kh(36, "#E8FFFB")}>ចាប់ពី ២២ដុល្លារ | មកទទួលដល់ផ្ទះ ឬសណ្ឋាគារ | មិនខកជើងយន្តហោះ</div>
      </div>
      <PriceCard start={16} top={650} tileH={240} />
      <div style={{position: "absolute", top: 1310, left: 40, right: 40, ...r(36)}}>
        <div style={{...kh(36, "#E8FFFB"), fontFamily: geistFamily}}>Sedan $22 · SUV $22 · MPV $30 · Van $35</div>
      </div>
      <div style={{position: "absolute", top: 1400, left: 40, right: 40, ...r(40)}}>
        <div style={kh(48)}>កក់ឥឡូវនេះ៖ <span style={{fontFamily: geistFamily, color: teal}}>vehabooking.com</span></div>
        <div style={kh(44)}>ទូរស័ព្ទ៖ <span style={{fontFamily: geistFamily}}>095 255 577</span></div>
      </div>
    </AbsoluteFill>
  );
};

const cues: SfxCue[] = (() => {
  const c: SfxCue[] = [];
  for (const l of timeline) {
    c.push({frame: l.from + 2, sfx: "whoosh", note: `${l.id} in`, volume: 0.35});
    c.push({frame: l.from + 8, sfx: "pop", note: `${l.id} sticker`, volume: 0.45});
  }
  const s03 = byId("s03"), s05 = byId("s05"), s07 = byId("s07");
  c.push({frame: s03.voiceFrom + sec(7.24), sfx: "buzz", note: "miss the flight", volume: 0.5});
  c.push({frame: s05.voiceFrom + sec(0.2), sfx: "tap", note: "phone", volume: 0.55});
  c.push({frame: s05.voiceFrom + sec(4.67), sfx: "coin", note: "price card", volume: 0.5});
  c.push({frame: s07.voiceFrom + sec(3.63), sfx: "tap", note: "step 1", volume: 0.45});
  c.push({frame: s07.voiceFrom + sec(4.13), sfx: "tap", note: "step 2", volume: 0.45});
  c.push({frame: s07.voiceFrom + sec(5.89), sfx: "tap", note: "step 3", volume: 0.45});
  c.push({frame: s07.voiceFrom + sec(7.63), sfx: "scan", note: "KHQR", volume: 0.5});
  c.push({frame: s07.voiceFrom + sec(9.54), sfx: "ding", note: "paid", volume: 0.45});
  c.push({frame: endCardFrom + 4, sfx: "whoosh", note: "end card", volume: 0.4});
  c.push({frame: endCardFrom + 12, sfx: "ding", note: "end card", volume: 0.45});
  return c;
})();

export const SaiHouseAirportKhVideo: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const brandOut = interpolate(f, [endCardFrom - 6, endCardFrom + 4], [1, 0], clamp);
  const s01 = byId("s01"), s07 = byId("s07");
  return (
    <AbsoluteFill style={{background: "#0B1530"}}>
      {timeline.map((l) => (
        <Sequence key={l.id} from={l.from} durationInFrames={l.duration + 8} name={l.id}>
          <Scene line={l} />
        </Sequence>
      ))}
      <Sequence from={endCardFrom} durationInFrames={END_CARD} name="end-card">
        <EndCard />
      </Sequence>

      <Audio src={staticFile("music/veha-bed.wav")} loop volume={(fr) => {
        const duck = [...timeline, {voiceFrom: narrationFrom, audioFrames: narrationFrames}].reduce((g, l) => Math.min(g, interpolate(fr, [l.voiceFrom - 4, l.voiceFrom, l.voiceFrom + l.audioFrames, l.voiceFrom + l.audioFrames + 6], [1, 0.45, 0.45, 1], clamp)), 1);
        return interpolate(fr, [0, fps * 0.5, totalFrames - fps, totalFrames - 1], [0, 0.12, 0.12, 0], clamp) * duck;
      }} />
      {timeline.map((l) => (
        <Sequence key={`v-${l.id}`} from={l.voiceFrom} durationInFrames={l.audioFrames + 2} name={`voice ${l.id}`}>
          <Audio src={staticFile(`voice/sai-house-airport/${l.id}.mp3`)} />
        </Sequence>
      ))}
      <Sequence from={narrationFrom} durationInFrames={narrationFrames + 2} name="voice n01 narrator (Oudom)">
        <Audio src={staticFile("voice/sai-house-airport/n01.mp3")} />
      </Sequence>
      <SfxTrack cues={cues} />
      <Sequence from={s01.from + 2} durationInFrames={45} name="clock-alarm">
        <Audio src={staticFile("sfx/clock-alarm.wav")} volume={0.28} />
      </Sequence>
      <Sequence from={s07.voiceFrom + sec(10.48)} durationInFrames={60} name="car-horn">
        <Audio src={staticFile("sfx/car-horn-gentle.wav")} volume={0.35} />
      </Sequence>

      <div style={{position: "absolute", left: 60, top: 60, scale: "0.8", transformOrigin: "0 0", opacity: brandOut, zIndex: 60}}><Logo size={80} light /></div>
      <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 8, background: "rgba(255,255,255,0.18)", zIndex: 61}}>
        <div style={{height: "100%", width: `${(f / totalFrames) * 100}%`, background: teal}} />
      </div>
    </AbsoluteFill>
  );
};
