/*
https://chatgpt.com/share/6a05153a-5e3c-83a8-8be2-1a864b9ffc2f
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LLM_taro_simple: React.FC = () => {
  const mode = import.meta.env.MODE;
  const baseUrl = import.meta.env.VITE_BASE_SERVER_URL;

  const [myinput, setmyinput] = useState("");
  const [answer, setAnswer] = useState("");

  const askLLM = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("userquery", myinput);

      const response = await fetch(`${baseUrl}/llm/askllm`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const result = await response.json();

      console.log(result);

      if (result.success) {
        setAnswer(result.data.answer);
      } else {
        setAnswer("요청 실패");
      }
    } catch (error) {
      console.error(error);
      setAnswer("서버 연결 중 오류 발생");
    }
  };

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
          <button onClick={askLLM}>확인</button>
        </div>

        <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
          {answer}
        </div>
      </div>
    </div>
  );
};

export default LLM_taro_simple;
