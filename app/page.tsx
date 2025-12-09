import { useState } from "react";
import { Monitor } from "../src/components/Monitor";
import { SupportPanel } from "../src/components/SupportPanel";
import { Logs } from "../src/components/Logs";
import { OrderSection } from "../src/components/OrderSection";
import { LabModal } from "../src/components/Modals/LabModal";
import { AbxModal } from "../src/components/Modals/AbxModal";
import { PressorModal } from "../src/components/Modals/PressorModal";
import { VentModal } from "../src/components/Modals/VentModal";
import { PatientState } from "../src/types";
import { scenarios, defaultScenarioId } from "../src/scenarios";
import { applyDrift, applyEffect, checkEndings } from "../src/state/stateMachine";

const BASE_STATE: PatientState = {
  vitals: { sbp: 88, dbp: 52, map: 62, hr: 112, spo2: 91, temp: 38.6, rr: 26 },
  support: { pressor: "Norepi 0.05 μg/kg/min", inotrope: "尚未使用", o2: "4L 鼻導管", vent: null, fluids: "近3小時無大補液，尿量 15 mL/h" },
  flags: { intubated: false, niv: false, antibiotics: false, bigFluid: false },
  log: [
    { tag: "info", text: "初始：BP 88/52 (MAP 62)、HR 112、SpO2 91% (4L NC)、Temp 38.6、RR 26。" },
    { tag: "warn", text: "皮膚溫熱、JVP 高，肺濕音。" },
  ],
  results: [],
  time: 0,
};

export default function HomePage() {
  const [scenarioId, setScenarioId] = useState(defaultScenarioId);
  const [state, setState] = useState<PatientState>(structuredClone(scenarios[scenarioId].initialState || BASE_STATE));
  const [log, setLog] = useState(state.log);
  const [results, setResults] = useState<string[]>([]);
  const [labOpen, setLabOpen] = useState(false);
  const [abxOpen, setAbxOpen] = useState(false);
  const [pressorOpen, setPressorOpen] = useState(false);
  const [ventOpen, setVentOpen] = useState(false);
  const [pendingPressor, setPendingPressor] = useState<string | null>(null);

  const currentScenario = scenarios[scenarioId];

  const addLog = (tag: "info" | "warn" | "good", text: string) => {
    setLog((prev) => [{ tag, text }, ...prev].slice(0, 12));
  };
  const addResult = (text: string) => setResults((prev) => [text, ...prev].slice(0, 6));

  const handleReset = (id: string) => {
    const s = structuredClone(scenarios[id].initialState || BASE_STATE);
    setScenarioId(id);
    setState(s);
    setLog(s.log);
    setResults([]);
  };

  const handleEffect = (effectId: string, payload?: any) => {
    const next = applyEffect(structuredClone(state), effectId, currentScenario, payload);
    const ending = checkEndings(next, currentScenario);
    setState(next);
    setLog(next.log);
    if (ending) addResult(ending.message);
  };

  const handleDrift = () => {
    const next = applyDrift(structuredClone(state), currentScenario);
    const ending = checkEndings(next, currentScenario);
    setState(next);
    setLog(next.log);
    if (ending) addResult(ending.message);
  };

  const ordersData = [
    { title: "詢問 / HISTORY", items: [
      { label: "問護理師：輸入/輸出、症狀變化", desc: "尿量 15 mL/h，越來越喘，血壓緩跌。" },
      { label: "問病人：胸痛/胸悶/頭暈", desc: "胸悶、吸氣就頭暈，躺平喘。" },
      { label: "查看 I/O 紀錄", desc: "近 6h 入出量" },
    ]},
    { title: "抽血 / LAB", lab: true },
    { title: "影像 / IMAGING", items: [
      { label: "CXR 床邊", desc: "肺水腫 + 右下葉浸潤。" },
      { label: "CT 胸 (考慮)", desc: "目前不穩，先不搬動。" },
    ]},
    { title: "床邊超音波", items: [
      { label: "A4C", desc: "Apical 4-chamber" },
      { label: "PLAX", desc: "Parasternal long axis" },
      { label: "PSAX", desc: "Parasternal short axis" },
      { label: "IVC 視野", desc: "IVC 直徑/塌陷度" },
      { label: "Lung zone 前/側", desc: "肺 B-line/實變" },
    ]},
    { title: "呼吸/呼吸器", items: [
      { label: "鼻導管 2-4 L", desc: "低流量 O2" },
      { label: "Simple mask 6-8 L", desc: "中等流量" },
      { label: "Venturi 40%", desc: "控制 FiO2" },
      { label: "NRM 12-15 L", desc: "高流量面罩" },
      { label: "BiPAP 12/6 FiO2 60%", desc: "無創雙相" },
      { label: "插管並設定呼吸器", desc: "進入設定頁面" },
    ]},
    { title: "用藥 / 升壓強心", items: [
      { label: "Norepi 滴數", desc: "0–0.3 μg/kg/min", type: "pressor" as const, agent: "Norepi" },
      { label: "Epinephrine 滴數", desc: "0–0.3 μg/kg/min", type: "pressor" as const, agent: "Epinephrine" },
      { label: "Vasopressin 滴數", desc: "0–0.06 u/min", type: "pressor" as const, agent: "Vasopressin" },
      { label: "Dobutamine 滴數", desc: "0–10 μg/kg/min", type: "pressor" as const, agent: "Dobutamine" },
      { label: "Milrinone 滴數", desc: "0–0.75 μg/kg/min", type: "pressor" as const, agent: "Milrinone" },
      { label: "NTG 5 mcg/min", desc: "前負荷/後負荷下降" },
      { label: "Furosemide 20 mg IV", desc: "利尿" },
      { label: "廣譜抗生素", desc: "抗感染覆蓋", type: "abx" as const },
      { label: "大補液 500 mL", desc: "高風險：RV overload。" },
    ]},
  ];

  return (
    <main style={{ padding: "18px" }}>
      <header style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
        <div className="title">ICU PIXEL BOARD</div>
        <div className="pill">患者：ICU-000</div>
        <div className="pill danger">情境：{currentScenario.name}</div>
        <div className="pill">入院：+12h post PCI</div>
        <select
          value={scenarioId}
          onChange={(e) => handleReset(e.target.value)}
          style={{ background: "#0f1a26", color: "var(--text)", border: "1px solid #203042", borderRadius: 8, padding: "6px 8px" }}
        >
          {Object.values(scenarios).map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <button className="action-secondary" onClick={handleDrift}>時間 +10 分</button>
      </header>
      <div className="grid">
        <div className="panel">
          <h3>病人面板 / MONITOR</h3>
          <div className="patient-block">
            <div className="pixel-patient"><div className="pixel-label">PATIENT</div></div>
            <div className="monitor">
              <Monitor vitals={state.vitals} />
              <SupportPanel support={state.support as any} />
            </div>
          </div>
          <div className="pocu-box hidden" id="pocus">POCUS 更新：RV 擴大/收縮差，IVC 大且僵直；LV 中度差。</div>
        </div>

        <div className="panel">
          <h3>ORDERS / 決策</h3>
          <div className="order-board">
            {ordersData.map((group, idx) => (
              <OrderSection
                key={idx}
                title={group.title}
                items={group.items as any}
                isLab={group.lab}
                onLabOpen={() => setLabOpen(true)}
                onPressor={(agent) => { setPendingPressor(agent); setPressorOpen(true); }}
                onAbx={() => setAbxOpen(true)}
                onVent={() => setVentOpen(true)}
                onGeneric={(item) => {
                  addLog("info", `已執行：${item.label}`);
                  if (item.label.includes("大補液")) handleEffect("fluid:bolus");
                  if (item.label.includes("鼻導管")) handleEffect("resp:o2:nc");
                  if (item.label.includes("Simple mask")) handleEffect("resp:o2:simple");
                  if (item.label.includes("Venturi")) handleEffect("resp:o2:venturi");
                  if (item.label.includes("NRM")) handleEffect("resp:oxygen:nrm");
                  if (item.label.includes("BiPAP")) handleEffect("resp:o2:bipap");
                }}
              />
            ))}
          </div>
          <div className="pocu-box" id="order-detail">已送出的醫囑會顯示在這裡。</div>
        </div>

        <div className="panel">
          <h3>事件紀錄</h3>
          <Logs events={log} />
        </div>
        <div className="panel">
          <h3>結果訊息板</h3>
          <div className="log" id="results-log">
            {results.map((r, idx) => (
              <div className="log-entry" key={idx}><div className="tag info">結果</div><div>{r}</div></div>
            ))}
          </div>
        </div>
      </div>

      <LabModal open={labOpen} onClose={() => setLabOpen(false)} onSubmit={(items, note) => { if (items.length) addResult(`Lab 已送出：${items.join("，")}${note ? "｜備註：" + note : ""}`); setLabOpen(false); }} />
      <AbxModal open={abxOpen} onClose={() => setAbxOpen(false)} onSubmit={(choice, note) => { addLog("info", `抗生素：${choice} 已給。`); addResult(`抗生素：${choice}${note ? "｜備註：" + note : ""}`); handleEffect("med:abx"); }} />
      <PressorModal
        open={pressorOpen}
        agent={pendingPressor}
        onClose={() => { setPressorOpen(false); setPendingPressor(null); }}
        onSubmit={(rate) => {
          addLog("info", `${pendingPressor} ${rate.toFixed(2)} 已設定。`);
          if (pendingPressor === "Dobutamine" || pendingPressor === "Milrinone") {
            handleEffect(`med:inotrope:${pendingPressor.toLowerCase()}`, rate);
          } else if (pendingPressor) {
            const key = pendingPressor === "Vasopressin" ? "med:pressor:vaso" : `med:pressor:${pendingPressor.toLowerCase()}`;
            handleEffect(key, rate);
          }
        }}
      />
      <VentModal open={ventOpen} onClose={() => setVentOpen(false)} onSubmit={(settings) => { addLog("info", `呼吸器設定：FiO2 ${settings.fio2}，PEEP ${settings.peep}，RR ${settings.rr}，Vt ${settings.tv}`); setVentOpen(false); handleEffect("resp:intubate"); }} />
    </main>
  );
}
