import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (settings: { fio2: number; peep: number; rr: number; tv: number }) => void;
};

export const VentModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [fio2, setFio2] = React.useState(50);
  const [peep, setPeep] = React.useState(5);
  const [rr, setRr] = React.useState(16);
  const [tv, setTv] = React.useState(6);

  React.useEffect(() => {
    if (!open) {
      setFio2(50); setPeep(5); setRr(16); setTv(6);
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={(e)=> e.target===e.currentTarget && onClose()}>
      <div className="modal" style={{ width: "min(560px,92vw)" }}>
        <div className="modal-header">
          <span>呼吸器設定</span>
          <button className="modal-close" onClick={onClose}>關閉</button>
        </div>
        <div className="modal-body">
          <div className="modal-row">FiO2: <input type="range" min="30" max="100" step="5" value={fio2} onChange={(e)=>setFio2(Number(e.target.value))} /> <span>{fio2}%</span></div>
          <div className="modal-row">PEEP: <input type="range" min="5" max="12" step="1" value={peep} onChange={(e)=>setPeep(Number(e.target.value))} /> <span>{peep}</span></div>
          <div className="modal-row">RR: <input type="range" min="10" max="24" step="1" value={rr} onChange={(e)=>setRr(Number(e.target.value))} /> <span>{rr}</span></div>
          <div className="modal-row">潮氣量 (ml/kg): <input type="range" min="4" max="8" step="0.5" value={tv} onChange={(e)=>setTv(Number(e.target.value))} /> <span>{tv}</span></div>
        </div>
        <button className="modal-submit" onClick={() => onSubmit({ fio2, peep, rr, tv })}>套用設定</button>
      </div>
    </div>
  );
};
