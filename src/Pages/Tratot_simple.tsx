
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Tratot_simple: React.FC = () => {
  const mode = import.meta.env.MODE;
  const cards=[
    "태양 카드",
    "달 카드",
    "별 카드",
    "연인 카드",
    "마법사 카드",
    "운명의 수레바퀴 카드"
  ]
  return (
    <div className="">
      <div>Tratot_simple</div>
      <div>mode: {mode}</div>
    </div>
  );
};

export default Tratot_simple;
