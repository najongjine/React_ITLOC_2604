
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Tratot_simple: React.FC = () => {
  const mode = import.meta.env.MODE;
  const cards=[
    {name:"태양 카드",meaning:"밝은 결과, 성공, 자신감, 좋은 흐름을 의미합니다"},
    {name:"달 카드",meaning:"불안, 착각, 숨겨진 진실, 아직 확실하지 않은 상황을 의미합니다"},
    {name:"별 카드",meaning:"희망, 회복, 가능성, 천천히 좋아지는 흐름을 의미합니다."},
    {name:"연인 카드",meaning:"관계, 선택, 마음의 결정, 중요한 선택의 순간을 의미합니다"},
    {name:"마법사 카드",meaning:"새로운 시작, 실행력, 능력 발휘, 도전의 기회를 의미합니다"},
    {name:"운명의 수레바퀴 카드",meaning:"변화, 기회, 흐름의 전환, 예상치 못한 변화를 의미합니다"}
  ]

  function drawCard(){
    // 랜덤 숫자(정수) 0~cards 길이
    const randomIndex=Math.floor(Math.random()*cards.length);
    const selectedCard = cards[randomIndex];
    console.log(`# selectedCard: `,selectedCard);
  }
  return (
    <div className="">
      <div>Tratot_simple</div>
      <div>mode: {mode}</div>
      <div><button onClick={drawCard}>카드고르기</button></div>
    </div>
  );
};

export default Tratot_simple;
