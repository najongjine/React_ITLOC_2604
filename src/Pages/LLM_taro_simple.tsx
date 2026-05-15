/*
https://chatgpt.com/share/6a05153a-5e3c-83a8-8be2-1a864b9ffc2f
 */
import React, { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type TarotPosition = "past" | "present" | "future";

type TarotCard = {
  id: string;
  name: string;
  img: string;
};

type DrawnTarotCard = TarotCard & {
  position: TarotPosition;
  reversed: boolean;
};

const tarotPositions: TarotPosition[] = ["past", "present", "future"];

const positionLabels: Record<TarotPosition, string> = {
  past: "과거",
  present: "현재",
  future: "미래",
};

const majorCards = [
  ["major-00-fool", "The Fool"],
  ["major-01-magician", "The Magician"],
  ["major-02-high-priestess", "The High Priestess"],
  ["major-03-empress", "The Empress"],
  ["major-04-emperor", "The Emperor"],
  ["major-05-hierophant", "The Hierophant"],
  ["major-06-lovers", "The Lovers"],
  ["major-07-chariot", "The Chariot"],
  ["major-08-strength", "Strength"],
  ["major-09-hermit", "The Hermit"],
  ["major-10-wheel-of-fortune", "Wheel of Fortune"],
  ["major-11-justice", "Justice"],
  ["major-12-hanged-man", "The Hanged Man"],
  ["major-13-death", "Death"],
  ["major-14-temperance", "Temperance"],
  ["major-15-devil", "The Devil"],
  ["major-16-tower", "The Tower"],
  ["major-17-star", "The Star"],
  ["major-18-moon", "The Moon"],
  ["major-19-sun", "The Sun"],
  ["major-20-judgement", "Judgement"],
  ["major-21-world", "The World"],
] as const;

const suitLabels = {
  wands: "Wands",
  cups: "Cups",
  swords: "Swords",
  pentacles: "Pentacles",
} as const;

const minorRanks = [
  ["01-ace", "Ace"],
  ["02-two", "Two"],
  ["03-three", "Three"],
  ["04-four", "Four"],
  ["05-five", "Five"],
  ["06-six", "Six"],
  ["07-seven", "Seven"],
  ["08-eight", "Eight"],
  ["09-nine", "Nine"],
  ["10-ten", "Ten"],
  ["11-page", "Page"],
  ["12-knight", "Knight"],
  ["13-queen", "Queen"],
  ["14-king", "King"],
] as const;

const tarotCards: TarotCard[] = [
  ...majorCards.map(([id, name]) => ({
    id,
    name,
    img: `/img/tarotcards/${id}.jpg`,
  })),
  ...Object.entries(suitLabels).flatMap(([suit, label]) =>
    minorRanks.map(([rankId, rankName]) => {
      const id = `${suit}-${rankId}`;
      return {
        id,
        name: `${rankName} of ${label}`,
        img: `/img/tarotcards/${id}.jpg`,
      };
    }),
  ),
];

const resetPositions = (cards: DrawnTarotCard[]) =>
  cards.map((card, index) => ({
    ...card,
    position: tarotPositions[index],
  }));

const LLM_taro_simple: React.FC = () => {
  const mode = import.meta.env.MODE;
  const baseUrl = import.meta.env.VITE_BASE_SERVER_URL;

  const [myinput, setmyinput] = useState("");
  const [answer, setAnswer] = useState("");

  // 우리한테 중요한건 이거. 고른 카드 정보.
  const [selectedCards, setSelectedCards] = useState<DrawnTarotCard[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const selectCard = (card: TarotCard) => {
    setSelectedCards((prevCards) => {
      if (prevCards.some((item) => item.id === card.id)) {
        return resetPositions(prevCards.filter((item) => item.id !== card.id));
      }

      if (prevCards.length >= 3) {
        return prevCards;
      }

      return [
        ...prevCards,
        {
          ...card,
          position: tarotPositions[prevCards.length],
          reversed: Math.random() > 0.5,
        },
      ];
    });
  };

  const toggleDirection = (cardId: string) => {
    setSelectedCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, reversed: !card.reversed } : card,
      ),
    );
  };

  const askLLM = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("userquery", myinput);
      formData.append("selected_cards", JSON.stringify(selectedCards));
      formData.append("chat_history", JSON.stringify(chatHistory));

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
        setChatHistory([
          ...chatHistory,
          {
            role: "user",
            content: myinput,
          },
          {
            role: "assistant",
            content: answer,
          },
        ]);
        setmyinput("");
      } else {
        setAnswer("요청 실패");
      }
    } catch (error) {
      console.error(error);
      setAnswer("서버 연결 중 오류 발생");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ marginTop: 0 }}>LLM_taro_simple</h1>
      <div>mode: {mode}</div>

      <div style={{ marginTop: "20px" }}>
        <label
          htmlFor="tarot-question"
          style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}
        >
          질문 입력:
        </label>
        <textarea
          id="tarot-question"
          value={myinput}
          onChange={(e) => {
            setmyinput(e?.target?.value || "");
          }}
          style={{
            width: "min(100%, 640px)",
            height: "150px",
            display: "block",
          }}
        />

        <div style={{ marginTop: "12px" }}>
          <button onClick={askLLM}>확인</button>
        </div>

        <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
          {answer}
        </div>
      </div>

      <section style={{ marginTop: "32px" }}>
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ margin: 0 }}>타로 카드 선택</h2>
          <span>
            {selectedCards.length} / 3장 선택됨 · 총 {tarotCards.length}장
          </span>
          {selectedCards.length > 0 && (
            <button type="button" onClick={() => setSelectedCards([])}>
              전체 선택 해제
            </button>
          )}
        </div>

        {selectedCards.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
              marginBottom: "20px",
              maxWidth: "720px",
            }}
          >
            {selectedCards.map((card, index) => (
              <div
                key={card.id}
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >
                <img
                  src={card.img}
                  alt={card.name}
                  style={{
                    width: "72px",
                    borderRadius: "6px",
                    transform: card.reversed ? "rotate(180deg)" : "none",
                  }}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {index + 1}번째 카드 · {positionLabels[card.position]}
                  </div>
                  <div>{card.name}</div>
                  <div style={{ fontSize: "13px", color: "#666" }}>
                    {card.position} · {card.reversed ? "역방향" : "정방향"}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleDirection(card.id)}
                    style={{ marginTop: "8px" }}
                  >
                    방향 변경
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(92px, 1fr))",
            gap: "12px",
            maxWidth: "960px",
          }}
        >
          {tarotCards.map((card) => {
            const selectedIndex = selectedCards.findIndex(
              (item) => item.id === card.id,
            );
            const isSelected = selectedIndex >= 0;
            const cannotSelectMore = selectedCards.length >= 3 && !isSelected;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => selectCard(card)}
                disabled={cannotSelectMore}
                style={{
                  padding: "6px",
                  border: isSelected ? "3px solid #6d4aff" : "1px solid #ddd",
                  borderRadius: "8px",
                  background: isSelected ? "#f3f0ff" : "#fff",
                  cursor: cannotSelectMore ? "not-allowed" : "pointer",
                  opacity: cannotSelectMore ? 0.45 : 1,
                  textAlign: "left",
                  position: "relative",
                }}
              >
                {isSelected && (
                  <span
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#6d4aff",
                      color: "#fff",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    {selectedIndex + 1}
                  </span>
                )}
                <img
                  src={card.img}
                  alt={card.name}
                  style={{
                    width: "100%",
                    aspectRatio: "2 / 3.2",
                    objectFit: "cover",
                    borderRadius: "5px",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "12px",
                    lineHeight: 1.25,
                    color: "#222",
                  }}
                >
                  {card.name}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default LLM_taro_simple;
