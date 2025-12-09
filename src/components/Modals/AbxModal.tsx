import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (choice: string, note: string) => void;
};

const ABX_ITEMS = [
  { value: "Cefazolin", desc: "第一代，軟組織/泌尿" },
  { value: "Cefoxitin", desc: "第二代，厭氧涵蓋" },
  { value: "Ceftriaxone", desc: "第三代，社區型覆蓋" },
  { value: "Ceftazidime", desc: "第三代，抗綠" },
  { value: "Cefepime", desc: "第四代，抗綠膿桿菌" },
  { value: "Pip/Tazo", desc: "抗假單胞、厭氧" },
  { value: "Meropenem", desc: "廣譜，抗 ESBL" },
  { value: "Amp/Sulbactam", desc: "社區型，厭氧" },
  { value: "Levofloxacin", desc: "呼吸道涵蓋，抗綠可調" },
  { value: "Colistin", desc: "多重抗藥覆蓋" },
  { value: "Linezolid", desc: "MRSA 覆蓋" },
  { value: "Vancomycin", desc: "MRSA 覆蓋" },
];

export const AbxModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [choice, setChoice] = React.useState("");
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    if (!open) { setChoice(""); setNote(""); }
  }, [open]);

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={(e)=> e.target===e.currentTarget && onClose()}>
      <div className="modal" style={{ width: "min(520px, 92vw)" }}>
        <div className="modal-header">
          <span>抗生素選擇</span>
          <button className="modal-close" onClick={onClose}>關閉</button>
        </div>
        <div className="modal-body" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 8 }}>
          {ABX_ITEMS.map((item) => (
            <label className="check-row" key={item.value}>
              <input type="radio" name="abx" value={item.value} checked={choice === item.value} onChange={() => setChoice(item.value)} />
              <div>
                <div style={{ fontWeight: 700 }}>{item.value}</div>
                <div className="order-meta">{item.desc}</div>
              </div>
            </label>
          ))}
        </div>
        <div className="modal-body">
          <div className="order-meta" style={{ marginBottom: 6 }}>備註（可留白）</div>
          <textarea className="modal-note" value={note} onChange={(e)=>setNote(e.target.value)} placeholder="例：懷疑肺部來源，需 MRSA 覆蓋"></textarea>
        </div>
        <button className="modal-submit" onClick={() => { if (choice) onSubmit(choice, note); onClose(); }}>送出</button>
      </div>
    </div>
  );
};
