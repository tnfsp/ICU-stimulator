import React, { useState } from "react";

type Item = {
  label: string;
  desc: string;
  type?: "pressor" | "abx";
  agent?: string;
};

type Props = {
  title: string;
  items?: Item[];
  isLab?: boolean;
  onLabOpen?: () => void;
  onPressor?: (agent: string) => void;
  onAbx?: () => void;
  onVent?: () => void;
  onGeneric?: (item: Item) => void;
};

export const OrderSection: React.FC<Props> = ({
  title,
  items = [],
  isLab,
  onLabOpen,
  onPressor,
  onAbx,
  onVent,
  onGeneric,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="order-section">
      <header>
        <h4>{title}</h4>
        <button className="toggle" onClick={() => setOpen(!open)}>{open ? "收合" : "展開"}</button>
      </header>
      {open && (
        <div className="order-items">
          {isLab ? (
            <button className="order-btn" onClick={onLabOpen}>
              開立抽血
              <div className="order-meta">選取多項實驗一次送出</div>
            </button>
          ) : (
            items.map((item, i) => (
              <button
                className="order-btn"
                key={i}
                onClick={() => {
                  if (item.type === "pressor" && item.agent && onPressor) return onPressor(item.agent);
                  if (item.type === "abx" && onAbx) return onAbx();
                  if (item.label.includes("插管") && onVent) return onVent();
                  onGeneric?.(item);
                }}
              >
                {item.label}
                <div className="order-meta">{item.desc}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
