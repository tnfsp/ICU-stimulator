import { PatientState, ScenarioConfig } from "../types";

export const cardiogenicMimicSepsis: ScenarioConfig = {
  id: "cardiogenic-mimic-sepsis",
  name: "心因性休克偽裝敗血症",
  tags: ["pump", "sepsis"],
  preamble:
    "68 歲男性，NSTEMI s/p PCI 12h，發燒、血壓低，皮膚溫熱，JVP 高，肺濕音，疑似敗血但實為 RV/LV 功能差。",
  initialState: {
    vitals: { sbp: 88, dbp: 52, map: 62, hr: 112, spo2: 91, temp: 38.6, rr: 26 },
    support: {
      pressor: "Norepi 0.05 μg/kg/min",
      inotrope: "尚未使用",
      o2: "N/C 4L",
      vent: null,
      fluids: "近3h 無大補液，尿量 15 mL/h",
    },
    flags: { intubated: false, niv: false, antibiotics: false, bigFluid: false, rvFailure: true, infectionSuspected: true },
    log: [],
    results: [],
    time: 0,
  },
  drift: [
    {
      dvitals: { map: -2, spo2: -1, rr: 1 },
      condition: () => true,
    },
  ],
  endings: [
    {
      label: "death",
      when: (s) => s.vitals.map < 50 || s.vitals.spo2 < 82,
      message: "病人崩盤死亡。",
    },
    {
      label: "crash",
      when: (s) => s.vitals.map < 55 || s.vitals.spo2 < 85,
      message: "血流動力嚴重不穩，需立即插管/升壓強心。",
    },
    {
      label: "improve",
      when: (s) => s.vitals.map >= 65 && s.vitals.spo2 >= 94 && s.flags.antibiotics && s.support.inotrope !== "尚未使用",
      message: "病人穩定：MAP >65，SpO2 ≥94，已給強心與抗生素。",
    },
  ],
  orders: [], // UI uses separate config; effects keyed below
  effects: {
    "lab:lactate": (s) => addResult(s, "乳酸 3.8，血培送出。"),
    "lab:culture-blood": (s) => addResult(s, "血液培養送出。"),
    "lab:culture-urine": (s) => addResult(s, "尿液培養送出。"),
    "med:abx": (s) => {
      s.flags.antibiotics = true;
      s.results.unshift("抗生素已給。");
      return s;
    },
    "med:pressor:norepi": (s) => {
      s.support.pressor = "Norepi 滴定中";
      s.vitals.map += 4;
      s.vitals.sbp += 6;
      s.vitals.dbp += 3;
      s.log.unshift({ time: s.time, tag: "info", text: "Norepi 調高。" });
      return s;
    },
    "med:pressor:epi": (s) => {
      s.support.pressor = "Epinephrine 滴定中";
      s.vitals.map += 3;
      s.vitals.hr += 2;
      s.log.unshift({ time: s.time, tag: "info", text: "Epinephrine 上線。" });
      return s;
    },
    "med:inotrope:dobutamine": (s) => {
      s.support.inotrope = "Dobutamine 滴定中";
      s.vitals.map += 2;
      s.vitals.sbp += 3;
      s.log.unshift({ time: s.time, tag: "good", text: "Dobutamine 啟用。" });
      return s;
    },
    "resp:intubate": (s) => {
      s.flags.intubated = true;
      s.support.o2 = "ETT";
      s.support.vent = { mode: "VC", fio2: 0.5, peep: 5, tv: 6, rr: 16 };
      s.vitals.spo2 += 3;
      s.log.unshift({ time: s.time, tag: "info", text: "已插管並上呼吸器。" });
      return s;
    },
    "resp:oxygen:nrm": (s) => {
      s.support.o2 = "NRM 12-15L";
      s.vitals.spo2 += 2;
      return s;
    },
    "fluid:bolus": (s) => {
      s.flags.bigFluid = true;
      s.vitals.map -= 2;
      s.vitals.spo2 -= 2;
      s.log.unshift({ time: s.time, tag: "warn", text: "大補液 500 mL：JVP 上升，血壓不升反降。" });
      return s;
    },
  },
};

function addResult(state: PatientState, text: string) {
  state.results.unshift(text);
  return state;
}
