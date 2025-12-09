import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (items: string[], note: string) => void;
};

const LAB_ITEMS = [
  "CBC + Diff","Na","K","Cl","CO2 (HCO3)","BUN","Creatinine","Glucose","AST","ALT","ALP","T.Bili",
  "PT/INR","aPTT","Amylase","Lipase","Procalcitonin","Blood culture","Urine culture","U/A","血乳酸 + 血培","ABG/VBG","Cardiac enzymes"
];

export const LabModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    if (!open) { setSelected({}); setNote(""); }
  }, [open]);

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal wide">
        <div className="modal-header">
          <span>開立：抽血 / LAB</span>
          <button className="modal-close" onClick={onClose}>關閉</button>
        </div>
        <div className="modal-body grid">
          {LAB_ITEMS.map((name) => (
            <label className="check-row" key={name}>
              <input
                type="checkbox"
                checked={!!selected[name]}
                onChange={(e) => setSelected({ ...selected, [name]: e.target.checked })}
              />
              <div><div style={{ fontWeight: 700 }}>{name}</div></div>
            </label>
          ))}
          <div style={{ gridColumn: "1 / -1" }}>
            <div className="order-meta" style={{ marginBottom: 6 }}>你的判讀/備註（可留白）</div>
            <textarea className="modal-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="例：懷疑敗血，優先乳酸、血培"></textarea>
          </div>
        </div>
        <button
          className="modal-submit"
          onClick={() => onSubmit(Object.keys(selected).filter(k => selected[k]), note)}
        >
          送出醫囑
        </button>
      </div>
    </div>
  );
};
