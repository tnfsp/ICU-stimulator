import { ScenarioConfig } from "../types";

// Map UI order ids to effect ids per scenario; fallback to identity keys.
export function resolveEffectId(orderKey: string, scenario: ScenarioConfig): string | null {
  // if scenario has direct effect id
  if (scenario.effects[orderKey]) return orderKey;
  // simple aliasing examples
  const map: Record<string, string> = {
    "lab:cbc": "lab:cbc",
    "lab:lactate": "lab:lactate",
    "lab:culture-blood": "lab:culture-blood",
    "lab:culture-urine": "lab:culture-urine",
    "lab:ddimer": "lab:ddimer",
    "lab:trop": "lab:trop",
    "lab:hgb": "lab:hgb",
    "med:abx": "med:abx",
    "med:pressor:norepi": "med:pressor:norepi",
    "med:pressor:epi": "med:pressor:epi",
    "med:pressor:vaso": "med:pressor:norepi", // default fallback
    "med:inotrope:dobutamine": "med:inotrope:dobutamine",
    "resp:intubate": "resp:intubate",
    "resp:oxygen:nrm": "resp:oxygen:nrm",
    "fluid:bolus": "fluid:bolus",
    "line:check": "line:check",
  };
  if (map[orderKey]) return map[orderKey];
  return scenario.effects[orderKey] ? orderKey : null;
}
