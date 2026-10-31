import type React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {Card, CarIcon, Check, clamp, coral, ease, enter, geistFamily, Kh, muted, navy, PlaneIcon, sun, teal, tealDeep, usePop} from "./brand";
import {abs, Board, Emoji, Field, Phone} from "./01-private-airport-kh/scenes";

// Airport · drop-off: home -> airport on time
export const SDrop: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [10, 110], [150, 600], {...clamp, easing: ease});
  return (
    <Board>
      <div style={abs(60, 120)}><Emoji size={170}>🏡</Emoji></div>
      <div style={abs(740, 100, {rotate: "-30deg"})}><PlaneIcon size={220} /></div>
      <div style={abs(120, 420, {width: 760, height: 16, borderRadius: 10, background: "#C9D6E5"})} />
      <div style={abs(x, 330)}><CarIcon width={260} /></div>
      <Card style={{...abs(170, 560, {width: 660, padding: "26px 36px", display: "flex", alignItems: "center", gap: 26}), ...enter(f, 40)}}>
        <Emoji size={86}>⏰</Emoji>
        <div>
          <Kh size={46}>ជូនទៅទាន់ម៉ោង</Kh>
          <Kh size={28} color={muted} weight={500}>Home → Airport drop-off</Kh>
        </div>
      </Card>
    </Board>
  );
};

// Airport · two airports KTI & SAI
const airports = [["KTI", "តេជោ · ភ្នំពេញ"], ["SAI", "សៀមរាប-អង្គរ"]] as const;
export const SAirports: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Board>
      {airports.map(([code, name], i) => (
        <Card key={code} style={{...abs(80, 90 + i * 420, {width: 840, height: 360, display: "flex", alignItems: "center", gap: 40, padding: "0 50px", borderLeft: `16px solid ${i ? sun : teal}`}), ...enter(f, 6 + i * 50)}}>
          <PlaneIcon size={150} color={i ? navy : teal} />
          <div>
            <div style={{fontFamily: geistFamily, fontSize: 110, fontWeight: 800, color: navy, lineHeight: 1}}>{code}</div>
            <Kh size={48} color={muted} weight={600}>{name}</Kh>
          </div>
        </Card>
      ))}
    </Board>
  );
};

// Private · bus pain
export const SBus: React.FC = () => {
  const f = useCurrentFrame();
  const shake = Math.sin(f / 3) * 4;
  return (
    <Board>
      <div style={{...abs(0, 80, {width: 1000, textAlign: "center", translate: `${shake}px 0px`})}}><Emoji size={240}>🚌</Emoji></div>
      {["⏳ ចាំយូរ", "🛑 ឈប់ច្រើន", "😩 ធុញ"].map((t, i) => (
        <Card key={t} style={{...abs(120 + (i % 2) * 120, 420 + i * 170, {width: 640, padding: "20px 40px", border: `5px solid ${coral}`}), ...enter(f, 30 + i * 22)}}>
          <Kh size={54} color={navy}>{t}</Kh>
        </Card>
      ))}
    </Board>
  );
};

// Private · stop anywhere
export const SStops: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 120], [-60, 700], clamp);
  return (
    <Board>
      <div style={abs(40, 300, {width: 920, height: 18, borderRadius: 10, background: "#C9D6E5"})} />
      {[["☕", 180, 10], ["📸", 480, 40], ["🌴", 760, 70]].map(([e, px, d]) => (
        <div key={String(e)} style={{...abs(Number(px), 130), ...enter(f, Number(d))}}><Emoji size={120}>{String(e)}</Emoji></div>
      ))}
      <div style={abs(x, 240)}><CarIcon width={200} kind="suv" /></div>
      <Card style={{...abs(150, 500, {width: 700, padding: "30px 40px", textAlign: "center"}), ...enter(f, 60)}}>
        <Kh size={58} color={tealDeep}>ឈប់បានតាមចិត្ត</Kh>
        <Kh size={34} color={muted} weight={500}>ឡានសម្រាប់តែក្រុមបង</Kh>
      </Card>
    </Board>
  );
};

export const S10Air: React.FC = () => {
  const f = useCurrentFrame();
  const tap = interpolate(f, [70, 74, 84], [1, 0.9, 1], clamp);
  return (
    <Board>
      <div style={abs(265, 50)}>
        <Phone>
          <Kh size={36}>កក់ឡានទទួលព្រលានយន្តហោះ</Kh>
          <Field label="1 · FROM" value="ព្រលានយន្តហោះ KTI" at={14} />
          <Field label="2 · TO" value="ភ្នំពេញ" at={34} />
          <Field label="3 · DATE" value="07 Nov 2026" at={54} />
          <div style={{marginTop: 6, borderRadius: 24, padding: "22px 0", textAlign: "center", background: f >= 72 ? tealDeep : teal, color: "#fff", fontFamily: geistFamily, fontSize: 38, fontWeight: 800, scale: String(tap), boxShadow: "0 14px 30px rgba(0,179,159,0.4)"}}>Book Now</div>
        </Phone>
      </div>
      <div style={{...abs(560, 700), opacity: interpolate(f, [56, 64], [0, 1], clamp), translate: `${interpolate(f, [56, 70], [120, 0], {...clamp, easing: ease})}px ${interpolate(f, [56, 70], [80, 0], {...clamp, easing: ease})}px`}}><Emoji size={110}>👆</Emoji></div>
    </Board>
  );
};


export const S11Air: React.FC = () => {
  const f = useCurrentFrame();
  const s = usePop(4, 10);
  return (
    <Board>
      <Card style={abs(140, 60, {width: 720, height: 860, display: "flex", flexDirection: "column", alignItems: "center", padding: 50, gap: 22, scale: String(s)})}>
        <Check size={200} progress={interpolate(f, [12, 32], [0, 1], clamp)} />
        <Kh size={56} color={tealDeep}>កក់បានជោគជ័យ!</Kh>
        <div style={{width: "100%", height: 3, background: "#E6EEF5"}} />
        {[["KTI → ភ្នំពេញ", "Sedan"], ["07 Nov 2026", "08:00"], ["តម្លៃសរុប", "$15"]].map(([a, b], i) => (
          <div key={a} style={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", ...enter(f, 24 + i * 10, 20)}}>
            <Kh size={38} weight={600} color={muted}>{a}</Kh>
            <div style={{fontFamily: geistFamily, fontSize: 42, fontWeight: 800, color: i === 2 ? teal : navy}}>{b}</div>
          </div>
        ))}
      </Card>
    </Board>
  );
};

