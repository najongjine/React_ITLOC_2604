import React from "react";
import { Link, useNavigate } from "react-router-dom";

const LLM_taro_simple: React.FC = () => {
  const mode = import.meta.env.MODE;
  return (
    <div className="">
      <div>LLM_taro_simple</div>
      <div>mode: {mode}</div>
      <div>
        <label>질문입력:</label>
        <textarea />
      </div>
    </div>
  );
};

export default LLM_taro_simple;
