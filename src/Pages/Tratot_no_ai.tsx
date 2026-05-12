import React, { useMemo, useState } from "react";

type Category = "love" | "money" | "study" | "career";
type Suit = "major" | "wands" | "cups" | "swords" | "pentacles";
type Tone = "bright" | "steady" | "caution" | "turning";

type TarotCard = {
  id: string;
  name: string;
  arcana: string;
  suit: Suit;
  img: string;
  keywords: string[];
  tone: Tone;
  core: string;
};

type DrawnCard = TarotCard & {
  reversed: boolean;
};

type SpreadSlot = {
  title: string;
  subtitle: string;
};

const categoryLabels: Record<Category, string> = {
  love: "연애 / 관계",
  money: "금전 / 재물",
  study: "학업 / 시험",
  career: "진로 / 일",
};

const categoryFocus: Record<Category, string> = {
  love: "마음의 온도, 관계의 균형, 상대와 나 사이의 거리",
  money: "현금 흐름, 선택의 손익, 지켜야 할 기준",
  study: "집중력, 학습 루틴, 결과를 만드는 반복",
  career: "역할, 방향성, 기회를 잡는 실행력",
};

const categoryAdvice: Record<Category, string[]> = {
  love: [
    "상대의 반응을 맞히려 하기보다 내 감정과 원하는 관계 방식을 먼저 정리하세요.",
    "좋은 흐름일수록 표현은 단순하게, 불안한 흐름일수록 확인은 부드럽게 하는 편이 좋습니다.",
    "관계의 속도를 무리하게 당기지 말고 대화의 질을 높이는 쪽이 유리합니다.",
  ],
  money: [
    "큰 결정보다 작은 지출 구조를 먼저 정리하면 흐름이 빨리 안정됩니다.",
    "수익 가능성만 보지 말고 손실이 났을 때 감당 가능한 범위를 먼저 정하세요.",
    "계약, 가격, 조건처럼 숫자로 확인할 수 있는 것부터 점검하는 편이 좋습니다.",
  ],
  study: [
    "지금은 의욕보다 반복 가능한 시간표가 더 중요합니다.",
    "틀린 문제와 애매한 개념을 따로 모아 다시 보는 방식이 효율적입니다.",
    "몰아치기보다 매일 같은 시간에 시작하는 루틴이 결과를 안정시킵니다.",
  ],
  career: [
    "역할과 목표를 작게 쪼개면 지금 바로 움직일 수 있는 지점이 보입니다.",
    "기회가 와도 준비된 자료나 포트폴리오가 없으면 지나갈 수 있으니 먼저 정리하세요.",
    "평판, 협업, 일정 관리처럼 눈에 덜 띄는 기본기가 결과를 좌우합니다.",
  ],
};

const toneCategoryReadings: Record<
  Category,
  Record<Tone, { upright: string[]; reversed: string[] }>
> = {
  love: {
    bright: {
      upright: [
        "호감과 표현이 살아나는 흐름이라 먼저 부드럽게 다가가도 좋습니다.",
        "상대와의 분위기가 가벼워지고, 관계를 긍정적으로 열 수 있는 신호가 있습니다.",
      ],
      reversed: [
        "호감은 있지만 표현이 들뜨거나 엇갈릴 수 있어 속도 조절이 필요합니다.",
        "좋은 감정이 있어도 기대가 앞서면 상대의 실제 반응을 놓칠 수 있습니다.",
      ],
    },
    steady: {
      upright: [
        "관계가 천천히 안정되는 흐름이므로 신뢰를 쌓는 태도가 가장 중요합니다.",
        "급한 고백이나 결론보다 꾸준한 배려가 관계의 밀도를 높입니다.",
      ],
      reversed: [
        "안정감이 정체감으로 느껴질 수 있어 대화의 온도를 다시 맞춰야 합니다.",
        "표면상 괜찮아 보여도 속마음이 닫힐 수 있으니 작은 불편함을 넘기지 마세요.",
      ],
    },
    caution: {
      upright: [
        "오해, 집착, 방어심이 관계의 핵심 변수가 될 수 있습니다.",
        "감정이 예민해진 상태라 말의 강도와 타이밍을 신중히 골라야 합니다.",
      ],
      reversed: [
        "불안이 실제보다 커질 수 있어 확인되지 않은 추측은 멈추는 편이 좋습니다.",
        "관계의 문제를 피하거나 덮으면 같은 장면이 반복될 가능성이 큽니다.",
      ],
    },
    turning: {
      upright: [
        "관계의 국면이 바뀌며 고백, 정리, 재회, 거리 조절 같은 결정이 떠오릅니다.",
        "지금 선택은 감정의 흐름뿐 아니라 앞으로의 관계 방식까지 바꿀 수 있습니다.",
      ],
      reversed: [
        "변화가 필요하지만 미련이나 두려움 때문에 결론이 늦어질 수 있습니다.",
        "관계가 바뀌는 중이라 섣불리 단정하기보다 신호를 며칠 더 관찰하세요.",
      ],
    },
  },
  money: {
    bright: {
      upright: [
        "수입, 보상, 제안처럼 돈의 흐름을 키울 만한 기회가 보입니다.",
        "작은 시도라도 실제 수익 구조로 이어질 가능성이 있습니다.",
      ],
      reversed: [
        "기회는 있지만 기대 수익을 크게 잡으면 실망하거나 지출이 앞설 수 있습니다.",
        "좋아 보이는 제안일수록 조건과 비용을 다시 확인해야 합니다.",
      ],
    },
    steady: {
      upright: [
        "예산, 저축, 장기 계획처럼 안정적인 관리가 힘을 발휘합니다.",
        "큰 한 방보다 꾸준히 쌓이는 흐름이 재정에 유리합니다.",
      ],
      reversed: [
        "안전하게 가려다 필요한 투자까지 미루는 모습이 생길 수 있습니다.",
        "지출을 줄이는 것만으로는 부족하니 돈이 묶인 곳도 함께 보세요.",
      ],
    },
    caution: {
      upright: [
        "충동구매, 손실, 계약 실수처럼 빠져나가는 돈을 먼저 막아야 합니다.",
        "감정적인 결제나 급한 투자는 이 카드 흐름에서 특히 불리합니다.",
      ],
      reversed: [
        "손실을 인정하지 않으면 더 큰 비용으로 번질 수 있습니다.",
        "이미 위험 신호를 봤다면 미루지 말고 바로 지출 구조를 정리하세요.",
      ],
    },
    turning: {
      upright: [
        "수입원, 투자 방향, 소비 습관이 바뀌는 전환점에 있습니다.",
        "낡은 재정 패턴을 끝내면 새로운 돈의 길이 열릴 수 있습니다.",
      ],
      reversed: [
        "바꾸어야 할 것은 알지만 실제 실행이 늦어질 수 있습니다.",
        "전환기에는 큰돈을 한 번에 움직이기보다 단계별로 옮기는 편이 낫습니다.",
      ],
    },
  },
  study: {
    bright: {
      upright: [
        "이해력과 동기가 살아나며 공부가 생각보다 잘 붙는 흐름입니다.",
        "새 과목, 새 루틴, 새 목표를 시작하기에 좋은 카드입니다.",
      ],
      reversed: [
        "의욕은 있지만 집중이 분산될 수 있어 범위를 좁혀야 합니다.",
        "기분에 따라 공부량이 흔들리면 성과가 들쑥날쑥해질 수 있습니다.",
      ],
    },
    steady: {
      upright: [
        "반복, 오답 정리, 기본기 점검이 확실한 성과를 만듭니다.",
        "느려 보여도 루틴을 지키면 점수가 안정적으로 올라갑니다.",
      ],
      reversed: [
        "너무 익숙한 방식만 붙잡으면 약점이 그대로 남을 수 있습니다.",
        "성실함은 있지만 효율이 떨어질 수 있으니 공부법을 한 번 점검하세요.",
      ],
    },
    caution: {
      upright: [
        "불안, 비교, 미루기가 집중력을 흔들 수 있습니다.",
        "막힌 개념을 방치하면 뒤 단원까지 영향을 줄 수 있습니다.",
      ],
      reversed: [
        "실패에 대한 걱정이 실제 실력보다 크게 느껴질 수 있습니다.",
        "공부를 피하고 싶은 마음이 강해질수록 작은 단위로 쪼개 시작해야 합니다.",
      ],
    },
    turning: {
      upright: [
        "공부 방향이나 시험 전략을 바꾸면 흐름이 살아납니다.",
        "지금은 예전 방식의 한계를 인정하고 새 계획으로 넘어갈 때입니다.",
      ],
      reversed: [
        "전략을 바꾸어야 하는데 익숙한 방식에 머무를 수 있습니다.",
        "계획 변경이 늦어지면 같은 실수가 반복될 가능성이 큽니다.",
      ],
    },
  },
  career: {
    bright: {
      upright: [
        "새 제안, 좋은 평가, 프로젝트 기회가 들어올 수 있는 흐름입니다.",
        "자신의 강점을 드러낼수록 일이 더 잘 풀립니다.",
      ],
      reversed: [
        "기회는 있지만 준비가 부족하면 흐름을 온전히 잡기 어렵습니다.",
        "자신감이 과하면 일정이나 디테일에서 빈틈이 생길 수 있습니다.",
      ],
    },
    steady: {
      upright: [
        "역할, 책임, 프로세스를 정리하면 일의 신뢰도가 올라갑니다.",
        "당장 화려하지 않아도 꾸준한 수행이 평판을 만듭니다.",
      ],
      reversed: [
        "안정적인 일이 반복되며 성장감이 낮아질 수 있습니다.",
        "책임을 혼자 떠안기보다 범위와 우선순위를 다시 정해야 합니다.",
      ],
    },
    caution: {
      upright: [
        "일정 지연, 소통 오류, 무리한 약속을 조심해야 합니다.",
        "겉으로 괜찮아 보여도 내부 구조의 약점이 드러날 수 있습니다.",
      ],
      reversed: [
        "문제를 알고도 미루면 나중에 더 큰 수정 비용이 생깁니다.",
        "불안 때문에 움직이지 못하기보다 작은 리스크부터 제거하세요.",
      ],
    },
    turning: {
      upright: [
        "이직, 역할 변화, 방향 전환처럼 판이 바뀌는 흐름이 있습니다.",
        "지금 선택은 앞으로의 커리어 포지션을 새로 정할 수 있습니다.",
      ],
      reversed: [
        "변화 욕구는 강하지만 현실 조건 때문에 속도가 늦어질 수 있습니다.",
        "바로 뛰기보다 자료, 일정, 사람을 정리한 뒤 움직이는 편이 좋습니다.",
      ],
    },
  },
};

const suitCategoryReadings: Record<Suit, Record<Category, string>> = {
  major: {
    love: "메이저 카드는 관계의 분위기보다 삶의 큰 선택과 연결됩니다.",
    money: "메이저 카드는 단기 수입보다 돈을 대하는 태도 자체를 묻습니다.",
    study: "메이저 카드는 단원 하나보다 공부 방향과 목표 설정에 영향을 줍니다.",
    career: "메이저 카드는 직무나 역할의 큰 방향 전환을 암시합니다.",
  },
  wands: {
    love: "완드는 끌림과 행동력의 카드라 먼저 움직이는 태도가 중요합니다.",
    money: "완드는 부업, 영업, 빠른 실행처럼 돈을 벌기 위한 추진력을 봅니다.",
    study: "완드는 의욕과 단기 집중력에 강하지만 오래 유지하는 장치가 필요합니다.",
    career: "완드는 프로젝트 시작, 발표, 주도권 같은 능동적인 장면에 강합니다.",
  },
  cups: {
    love: "컵은 감정과 공감의 카드라 관계의 온도와 진심을 섬세하게 봐야 합니다.",
    money: "컵은 기분 소비와 만족감을 보여주므로 감정적 지출을 점검해야 합니다.",
    study: "컵은 컨디션과 흥미가 성과에 영향을 주는 흐름입니다.",
    career: "컵은 협업, 분위기, 사람과의 신뢰가 일의 핵심 변수가 됩니다.",
  },
  swords: {
    love: "소드는 말, 판단, 거리감의 카드라 대화 방식이 관계를 좌우합니다.",
    money: "소드는 숫자, 계약, 정보 확인처럼 차가운 판단이 필요한 돈입니다.",
    study: "소드는 개념 정리와 논리 싸움에 강하지만 불안을 키우기도 합니다.",
    career: "소드는 기획, 분석, 문서, 커뮤니케이션에서 승부가 납니다.",
  },
  pentacles: {
    love: "펜타클은 현실성과 지속성을 보므로 오래 갈 수 있는 구조가 중요합니다.",
    money: "펜타클은 가장 현실적인 재물 카드라 수입, 저축, 자산 관리와 직접 연결됩니다.",
    study: "펜타클은 반복 연습과 누적 성과를 보여줍니다.",
    career: "펜타클은 실무 능력, 결과물, 보상처럼 눈에 보이는 성과를 뜻합니다.",
  },
};

const spreadPositionReadings = [
  {
    upright: "현재 자리에서는 이 카드가 이미 드러난 문제의 중심입니다.",
    reversed: "현재 자리의 역방향은 본인이 느끼는 불편함보다 원인이 더 안쪽에 있음을 말합니다.",
  },
  {
    upright: "흐름 자리에서는 앞으로 이 에너지가 점점 커질 가능성이 높습니다.",
    reversed: "흐름 자리의 역방향은 변화가 오더라도 지연, 우회, 재확인이 끼어들 수 있음을 뜻합니다.",
  },
  {
    upright: "조언 자리에서는 이 카드의 장점을 의식적으로 선택해야 합니다.",
    reversed: "조언 자리의 역방향은 이 카드의 그림자를 피하는 것이 곧 해법이라는 뜻입니다.",
  },
];

const spreadSlots: SpreadSlot[] = [
  {
    title: "현재의 바탕",
    subtitle: "지금 상황의 핵심 기류",
  },
  {
    title: "흐름의 방향",
    subtitle: "가까운 미래에 강해질 움직임",
  },
  {
    title: "전문가 조언",
    subtitle: "선택을 정리하는 실전 포인트",
  },
];

const majorCards: TarotCard[] = [
  ["major-00-fool", "바보", ["시작", "자유", "모험"], "bright", "새로운 가능성이 열리지만 아직 형태가 잡히지 않은 상태입니다."],
  ["major-01-magician", "마법사", ["실행", "재능", "표현"], "bright", "이미 가진 도구를 꺼내 쓰면 흐름을 주도할 수 있습니다."],
  ["major-02-high-priestess", "여사제", ["직감", "침묵", "내면"], "steady", "겉으로 드러난 말보다 감춰진 분위기와 패턴을 읽어야 합니다."],
  ["major-03-empress", "여황제", ["풍요", "돌봄", "성장"], "bright", "자연스럽게 자라는 힘이 있으며 관계와 결과가 무르익습니다."],
  ["major-04-emperor", "황제", ["질서", "책임", "기준"], "steady", "감정보다 구조를 세울 때 안정적인 결과가 만들어집니다."],
  ["major-05-hierophant", "교황", ["전통", "조언", "신뢰"], "steady", "검증된 방식과 신뢰할 만한 조언이 길을 열어줍니다."],
  ["major-06-lovers", "연인", ["선택", "끌림", "조화"], "bright", "중요한 선택 앞에서 마음과 현실의 균형을 맞춰야 합니다."],
  ["major-07-chariot", "전차", ["추진", "승부", "목표"], "bright", "방향을 정하면 빠르게 밀고 나갈 수 있는 힘이 있습니다."],
  ["major-08-strength", "힘", ["인내", "용기", "조절"], "steady", "세게 밀어붙이기보다 부드럽게 버티는 힘이 필요합니다."],
  ["major-09-hermit", "은둔자", ["성찰", "탐구", "거리"], "steady", "혼자 점검하고 본질을 파악해야 다음 길이 선명해집니다."],
  ["major-10-wheel-of-fortune", "운명의 수레바퀴", ["변화", "기회", "전환"], "turning", "흐름이 바뀌는 시점이며 타이밍을 놓치지 않는 감각이 중요합니다."],
  ["major-11-justice", "정의", ["균형", "판단", "공정"], "steady", "정확한 기준과 사실 확인이 좋은 결론을 만듭니다."],
  ["major-12-hanged-man", "매달린 사람", ["정지", "관점", "희생"], "caution", "서두르면 꼬이고, 관점을 바꿔야 해결책이 보입니다."],
  ["major-13-death", "죽음", ["종료", "변화", "재시작"], "turning", "낡은 방식을 끝내야 새로운 국면이 시작됩니다."],
  ["major-14-temperance", "절제", ["조화", "회복", "균형"], "steady", "극단을 피하고 속도를 조절하면 상황이 안정됩니다."],
  ["major-15-devil", "악마", ["집착", "유혹", "속박"], "caution", "강한 욕망이나 반복되는 습관이 판단을 흐릴 수 있습니다."],
  ["major-16-tower", "탑", ["충격", "붕괴", "각성"], "caution", "불안정한 구조가 드러나며 과감한 정리가 필요합니다."],
  ["major-17-star", "별", ["희망", "치유", "가능성"], "bright", "회복과 희망의 신호가 있으며 긴 호흡으로 보면 좋습니다."],
  ["major-18-moon", "달", ["불안", "환상", "모호함"], "caution", "정보가 불완전하므로 추측보다 확인이 우선입니다."],
  ["major-19-sun", "태양", ["성공", "기쁨", "명확함"], "bright", "밝고 직접적인 에너지가 결과를 좋게 이끕니다."],
  ["major-20-judgement", "심판", ["부름", "평가", "결단"], "turning", "미뤄둔 결정을 마주하고 다음 단계로 넘어갈 때입니다."],
  ["major-21-world", "세계", ["완성", "성취", "통합"], "bright", "긴 과정이 마무리되거나 한 단계 높은 완성으로 이어집니다."],
].map(([id, name, keywords, tone, core]) => ({
  id: id as string,
  name: name as string,
  arcana: "Major Arcana",
  suit: "major",
  img: `/img/tarotcards/${id}.jpg`,
  keywords: keywords as string[],
  tone: tone as Tone,
  core: core as string,
}));

const suitMeta: Record<Exclude<Suit, "major">, { ko: string; file: string; element: string; domain: string }> = {
  wands: { ko: "완드", file: "wands", element: "불", domain: "의욕과 행동" },
  cups: { ko: "컵", file: "cups", element: "물", domain: "감정과 관계" },
  swords: { ko: "소드", file: "swords", element: "공기", domain: "생각과 판단" },
  pentacles: { ko: "펜타클", file: "pentacles", element: "흙", domain: "현실과 성과" },
};

const minorRanks = [
  ["01-ace", "에이스", ["시작", "씨앗", "기회"], "bright", "새로운 에너지가 생기는 출발점입니다."],
  ["02-two", "2", ["균형", "선택", "조율"], "steady", "두 가지 흐름 사이에서 균형을 잡아야 합니다."],
  ["03-three", "3", ["확장", "협력", "성장"], "bright", "작은 성과가 밖으로 확장되기 시작합니다."],
  ["04-four", "4", ["안정", "기반", "휴식"], "steady", "기반을 다지고 안정감을 회복하는 흐름입니다."],
  ["05-five", "5", ["갈등", "변수", "도전"], "caution", "마찰이 생기지만 약점을 찾는 계기가 됩니다."],
  ["06-six", "6", ["회복", "인정", "교류"], "bright", "막혔던 흐름이 풀리고 도움이나 인정이 따릅니다."],
  ["07-seven", "7", ["방어", "점검", "버팀"], "caution", "쉽게 물러서지 말고 기준을 지켜야 합니다."],
  ["08-eight", "8", ["속도", "반복", "전개"], "bright", "움직임이 빨라지고 집중할수록 결과가 납니다."],
  ["09-nine", "9", ["완성 직전", "경계", "집중"], "steady", "마지막 고비이므로 흐트러지지 않는 태도가 중요합니다."],
  ["10-ten", "10", ["완성", "부담", "결실"], "turning", "한 주기가 끝나며 결실과 부담을 함께 정리합니다."],
  ["11-page", "페이지", ["소식", "배움", "호기심"], "bright", "작은 소식이나 배움이 다음 흐름을 엽니다."],
  ["12-knight", "기사", ["추진", "이동", "열정"], "turning", "움직임은 강하지만 속도 조절이 관건입니다."],
  ["13-queen", "여왕", ["성숙", "수용", "관리"], "steady", "상황을 품고 조율하는 섬세한 관리가 필요합니다."],
  ["14-king", "왕", ["책임", "통제", "성과"], "steady", "큰 그림을 보고 책임 있게 결론을 내릴 힘이 있습니다."],
] as const;

const minorCards: TarotCard[] = (Object.keys(suitMeta) as Exclude<Suit, "major">[]).flatMap((suit) =>
  minorRanks.map(([fileRank, rankName, keywords, tone, core]) => {
    const meta = suitMeta[suit];
    return {
      id: `${meta.file}-${fileRank}`,
      name: `${meta.ko} ${rankName}`,
      arcana: `${meta.ko} | ${meta.element}`,
      suit,
      img: `/img/tarotcards/${meta.file}-${fileRank}.jpg`,
      keywords: [...keywords, meta.domain],
      tone,
      core: `${meta.domain}에서 ${core}`,
    };
  }),
);

const tarotCards: TarotCard[] = [...majorCards, ...minorCards];

const toneLabels: Record<Tone, string> = {
  bright: "긍정",
  steady: "안정",
  caution: "주의",
  turning: "전환",
};

const cardBackStyle: React.CSSProperties = {
  background:
    "linear-gradient(135deg, #17131f 0%, #2a1f36 45%, #544032 100%)",
  border: "1px solid rgba(244, 214, 150, 0.38)",
  boxShadow: "inset 0 0 0 7px rgba(255,255,255,0.04), 0 16px 34px rgba(17, 12, 24, 0.28)",
};

function shuffleDeck(deck: TarotCard[]) {
  return [...deck]
    .map((card) => ({ card, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ card }) => card);
}

function drawCard(card: TarotCard): DrawnCard {
  return {
    ...card,
    reversed: Math.random() > 0.72,
  };
}

function pickByCard<T>(items: T[], card: DrawnCard, category: Category, index: number) {
  const seed = `${card.id}-${category}-${index}-${card.reversed ? "r" : "u"}`;
  const total = seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return items[total % items.length];
}

function getCategoryReading(card: DrawnCard, category: Category, index: number) {
  const direction = card.reversed ? "reversed" : "upright";
  const toneReading = pickByCard(
    toneCategoryReadings[category][card.tone][direction],
    card,
    category,
    index,
  );
  const positionReading = spreadPositionReadings[index][direction];
  const suitReading = suitCategoryReadings[card.suit][category];
  const polarity = card.reversed
    ? "따라서 이 카드의 의미는 막힘, 과잉, 지연 중 하나로 나타날 수 있습니다."
    : "따라서 이 카드의 의미는 비교적 자연스럽고 직접적으로 드러납니다.";

  return `${positionReading} ${card.core} ${suitReading} ${categoryFocus[category]}를 기준으로 보면, ${toneReading} ${polarity}`;
}

function makeSummary(cards: DrawnCard[], category: Category) {
  const cautionCount = cards.filter((card) => card.tone === "caution" || card.reversed).length;
  const brightCount = cards.filter((card) => card.tone === "bright" && !card.reversed).length;
  const majorCount = cards.filter((card) => card.suit === "major").length;

  if (cautionCount >= 2) {
    return `${categoryLabels[category]} 흐름은 성급한 결정보다 점검이 먼저입니다. 불안한 신호를 무시하지 말고, 확인 가능한 사실과 반복되는 패턴을 분리해서 보세요.`;
  }

  if (brightCount >= 2) {
    return `${categoryLabels[category]} 흐름은 열려 있습니다. 좋은 카드가 많으니 생각만 정리하다가 늦어지기보다, 작게라도 먼저 움직이는 편이 운을 살립니다.`;
  }

  if (majorCount >= 2) {
    return `${categoryLabels[category]} 문제는 단순한 하루 운세보다 큰 방향성과 관련되어 있습니다. 지금 선택은 이후 흐름을 바꿀 수 있으니 기준을 분명히 잡으세요.`;
  }

  return `${categoryLabels[category]} 흐름은 무난하지만 자동으로 풀리지는 않습니다. 카드들이 말하는 강점과 주의점을 현실적인 행동으로 바꾸면 결과가 좋아집니다.`;
}

function makeCombinationInsights(cards: DrawnCard[], category: Category) {
  const insights: string[] = [];
  const majorCount = cards.filter((card) => card.suit === "major").length;
  const reversedCount = cards.filter((card) => card.reversed).length;
  const suitCounts = cards.reduce<Record<Suit, number>>(
    (counts, card) => ({ ...counts, [card.suit]: counts[card.suit] + 1 }),
    { major: 0, wands: 0, cups: 0, swords: 0, pentacles: 0 },
  );
  const toneCounts = cards.reduce<Record<Tone, number>>(
    (counts, card) => ({ ...counts, [card.tone]: counts[card.tone] + 1 }),
    { bright: 0, steady: 0, caution: 0, turning: 0 },
  );

  if (majorCount >= 2) {
    insights.push("메이저 카드가 2장 이상이라 단순한 기분 운세보다 큰 흐름의 전환으로 읽습니다.");
  }

  if (reversedCount >= 2) {
    insights.push("역방향이 많아서 외부 문제보다 내 안의 망설임, 지연, 회피를 먼저 다루는 편이 좋습니다.");
  }

  if (suitCounts.cups >= 2) {
    insights.push(`${categoryLabels[category]}에서 감정과 인간관계가 핵심 변수로 강하게 작용합니다.`);
  }

  if (suitCounts.swords >= 2) {
    insights.push("소드가 많아 말, 판단, 정보 확인이 결과를 크게 좌우합니다.");
  }

  if (suitCounts.pentacles >= 2) {
    insights.push("펜타클이 많아 현실적인 조건, 시간, 돈, 결과물이 핵심입니다.");
  }

  if (suitCounts.wands >= 2) {
    insights.push("완드가 많아 망설이는 순간보다 직접 움직이는 순간에 흐름이 살아납니다.");
  }

  if (toneCounts.caution >= 2) {
    insights.push("주의 카드가 많으므로 지금은 확장보다 정리, 확인, 손실 방지가 우선입니다.");
  }

  if (toneCounts.bright >= 2) {
    insights.push("긍정 카드가 많아 운은 열려 있습니다. 다만 기회를 현실 행동으로 옮겨야 체감됩니다.");
  }

  if (toneCounts.turning >= 2) {
    insights.push("전환 카드가 많아 오래 끌던 방식을 바꾸는 것이 이번 리딩의 핵심입니다.");
  }

  if (insights.length === 0) {
    insights.push("세 카드의 성격이 고르게 섞여 있어 한 가지 답보다 균형 잡힌 선택이 중요합니다.");
  }

  return insights.slice(0, 3);
}

const Tratot_no_ai: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("love");
  const [deck, setDeck] = useState<TarotCard[]>(() => shuffleDeck(tarotCards));
  const [selectedCards, setSelectedCards] = useState<DrawnCard[]>([]);
  const [isReadingOpen, setIsReadingOpen] = useState(false);

  const canRead = selectedCards.length === 3;

  const readingSummary = useMemo(() => {
    if (!canRead) return "";
    return makeSummary(selectedCards, selectedCategory);
  }, [canRead, selectedCards, selectedCategory]);

  const combinationInsights = useMemo(() => {
    if (!canRead) return [];
    return makeCombinationInsights(selectedCards, selectedCategory);
  }, [canRead, selectedCards, selectedCategory]);

  const selectCard = (card: TarotCard) => {
    if (selectedCards.length >= 3 || selectedCards.some((item) => item.id === card.id)) return;

    const nextCards = [...selectedCards, drawCard(card)];
    setSelectedCards(nextCards);
    if (nextCards.length === 3) {
      setIsReadingOpen(true);
    }
  };

  const resetReading = () => {
    setDeck(shuffleDeck(tarotCards));
    setSelectedCards([]);
    setIsReadingOpen(false);
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroText}>
          <p style={styles.eyebrow}>No AI Tarot Reader</p>
          <h1 style={styles.title}>타로 전문가 시스템</h1>
          <p style={styles.subtitle}>
            카테고리를 고르고 3장의 카드를 뽑으면, 보편적인 3카드 스프레드 방식으로 현재의 바탕,
            흐름의 방향, 실전 조언을 정리합니다.
          </p>
        </div>
        <div style={styles.heroPanel}>
          <strong style={styles.panelNumber}>{selectedCards.length}/3</strong>
          <span style={styles.panelText}>선택한 카드</span>
        </div>
      </section>

      <section style={styles.controls}>
        <div>
          <h2 style={styles.sectionTitle}>카테고리</h2>
          <div style={styles.categoryGrid}>
            {(Object.keys(categoryLabels) as Category[]).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                style={{
                  ...styles.categoryButton,
                  ...(selectedCategory === category ? styles.categoryButtonActive : {}),
                }}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>

        <button type="button" onClick={resetReading} style={styles.resetButton}>
          새로 섞기
        </button>
      </section>

      <section style={styles.spread}>
        {spreadSlots.map((slot, index) => {
          const card = selectedCards[index];
          return (
            <article key={slot.title} style={styles.slot}>
              <div>
                <span style={styles.slotIndex}>0{index + 1}</span>
                <h3 style={styles.slotTitle}>{slot.title}</h3>
                <p style={styles.slotSubtitle}>{slot.subtitle}</p>
              </div>
              {card ? (
                <div style={styles.selectedCard}>
                  <img src={card.img} alt={card.name} style={styles.selectedImage} />
                  <div>
                    <strong style={styles.cardName}>{card.name}</strong>
                    <span style={styles.cardMeta}>
                      {card.reversed ? "역방향" : "정방향"} · {toneLabels[card.tone]}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ ...styles.emptyCard, ...cardBackStyle }}>
                  <span>?</span>
                </div>
              )}
            </article>
          );
        })}
      </section>

      <section style={styles.deckSection}>
        <div style={styles.deckHeader}>
          <div>
            <h2 style={styles.sectionTitle}>카드 선택</h2>
            <p style={styles.muted}>직감으로 3장을 고르세요. 이미 선택한 카드는 덱에서 잠깁니다.</p>
          </div>
          <span style={styles.countBadge}>총 {tarotCards.length}장</span>
        </div>

        <div style={styles.deckGrid}>
          {deck.map((card) => {
            const picked = selectedCards.some((item) => item.id === card.id);
            return (
              <button
                key={card.id}
                type="button"
                disabled={picked || selectedCards.length >= 3}
                onClick={() => selectCard(card)}
                aria-label={`${card.name} 선택`}
                style={{
                  ...styles.deckCard,
                  ...cardBackStyle,
                  ...(picked ? styles.deckCardPicked : {}),
                }}
              >
                <span style={styles.deckMark}>{picked ? "선택됨" : "TAROT"}</span>
              </button>
            );
          })}
        </div>
      </section>

      {isReadingOpen && canRead && (
        <section style={styles.result}>
          <div style={styles.resultHeader}>
            <div>
              <p style={styles.eyebrow}>Reading Result</p>
              <h2 style={styles.resultTitle}>{categoryLabels[selectedCategory]} 리딩</h2>
            </div>
            <span style={styles.resultBadge}>3 Card Spread</span>
          </div>

          <p style={styles.summary}>{readingSummary}</p>

          <div style={styles.insightBox}>
            <h3 style={styles.insightTitle}>조합 해석</h3>
            <ul style={styles.insightList}>
              {combinationInsights.map((insight) => (
                <li key={insight}>{insight}</li>
              ))}
            </ul>
          </div>

          <div style={styles.readingGrid}>
            {selectedCards.map((card, index) => (
              <article key={card.id} style={styles.readingCard}>
                <img src={card.img} alt={card.name} style={styles.readingImage} />
                <div>
                  <span style={styles.slotIndex}>{spreadSlots[index].title}</span>
                  <h3 style={styles.readingCardTitle}>{card.name}</h3>
                  <p style={styles.keywordLine}>{card.keywords.join(" · ")}</p>
                  <p style={styles.readingText}>{getCategoryReading(card, selectedCategory, index)}</p>
                </div>
              </article>
            ))}
          </div>

          <div style={styles.actionBox}>
            <h3 style={styles.actionTitle}>오늘의 실행 조언</h3>
            <ul style={styles.actionList}>
              {categoryAdvice[selectedCategory].map((advice) => (
                <li key={advice}>{advice}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "40px 18px 64px",
    background: "#f7f3ea",
    color: "#201a17",
  },
  hero: {
    maxWidth: 1180,
    margin: "0 auto 22px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 220px",
    gap: 18,
    alignItems: "stretch",
  },
  heroText: {
    padding: "36px",
    borderRadius: 8,
    background: "#211826",
    color: "#fff8ed",
    boxShadow: "0 22px 50px rgba(26, 18, 29, 0.2)",
  },
  eyebrow: {
    margin: "0 0 10px",
    fontSize: 13,
    fontWeight: 800,
    color: "#b88746",
    textTransform: "uppercase",
    letterSpacing: 0,
  },
  title: {
    margin: 0,
    fontSize: "clamp(32px, 5vw, 56px)",
    lineHeight: 1.05,
    letterSpacing: 0,
  },
  subtitle: {
    maxWidth: 760,
    margin: "18px 0 0",
    color: "#eadfce",
    fontSize: 17,
  },
  heroPanel: {
    borderRadius: 8,
    background: "#fffaf1",
    border: "1px solid #ead8bb",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 190,
  },
  panelNumber: {
    fontSize: 48,
    lineHeight: 1,
  },
  panelText: {
    marginTop: 10,
    color: "#766551",
    fontWeight: 700,
  },
  controls: {
    maxWidth: 1180,
    margin: "0 auto 22px",
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "end",
  },
  sectionTitle: {
    margin: "0 0 10px",
    fontSize: 22,
  },
  categoryGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    minHeight: 42,
    borderRadius: 8,
    border: "1px solid #d8c4a5",
    background: "#fffaf1",
    color: "#2a201b",
    fontWeight: 800,
  },
  categoryButtonActive: {
    background: "#8f5c2f",
    color: "#fffaf1",
    borderColor: "#8f5c2f",
  },
  resetButton: {
    minHeight: 42,
    borderRadius: 8,
    border: "1px solid #2b211d",
    background: "#2b211d",
    color: "#fffaf1",
    fontWeight: 800,
  },
  spread: {
    maxWidth: 1180,
    margin: "0 auto 22px",
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
  },
  slot: {
    minHeight: 220,
    padding: 18,
    borderRadius: 8,
    background: "#fffaf1",
    border: "1px solid #ead8bb",
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
  },
  slotIndex: {
    display: "block",
    color: "#9c6b36",
    fontSize: 12,
    fontWeight: 900,
  },
  slotTitle: {
    margin: "4px 0",
    fontSize: 18,
  },
  slotSubtitle: {
    margin: 0,
    color: "#766551",
    fontSize: 14,
  },
  emptyCard: {
    width: 92,
    height: 138,
    borderRadius: 8,
    display: "grid",
    placeItems: "center",
    color: "#f2d49a",
    fontSize: 28,
    flex: "0 0 auto",
  },
  selectedCard: {
    width: 132,
    flex: "0 0 auto",
  },
  selectedImage: {
    width: "100%",
    aspectRatio: "2 / 3.35",
    objectFit: "cover",
    borderRadius: 8,
    boxShadow: "0 12px 24px rgba(26, 18, 29, 0.22)",
  },
  cardName: {
    display: "block",
    marginTop: 8,
    fontSize: 14,
  },
  cardMeta: {
    display: "block",
    color: "#7a6750",
    fontSize: 12,
  },
  deckSection: {
    maxWidth: 1180,
    margin: "0 auto 22px",
    padding: 20,
    borderRadius: 8,
    background: "#efe4d1",
  },
  deckHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "start",
    marginBottom: 14,
  },
  muted: {
    margin: 0,
    color: "#75644f",
  },
  countBadge: {
    padding: "8px 10px",
    borderRadius: 8,
    background: "#fffaf1",
    color: "#6b4d2d",
    fontWeight: 900,
    whiteSpace: "nowrap",
  },
  deckGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(74px, 1fr))",
    gap: 10,
  },
  deckCard: {
    width: "100%",
    aspectRatio: "2 / 3.2",
    borderRadius: 8,
    display: "grid",
    placeItems: "center",
    color: "#f4d696",
    fontSize: 11,
    fontWeight: 900,
    padding: 4,
  },
  deckCardPicked: {
    opacity: 0.42,
    transform: "translateY(4px)",
  },
  deckMark: {
    border: "1px solid rgba(244, 214, 150, 0.5)",
    borderRadius: 999,
    padding: "4px 6px",
  },
  result: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: 24,
    borderRadius: 8,
    background: "#fffaf1",
    border: "1px solid #ead8bb",
    boxShadow: "0 18px 44px rgba(40, 28, 18, 0.12)",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    gap: 16,
  },
  resultTitle: {
    margin: 0,
    fontSize: 30,
  },
  resultBadge: {
    padding: "8px 10px",
    borderRadius: 8,
    background: "#2b211d",
    color: "#fffaf1",
    fontWeight: 900,
    whiteSpace: "nowrap",
  },
  summary: {
    margin: "18px 0",
    padding: 16,
    borderRadius: 8,
    background: "#f1e5d1",
    color: "#342820",
    fontSize: 17,
    fontWeight: 700,
  },
  insightBox: {
    margin: "0 0 16px",
    padding: 16,
    borderRadius: 8,
    background: "#f7efe0",
    border: "1px solid #ead8bb",
  },
  insightTitle: {
    margin: "0 0 8px",
    fontSize: 18,
  },
  insightList: {
    margin: 0,
    paddingLeft: 20,
    color: "#3c3129",
  },
  readingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
  },
  readingCard: {
    display: "grid",
    gridTemplateColumns: "92px minmax(0, 1fr)",
    gap: 14,
    padding: 14,
    borderRadius: 8,
    border: "1px solid #ead8bb",
    background: "#fffdf8",
  },
  readingImage: {
    width: 92,
    aspectRatio: "2 / 3.35",
    objectFit: "cover",
    borderRadius: 8,
  },
  readingCardTitle: {
    margin: "3px 0",
    fontSize: 18,
  },
  keywordLine: {
    margin: "0 0 8px",
    color: "#8b673d",
    fontSize: 13,
    fontWeight: 800,
  },
  readingText: {
    margin: 0,
    color: "#3c3129",
    fontSize: 14,
  },
  actionBox: {
    marginTop: 16,
    padding: 18,
    borderRadius: 8,
    background: "#211826",
    color: "#fff8ed",
  },
  actionTitle: {
    margin: "0 0 8px",
    fontSize: 18,
  },
  actionList: {
    margin: 0,
    paddingLeft: 20,
  },
};

export { tarotCards };
export default Tratot_no_ai;
