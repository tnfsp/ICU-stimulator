import { PatientState, ScenarioConfig } from "../types";

const initial: PatientState = {
  vitals: { sbp: 82, dbp: 48, map: 58, hr: 110, spo2: 90, temp: 37.0, rr: 24 },
  support: {
    pressor: "Norepi 0.05 μg/kg/min",
    inotrope: "尚未使用",
    o2: "NRM 10L",
    vent: null,
    fluids: "未補液",
  },
  flags: { intubated: false, niv: false, antibiotics: false, bigFluid: false },
  log: [],
  results: [],
  time: 0,
};

export const circuitIssueScenario: ScenarioConfig = {
  id: "circuit-issue",
  name: "輸注/管路問題",
  tags: ["circuit"],
  preamble: "血壓下滑，輸液/輸血管路可能漏、阻塞或氣栓，需檢查線路。",
  initialState: initial,
  drift: [
    { dvitals: { map: -2, hr: 1 }, condition: () => true },
  ],
  endings: [
    { label: "death", when: (s) => s.vitals.map < 50, message: "循環崩潰，病人死亡。" },
    { label: "improve", when: (s) => s.vitals.map >= 65 && s.flags.bigFluid, message: "修復管路並補液後血壓回升。" },
  ],
  orders: [],
  effects: {
    "lab:hgb": (s) => addResult(s, "Hb 9.5。"),
    "line:check": (s) => { s.log.unshift({ time: s.time, tag: "info", text: "管路檢查：發現滲漏/阻塞已處理。" }); return s; },
    "fluid:bolus": (s) => { s.flags.bigFluid = true; s.vitals.map += 5; s.vitals.sbp += 6; return s; },
    "med:pressor:norepi": (s) => { s.support.pressor = "Norepi 滴定中"; s.vitals.map += 3; return s; },
  },
};

function addResult(s: PatientState, text: string) {
  s.results.unshift(text);
  return s;
}
