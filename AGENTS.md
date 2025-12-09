# 🫀 Heart Surgery ICU Decision Simulator  
AGENTS.md — Working Notes (v1.1, UI-first prototype)

## 1. App Concept (current consensus)
- Web ICU deterioration simulator, zh-TW, pixel/turn-based board vibe.
- Single patient with live monitor (SBP/DBP/MAP, HR, SpO2, Temp, RR) and support badges (pressors/inotropes/O2/vent, fluids).
- Orders are modal-driven, data-backed checklists (Labs, Imaging, POCUS views, Respiratory modes, Meds/pressors/inotropes/antibiotics). Labs open a wide grid, single submit; Imaging/POCUS show views/findings without hints; antibiotics have a dedicated picker.
- Logs are neutral (no embedded guidance); Results board separates recent outcomes from event log.
- Vent settings use slider modal; pressors/inotropes use slider modal per agent.

## 2. Interaction Model
- One patient; decisions change `patient_state`.
- Orders open modals; some have sliders (vent, pressor); labs use multi-select grid; antibiotics use radio picker.
- POCUS views selectable individually (A4C, PLAX, PSAX, IVC, Lung zones), surface findings only when requested.
- Imaging/POCUS planned to show actual assets (CXR, CT, echo clips) with user interpretation before reveal (placeholder now).
- No hinting in findings; reasoning deferred to learner; feedback/logs are descriptive only.

## 3. Core Shock Pattern (current scenario)
- Cardiogenic shock mimicking sepsis (post-PCI), warm early, high JVP, B-lines, RV dysfunction; fluids worsen.

## 4. Orders (current UI)
- HISTORY: nurse/patient Q&A, I/O view, free-text question with persona (planned AI responder).
- LAB: CBC, electrolytes (Na/K/Cl/CO2), renal (BUN/Cr), glucose, LFT (AST/ALT/ALP/T.Bili), coag (PT/INR/aPTT), amylase/lipase, procal, lactate+blood culture, blood culture, urine culture, U/A. Wide grid modal, one submit.
- IMAGING: CXR, CT (neutral findings; assets planned).
- POCUS: A4C, PLAX, PSAX, IVC, Lung zones; findings only when ordered.
- RESP: O2 ladder (N/C → Simple → Venturi → NRM → BiPAP → intubate). Intubation opens vent slider modal (FiO2, PEEP, RR, Vt).
- MEDS: Pressors/inotropes via slider modal (Norepi, Epi, Vaso, Dobutamine, Milrinone). Other meds: NTG, diuretic, broad antibiotics picker (Ceph 1–4 gen, Pip/Tazo, Meropenem, Amp/Sulbactam, Levo, Colistin, Linezolid, Vanco).
- Logs/results: neutral text; Results board separate from event log.

## 5. Open Questions (now clarified)
- Drift/Effect numbers: will be tuned during implementation.
- Endings: allow scenario-specific thresholds (崩盤/死亡/改善) and messaging.
- Scenarios to ship: cardiogenic mimic sepsis, sepsis, hypovolemic/bleed, PE/RV, circuit issue.
- Assets: CXR/CT/POCUS/echo clips can be placeholders first; final assets to be provided or sourced later.
- AI feedback: trigger after scenario end; uses OpenAI API; zh-TW output; user manually ends run then requests feedback.
- Multi-language: not required (zh-TW only for now).
- Deploy target: Vercel; OPENAI API integration planned.

## 6. Next Implementation Steps (revised)
1) State & Scenario config: build `ScenarioConfig` (ids, tags, initialState, drift, effects, endings, assets, preamble); `PatientState` and event tracking.
2) Time drift: tick/“下一步” applies scenario drift to vitals/flags; log neutral drift events.
3) Wire orders to effects: existing buttons/ modals call `applyEffect` to mutate state, append events/log/results.
4) Endings: implement scenario-specific thresholds (崩盤/死亡/改善) with neutral prompts; lock or allow replay.
5) Scenario selector: landing cards to choose scenario; load corresponding config.
6) Assets & interpretation: add imaging/POCUS thumb + viewer; require user note before reveal (placeholder asset ok).
7) AI feedback: on finish, generate decision summary (preamble + actions/outcomes) and send to OpenAI; display response.
