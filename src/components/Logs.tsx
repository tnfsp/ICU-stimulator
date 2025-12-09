import React from "react";
import { EventLog } from "../types";

type Props = {
  events: EventLog[];
  title?: string;
  tagLabelMap?: Record<string, string>;
};

const defaultTagLabel: Record<string, string> = {
  warn: "紀錄",
  good: "改善",
  info: "資訊",
};

export const Logs: React.FC<Props> = ({ events, tagLabelMap }) => {
  const labelMap = { ...defaultTagLabel, ...tagLabelMap };
  return (
    <div className="log">
      {events.map((entry, idx) => {
        const tagClass = entry.tag === "warn" ? "warn" : entry.tag === "good" ? "good" : "info";
        return (
          <div className="log-entry" key={idx}>
            <div className={`tag ${tagClass}`}>{labelMap[tagClass] || tagClass}</div>
            <div>{entry.text}</div>
          </div>
        );
      })}
    </div>
  );
};
