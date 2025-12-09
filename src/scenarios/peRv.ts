import { PatientState, ScenarioConfig } from "../types";

const initial: PatientState = {
  vitals: { sbp: 86, dbp: 54, map: 64, hr: 118, spo2: 88, temp: 37.2, rr: 30 },
  support: {
    pressor: "尚未使用",
    inotrope: "尚未使用",
    o2: "NRM 12L",
    vent: null,
    fluids: "未補液，尿量偏少",
  },
  flags: { intubated: false, niv: false, antibiotics: false, bigFluid: false, rvFailure: true },
  log: [],
  results: [],
  time: 0,
};

export const peRvScenario: ScenarioConfig = {
  id: "pe-rv-failure",
  name: "肺栓塞 / 右心衰",
  tags: ["air", "pump"],
  preamble: "急性低氧、低壓、心跳快，RV strain；疑似 PE / 右心衰。",
  initialState: initial,
  drift: [
    { dvitals: { map: -3, spo2: -2, rr: 1 }, condition: () => true },
  ],
  endings: [
    { label: "death", when: (s) => s.vitals.spo2 < 78 || s.vitals.map < 50, message: "右心衰惡化，病人死亡。" },
    { label: "crash", when: (s) => s.vitals.spo2 < 82, message: "低氧嚴重，需高流或插管。" },
    { label: "improve", when: (s) => s.vitals.map >= 65 && s.vitals.spo2 >= 92, message: "血壓與氧合穩定。" },
  ],
  orders: [],
  effects: {
    "lab:ddimer": (s) => addResult(s, "D-dimer 升高。"),
    "lab:trop": (s) => addResult(s, "Trop 輕度升高，RV strain 可能。"),
    "resp:o2:nrm": (s) => { s.support.o2 = "NRM 12L"; s.vitals.spo2 += 2; return s; },
    "resp:o2:bipap": (s) => { s.support.o2 = "BiPAP"; s.vitals.spo2 += 2; return s; },
    "resp:intubate": (s) => { s.flags.intubated = true; s.support.o2 = "ETT"; s.vitals.spo2 += 3; return s; },
    "fluid:bolus": (s) => { s.flags.bigFluid = true; s.vitals.map -= 2; s.vitals.spo2 -= 1; s.log.unshift({ time: s.time, tag: "warn", text: "快速補液使 RV 壓力上升，血壓下降。" }); return s; },
    "med:pressor:norepi": (s, rate=0.05) => { s.support.pressor = `Norepi ${rate.toFixed(2)}`; s.vitals.map += Math.round(rate*40); return s; },
  },
};

function addResult(s: PatientState, text: string) {
  s.results.unshift(text);
  return s;
}
