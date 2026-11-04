import type React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {Card, clamp, ease, enter, geistFamily, Kh, muted, navy, sun, teal, tealDeep, usePop, useT} from "../brand";
import {abs, Board, Emoji, Phone} from "../01-private-airport-kh/scenes";

// Same visual language as 06/07, but the Sanloem cut gets its own text and numbers.
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

// 01 · quiet beach postcard (Sanloem)
export const FSanloem: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Board>
      <div style={abs(0, 0, {width: 1000, height: 1000, borderRadius: 40, background: "linear-gradient(180deg,#BDEBFF,#E9FAFF)", overflow: "hidden"})}>
        <div style={abs(710, 90, {width: 180, height: 180, borderRadius: 999, background: sun, scale: String(1 + Math.sin(f / 10) * 0.04)})} />
        <div style={abs(120, 330, {width: 760, height: 210, borderRadius: "50% 50% 0 0", background: "#F4DFA8"})} />
        <div style={abs(190, 190)}><Emoji size={200}>🌴</Emoji></div>
        <div style={abs(560, 230)}><Emoji size={170}>🏝️</Emoji></div>
      </div>
      <Waves y={500} speed={2} />
      <Card style={{...abs(100, 700, {width: 600, padding: "24px 30px", textAlign: "center"}), ...enter(f, 12)}}>
        <T kh="ស្ងាត់ៗ ស្អាតណាស់" en="Quiet & beautiful" size={48} />
      </Card>
    </Board>
  );
};

// 02 · route Sihanoukville → Koh Rong Sanloem, from $17
export const FRouteSanloem: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 70], [100, 520], {...clamp, easing: ease});
  const s = usePop(30, 10);
  return (
    <Board>
      <Waves y={300} />
      <div style={abs(40, 180)}><Emoji size={120}>🏙️</Emoji></div>
      <div style={abs(820, 180)}><Emoji size={120}>🏝️</Emoji></div>
      <div style={abs(x, 380)}><Boat size={160} /></div>
      <Card style={{...abs(80, 600, {width: 840, padding: "26px 34px"}), ...enter(f, 8)}}>
        <T kh="ព្រះសីហនុ → កោះរ៉ុងសន្លឹម" en="Sihanoukville → Koh Rong Sanloem" size={46} />
        <T kh="ទៅដល់តែម្ដង" en="Direct" size={36} color={muted} weight={600} />
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

// 03 · speedboat on waves, 30 min
export const FSpeed30: React.FC = () => {
  const f = useCurrentFrame();
  const s = usePop(12, 10);
  return (
    <Board>
      <Waves y={0} speed={9} />
      {[0, 1, 2].map((i) => <div key={i} style={abs(80 + ((f * 14 + i * 120) % 300), 420 + i * 40, {width: 180, height: 8, borderRadius: 8, background: "rgba(255,255,255,0.8)"})} />)}
      <div style={abs(400, 300)}><Boat size={260} /></div>
      <div style={abs(250, 640, {scale: String(s), width: 500, padding: "24px 0", borderRadius: 40, background: "#fff", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.25)"})}>
        <div style={{fontFamily: geistFamily, fontSize: 96, fontWeight: 800, color: navy, lineHeight: 1}}>⏱ 30</div>
        <T kh="នាទី ដល់កោះ!" en="min to the island!" size={40} color={tealDeep} />
      </div>
    </Board>
  );
};

// 04 · Sanloem departures board: 8 sailings, 08:00–16:00
const sanloemTimes = ["08:00", "09:00", "11:00", "12:00", "14:00", "14:30", "15:00", "16:00"];
export const FBoardSanloem: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Board>
      <Card style={abs(80, 35, {width: 840, height: 700, background: navy, padding: "30px 40px"})}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div style={{fontFamily: geistFamily, fontSize: 40, fontWeight: 800, color: sun, letterSpacing: 4}}>DEPARTURES</div>
          <T kh="៨ ជើង/ថ្ងៃ" en="8 / day" size={40} color="#fff" />
        </div>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 30px", marginTop: 26}}>
          {sanloemTimes.map((t, i) => (
            <div key={i} style={{opacity: interpolate(f, [i * 3, i * 3 + 6], [0, 1], clamp), display: "flex", justifyContent: "space-between", padding: "10px 18px", borderRadius: 12, background: "rgba(255,255,255,0.08)", fontFamily: geistFamily, fontSize: 36, fontWeight: 700, color: "#fff"}}>
              <span>{t}</span><span style={{color: teal}}>🚤</span>
            </div>
          ))}
        </div>
        <div style={{marginTop: 20, textAlign: "center", fontFamily: geistFamily, fontSize: 44, fontWeight: 800, color: sun}}>08:00 – 16:00</div>
      </Card>
    </Board>
  );
};

// 05 · two Sanloem operators
export const FOpsSanloem: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Board>
      {[["Island Speed", teal], ["GTVC", navy]].map(([n, c], i) => (
        <Card key={n} style={{...abs(100, 160 + i * 300, {width: 800, height: 260, display: "flex", alignItems: "center", gap: 36, padding: "0 46px", borderLeft: `18px solid ${c}`}), ...enter(f, 4 + i * 10)}}>
          <Boat size={120} />
          <div>
            <div style={{fontFamily: geistFamily, fontSize: 60, fontWeight: 800, color: navy}}>{n}</div>
            <div style={{fontFamily: geistFamily, fontSize: 32, fontWeight: 700, color: muted}}>from $17</div>
          </div>
        </Card>
      ))}
    </Board>
  );
};

// 06 · hammock + sunset
export const FSunset: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Board>
      <div style={abs(0, 0, {width: 1000, height: 1000, borderRadius: 40, background: "linear-gradient(180deg,#FFD79A 0%,#FF9A6B 46%,#2BA8D8 47%,#1B6FA8 100%)", overflow: "hidden"})}>
        <div style={abs(600, 230, {width: 220, height: 220, borderRadius: 999, background: "#FFE28A", boxShadow: "0 0 90px rgba(255,210,90,0.85)"})} />
        {[0, 1, 2, 3].map((i) => <div key={i} style={abs(-200 + ((f * 2 + i * 260) % 1400) - 200, 610 + i * 55, {width: 220, height: 10, borderRadius: 8, background: "rgba(255,255,255,0.32)"})} />)}
        <div style={abs(20, 270)}><Emoji size={250}>🌴</Emoji></div>
        <div style={abs(750, 300)}><Emoji size={230}>🌴</Emoji></div>
        <div style={abs(230, 520, {width: 620, height: 120, borderRadius: "0 0 50% 50%", borderBottom: "14px solid #F4DFA8"})} />
        <div style={abs(480, 555)}><Emoji size={90}>🍹</Emoji></div>
      </div>
      <Card style={{...abs(110, 790, {width: 600, padding: "22px 30px", textAlign: "center"}), ...enter(f, 16)}}>
        <T kh="ថ្ងៃលិចស្អាតណាស់" en="Beautiful sunset" size={48} />
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

// 07 · booking phone: Sanloem
export const FBookSanloem: React.FC = () => {
  const f = useCurrentFrame();
  const {L} = useL();
  const tap = interpolate(f, [46, 50, 58], [1, 0.9, 1], clamp);
  return (
    <Board>
      <div style={abs(265, 50)}>
        <Phone>
          <Tabs active={1} />
          <PField label="1 · FROM" value={L("ក្រុងព្រះសីហនុ", "Sihanoukville")} at={8} />
          <PField label="2 · TO" value={L("កោះរ៉ុងសន្លឹម", "Koh Rong Sanloem")} at={20} />
          <PField label="3 · DATE" value="07 Nov 2026" at={32} />
          <div style={{borderRadius: 24, padding: "20px 0", textAlign: "center", background: f >= 48 ? tealDeep : teal, color: "#fff", fontFamily: geistFamily, fontSize: 38, fontWeight: 800, scale: String(tap)}}>Book Now</div>
        </Phone>
      </div>
      <div style={{...abs(560, 700), opacity: interpolate(f, [34, 40], [0, 1], clamp), translate: `${interpolate(f, [34, 46], [120, 0], {...clamp, easing: ease})}px 0px`}}><Emoji size={110}>👆</Emoji></div>
    </Board>
  );
};
