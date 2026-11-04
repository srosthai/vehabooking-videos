import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {CarIcon, clamp, geistFamily, khmerFamily, Logo, navy, sun, teal, tealDeep} from "../brand";

export const spark = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const Sun: React.FC<{readonly size: number; readonly x: number; readonly y: number; readonly warm?: boolean}> = ({size, x, y, warm = true}) => (
  <div style={{position: "absolute", left: x, top: y, width: size, height: size, borderRadius: 999, background: warm ? "radial-gradient(circle at 38% 34%, #FFF6C8 0%, #FFE28A 38%, #FFC83D 100%)" : "radial-gradient(circle at 38% 34%, #FFFFFF, #FFD1A8)", boxShadow: warm ? "0 0 120px rgba(255,200,61,0.55)" : "0 0 80px rgba(255,209,168,0.45)"}} />
);

export const Palm: React.FC<{readonly x: number; readonly y: number; readonly size: number; readonly flip?: boolean; readonly color?: string; readonly trunk?: string}> = ({x, y, size, flip, color = "#1E7A5A", trunk = "#8A5A32"}) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 200 300" style={{position: "absolute", left: x, top: y, transform: flip ? "scaleX(-1)" : undefined, opacity: 0.98}}>
    <path d="M104 292 C 96 230, 92 170, 100 96" stroke={trunk} strokeWidth={15} strokeLinecap="round" fill="none" />
    <path d="M100 96 C 72 62, 36 58, 8 78 C 42 82, 70 90, 100 96 Z" fill={color} />
    <path d="M100 96 C 88 50, 58 28, 24 30 C 58 48, 82 70, 100 96 Z" fill={color} />
    <path d="M100 96 C 110 46, 144 24, 178 30 C 146 46, 122 70, 100 96 Z" fill={color} />
    <path d="M100 96 C 132 62, 168 58, 194 80 C 160 82, 132 90, 100 96 Z" fill={color} />
    <path d="M100 96 C 100 58, 112 32, 132 14 C 124 46, 114 70, 100 96 Z" fill={color} opacity={0.92} />
    <path d="M100 96 C 76 114, 44 120, 18 112 C 48 104, 74 100, 100 96 Z" fill={color} opacity={0.85} />
    <circle cx={98} cy={100} r={9} fill={trunk} />
  </svg>
);

export const Hills: React.FC<{readonly y: number; readonly tone?: "warm" | "cool"}> = ({y, tone = "warm"}) => (
  <svg width={1080} height={420} viewBox="0 0 1080 420" style={{position: "absolute", left: 0, top: y}}>
    <path d="M0 240 C 150 150, 300 160, 430 220 C 570 285, 700 260, 820 200 C 920 150, 1010 150, 1080 180 L1080 420 L0 420 Z" fill={tone === "warm" ? "#2A6D6A" : "#245E6A"} opacity={0.55} />
    <path d="M0 300 C 160 220, 320 240, 470 300 C 640 368, 780 330, 900 280 C 990 244, 1050 250, 1080 260 L1080 420 L0 420 Z" fill={tone === "warm" ? "#1E5A58" : "#1B4C5A"} opacity={0.65} />
  </svg>
);

export const WindowLight: React.FC<{readonly x: number; readonly y: number; readonly w: number; readonly h: number}> = ({x, y, w, h}) => (
  <div style={{position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 32, overflow: "hidden", border: "14px solid #F7EAD6", boxShadow: "0 30px 60px rgba(27,49,96,0.18), inset 0 0 0 5px rgba(27,49,96,0.08)"}}>
    <div style={{position: "absolute", inset: 0, background: "linear-gradient(180deg,#BDEBFF,#E9FAFF 70%,#F4DFA8)"}} />
    <Sun size={w * 0.34} x={w * 0.56} y={h * 0.12} />
    <Palm x={w * 0.05} y={h * 0.32} size={w * 0.52} color="#2B8A63" trunk="#A97545" />
    <div style={{position: "absolute", left: 0, right: 0, top: h * 0.68, height: 6, background: "rgba(255,255,255,0.7)"}} />
    <div style={{position: "absolute", left: 0, right: 0, top: 0, bottom: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.45), rgba(255,255,255,0))"}} />
    <div style={{position: "absolute", left: w * 0.48, top: 0, bottom: 0, width: 8, background: "#F7EAD6"}} />
    <div style={{position: "absolute", left: 0, right: 0, top: h * 0.48, height: 8, background: "#F7EAD6"}} />
  </div>
);

export const Sofa: React.FC<{readonly x: number; readonly y: number; readonly scale?: number}> = ({x, y, scale = 1}) => (
  <div style={{position: "absolute", left: x, top: y, width: 760, height: 380, transform: `scale(${scale})`, transformOrigin: "0 100%"}}>
    <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 230, borderRadius: 46, background: "linear-gradient(180deg,#2A8C82,#1C6F6B)", boxShadow: "0 30px 60px rgba(27,49,96,0.22)"}} />
    <div style={{position: "absolute", left: 30, right: 30, bottom: 130, height: 170, borderRadius: 40, background: "linear-gradient(180deg,#3AA99D,#2A8C82)", boxShadow: "inset 0 8px 18px rgba(255,255,255,0.14)"}} />
    <div style={{position: "absolute", left: 46, bottom: 200, width: 300, height: 126, borderRadius: 30, background: "#46B8AA", boxShadow: "inset 0 -10px 18px rgba(0,0,0,0.08)"}} />
    <div style={{position: "absolute", right: 46, bottom: 200, width: 300, height: 126, borderRadius: 30, background: "#F4DFA8", boxShadow: "inset 0 -10px 18px rgba(0,0,0,0.06)"}} />
    <div style={{position: "absolute", left: 0, bottom: 40, width: 70, height: 160, borderRadius: 30, background: "#1C6F6B"}} />
    <div style={{position: "absolute", right: 0, bottom: 40, width: 70, height: 160, borderRadius: 30, background: "#1C6F6B"}} />
    {[80, 640].map((lx) => <div key={lx} style={{position: "absolute", left: lx, bottom: -26, width: 24, height: 54, borderRadius: 10, background: "#6B3A25"}} />)}
    <div style={{position: "absolute", left: 40, right: 40, bottom: 0, height: 20, borderRadius: 12, background: "rgba(17,31,64,0.18)", filter: "blur(8px)"}} />
  </div>
);

export const Plant: React.FC<{readonly x: number; readonly y: number; readonly size?: number}> = ({x, y, size = 260}) => (
  <div style={{position: "absolute", left: x, top: y, width: size, height: size * 1.35}}>
    <div style={{position: "absolute", left: size * 0.26, bottom: 0, width: size * 0.48, height: size * 0.4, borderRadius: "18% 18% 28% 28%", background: "linear-gradient(180deg,#E9C79A,#C99B68)"}} />
    <div style={{position: "absolute", left: 0, top: 0, width: size, height: size, background: "radial-gradient(ellipse at 50% 50%, rgba(30,122,90,0.22), transparent 70%)", filter: "blur(8px)"}} />
    {[-55, -25, 5, 35, 65].map((deg, i) => (
      <div key={i} style={{position: "absolute", left: size * 0.44, top: size * 0.34, width: size * 0.52, height: size * 0.26, borderRadius: "60% 40% 60% 40%", background: i % 2 ? "#2F9B6C" : "#1E7A5A", transformOrigin: "0 50%", transform: `rotate(${deg}deg)`, boxShadow: "inset 0 -8px 16px rgba(0,0,0,0.12)"}} />
    ))}
  </div>
);

export const Dust: React.FC<{readonly count?: number; readonly color?: string; readonly speed?: number}> = ({count = 26, color = "#FFE9B0", speed = 1}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none"}}>
      {Array.from({length: count}).map((_, i) => {
        const x = spark(i + 3) * 1080;
        const baseY = spark(i + 19) * 1920;
        const y = (baseY - f * speed * (0.35 + spark(i + 7) * 0.5) + 1920) % 1920;
        const s = 2 + spark(i + 11) * 6;
        const o = 0.12 + spark(i + 23) * 0.35;
        return <div key={i} style={{position: "absolute", left: x, top: y, width: s, height: s, borderRadius: 999, background: color, opacity: o, filter: "blur(0.5px)", boxShadow: `0 0 ${s * 3}px ${color}`}} />;
      })}
    </div>
  );
};

export const LightRays: React.FC<{readonly x?: number; readonly y?: number; readonly rotate?: number; readonly opacity?: number}> = ({x = 0, y = 0, rotate = 0, opacity = 0.22}) => {
  const f = useCurrentFrame();
  const flicker = 0.85 + Math.sin(f / 37) * 0.15;
  return (
    <div style={{position: "absolute", left: x, top: y, width: 1400, height: 1600, transform: `rotate(${rotate}deg)`, opacity: opacity * flicker, pointerEvents: "none", background: "linear-gradient(105deg, transparent 12%, rgba(255,241,190,0.55) 26%, transparent 38%, rgba(255,241,190,0.3) 52%, transparent 64%)", filter: "blur(14px)", mixBlendMode: "screen"}} />
  );
};

export const Grain: React.FC<{readonly opacity?: number}> = ({opacity = 0.06}) => (
  <svg width="100%" height="100%" style={{position: "absolute", inset: 0, opacity, mixBlendMode: "overlay", pointerEvents: "none"}}>
    <filter id="pf-grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" /></filter>
    <rect width="100%" height="100%" filter="url(#pf-grain)" />
  </svg>
);

export const Vignette: React.FC<{readonly strength?: number}> = ({strength = 0.4}) => <div style={{position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 42%, transparent 42%, rgba(17,31,64,${strength}) 100%)`, pointerEvents: "none"}} />;

export const LocationPill: React.FC<{readonly label: string; readonly x?: number; readonly y?: number}> = ({label, x = 700, y = 56}) => (
  <div style={{position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 999, background: "rgba(255,255,255,0.82)", boxShadow: "0 10px 24px rgba(27,49,96,0.12)", border: "1px solid rgba(255,255,255,0.8)"}}>
    <span style={{width: 9, height: 9, borderRadius: 999, background: teal}} />
    <span style={{fontFamily: khmerFamily, fontSize: 22, fontWeight: 700, color: navy}}>{label}</span>
  </div>
);

export const TopBar: React.FC<{readonly location: string; readonly progress: number; readonly light?: boolean}> = ({location, progress, light}) => (
  <>
    <div style={{position: "absolute", left: 42, top: 40, scale: "0.72", transformOrigin: "0 0"}}><Logo size={76} light={light} /></div>
    <div style={{position: "absolute", right: 52, top: 52, fontFamily: geistFamily, fontWeight: 700, fontSize: 22, color: light ? "rgba(255,255,255,0.85)" : tealDeep, letterSpacing: 0.5}}>vehabooking.com</div>
    <LocationPill label={location} x={40} y={118} />
    <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 8, background: "rgba(27,49,96,0.10)", zIndex: 90}}>
      <div style={{width: `${Math.min(100, progress)}%`, height: "100%", background: `linear-gradient(90deg, ${teal}, ${sun})`, boxShadow: "0 0 18px rgba(0,179,159,0.5)"}} />
    </div>
  </>
);

export const Chip: React.FC<{readonly text: string; readonly x: number; readonly y: number; readonly icon?: string; readonly delay?: number; readonly color?: string}> = ({text, x, y, icon, delay = 0, color = teal}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [delay, delay + 10], [0, 1], clamp);
  return <div style={{position: "absolute", left: x, top: y, opacity: p, translate: `0px ${(1 - p) * 24}px`, display: "flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 999, background: "rgba(255,255,255,0.9)", border: `1px solid ${color}55`, boxShadow: "0 14px 30px rgba(27,49,96,0.14)", fontFamily: khmerFamily, fontSize: 24, fontWeight: 700, color: navy, whiteSpace: "nowrap"}}>{icon && <span style={{fontSize: 24}}>{icon}</span>}{text}</div>;
};

export const Van: React.FC<{readonly x: number; readonly y: number; readonly width: number; readonly color?: string; readonly flip?: boolean}> = ({x, y, width, color = "#F7F1E6", flip}) => (
  <div style={{position: "absolute", left: x, top: y, width, transform: flip ? "scaleX(-1)" : undefined, filter: "drop-shadow(0 28px 30px rgba(17,31,64,0.26))"}}>
    <CarIcon width={width} color={color} kind="van" />
    <div style={{position: "absolute", left: width * 0.18, top: width * 0.16, width: width * 0.48, height: width * 0.16, borderRadius: 8, background: "rgba(189,235,255,0.9)", border: "3px solid rgba(27,49,96,0.25)"}} />
    <div style={{position: "absolute", left: width * 0.39, top: width * 0.16, width: 4, height: width * 0.16, background: "rgba(27,49,96,0.25)"}} />
  </div>
);

export const CarCard: React.FC<{readonly x: number; readonly y: number; readonly label: string; readonly seats: string; readonly kind: "sedan" | "suv" | "mpv" | "van"; readonly active?: boolean; readonly delay?: number; readonly color?: string}> = ({x, y, label, seats, kind, active, delay = 0, color = teal}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [delay, delay + 12], [0, 1], clamp);
  const s = active ? 1.04 + Math.sin(f / 18) * 0.008 : 1;
  return (
    <div style={{position: "absolute", left: x, top: y, width: 430, height: 360, opacity: p, translate: `0px ${(1 - p) * 30}px`, scale: String(s), borderRadius: 34, background: active ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.78)", border: active ? `5px solid ${color}` : "2px solid rgba(27,49,96,0.08)", boxShadow: active ? `0 28px 70px ${color}44` : "0 18px 40px rgba(27,49,96,0.12)", padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{fontFamily: khmerFamily, fontSize: 30, fontWeight: 800, color: navy}}>{label}</div>
        {active && <div style={{width: 34, height: 34, borderRadius: 999, background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900}}>✓</div>}
      </div>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: 190}}><CarIcon width={250} color={active ? color : "#7A8FA8"} kind={kind} /></div>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{fontFamily: khmerFamily, fontSize: 22, color: "#5A6B85", fontWeight: 600}}>{seats}</div>
        <div style={{fontFamily: geistFamily, fontSize: 18, fontWeight: 800, color: active ? color : "#5A6B85", letterSpacing: 1}}>{active ? "SELECTED" : "AVAILABLE"}</div>
      </div>
    </div>
  );
};

export const PhoneFrame: React.FC<{readonly children: React.ReactNode; readonly tilt?: number; readonly width?: number}> = ({children, tilt = -7, width = 560}) => {
  const f = useCurrentFrame();
  const float = Math.sin(f / 26) * 6;
  const ry = tilt + Math.sin(f / 34) * 1.2;
  return (
    <div style={{perspective: 1600}}>
      <div style={{width, height: width * 1.92, borderRadius: width * 0.13, background: "linear-gradient(145deg,#22345E,#111F40)", padding: width * 0.035, transform: `rotateY(${ry}deg) rotateX(3deg) translateY(${float}px)`, boxShadow: "0 50px 100px rgba(17,31,64,0.4), inset 0 0 0 2px rgba(255,255,255,0.12)"}}>
        <div style={{width: "100%", height: "100%", borderRadius: width * 0.1, background: "#F9FCFC", overflow: "hidden", position: "relative", padding: `${width * 0.09}px ${width * 0.055}px ${width * 0.05}px`, display: "flex", flexDirection: "column", gap: width * 0.032}}>
          <div style={{position: "absolute", top: width * 0.025, left: "50%", translate: "-50% 0", width: width * 0.24, height: width * 0.045, borderRadius: 999, background: "#111F40"}} />
          {children}
        </div>
      </div>
    </div>
  );
};

export const RouteUI: React.FC<{readonly showPrice?: boolean}> = ({showPrice = true}) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{fontFamily: geistFamily, fontSize: 22, fontWeight: 800, color: navy}}>vehabooking.com</div>
        <div style={{fontFamily: khmerFamily, fontSize: 16, color: "#5A6B85"}}>សុវត្ថិភាព</div>
      </div>
      <div style={{display: "flex", gap: 8}}>
        {["ឡានក្រុង", "Ferry", "ឯកជន", "ព្រលាន"].map((x, i) => <div key={x} style={{flex: 1, textAlign: "center", padding: "10px 0", borderRadius: 14, fontFamily: khmerFamily, fontSize: 18, fontWeight: 700, background: i === 2 ? teal : "#E6EEF5", color: i === 2 ? "#fff" : "#5A6B85"}}>{x}</div>)}
      </div>
      {[["1 · FROM", "ភ្នំពេញ", 0], ["2 · TO", "កំពត", 8], ["3 · DATE", "07 Nov 2026", 16], ["4 · GUESTS", "៤ នាក់", 24]].map(([label, value, d]) => (
        <div key={String(label)} style={{opacity: interpolate(f, [Number(d), Number(d) + 8], [0, 1], clamp), translate: `0px ${interpolate(f, [Number(d), Number(d) + 10], [18, 0], clamp)}px`, borderRadius: 20, border: `3px solid ${f > Number(d) + 4 ? teal : "#DDE5EE"}`, padding: "12px 20px", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div style={{fontFamily: geistFamily, fontSize: 15, fontWeight: 800, letterSpacing: 1.6, color: "#5A6B85"}}>{label}</div>
          <div style={{fontFamily: khmerFamily, fontSize: 26, fontWeight: 800, color: navy}}>{value}</div>
        </div>
      ))}
      {showPrice && (
        <div style={{marginTop: 2, borderRadius: 24, padding: "18px 22px", background: "linear-gradient(135deg,#0FB5A0,#00877A)", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: interpolate(f, [32, 42], [0, 1], clamp), scale: String(interpolate(f, [32, 42], [0.92, 1], clamp))}}>
          <div style={{fontFamily: khmerFamily, fontSize: 22, fontWeight: 700}}>ចាប់ពី</div>
          <div style={{fontFamily: geistFamily, fontSize: 46, fontWeight: 900}}>$45</div>
        </div>
      )}
      <div style={{marginTop: "auto", borderRadius: 24, padding: "18px 0", textAlign: "center", background: tealDeep, color: "#fff", fontFamily: geistFamily, fontSize: 28, fontWeight: 900, letterSpacing: 1}}>CONTINUE</div>
    </>
  );
};

export const BookUI: React.FC<{readonly tapped?: boolean}> = ({tapped = false}) => {
  const f = useCurrentFrame();
  const tap = interpolate(f, [40, 44, 50], [1, 0.92, 1], clamp);
  if (tapped && f > 46) {
    return (
      <>
        <div style={{display: "flex", justifyContent: "center", marginTop: 24}}>
          <div style={{width: 190, height: 190, borderRadius: 999, background: "linear-gradient(135deg,#0FB5A0,#00877A)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 24px 50px rgba(0,179,159,0.3)", scale: String(interpolate(f, [46, 56], [0.5, 1], clamp))}}>
            <div style={{fontSize: 100, color: "#fff", fontWeight: 900, lineHeight: 1}}>✓</div>
          </div>
        </div>
        <div style={{textAlign: "center", fontFamily: khmerFamily, fontSize: 42, fontWeight: 900, color: tealDeep}}>កក់បានហើយ!</div>
        <div style={{borderRadius: 24, background: "#fff", border: "2px solid #E6EEF5", padding: 22, display: "flex", flexDirection: "column", gap: 14}}>
          {[["ភ្នំពេញ → កំពត", "Van"], ["07 Nov 2026", "08:00"], ["តម្លៃសរុប", "$45"]].map(([a, b], i) => <div key={a} style={{display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: khmerFamily, fontSize: 22, color: "#5A6B85"}}><span>{a}</span><span style={{fontFamily: geistFamily, fontWeight: 900, color: i === 2 ? teal : navy, fontSize: 24}}>{b}</span></div>)}
        </div>
        <div style={{marginTop: "auto", textAlign: "center", fontFamily: khmerFamily, fontSize: 18, color: "#5A6B85"}}>បញ្ជាក់ភ្លាម · តម្លៃច្បាស់</div>
      </>
    );
  }
  return (
    <>
      <div style={{fontFamily: khmerFamily, fontSize: 24, fontWeight: 800, color: navy}}>ជ្រើសថ្ងៃធ្វើដំណើរ</div>
      <div style={{display: "flex", gap: 10}}>
        {["07", "08", "09"].map((d, i) => <div key={d} style={{flex: 1, textAlign: "center", padding: "16px 0", borderRadius: 18, background: i === 0 ? teal : "#fff", border: `2px solid ${i === 0 ? teal : "#E6EEF5"}`, color: i === 0 ? "#fff" : navy, fontFamily: geistFamily, fontSize: 24, fontWeight: 800}}>{d}<div style={{fontSize: 13, fontWeight: 600}}>NOV</div></div>)}
      </div>
      <div style={{borderRadius: 24, background: "#fff", border: "2px solid #E6EEF5", padding: 22, display: "flex", flexDirection: "column", gap: 14}}>
        <div style={{display: "flex", justifyContent: "space-between", fontFamily: khmerFamily, fontSize: 22, color: "#5A6B85"}}><span>ឡាន</span><span style={{color: navy, fontWeight: 800}}>Van · ៤ នាក់</span></div>
        <div style={{display: "flex", justifyContent: "space-between", fontFamily: khmerFamily, fontSize: 22, color: "#5A6B85"}}><span>ចម្ងាយ</span><span style={{color: navy, fontWeight: 800}}>ភ្នំពេញ → កំពត</span></div>
        <div style={{display: "flex", justifyContent: "space-between", fontFamily: khmerFamily, fontSize: 22, color: "#5A6B85"}}><span>តម្លៃ</span><span style={{fontFamily: geistFamily, fontSize: 36, fontWeight: 900, color: teal}}>$45</span></div>
      </div>
      <div style={{marginTop: "auto", position: "relative"}}>
        <div style={{position: "absolute", inset: -10, borderRadius: 34, border: `4px solid ${teal}`, opacity: interpolate(f, [40, 44, 54], [0, 0.9, 0], clamp), scale: String(interpolate(f, [40, 44, 54], [0.96, 1.04, 1.12], clamp))}} />
        <div style={{borderRadius: 24, padding: "20px 0", textAlign: "center", background: f >= 48 ? tealDeep : teal, color: "#fff", fontFamily: geistFamily, fontSize: 30, fontWeight: 900, scale: String(tap), boxShadow: "0 18px 30px rgba(0,179,159,0.3)"}}>Book Now</div>
      </div>
    </>
  );
};
