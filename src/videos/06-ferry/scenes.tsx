import type React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {Card, Check, clamp, coral, ease, enter, geistFamily, Kh, Logo, muted, navy, sun, teal, tealDeep, usePop, useT} from "../brand";
import {abs, Board, Emoji, Phone} from "../01-private-airport-kh/scenes";

// Pick text by language (scenes are ~2-3s, so all motion lands within ~40 frames).
const useL = () => {
  const {lang, font} = useT();
  return {font, L: (kh: string, en: string) => (lang === "en" ? en : kh)};
};
const T: React.FC<{readonly kh: string; readonly en: string; readonly size: number; readonly color?: string; readonly weight?: number; readonly style?: React.CSSProperties}> = ({kh, en, ...p}) => {
  const {L} = useL();
  return <Kh {...p}>{L(kh, en)}</Kh>;
};
const sea = "#2BA8D8";
const Waves: React.FC<{readonly y: number; readonly speed?: number}> = ({y, speed = 3}) => {
  const f = useCurrentFrame();
  return (
    <div style={abs(0, y, {width: 1000, height: 1000 - y, overflow: "hidden", borderRadius: 40, background: `linear-gradient(180deg, ${sea}, #1B6FA8)`})}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={abs(-200 + ((f * speed + i * 260) % 1400) - 200, 30 + i * 70, {width: 260, height: 12, borderRadius: 10, background: "rgba(255,255,255,0.45)"})} />
      ))}
    </div>
  );
};
const Boat: React.FC<{readonly size: number}> = ({size}) => {
  const f = useCurrentFrame();
  return <div style={{fontSize: size, lineHeight: 1, rotate: `${Math.sin(f / 5) * 3}deg`, translate: `0px ${Math.sin(f / 4) * 6}px`}}>🚤</div>;
};

// 01 · sea & island
export const FIsland: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Board>
      <div style={abs(0, 0, {width: 1000, height: 1000, borderRadius: 40, background: "linear-gradient(180deg,#BDEBFF,#E9FAFF)", overflow: "hidden"})}>
        <div style={abs(700, 80, {width: 180, height: 180, borderRadius: 999, background: sun, scale: String(1 + Math.sin(f / 10) * 0.04)})} />
        <div style={abs(180, 300, {width: 640, height: 200, borderRadius: "50% 50% 0 0", background: "#F4DFA8"})} />
        <div style={abs(380, 160)}><Emoji size={190}>🌴</Emoji></div>
      </div>
      <Waves y={470} />
      <Card style={{...abs(180, 700, {width: 640, padding: "22px 30px", textAlign: "center"}), ...enter(f, 14)}}>
        <T kh="ទៅលេងកោះ... កក់នៅណាហ្នឹង? 🤔" en="Island trip... book where? 🤔" size={46} />
      </Card>
    </Board>
  );
};

// 02 · worried at the pier → Veha Booking
export const FPier: React.FC = () => {
  const f = useCurrentFrame();
  const s = usePop(22, 10);
  return (
    <Board>
      <Waves y={560} speed={2} />
      <div style={abs(40, 480, {width: 560, height: 60, borderRadius: 12, background: "#9C6B3E"})} />
      {[80, 220, 360, 500].map((x) => <div key={x} style={abs(x, 540, {width: 26, height: 200, background: "#7A5230"})} />)}
      <div style={abs(120, 290)}><Emoji size={190}>🧍</Emoji></div>
      <div style={abs(250, 250, {opacity: interpolate(f, [0, 10, 20, 26], [0, 1, 1, 0], clamp)})}><Emoji size={110}>😟</Emoji></div>
      <Card style={abs(430, 120, {width: 520, padding: "34px 30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, scale: String(s)})}>
        <Logo size={80} />
        <T kh="ជួយបងប្អូនទៅកោះ" en="Your island helper" size={40} color={tealDeep} />
      </Card>
    </Board>
  );
};

const Tabs: React.FC<{readonly active: number}> = ({active}) => {
  const {L} = useL();
  return (
    <div style={{display: "flex", gap: 8}}>
      {[L("ឡានក្រុង", "Bus"), "Ferry", L("ឯកជន", "Private"), L("ព្រលាន", "Airport")].map((t, i) => (
        <div key={t} style={{flex: 1, textAlign: "center", padding: "10px 0", borderRadius: 14, fontFamily: geistFamily, fontSize: 20, fontWeight: 800, background: i === active ? teal : "#E6EEF5", color: i === active ? "#fff" : muted}}>{t}</div>
      ))}
    </div>
  );
};

// 03 · website Ferry tab
export const FTab: React.FC = () => {
  const f = useCurrentFrame();
  const active = f >= 24 ? 1 : 0;
  return (
    <Board>
      <div style={abs(265, 60)}>
        <Phone>
          <div style={{fontFamily: geistFamily, fontSize: 30, fontWeight: 800, color: navy}}>vehabooking.com</div>
          <Tabs active={active} />
          <div style={{borderRadius: 24, overflow: "hidden", height: 300, background: `linear-gradient(180deg,#BDEBFF, ${sea})`, display: "flex", alignItems: "center", justifyContent: "center"}}><Boat size={170} /></div>
          <T kh="ទូកល្បឿនលឿន" en="Speed ferry" size={36} />
          <T kh="កក់អនឡាញ ងាយៗ" en="Book online, easy" size={28} color={muted} weight={500} />
        </Phone>
      </div>
      <div style={{...abs(560, 120), opacity: interpolate(f, [8, 16], [0, 1], clamp), translate: `${interpolate(f, [8, 22], [140, 0], {...clamp, easing: ease})}px 0px`}}><Emoji size={110}>👆</Emoji></div>
    </Board>
  );
};

// 04 · route Sihanoukville → Koh Rong / Sanloem, from $17
export const FRoute: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 70], [100, 520], {...clamp, easing: ease});
  const s = usePop(30, 10);
  return (
    <Board>
      <Waves y={300} />
      <div style={abs(40, 180)}><Emoji size={120}>🏙️</Emoji></div>
      <div style={abs(820, 180)}><Emoji size={120}>🏝️</Emoji></div>
      <div style={abs(x, 380)}><Boat size={160} /></div>
      <Card style={{...abs(90, 600, {width: 820, padding: "26px 34px"}), ...enter(f, 8)}}>
        <T kh="ព្រះសីហនុ → កោះរ៉ុង" en="Sihanoukville → Koh Rong" size={50} />
        <T kh="+ កោះរ៉ុងសន្លឹម" en="+ Koh Rong Sanloem" size={36} color={muted} weight={600} />
      </Card>
      <div style={abs(120, 820, {scale: String(s)})}>
        <div style={{display: "inline-flex", gap: 14, alignItems: "center", padding: "10px 30px", borderRadius: 999, background: navy}}>
          <T kh="ចាប់ពី" en="From" size={34} color="#fff" weight={600} />
          <span style={{fontFamily: geistFamily, fontSize: 60, fontWeight: 800, color: sun}}>$17</span>
        </div>
      </div>
    </Board>
  );
};

// 05 · speedboat on waves, 35 min
export const FSpeed: React.FC = () => {
  const f = useCurrentFrame();
  const s = usePop(12, 10);
  return (
    <Board>
      <Waves y={0} speed={9} />
      {[0, 1, 2].map((i) => <div key={i} style={abs(80 + ((f * 14 + i * 120) % 300), 420 + i * 40, {width: 180, height: 8, borderRadius: 8, background: "rgba(255,255,255,0.8)"})} />)}
      <div style={abs(400, 300)}><Boat size={260} /></div>
      <div style={abs(250, 640, {scale: String(s), width: 500, padding: "24px 0", borderRadius: 40, background: "#fff", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.25)"})}>
        <div style={{fontFamily: geistFamily, fontSize: 96, fontWeight: 800, color: navy, lineHeight: 1}}>⏱ 35</div>
        <T kh="នាទី ដល់កោះ!" en="min to the island!" size={40} color={tealDeep} />
      </div>
    </Board>
  );
};

// 06 · departures board
const deps = ["08:00", "08:30", "09:00", "09:45", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "16:00", "17:00", "17:30"];
export const FBoard: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Board>
      <Card style={abs(80, 40, {width: 840, height: 920, background: navy, padding: "30px 40px"})}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div style={{fontFamily: geistFamily, fontSize: 40, fontWeight: 800, color: sun, letterSpacing: 4}}>DEPARTURES</div>
          <T kh="១៤ ជើង/ថ្ងៃ" en="14 / day" size={40} color="#fff" />
        </div>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 30px", marginTop: 24}}>
          {["08:00", ...deps].slice(0, 14).map((t, i) => (
            <div key={i} style={{opacity: interpolate(f, [i * 2.5, i * 2.5 + 6], [0, 1], clamp), display: "flex", justifyContent: "space-between", padding: "10px 18px", borderRadius: 12, background: "rgba(255,255,255,0.08)", fontFamily: geistFamily, fontSize: 38, fontWeight: 700, color: "#fff"}}>
              <span>{t}</span><span style={{color: teal}}>🚤</span>
            </div>
          ))}
        </div>
        <div style={{marginTop: 22, textAlign: "center", fontFamily: geistFamily, fontSize: 44, fontWeight: 800, color: sun}}>08:00 – 17:30</div>
      </Card>
    </Board>
  );
};

// 07 · one way vs round trip
export const FRound: React.FC = () => {
  const f = useCurrentFrame();
  const s = usePop(30, 9);
  return (
    <Board>
      {[["មួយជើង", "One way", "$17", false], ["ទៅមកវិញ", "Round trip", "$30", true]].map(([kh, en, p, hi], i) => (
        <Card key={String(en)} style={{...abs(60 + i * 470, 180, {width: 410, height: 460, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, border: hi ? `8px solid ${teal}` : "none"}), ...enter(f, 4 + i * 12)}}>
          <Emoji size={110}>{hi ? "🔁" : "➡️"}</Emoji>
          <T kh={String(kh)} en={String(en)} size={44} />
          <div style={{fontFamily: geistFamily, fontSize: 100, fontWeight: 800, color: hi ? teal : navy}}>{p}</div>
        </Card>
      ))}
      <div style={abs(300, 700, {scale: String(s), width: 400, padding: "20px 0", borderRadius: 999, background: sun, textAlign: "center", rotate: "-4deg"})}>
        <T kh="សន្សំ $4" en="Save $4" size={56} color={navy} />
      </div>
    </Board>
  );
};

// 08 · kids price
export const FKids: React.FC = () => {
  const f = useCurrentFrame();
  const s = usePop(16, 9);
  return (
    <Board>
      <div style={{...abs(0, 60, {width: 1000, textAlign: "center"}), ...enter(f, 0)}}><Emoji size={260}>👨‍👩‍👧‍👦</Emoji></div>
      <Card style={abs(160, 440, {width: 680, padding: "34px 30px", textAlign: "center", scale: String(s)})}>
        <T kh="ក្មេង (១–១៣ ឆ្នាំ)" en="Kids (ages 1–13)" size={48} />
        <div style={{fontFamily: geistFamily, fontSize: 130, fontWeight: 800, color: teal, lineHeight: 1.1}}>$8.50</div>
      </Card>
      <div style={{...abs(220, 820, {width: 560, textAlign: "center"}), ...enter(f, 26)}}><T kh="ទៅលេងទាំងគ្រួសារ" en="Family trips" size={40} color={muted} /></div>
    </Board>
  );
};

// 09 · safety
export const FSafety: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Board>
      {[["🦺", "អាវពោងសុវត្ថិភាព", "Life jackets"], ["👨‍✈️", "អ្នកបើកជំនាញ", "Trained captains"], ["🚻", "មានបន្ទប់ទឹក", "Toilet on board"]].map(([e, kh, en], i) => (
        <Card key={en} style={{...abs(110, 90 + i * 290, {width: 780, height: 240, display: "flex", alignItems: "center", gap: 40, padding: "0 50px"}), ...enter(f, 2 + i * 10)}}>
          <Emoji size={140}>{e}</Emoji>
          <T kh={kh} en={en} size={50} />
          <div style={{marginLeft: "auto"}}><Check size={80} progress={interpolate(f, [10 + i * 10, 24 + i * 10], [0, 1], clamp)} /></div>
        </Card>
      ))}
    </Board>
  );
};

// 10 · operators
export const FOps: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Board>
      {[["Island Speed", teal], ["GTVC", navy], ["VET", coral]].map(([n, c], i) => (
        <Card key={n} style={{...abs(110, 90 + i * 280, {width: 780, height: 230, display: "flex", alignItems: "center", gap: 36, padding: "0 46px", borderLeft: `18px solid ${c}`}), ...enter(f, 2 + i * 10)}}>
          <Boat size={110} />
          <div>
            <div style={{fontFamily: geistFamily, fontSize: 58, fontWeight: 800, color: navy}}>{n}</div>
            <div style={{fontFamily: geistFamily, fontSize: 30, fontWeight: 700, color: muted}}>from $17</div>
          </div>
        </Card>
      ))}
    </Board>
  );
};

const PField: React.FC<{readonly label: string; readonly value: string; readonly at: number}> = ({label, value, at}) => {
  const f = useCurrentFrame();
  const {font} = useT();
  const on = f >= at;
  return (
    <div style={{...enter(f, at - 8, 16), borderRadius: 20, border: `3px solid ${on ? teal : "#DDE5EE"}`, padding: "8px 20px", background: "#fff"}}>
      <div style={{fontFamily: geistFamily, fontSize: 20, fontWeight: 700, letterSpacing: 2, color: muted}}>{label}</div>
      <div style={{fontFamily: font, fontSize: 30, fontWeight: 700, color: navy, lineHeight: 1.5}}>{on ? value : "…"}</div>
    </div>
  );
};

// 11 · booking UI
export const FBook: React.FC = () => {
  const f = useCurrentFrame();
  const {L} = useL();
  const tap = interpolate(f, [46, 50, 58], [1, 0.9, 1], clamp);
  return (
    <Board>
      <div style={abs(265, 50)}>
        <Phone>
          <Tabs active={1} />
          <PField label="1 · FROM" value={L("ក្រុងព្រះសីហនុ", "Sihanoukville")} at={8} />
          <PField label="2 · TO" value={L("កោះរ៉ុង", "Koh Rong")} at={20} />
          <PField label="3 · DATE" value="07 Nov 2026" at={32} />
          <div style={{borderRadius: 24, padding: "20px 0", textAlign: "center", background: f >= 48 ? tealDeep : teal, color: "#fff", fontFamily: geistFamily, fontSize: 38, fontWeight: 800, scale: String(tap)}}>Book Now</div>
        </Phone>
      </div>
      <div style={{...abs(560, 700), opacity: interpolate(f, [34, 40], [0, 1], clamp), translate: `${interpolate(f, [34, 46], [120, 0], {...clamp, easing: ease})}px 0px`}}><Emoji size={110}>👆</Emoji></div>
    </Board>
  );
};

// 12 · confirmation
export const FDone: React.FC = () => {
  const f = useCurrentFrame();
  const s = usePop(2, 10);
  const {L} = useL();
  return (
    <Board>
      <Card style={abs(140, 60, {width: 720, height: 860, display: "flex", flexDirection: "column", alignItems: "center", padding: 50, gap: 22, scale: String(s)})}>
        <Check size={200} progress={interpolate(f, [6, 22], [0, 1], clamp)} />
        <T kh="កក់បានហើយ!" en="Booked!" size={56} color={tealDeep} />
        <div style={{width: "100%", height: 3, background: "#E6EEF5"}} />
        {[[L("ព្រះសីហនុ → កោះរ៉ុង", "Sihanoukville → Koh Rong"), "🚤"], ["07 Nov 2026", "08:00"], [L("តម្លៃសរុប", "Total"), "$17"]].map(([a, b], i) => (
          <div key={i} style={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", ...enter(f, 14 + i * 6, 20)}}>
            <Kh size={34} weight={600} color={muted}>{a}</Kh>
            <div style={{fontFamily: geistFamily, fontSize: 42, fontWeight: 800, color: i === 2 ? teal : navy}}>{b}</div>
          </div>
        ))}
      </Card>
    </Board>
  );
};

// 13 · end card (phone number as text only)
export const FEnd: React.FC = () => {
  const f = useCurrentFrame();
  const s = usePop(2, 10);
  return (
    <Board>
      <Card style={abs(60, 60, {width: 880, height: 880, background: navy, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, scale: String(s)})}>
        <Emoji size={130}>🏝️</Emoji>
        <Logo size={100} light />
        <T kh="ទៅកោះស្រួលៗ" en="Island trips made easy" size={56} color="#fff" style={{textAlign: "center"}} />
        <div style={{...enter(f, 10), padding: "16px 44px", borderRadius: 999, background: teal, fontFamily: geistFamily, fontSize: 56, fontWeight: 800, color: "#fff"}}>vehabooking.com</div>
        <div style={{...enter(f, 18), fontFamily: geistFamily, fontSize: 48, fontWeight: 700, color: sun}}>+855 95 255 577</div>
      </Card>
    </Board>
  );
};
