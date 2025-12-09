import { DriftRule, EndingCondition, PatientState, ScenarioConfig } from "../types";

export function applyDrift(state: PatientState, scenario: ScenarioConfig): PatientState {
  let next = { ...state, vitals: { ...state.vitals }, time: state.time + 10 };
  scenario.drift.forEach((rule) => {
    if (!rule.condition || rule.condition(state)) {
      next.vitals = addVitals(next.vitals, rule.dvitals);
    }
  });
  next = clampVitals(next);
  next.log = [
    { time: next.time, tag: "warn", text: "時間流逝：未處置造成生命徵象惡化。" },
    ...next.log,
  ].slice(0, 20);
  return next;
}

export function applyEffect(state: PatientState, effectId: string, scenario: ScenarioConfig, payload?: any): PatientState {
  const fn = scenario.effects[effectId];
  if (!fn) return state;
  let next = fn(state, payload);
  next = clampVitals(next);
  return next;
}

export function checkEndings(state: PatientState, scenario: ScenarioConfig): EndingCondition | null {
  for (const end of scenario.endings) {
    if (end.when(state)) return end;
  }
  return null;
}

function addVitals(base: PatientState["vitals"], delta: Partial<PatientState["vitals"]>) {
  return {
    ...base,
    sbp: base.sbp + (delta.sbp ?? 0),
    dbp: base.dbp + (delta.dbp ?? 0),
    map: base.map + (delta.map ?? 0),
    hr: base.hr + (delta.hr ?? 0),
    spo2: base.spo2 + (delta.spo2 ?? 0),
    temp: base.temp + (delta.temp ?? 0),
    rr: base.rr + (delta.rr ?? 0),
  };
}

function clampVitals(state: PatientState): PatientState {
  const v = state.vitals;
  state.vitals = {
    sbp: clamp(v.sbp, 40, 180),
    dbp: clamp(v.dbp, 20, 120),
    map: clamp(v.map, 25, 130),
    hr: clamp(v.hr, 30, 180),
    spo2: clamp(v.spo2, 60, 100),
    temp: clamp(v.temp, 32, 41),
    rr: clamp(v.rr, 6, 50),
  };
  return state;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}
