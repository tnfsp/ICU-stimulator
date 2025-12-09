export type Vitals = {
  sbp: number;
  dbp: number;
  map: number;
  hr: number;
  spo2: number;
  temp: number;
  rr: number;
};

export type Support = {
  pressor: string;
  inotrope: string;
  o2: string;
  vent: VentSettings | null;
  fluids: string;
};

export type VentSettings = {
  mode: "VC" | "PC";
  fio2: number;
  peep: number;
  tv: number;
  rr: number;
};

export type Flags = {
  intubated: boolean;
  niv: boolean;
  antibiotics: boolean;
  bigFluid: boolean;
  rvFailure?: boolean;
  infectionSuspected?: boolean;
};

export type PatientState = {
  vitals: Vitals;
  support: Support;
  flags: Flags;
  log: EventLog[];
  results: string[];
  time: number; // minutes since start
};

export type EventLog = {
  time: number;
  tag: "info" | "warn" | "good";
  text: string;
};

export type DriftRule = {
  dvitals: Partial<Vitals>;
  condition?: (s: PatientState) => boolean;
};

export type EffectFn = (state: PatientState) => PatientState;

export type EndingCondition = {
  label: "crash" | "death" | "improve";
  when: (state: PatientState) => boolean;
  message: string;
};

export type OrderItem = {
  id: string;
  label: string;
  effectId: string;
  category:
    | "history"
    | "lab"
    | "imaging"
    | "pocus"
    | "resp"
    | "med"
    | "abx"
    | "fluid";
};

export type OrderGroup = {
  title: string;
  items: OrderItem[];
};

export type ScenarioConfig = {
  id: string;
  name: string;
  tags: ("pump" | "volume" | "air" | "circuit" | "sepsis")[];
  preamble: string;
  initialState: PatientState;
  drift: DriftRule[];
  effects: Record<string, EffectFn>;
  endings: EndingCondition[];
  orders: OrderGroup[];
  assets?: {
    cxr?: string;
    ct?: string;
    pocus?: Record<string, string>;
  };
};
