import { PatientState, ScenarioConfig } from "../types";

const initial: PatientState = {
  vitals: { sbp: 80, dbp: 46, map: 56, hr: 122, spo2: 94, temp: 36.8, rr: 24 },
  support: {
    pressor: "尚未使用",
    inotrope: "尚未使用",
    o2: "N/C 3L",
    vent: null,
    fluids: "未補液，尿量少",
  },
  flags: { intubated: false, niv: false, antibiotics: false, bigFluid: false },
  log: [],
  results: [],
  time: 0,
};

export const hypovolemicScenario: ScenarioConfig = {
  id: "hypovolemic-bleed",
  name: "低血容量/出血性休克",
  tags: ["volume"],
  preamble: "疑似 GI/術後出血，血壓低、心跳快，末梢冷，尿量低。",
  initialState: initial,
  drift: [
    { dvitals: { map: -2, hr: 1, spo2: -0.5 }, condition: () => true },
  ],
  endings: [
    { label: "death", when: (s) => s.vitals.map < 50, message: "循環崩潰，病人死亡。" },
    { label: "improve", when: (s) => s.vitals.map >= 65 && s.flags.bigFluid, message: "血壓回升，補液有效。" },
  ],
  orders: [],
  effects: {
    "lab:hgb": (s) => addResult(s, "Hb 7.2，Hct 22%。"),
    "fluid:bolus": (s) => { s.flags.bigFluid = true; s.vitals.map += 6; s.vitals.sbp += 8; s.log.unshift({ time: s.time, tag: "good", text: "快速補液 500 mL，血壓回升。" }); return s; },
    "med:pressor:norepi": (s, rate=0.05) => { s.vitals.map += Math.round(rate*30); s.support.pressor = `Norepi ${rate.toFixed(2)}`; return s; },
    "resp:o2:nc": (s) => { s.support.o2 = "N/C 3L"; s.vitals.spo2 += 1; return s; },
  },
};

function addResult(s: PatientState, text: string) {
  s.results.unshift(text);
  return s;
}
