import React from "react";
import { Vitals } from "../types";

type Props = {
  vitals: Vitals;
};

const monitorConfig = [
  { key: "bp", label: "BP", unit: "mmHg", alert: (v: any) => v.map < 65, format: (v: any) => `${v.sbp}/${v.dbp} (MAP ${v.map})` },
  { key: "hr", label: "HR", unit: "bpm", alert: (v: number) => v > 110 },
  { key: "spo2", label: "SpO2", unit: "%", alert: (v: number) => v < 92 },
  { key: "temp", label: "Temp", unit: "°C", alert: (v: number) => v > 38.3 },
  { key: "rr", label: "RR", unit: "/min", alert: (v: number) => v > 24 },
];

export const Monitor: React.FC<Props> = ({ vitals }) => {
  return (
    <div className="monitor">
      <div className="monitor-grid">
        {monitorConfig.map((cfg) => {
          const val: any = cfg.key === "bp" ? vitals : (vitals as any)[cfg.key];
          const alert = cfg.alert(val);
          const display = cfg.format ? cfg.format(val) : val;
          return (
            <div className="monitor-tile" key={cfg.label}>
              <div className="monitor-label">
                <span>{cfg.label}</span>
                <span>{cfg.unit}</span>
              </div>
              <div className={`monitor-value ${alert ? "monitor-alert" : ""}`}>{display}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
