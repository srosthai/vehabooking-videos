import type React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {Card, CarIcon, Check, clamp, coral, ease, enter, geistFamily, Kh, Logo, mint, muted, navy, PlaneIcon, PriceTag, sun, teal, tealDeep, usePop, useT} from "../brand";

// Every stage is drawn on a 1000x1000 board; the film scales/places it per aspect ratio.
export const Board: React.FC<{readonly children: React.ReactNode}> = ({children}) => <div style={{position: "relative", width: 1000, height: 1000}}>{children}</div>;
export const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({position: "absolute", left: x, top: y, ...extra});

export const Phone: React.FC<{readonly children: React.ReactNode}> = ({children}) => (
  <div style={{width: 470, height: 860, borderRadius: 64, background: navy, padding: 18, boxShadow: "0 40px 80px rgba(17,31,64,0.3)"}}>
    <div style={{width: "100%", height: "100%", borderRadius: 48, background: "#F7FBFB", overflow: "hidden", position: "relative", padding: "60px 30px 30px", display: "flex", flexDirection: "column", gap: 22}}>
      <div style={{position: "absolute", top: 16, left: 165, width: 100, height: 26, borderRadius: 20, background: navy}} />
      {children}
    </div>
  </div>
);

export const Field: React.FC<{readonly label: string; readonly value: string; readonly at: number}> = ({label, value, at}) => {
  const f = useCurrentFrame();
  const shown = f >= at;
  const {t, font} = useT();
  return (
    <div style={{...enter(f, at - 10, 20), borderRadius: 20, border: `3px solid ${shown ? teal : "#DDE5EE"}`, padding: "10px 20px", background: "#fff"}}>
      <div style={{fontFamily: geistFamily, fontSize: 20, fontWeight: 700, letterSpacing: 2, color: muted}}>{label}</div>
      <div style={{fontFamily: font, fontSize: 30, fontWeight: 700, color: navy, lineHeight: 1.5}}>{shown ? t(value) : "…"}</div>
    </div>
  );
};

export const Emoji: React.FC<{readonly size: number; readonly children: string}> = ({size, children}) => <div style={{fontSize: size, lineHeight: 1}}>{children}</div>;

// 1 · Landing, tired traveller
export const S01: React.FC = () => {
  const f = useCurrentFrame();
  const px = interpolate(f, [0, 70], [-220, 560], {...clamp, easing: ease});
  const py = interpolate(f, [0, 70], [120, 300], {...clamp, easing: ease});
  return (
    <Board>
      <div style={abs(0, 560, {width: 1000, height: 30, borderRadius: 20, background: "#C9D6E5"})} />
      {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={abs(60 + i * 160, 570, {width: 80, height: 10, borderRadius: 6, background: "#fff"})} />)}
      <div style={abs(px, py, {rotate: "100deg"})}><PlaneIcon size={260} /></div>
      <Card style={{...abs(100, 660, {width: 800, padding: "26px 36px", display: "flex", alignItems: "center", gap: 28}), ...enter(f, 34)}}>
        <Emoji size={90}>🧳</Emoji>
        <div>
          <Kh size={46}>ហត់ហើយ… ទៅសណ្ឋាគារ?</Kh>
          <Kh size={28} color={muted} weight={500}>Techo International Airport · KTI</Kh>
        </div>
      </Card>
    </Board>
  );
};

// 2 · Brand reveal
export const S02: React.FC = () => {
  const f = useCurrentFrame();
  const s = usePop(4, 10);
  const ring = interpolate(f, [4, 50], [0.4, 1.6], clamp);
  return (
    <Board>
      <div style={abs(170, 0, {width: 660, height: 660, borderRadius: 999, border: `8px solid ${teal}`, opacity: interpolate(ring, [0.4, 1.6], [0.8, 0]), scale: String(ring)})} />
      <div style={abs(0, 240, {width: 1000, display: "flex", justifyContent: "center", scale: String(s)})}><Logo size={140} /></div>
      <div style={{...abs(0, 520, {width: 1000, textAlign: "center"}), ...enter(f, 18)}}>
        <Kh size={64} color={tealDeep}>ជួយអ្នកគ្រប់ដំណើរ</Kh>
        <Kh size={34} color={muted} weight={500}>Private car · Airport transfer</Kh>
      </div>
    </Board>
  );
};

// 3 · Book online, Airport tab
export const S03: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Board>
      <div style={{...abs(265, 50), ...enter(f, 0, 80, 22)}}>
        <Phone>
          <div style={{scale: "0.62", transformOrigin: "0 50%"}}><Logo size={80} /></div>
          <div style={{display: "flex", gap: 8}}>
            {["Private", "Airport", "Bus", "Ferry"].map((t) => (
              <div key={t} style={{flex: 1, textAlign: "center", padding: "10px 0", borderRadius: 14, fontFamily: geistFamily, fontWeight: 700, fontSize: 19, background: t === "Airport" ? teal : "#E6EEF5", color: t === "Airport" ? "#fff" : navy}}>{t}</div>
            ))}
          </div>
          <Field label="FROM" value="ព្រលានយន្តហោះ KTI" at={30} />
          <Field label="TO" value="ភ្នំពេញ" at={50} />
          <Field label="DATE" value="07 Nov 2026" at={70} />
        </Phone>
      </div>
    </Board>
  );
};

// 4 · Driver with name sign + price
export const S04: React.FC = () => {
  const f = useCurrentFrame();
  const sign = usePop(10, 9);
  return (
    <Board>
      <Card style={{...abs(150, 60, {width: 700, height: 470, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, rotate: `${Math.sin(f / 12) * 2}deg`, scale: String(sign)}), border: `10px solid ${navy}`}}>
        <Kh size={40} color={muted} weight={600}>សូមស្វាគមន៍</Kh>
        <div style={{fontFamily: geistFamily, fontSize: 96, fontWeight: 800, color: navy, letterSpacing: -2}}>Mr. Dara</div>
        <div style={{fontFamily: geistFamily, fontSize: 30, fontWeight: 700, color: teal, letterSpacing: 3}}>VEHA BOOKING</div>
      </Card>
      <div style={{...abs(0, 600, {width: 1000, display: "flex", justifyContent: "center"}), ...enter(f, 90)}}>
        <div style={{display: "flex", alignItems: "center", gap: 20, fontFamily: geistFamily, fontSize: 54, fontWeight: 800, color: navy}}>
          KTI <PlaneIcon size={56} color={teal} /> <Kh size={52} style={{display: "inline-block", lineHeight: 1.5}}>ភ្នំពេញ</Kh>
        </div>
      </div>
      <div style={abs(0, 740, {width: 1000, display: "flex", justifyContent: "center"})}>
        <PriceTag label="ចាប់ពី" price="$15" delay={120} />
      </div>
    </Board>
  );
};

// 5 · Vehicle lineup
const cars = [
  {kind: "sedan", name: "Sedan", seats: "៤"},
  {kind: "suv", name: "SUV", seats: "៧"},
  {kind: "mpv", name: "MPV", seats: "៧"},
  {kind: "van", name: "Van", seats: "១៥"},
] as const;
export const S05: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Board>
      {cars.map((c, i) => (
        <Card key={c.name} style={{...abs(i % 2 === 0 ? 40 : 520, i < 2 ? 40 : 500, {width: 440, height: 420, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6}), ...enter(f, 20 + i * 26, 60)}}>
          <div style={{translate: `${interpolate(f, [20 + i * 26, 50 + i * 26], [-60, 0], {...clamp, easing: ease})}px 0px`}}>
            <CarIcon width={300} kind={c.kind} color={i % 2 ? navy : teal} />
          </div>
          <div style={{fontFamily: geistFamily, fontSize: 52, fontWeight: 800, color: navy}}>{c.name}</div>
          <Kh size={36} color={tealDeep}>{`${c.seats} កៅអី`}</Kh>
        </Card>
      ))}
    </Board>
  );
};

// 6 · For everyone
const groups = [
  {e: "👨‍👩‍👧", t: "គ្រួសារ"},
  {e: "🧑‍🤝‍🧑", t: "មិត្តភក្តិ"},
  {e: "💼", t: "ធ្វើការ"},
];
export const S06: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Board>
      {groups.map((g, i) => (
        <Card key={g.t} style={{...abs(110, 70 + i * 290, {width: 780, height: 240, display: "flex", alignItems: "center", gap: 40, padding: "0 50px"}), opacity: interpolate(f, [8 + i * 14, 18 + i * 14], [0, 1], clamp), translate: `${interpolate(f, [8 + i * 14, 30 + i * 14], [i % 2 ? 300 : -300, 0], {...clamp, easing: ease})}px 0px`}}>
          <Emoji size={120}>{g.e}</Emoji>
          <Kh size={64}>{g.t}</Kh>
          <div style={{marginLeft: "auto"}}><Check size={90} progress={interpolate(f, [30 + i * 14, 44 + i * 14], [0, 1], clamp)} /></div>
        </Card>
      ))}
    </Board>
  );
};

// 7 · Road trip door to door
export const S07: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 100], [-340, 1000], clamp);
  return (
    <Board>
      <div style={{position: "absolute", inset: 0, borderRadius: 40, overflow: "hidden"}}>
        <div style={abs(0, 0, {width: 1000, height: 1000, background: "linear-gradient(180deg,#BFEFF0,#F1FAF8)"})} />
        <div style={abs(700, 80, {width: 180, height: 180, borderRadius: 999, background: sun, boxShadow: `0 0 80px ${sun}`})} />
        <div style={abs(-50, 380, {width: 1100, height: 300, background: "#9FE3D8", borderRadius: "50% 50% 0 0"})} />
        <div style={abs(0, 600, {width: 1000, height: 220, background: navy})} />
        {Array.from({length: 8}).map((_, i) => <div key={i} style={abs((((i * 180 - f * 14) % 1440) + 1440) % 1440 - 200, 700, {width: 100, height: 16, borderRadius: 8, background: "#fff"})} />)}
        <div style={abs(x, 470, {translate: `0px ${Math.sin(f / 3) * 3}px`})}><CarIcon width={340} kind="suv" /></div>
        <div style={{...abs(0, 850, {width: 1000, textAlign: "center"}), ...enter(f, 20)}}>
          <Kh size={56}>ដល់មុខទ្វារ 🏡</Kh>
        </div>
      </div>
    </Board>
  );
};

// 8 · Route map with prices
export const S08: React.FC = () => {
  const f = useCurrentFrame();
  const l1 = interpolate(f, [10, 50], [1, 0], clamp);
  const l2 = interpolate(f, [90, 130], [1, 0], clamp);
  const pins: ReadonlyArray<readonly [number, number]> = [[560, 470], [300, 790], [430, 300]];
  return (
    <Board>
      <Card style={abs(40, 20, {width: 920, height: 960, background: mint})}>{null}</Card>
      <svg width={1000} height={1000} style={abs(0, 0)}>
        <path d="M560 470 Q 360 640 300 790" stroke={navy} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray="1" pathLength={1} strokeDashoffset={l1} />
        <path d="M560 470 Q 600 330 430 300" stroke={teal} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray="1" pathLength={1} strokeDashoffset={l2} />
        {pins.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={22} fill={coral} stroke="#fff" strokeWidth={8} />)}
      </svg>
      <Kh size={42} style={abs(600, 440)}>ភ្នំពេញ</Kh>
      <div style={abs(110, 840)}><PriceTag label="កំពត" price="$45" delay={40} /></div>
      <div style={abs(250, 150)}><PriceTag label="សៀមរាប" price="$65" delay={125} /></div>
    </Board>
  );
};

// 9 · Comfort checklist
const perks = ["ឡានស្អាត", "ម៉ាស៊ីនត្រជាក់", "អង្គុយស្រួល", "អ្នកបើកបរចេះផ្លូវ"];
export const S09: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Board>
      <Card style={abs(100, 40, {width: 800, height: 920, padding: "50px 60px", display: "flex", flexDirection: "column", gap: 30})}>
        <div style={{display: "flex", justifyContent: "center"}}><CarIcon width={380} kind="mpv" /></div>
        {perks.map((p, i) => (
          <div key={p} style={{display: "flex", alignItems: "center", gap: 30, ...enter(f, 14 + i * 18, 30)}}>
            <Check size={70} progress={interpolate(f, [18 + i * 18, 30 + i * 18], [0, 1], clamp)} />
            <Kh size={50}>{p}</Kh>
          </div>
        ))}
      </Card>
    </Board>
  );
};

// 10 · Pick place, date, Book Now
export const S10: React.FC = () => {
  const f = useCurrentFrame();
  const tap = interpolate(f, [70, 74, 84], [1, 0.9, 1], clamp);
  return (
    <Board>
      <div style={abs(265, 50)}>
        <Phone>
          <Kh size={36}>កក់ឡានឯកជន</Kh>
          <Field label="1 · FROM" value="ភ្នំពេញ" at={14} />
          <Field label="2 · TO" value="សៀមរាប" at={34} />
          <Field label="3 · DATE" value="07 Nov 2026" at={54} />
          <div style={{marginTop: 6, borderRadius: 24, padding: "22px 0", textAlign: "center", background: f >= 72 ? tealDeep : teal, color: "#fff", fontFamily: geistFamily, fontSize: 38, fontWeight: 800, scale: String(tap), boxShadow: "0 14px 30px rgba(0,179,159,0.4)"}}>Book Now</div>
        </Phone>
      </div>
      <div style={{...abs(560, 700), opacity: interpolate(f, [56, 64], [0, 1], clamp), translate: `${interpolate(f, [56, 70], [120, 0], {...clamp, easing: ease})}px ${interpolate(f, [56, 70], [80, 0], {...clamp, easing: ease})}px`}}><Emoji size={110}>👆</Emoji></div>
    </Board>
  );
};

// 11 · Instant confirmation
export const S11: React.FC = () => {
  const f = useCurrentFrame();
  const s = usePop(4, 10);
  return (
    <Board>
      <Card style={abs(140, 60, {width: 720, height: 860, display: "flex", flexDirection: "column", alignItems: "center", padding: 50, gap: 22, scale: String(s)})}>
        <Check size={200} progress={interpolate(f, [12, 32], [0, 1], clamp)} />
        <Kh size={56} color={tealDeep}>កក់បានជោគជ័យ!</Kh>
        <div style={{width: "100%", height: 3, background: "#E6EEF5"}} />
        {[["ភ្នំពេញ → សៀមរាប", "SUV"], ["07 Nov 2026", "08:00"], ["តម្លៃសរុប", "$65"]].map(([a, b], i) => (
          <div key={a} style={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", ...enter(f, 24 + i * 10, 20)}}>
            <Kh size={38} weight={600} color={muted}>{a}</Kh>
            <div style={{fontFamily: geistFamily, fontSize: 42, fontWeight: 800, color: i === 2 ? teal : navy}}>{b}</div>
          </div>
        ))}
      </Card>
    </Board>
  );
};

// 12 · End card
export const S12: React.FC = () => {
  const f = useCurrentFrame();
  const s = usePop(2, 10);
  const shine = interpolate(f, [120, 170], [-300, 1300], clamp);
  return (
    <Board>
      <Card style={abs(60, 60, {width: 880, height: 880, background: navy, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, scale: String(s)})}>
        <div style={abs(shine, -100, {width: 140, height: 1200, rotate: "20deg", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)"})} />
        <Logo size={110} light />
        <Kh size={56} color="#fff" style={{textAlign: "center"}}>ធ្វើដំណើរស្រួល គ្រប់ទីកន្លែង</Kh>
        <div style={{...enter(f, 20), padding: "16px 44px", borderRadius: 999, background: teal, fontFamily: geistFamily, fontSize: 56, fontWeight: 800, color: "#fff"}}>vehabooking.com</div>
        <div style={{...enter(f, 34), fontFamily: geistFamily, fontSize: 52, fontWeight: 700, color: sun}}>+855 95 255 577</div>
      </Card>
    </Board>
  );
};

export const stages = [S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12];
