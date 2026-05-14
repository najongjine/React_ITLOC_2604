/*
https://chatgpt.com/share/6a05153a-5e3c-83a8-8be2-1a864b9ffc2f
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LLM_taro_simple: React.FC = () => {
  const mode = import.meta.env.MODE;

  const [myinput, setmyinput] = useState("");
  return (
    <div className="">
      <div>LLM_taro_simple</div>
      <div>mode: {mode}</div>
      <div>
        <label>질문입력:</label>
        <textarea
          value={myinput}
          onChange={(e) => {
            setmyinput(e?.target?.value || "");
          }}
          style={{
            width: "40%",
            height: "150px",
          }}
        />
        <div>
          <button>확인</button>
        </div>
      </div>
    </div>
  );
};

export default LLM_taro_simple;
