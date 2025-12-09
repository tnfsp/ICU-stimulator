import React from "react";
import { Support } from "../types";

type Props = {
  support: Support;
};

export const SupportPanel: React.FC<Props> = ({ support }) => {
  return (
    <div className="support">
      <div><strong>循環</strong>：{support.pressor}；強心：{support.inotrope}。</div>
      <div><strong>呼吸</strong>：{support.o2}。</div>
      <div><strong>通氣設定</strong>：{support.vent ? `${support.vent.mode} / Vt ${support.vent.tv} / RR ${support.vent.rr} / PEEP ${support.vent.peep} / FiO2 ${support.vent.fio2}` : "未接呼吸器"}</div>
      <div><strong>輸液/入量</strong>：{support.fluids}</div>
    </div>
  );
};
