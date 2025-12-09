import { scenarios, defaultScenarioId } from "../src/scenarios";

export default function HomePage() {
  const entries = Object.values(scenarios);
  const defaultScenario = scenarios[defaultScenarioId];
  return (
    <main style={{ padding: "24px", color: "var(--text)" }}>
      <h1 style={{ fontFamily: "Press Start 2P, monospace", fontSize: "18px" }}>ICU Simulator — 環境骨架</h1>
      <p>此頁面為開發環境占位。情境清單：</p>
      <ul>
        {entries.map((s) => (
          <li key={s.id}>{s.name} ({s.id})</li>
        ))}
      </ul>
      <p>預設情境：{defaultScenario.name}</p>
      <p>後續將把 pixel UI 元件掛載在此頁。</p>
    </main>
  );
}
