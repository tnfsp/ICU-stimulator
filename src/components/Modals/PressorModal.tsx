import React from "react";

type Props = {
  open: boolean;
  agent: string | null;
  onClose: () => void;
  onSubmit: (rate: number) => void;
};

const defaultRanges: Record<string, { max: number; step: number; def: number; unit: string }> = {
  Norepi: { max: 0.3, step: 0.01, def: 0.05, unit: "μg/kg/min" },
  Epinephrine: { max: 0.3, step: 0.01, def: 0.02, unit: "μg/kg/min" },
  Vasopressin: { max: 0.06, step: 0.01, def: 0.03, unit: "u/min" },
  Dobutamine: { max: 10, step: 0.5, def: 5, unit: "μg/kg/min" },
  Milrinone: { max: 0.75, step: 0.05, def: 0.25, unit: "μg/kg/min" },
};

export const PressorModal: React.FC<Props> = ({ open, agent, onClose, onSubmit }) => {
  const range = (agent && defaultRanges[agent]) || { max: 0.3, step: 0.01, def: 0.05, unit: "μg/kg/min" };
  const [val, setVal] = React.useState(range.def);

  React.useEffect(() => {
    setVal(range.def);
  }, [agent]);

  if (!open || !agent) return null;
  return (
    <div className="modal-overlay" onClick={(e)=> e.target===e.currentTarget && onClose()}>
      <div className="modal" style={{ width: "min(420px,90vw)" }}>
        <div className="modal-header">
          <span>{agent} 滴數</span>
          <button className="modal-close" onClick={onClose}>關閉</button>
        </div>
        <div className="modal-body">
          <div className="modal-row">
            滴速:
            <input
              type="range"
              min={0}
              max={range.max}
              step={range.step}
              value={val}
              onChange={(e) => setVal(Number(e.target.value))}
            />
            <span>{val.toFixed(2)} {range.unit}</span>
          </div>
        </div>
        <button className="modal-submit" onClick={() => { onSubmit(val); onClose(); }}>送出</button>
      </div>
    </div>
  );
};
