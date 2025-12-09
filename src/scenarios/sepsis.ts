import { PatientState, ScenarioConfig } from "../types";

const initial: PatientState = {
  vitals: { sbp: 86, dbp: 48, map: 60, hr: 118, spo2: 92, temp: 39.1, rr: 28 },
  support: {
    pressor: "Norepi 0.05 μg/kg/min",
    inotrope: "尚未使用",
    o2: "NRM 12L",
    vent: null,
    fluids: "已補 500 mL，尿量 20 mL/h",
  },
  flags: { intubated: false, niv: false, antibiotics: false, bigFluid: false, infectionSuspected: true },
  log: [],
  results: [],
  time: 0,
};

export const sepsisScenario: ScenarioConfig = {
  id: "sepsis-vasoplegia",
  name: "敗血性休克",
  tags: ["sepsis"],
  preamble: "發燒、低壓、心跳快，疑似肺源或腹源敗血。",
  initialState: initial,
  drift: [
    { dvitals: { map: -3, spo2: -1, hr: 1, rr: 1 }, condition: () => true },
  ],
  endings: [
    { label: "death", when: (s) => s.vitals.map < 50 || s.vitals.spo2 < 80, message: "循環崩潰，病人死亡。" },
    { label: "crash", when: (s) => s.vitals.map < 55 || s.vitals.spo2 < 85, message: "血壓極低，需升壓/插管。" },
    { label: "improve", when: (s) => s.vitals.map >= 65 && s.vitals.spo2 >= 94 && s.flags.antibiotics, message: "血壓回升，氧合改善。" },
  ],
  orders: [],
  effects: {
    "lab:lactate": (s) => addResult(s, "乳酸 4.2，血培送出。"),
    "med:abx": (s) => { s.flags.antibiotics = true; addResult(s, "廣譜抗生素已給。"); return s; },
    "fluid:bolus": (s) => { s.flags.bigFluid = true; s.vitals.map += 3; s.log.unshift({ time: s.time, tag: "info", text: "補液 500 mL。" }); return s; },
    "med:pressor:norepi": (s, rate=0.05) => { s.vitals.map += Math.round(rate*40); s.support.pressor = `Norepi ${rate.toFixed(2)}`; return s; },
    "med:pressor:epi": (s, rate=0.02) => { s.vitals.map += Math.round(rate*30); s.support.pressor = `Epi ${rate.toFixed(2)}`; return s; },
    "resp:o2:nc": (s) => { s.support.o2 = "N/C"; s.vitals.spo2 += 1; return s; },
    "resp:o2:nrm": (s) => { s.support.o2 = "NRM 12-15L"; s.vitals.spo2 += 3; return s; },
    "resp:o2:bipap": (s) => { s.support.o2 = "BiPAP 12/6"; s.vitals.spo2 += 2; return s; },
    "resp:intubate": (s) => { s.flags.intubated = true; s.support.o2 = "ETT"; s.vitals.spo2 += 3; return s; },
  },
};

function addResult(s: PatientState, text: string) {
  s.results.unshift(text);
  return s;
}
