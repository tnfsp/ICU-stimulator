import { cardiogenicMimicSepsis } from "./cardiogenicMimicSepsis";
import { sepsisScenario } from "./sepsis";
import { hypovolemicScenario } from "./hypovolemic";
import { peRvScenario } from "./peRv";
import { circuitIssueScenario } from "./circuitIssue";
import { ScenarioConfig } from "../types";

export const scenarios: Record<string, ScenarioConfig> = {
  [cardiogenicMimicSepsis.id]: cardiogenicMimicSepsis,
  [sepsisScenario.id]: sepsisScenario,
  [hypovolemicScenario.id]: hypovolemicScenario,
  [peRvScenario.id]: peRvScenario,
  [circuitIssueScenario.id]: circuitIssueScenario,
};

export const defaultScenarioId = cardiogenicMimicSepsis.id;
