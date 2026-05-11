import React, { useState } from "react";

type Category = "love" | "money" | "study";

type TarotMeanings = {
  love: string;
  money: string;
  study: string;
};

type TarotCard = {
  name: string;
  image: string;
  meanings: TarotMeanings;
};

const categoryLabels: Record<Category, string> = {
  love: "연애",
  money: "금전",
  study: "학업",
};

function makeMeanings(name: string): TarotMeanings {
  return {
    love: `${name} 카드의 연애운 풀이를 여기에 작성하세요.`,
    money: `${name} 카드의 금전운 풀이를 여기에 작성하세요.`,
    study: `${name} 카드의 학업운 풀이를 여기에 작성하세요.`,
  };
}

const cardList = [
  ["바보", "major-00-fool.jpg"],
  ["마법사", "major-01-magician.jpg"],
  ["여사제", "major-02-high-priestess.jpg"],
  ["여황제", "major-03-empress.jpg"],
  ["황제", "major-04-emperor.jpg"],
  ["교황", "major-05-hierophant.jpg"],
  ["연인", "major-06-lovers.jpg"],
  ["전차", "major-07-chariot.jpg"],
  ["힘", "major-08-strength.jpg"],
  ["은둔자", "major-09-hermit.jpg"],
  ["운명의 수레바퀴", "major-10-wheel-of-fortune.jpg"],
  ["정의", "major-11-justice.jpg"],
  ["행맨", "major-12-hanged-man.jpg"],
  ["죽음", "major-13-death.jpg"],
  ["절제", "major-14-temperance.jpg"],
  ["악마", "major-15-devil.jpg"],
  ["타워", "major-16-tower.jpg"],
  ["별", "major-17-star.jpg"],
  ["달", "major-18-moon.jpg"],
  ["태양", "major-19-sun.jpg"],
  ["심판", "major-20-judgement.jpg"],
  ["세계", "major-21-world.jpg"],
  ["완드 에이스", "wands-01-ace.jpg"],
  ["완드 2", "wands-02-two.jpg"],
  ["완드 3", "wands-03-three.jpg"],
  ["완드 4", "wands-04-four.jpg"],
  ["완드 5", "wands-05-five.jpg"],
  ["완드 6", "wands-06-six.jpg"],
  ["완드 7", "wands-07-seven.jpg"],
  ["완드 8", "wands-08-eight.jpg"],
  ["완드 9", "wands-09-nine.jpg"],
  ["완드 10", "wands-10-ten.jpg"],
  ["완드 페이지", "wands-11-page.jpg"],
  ["완드 나이트", "wands-12-knight.jpg"],
  ["완드 퀸", "wands-13-queen.jpg"],
  ["완드 킹", "wands-14-king.jpg"],
  ["컵 에이스", "cups-01-ace.jpg"],
  ["컵 2", "cups-02-two.jpg"],
  ["컵 3", "cups-03-three.jpg"],
  ["컵 4", "cups-04-four.jpg"],
  ["컵 5", "cups-05-five.jpg"],
  ["컵 6", "cups-06-six.jpg"],
  ["컵 7", "cups-07-seven.jpg"],
  ["컵 8", "cups-08-eight.jpg"],
  ["컵 9", "cups-09-nine.jpg"],
  ["컵 10", "cups-10-ten.jpg"],
  ["컵 페이지", "cups-11-page.jpg"],
  ["컵 나이트", "cups-12-knight.jpg"],
  ["컵 퀸", "cups-13-queen.jpg"],
  ["컵 킹", "cups-14-king.jpg"],
  ["소드 에이스", "swords-01-ace.jpg"],
  ["소드 2", "swords-02-two.jpg"],
  ["소드 3", "swords-03-three.jpg"],
  ["소드 4", "swords-04-four.jpg"],
  ["소드 5", "swords-05-five.jpg"],
  ["소드 6", "swords-06-six.jpg"],
  ["소드 7", "swords-07-seven.jpg"],
  ["소드 8", "swords-08-eight.jpg"],
  ["소드 9", "swords-09-nine.jpg"],
  ["소드 10", "swords-10-ten.jpg"],
  ["소드 페이지", "swords-11-page.jpg"],
  ["소드 나이트", "swords-12-knight.jpg"],
  ["소드 퀸", "swords-13-queen.jpg"],
  ["소드 킹", "swords-14-king.jpg"],
  ["펜타클 에이스", "pentacles-01-ace.jpg"],
  ["펜타클 2", "pentacles-02-two.jpg"],
  ["펜타클 3", "pentacles-03-three.jpg"],
  ["펜타클 4", "pentacles-04-four.jpg"],
  ["펜타클 5", "pentacles-05-five.jpg"],
  ["펜타클 6", "pentacles-06-six.jpg"],
  ["펜타클 7", "pentacles-07-seven.jpg"],
  ["펜타클 8", "pentacles-08-eight.jpg"],
  ["펜타클 9", "pentacles-09-nine.jpg"],
  ["펜타클 10", "pentacles-10-ten.jpg"],
  ["펜타클 페이지", "pentacles-11-page.jpg"],
  ["펜타클 나이트", "pentacles-12-knight.jpg"],
  ["펜타클 퀸", "pentacles-13-queen.jpg"],
  ["펜타클 킹", "pentacles-14-king.jpg"],
] as const;

const initialTarotCards: TarotCard[] = cardList.map(([name, fileName]) => ({
  name,
  image: `/img/tarotcards/${fileName}`,
  meanings: makeMeanings(name),
}));

const Tratot_simple: React.FC = () => {
  const mode = import.meta.env.MODE;
  const [categories] = useState<Category[]>(["love", "money", "study"]);
  const [tarotCards] = useState<TarotCard[]>(initialTarotCards);

  return (
    <main style={{ padding: "32px", maxWidth: "960px", margin: "0 auto" }}>
      <h1>Tarot Simple</h1>
      <p>mode: {mode}</p>

      <section>
        <h2>카테고리 목록</h2>
        <ul>
          {categories.map((category) => (
            <li key={category}>
              {category} - {categoryLabels[category]}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>카드 목록: {tarotCards.length}장</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
            gap: "12px",
          }}
        >
          {tarotCards.map((card) => (
            <div
              key={card.image}
              style={{
                padding: "6px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#fff",
              }}
            >
              <img
                src={card.image}
                alt={card.name}
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "2 / 3.4",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
              <div style={{ marginTop: "6px", fontSize: "12px" }}>
                {card.name}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export { initialTarotCards };
export default Tratot_simple;
