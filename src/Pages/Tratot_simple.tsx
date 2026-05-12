/**
 * https://chatgpt.com/share/6a0276fb-a940-83a5-9f06-5bbac90ea4ad
 */
import React, { useState } from "react";

type Category = "love" | "money" | "study";

type TarotCard = {
  name: string;
  keywords: string;
  img: string;
  meaning: {
    love: string;
    money: string;
    study: string;
  };
};

const categoryLabels: Record<Category, string> = {
  love: "연애",
  money: "금전",
  study: "학업",
};

const initialTarotCards: TarotCard[] = [
  {
    name: "바보",
    keywords: "자유, 시작, 모험",
    img: "/img/tarotcards/major-00-fool.jpg",
    meaning: {
      love: "새로운 만남이 가볍게 시작될 수 있습니다. 설렘은 크지만 아직 깊이를 판단하기엔 이르니 편하게 알아가세요.",
      money: "새로운 수입 기회가 보일 수 있지만 충동적인 지출도 생기기 쉽습니다. 돈을 쓰기 전 한 번 더 확인하세요.",
      study: "새 과목이나 공부법을 시작하기 좋은 흐름입니다. 다만 계획 없이 덤비면 금방 흐트러질 수 있습니다.",
    },
  },
  {
    name: "마법사",
    keywords: "능력, 실행, 창조",
    img: "/img/tarotcards/major-01-magician.jpg",
    meaning: {
      love: "말과 표현이 매력적으로 전달됩니다. 마음이 있다면 직접 표현할수록 관계가 움직입니다.",
      money: "가진 기술이나 아이디어를 돈으로 바꿀 수 있는 시기입니다. 실행력이 수익을 만듭니다.",
      study: "집중력과 이해력이 좋아집니다. 배운 내용을 응용하면 실력이 빠르게 늘어납니다.",
    },
  },
  {
    name: "여사제",
    keywords: "직감, 비밀, 내면",
    img: "/img/tarotcards/major-02-high-priestess.jpg",
    meaning: {
      love: "상대의 마음이 겉으로 잘 드러나지 않습니다. 서두르기보다 분위기와 행동을 조용히 살피세요.",
      money: "확실하지 않은 정보에 돈을 걸면 위험합니다. 자료를 더 모으고 판단하는 편이 좋습니다.",
      study: "깊게 읽고 혼자 정리하는 공부에 강합니다. 암기보다 이해 중심으로 접근하세요.",
    },
  },
  {
    name: "여황제",
    keywords: "풍요, 사랑, 성장",
    img: "/img/tarotcards/major-03-empress.jpg",
    meaning: {
      love: "다정하고 따뜻한 관계운입니다. 호감이 자연스럽게 자라고 편안한 분위기가 만들어집니다.",
      money: "돈의 흐름이 부드럽고 만족스러운 소비도 있습니다. 다만 기분에 따른 과소비는 조심하세요.",
      study: "창의력과 감각을 쓰는 공부에 좋습니다. 결과가 천천히 자라나는 시기입니다.",
    },
  },
  {
    name: "황제",
    keywords: "권위, 질서, 책임",
    img: "/img/tarotcards/major-04-emperor.jpg",
    meaning: {
      love: "관계를 분명히 정하고 책임지는 태도가 필요합니다. 애매함보다 확실한 약속이 중요합니다.",
      money: "예산과 규칙을 세우면 돈이 안정됩니다. 감정보다 숫자를 보고 판단하세요.",
      study: "계획표와 루틴이 성적을 만듭니다. 기초부터 체계적으로 쌓는 공부가 맞습니다.",
    },
  },
  {
    name: "교황",
    keywords: "전통, 조언, 믿음",
    img: "/img/tarotcards/major-05-hierophant.jpg",
    meaning: {
      love: "가볍기보다 진지한 관계에 어울립니다. 믿음, 약속, 소개를 통한 만남이 좋습니다.",
      money: "검증된 방식이 안전합니다. 전문가 조언이나 기존 원칙을 따르는 편이 유리합니다.",
      study: "선생님, 강의, 기본서의 도움을 받기 좋습니다. 혼자 꼼수 찾기보다 정석이 통합니다.",
    },
  },
  {
    name: "연인",
    keywords: "선택, 관계, 끌림",
    img: "/img/tarotcards/major-06-lovers.jpg",
    meaning: {
      love: "강한 끌림과 중요한 선택이 함께 옵니다. 마음이 향하는 곳을 솔직하게 인정해야 합니다.",
      money: "좋아 보이는 선택지가 여러 개 생깁니다. 감정이 아니라 기준을 세워 골라야 합니다.",
      study: "진로와 공부 방향을 정하기 좋은 시기입니다. 하고 싶은 것과 해야 할 것을 조율하세요.",
    },
  },
  {
    name: "전차",
    keywords: "승리, 추진력, 목표",
    img: "/img/tarotcards/major-07-chariot.jpg",
    meaning: {
      love: "적극적으로 움직이면 관계가 빠르게 진전됩니다. 망설임보다 확실한 태도가 필요합니다.",
      money: "목표 금액을 정하고 밀어붙이면 성과가 납니다. 속도는 좋지만 무리한 경쟁은 피하세요.",
      study: "단기간 집중에 강합니다. 시험, 발표, 과제 마감에 승부를 걸기 좋습니다.",
    },
  },
  {
    name: "힘",
    keywords: "인내, 용기, 절제",
    img: "/img/tarotcards/major-08-strength.jpg",
    meaning: {
      love: "부드럽게 기다리는 힘이 필요합니다. 억지로 밀기보다 이해하고 감싸면 관계가 좋아집니다.",
      money: "큰 욕심보다 꾸준한 관리가 유리합니다. 참고 버티면 재정 흐름이 안정됩니다.",
      study: "끈기가 성과를 만듭니다. 어려운 단원도 반복하면 결국 넘어갈 수 있습니다.",
    },
  },
  {
    name: "은둔자",
    keywords: "성찰, 탐구, 고독",
    img: "/img/tarotcards/major-09-hermit.jpg",
    meaning: {
      love: "혼자 생각할 시간이 필요합니다. 관계를 급하게 진전시키기보다 내 마음부터 확인하세요.",
      money: "큰 투자보다 점검과 절약에 맞습니다. 돈이 어디로 새는지 조용히 살펴보세요.",
      study: "혼자 깊게 파고드는 공부에 좋습니다. 복습과 오답 정리가 큰 도움이 됩니다.",
    },
  },
  {
    name: "운명의 수레바퀴",
    keywords: "변화, 기회, 흐름",
    img: "/img/tarotcards/major-10-wheel-of-fortune.jpg",
    meaning: {
      love: "예상하지 못한 만남이나 관계의 전환이 생길 수 있습니다. 흐름이 바뀌는 순간을 놓치지 마세요.",
      money: "돈의 흐름이 갑자기 바뀔 수 있습니다. 좋은 기회도 빠르게 오니 준비가 필요합니다.",
      study: "정체됐던 공부에 변화가 생깁니다. 새로운 방식이나 환경이 도움이 됩니다.",
    },
  },
  {
    name: "정의",
    keywords: "균형, 판단, 공정",
    img: "/img/tarotcards/major-11-justice.jpg",
    meaning: {
      love: "감정만으로 판단하면 흔들립니다. 서로에게 공정한 관계인지 차분히 따져보세요.",
      money: "계약, 정산, 계산을 정확히 해야 합니다. 대충 넘기면 나중에 문제가 됩니다.",
      study: "노력한 만큼 결과가 나옵니다. 부족한 부분을 객관적으로 인정하는 것이 먼저입니다.",
    },
  },
  {
    name: "행맨",
    keywords: "희생, 정지, 관점",
    img: "/img/tarotcards/major-12-hanged-man.jpg",
    meaning: {
      love: "관계가 잠시 멈춘 듯 느껴질 수 있습니다. 지금은 다른 관점에서 상대를 이해해야 합니다.",
      money: "큰 결정보다 기다림이 낫습니다. 당장 이득이 없어도 상황을 보는 시간이 필요합니다.",
      study: "진도가 느려도 괜찮습니다. 막힌 개념을 다른 방식으로 다시 보면 풀립니다.",
    },
  },
  {
    name: "죽음",
    keywords: "끝, 변화, 재시작",
    img: "/img/tarotcards/major-13-death.jpg",
    meaning: {
      love: "낡은 관계 방식이 끝나고 새 국면이 시작됩니다. 붙잡을 것과 놓을 것을 구분하세요.",
      money: "불필요한 지출이나 손해 보는 구조를 정리해야 합니다. 정리 뒤에 새 기회가 옵니다.",
      study: "기존 공부법이 맞지 않을 수 있습니다. 과감히 방식을 바꾸면 다시 살아납니다.",
    },
  },
  {
    name: "절제",
    keywords: "조화, 균형, 회복",
    img: "/img/tarotcards/major-14-temperance.jpg",
    meaning: {
      love: "서로 다른 점을 맞춰가면 관계가 안정됩니다. 속도 조절이 중요합니다.",
      money: "수입과 지출의 균형을 잡기 좋습니다. 무리하지 않는 관리가 재정을 회복시킵니다.",
      study: "매일 조금씩 꾸준히 하는 공부가 맞습니다. 벼락치기보다 균형 잡힌 루틴이 좋습니다.",
    },
  },
  {
    name: "악마",
    keywords: "집착, 유혹, 속박",
    img: "/img/tarotcards/major-15-devil.jpg",
    meaning: {
      love: "강한 끌림이 있지만 집착이나 의존으로 흐르기 쉽습니다. 감정의 균형을 지키세요.",
      money: "충동구매, 빚, 위험한 제안에 주의해야 합니다. 당장의 즐거움이 부담으로 돌아올 수 있습니다.",
      study: "딴짓과 유혹이 공부를 방해합니다. 휴대폰, 게임, 미루는 습관을 끊는 게 먼저입니다.",
    },
  },
  {
    name: "타워",
    keywords: "충격, 붕괴, 각성",
    img: "/img/tarotcards/major-16-tower.jpg",
    meaning: {
      love: "숨겨진 문제가 드러나 관계가 흔들릴 수 있습니다. 불편해도 진실을 마주해야 합니다.",
      money: "갑작스러운 지출이나 손실에 대비하세요. 안전장치 없이 움직이면 위험합니다.",
      study: "계획이 무너질 수 있지만 다시 세우면 됩니다. 약한 부분이 드러난 것을 기회로 보세요.",
    },
  },
  {
    name: "별",
    keywords: "희망, 치유, 가능성",
    img: "/img/tarotcards/major-17-star.jpg",
    meaning: {
      love: "맑고 희망적인 감정이 살아납니다. 상처가 있었다면 천천히 회복됩니다.",
      money: "당장 큰돈보다 미래 가능성이 보입니다. 장기적인 목표를 믿고 준비하세요.",
      study: "목표를 다시 믿어도 좋습니다. 조금씩 나아지는 흐름이 생깁니다.",
    },
  },
  {
    name: "달",
    keywords: "불안, 환상, 혼란",
    img: "/img/tarotcards/major-18-moon.jpg",
    meaning: {
      love: "오해와 불안이 커질 수 있습니다. 상상으로 판단하지 말고 확인이 필요합니다.",
      money: "불확실한 거래나 소문에 흔들리지 마세요. 잘 모르는 돈 문제는 미루는 편이 낫습니다.",
      study: "막연한 불안이 집중을 흐립니다. 작은 범위부터 정리하면 혼란이 줄어듭니다.",
    },
  },
  {
    name: "태양",
    keywords: "성공, 기쁨, 활력",
    img: "/img/tarotcards/major-19-sun.jpg",
    meaning: {
      love: "밝고 솔직한 관계운입니다. 마음을 숨기기보다 긍정적으로 표현하면 좋습니다.",
      money: "성과와 보상이 기대됩니다. 자신 있게 움직여도 좋은 흐름입니다.",
      study: "자신감이 붙고 결과가 잘 보입니다. 시험이나 발표에 좋은 카드입니다.",
    },
  },
  {
    name: "심판",
    keywords: "부활, 평가, 결단",
    img: "/img/tarotcards/major-20-judgement.jpg",
    meaning: {
      love: "과거의 인연이나 미뤄둔 대화가 다시 떠오를 수 있습니다. 결론을 내릴 때입니다.",
      money: "지난 선택의 결과를 확인하게 됩니다. 정산하고 다시 계획을 세우세요.",
      study: "복습과 재도전에 강합니다. 이전에 틀린 것을 다시 보면 성과가 납니다.",
    },
  },
  {
    name: "세계",
    keywords: "완성, 성취, 통합",
    img: "/img/tarotcards/major-21-world.jpg",
    meaning: {
      love: "관계가 안정되거나 한 단계 완성됩니다. 서로의 자리를 인정하는 흐름입니다.",
      money: "목표 달성이나 마무리 수익이 들어올 수 있습니다. 오래 준비한 일이 결실을 냅니다.",
      study: "긴 과정의 결과가 나옵니다. 마무리 정리와 최종 점검에 좋습니다.",
    },
  },
  {
    name: "완드 에이스",
    keywords: "열정, 시작, 의욕",
    img: "/img/tarotcards/wands-01-ace.jpg",
    meaning: {
      love: "새로운 호감이 강하게 피어납니다. 먼저 다가갈 용기가 생기는 카드입니다.",
      money: "새 수입 아이디어나 부업 기회가 보입니다. 작게라도 시작해보면 좋습니다.",
      study: "의욕이 올라 공부를 시작하기 좋습니다. 첫 단추를 빠르게 끼우세요.",
    },
  },
  {
    name: "완드 2",
    keywords: "계획, 전망, 선택",
    img: "/img/tarotcards/wands-02-two.jpg",
    meaning: {
      love: "관계의 다음 방향을 고민하게 됩니다. 지금 선택이 앞으로의 흐름을 정합니다.",
      money: "더 큰 계획을 세우는 시기입니다. 바로 움직이기보다 가능성을 비교하세요.",
      study: "진로와 목표를 넓게 봐야 합니다. 어떤 공부를 이어갈지 선택이 필요합니다.",
    },
  },
  {
    name: "완드 3",
    keywords: "확장, 기다림, 진전",
    img: "/img/tarotcards/wands-03-three.jpg",
    meaning: {
      love: "관계가 한 단계 넓어질 수 있습니다. 기다리던 연락이나 진전이 보입니다.",
      money: "기다리던 결과가 조금씩 돌아옵니다. 장기적인 시야로 돈을 봐야 합니다.",
      study: "공부한 것이 밖으로 연결됩니다. 발표, 지원, 시험 준비에 좋은 흐름입니다.",
    },
  },
  {
    name: "완드 4",
    keywords: "축하, 안정, 휴식",
    img: "/img/tarotcards/wands-04-four.jpg",
    meaning: {
      love: "편안하고 즐거운 만남에 좋습니다. 관계가 안정되고 기쁜 일이 생길 수 있습니다.",
      money: "작은 보상이나 안정적인 흐름이 있습니다. 무리하지 않고 즐겨도 괜찮습니다.",
      study: "중간 목표를 달성하고 잠시 쉬어가기 좋습니다. 성취감을 느껴보세요.",
    },
  },
  {
    name: "완드 5",
    keywords: "경쟁, 갈등, 도전",
    img: "/img/tarotcards/wands-05-five.jpg",
    meaning: {
      love: "의견 충돌이나 자존심 싸움이 생길 수 있습니다. 이기려 하기보다 조율이 필요합니다.",
      money: "경쟁이 심한 상황입니다. 성급히 뛰어들기보다 내 강점을 확인하세요.",
      study: "비교와 경쟁 때문에 흔들릴 수 있습니다. 다른 사람보다 내 진도에 집중하세요.",
    },
  },
  {
    name: "완드 6",
    keywords: "승리, 인정, 자신감",
    img: "/img/tarotcards/wands-06-six.jpg",
    meaning: {
      love: "자신감 있는 모습이 매력으로 보입니다. 호감 표현이 좋은 반응을 얻을 수 있습니다.",
      money: "성과를 인정받거나 보상을 받을 수 있습니다. 노력한 일이 돈으로 이어집니다.",
      study: "시험, 발표, 평가에서 좋은 흐름입니다. 자신 있게 결과를 보여주세요.",
    },
  },
  {
    name: "완드 7",
    keywords: "방어, 고집, 버팀",
    img: "/img/tarotcards/wands-07-seven.jpg",
    meaning: {
      love: "내 입장을 지켜야 하는 상황입니다. 다만 너무 방어적이면 거리감이 생깁니다.",
      money: "불리해 보여도 버티면 지킬 수 있습니다. 쉽게 포기하지 마세요.",
      study: "어려운 문제 앞에서 버티는 힘이 필요합니다. 포기 직전 한 번 더 보면 풀립니다.",
    },
  },
  {
    name: "완드 8",
    keywords: "속도, 연락, 전개",
    img: "/img/tarotcards/wands-08-eight.jpg",
    meaning: {
      love: "연락이 빠르게 오가고 관계가 급진전될 수 있습니다. 타이밍을 놓치지 마세요.",
      money: "돈의 흐름이 빨라집니다. 빠른 결정이 필요하지만 확인은 꼭 해야 합니다.",
      study: "짧은 시간에 진도를 많이 뺄 수 있습니다. 몰아서 처리하기 좋은 날입니다.",
    },
  },
  {
    name: "완드 9",
    keywords: "경계, 피로, 지속",
    img: "/img/tarotcards/wands-09-nine.jpg",
    meaning: {
      love: "상처 때문에 마음을 쉽게 열지 못할 수 있습니다. 천천히 신뢰를 회복하세요.",
      money: "지출을 막고 방어해야 하는 시기입니다. 마지막 안전선을 지키세요.",
      study: "지쳤지만 조금만 더 버티면 됩니다. 마무리 직전의 집중력이 필요합니다.",
    },
  },
  {
    name: "완드 10",
    keywords: "부담, 책임, 과로",
    img: "/img/tarotcards/wands-10-ten.jpg",
    meaning: {
      love: "관계의 부담을 혼자 짊어질 수 있습니다. 솔직히 나누고 도움을 요청하세요.",
      money: "책임과 지출이 커질 수 있습니다. 줄일 수 있는 부담부터 정리해야 합니다.",
      study: "할 일이 너무 많아 지칠 수 있습니다. 우선순위를 정하고 하나씩 처리하세요.",
    },
  },
  {
    name: "완드 페이지",
    keywords: "호기심, 소식, 시도",
    img: "/img/tarotcards/wands-11-page.jpg",
    meaning: {
      love: "가볍고 풋풋한 관심이 생깁니다. 메시지나 작은 표현이 시작점이 됩니다.",
      money: "작은 부업이나 새 시도를 탐색하기 좋습니다. 아직은 배우는 단계입니다.",
      study: "새로운 과목에 호기심이 생깁니다. 흥미를 붙이는 것이 가장 중요합니다.",
    },
  },
  {
    name: "완드 나이트",
    keywords: "돌진, 열정, 충동",
    img: "/img/tarotcards/wands-12-knight.jpg",
    meaning: {
      love: "뜨겁게 다가가지만 성급할 수 있습니다. 속도를 조금 조절하면 더 좋습니다.",
      money: "빠른 실행은 장점이지만 무리한 베팅은 위험합니다. 충동을 조심하세요.",
      study: "몰아치는 집중력이 있습니다. 단기 목표를 잡고 빠르게 밀어붙이세요.",
    },
  },
  {
    name: "완드 퀸",
    keywords: "매력, 자신감, 주도",
    img: "/img/tarotcards/wands-13-queen.jpg",
    meaning: {
      love: "밝고 당당한 매력이 돋보입니다. 끌려가기보다 자연스럽게 주도하세요.",
      money: "자신의 능력을 드러내면 이득이 됩니다. 협상이나 홍보에도 좋습니다.",
      study: "자기주도 학습에 강합니다. 스스로 계획을 세우면 성과가 큽니다.",
    },
  },
  {
    name: "완드 킹",
    keywords: "리더십, 비전, 결단",
    img: "/img/tarotcards/wands-14-king.jpg",
    meaning: {
      love: "관계를 이끄는 힘이 있습니다. 확실한 태도와 책임감이 매력으로 보입니다.",
      money: "크게 보고 결단하면 기회가 됩니다. 장기 전략이 중요합니다.",
      study: "목표를 직접 정하고 이끌어야 합니다. 리더처럼 계획을 관리하세요.",
    },
  },
  {
    name: "컵 에이스",
    keywords: "감정, 사랑, 시작",
    img: "/img/tarotcards/cups-01-ace.jpg",
    meaning: {
      love: "새로운 감정이 시작됩니다. 고백, 설렘, 따뜻한 만남에 좋은 카드입니다.",
      money: "기분 좋은 제안이나 만족스러운 소비가 있습니다. 감정적 지출은 조심하세요.",
      study: "좋아하는 분야에 몰입이 생깁니다. 흥미가 공부의 출발점이 됩니다.",
    },
  },
  {
    name: "컵 2",
    keywords: "교감, 화합, 만남",
    img: "/img/tarotcards/cups-02-two.jpg",
    meaning: {
      love: "서로 마음이 잘 통합니다. 만남, 화해, 고백에 매우 좋은 흐름입니다.",
      money: "협업이나 1대1 거래가 유리합니다. 신뢰할 수 있는 사람과 함께하세요.",
      study: "스터디 파트너와 공부하면 효과가 큽니다. 서로 설명하며 배우기 좋습니다.",
    },
  },
  {
    name: "컵 3",
    keywords: "기쁨, 모임, 우정",
    img: "/img/tarotcards/cups-03-three.jpg",
    meaning: {
      love: "친구 같은 즐거운 만남이 있습니다. 소개팅이나 모임에서 인연이 생길 수 있습니다.",
      money: "모임 지출이 늘 수 있지만 즐거운 흐름입니다. 사람을 통한 기회도 있습니다.",
      study: "팀 과제와 그룹 공부에 좋습니다. 함께하면 분위기가 살아납니다.",
    },
  },
  {
    name: "컵 4",
    keywords: "권태, 무관심, 고민",
    img: "/img/tarotcards/cups-04-four.jpg",
    meaning: {
      love: "권태나 무관심 때문에 기회를 놓칠 수 있습니다. 마음을 닫고 있지 않은지 보세요.",
      money: "좋은 제안도 시큰둥하게 보일 수 있습니다. 기회를 다시 검토해보세요.",
      study: "집중이 떨어지고 지루함이 큽니다. 공부 장소나 방식을 바꾸면 도움이 됩니다.",
    },
  },
  {
    name: "컵 5",
    keywords: "실망, 후회, 상실",
    img: "/img/tarotcards/cups-05-five.jpg",
    meaning: {
      love: "실망한 마음이 커질 수 있습니다. 잃은 것만 보지 말고 남은 가능성도 봐야 합니다.",
      money: "손실이나 아쉬운 지출이 있을 수 있습니다. 그래도 회복할 방법은 남아 있습니다.",
      study: "틀린 문제나 실패에 오래 머물 수 있습니다. 후회보다 복구가 중요합니다.",
    },
  },
  {
    name: "컵 6",
    keywords: "추억, 과거, 순수",
    img: "/img/tarotcards/cups-06-six.jpg",
    meaning: {
      love: "과거 인연이나 오래된 감정이 떠오릅니다. 순수한 마음으로 다시 볼 일이 생깁니다.",
      money: "예전 방식이나 익숙한 선택에서 힌트를 얻습니다. 과거 경험을 참고하세요.",
      study: "기초 복습이 큰 도움이 됩니다. 예전에 배운 내용을 다시 보면 정리가 됩니다.",
    },
  },
  {
    name: "컵 7",
    keywords: "환상, 선택지, 유혹",
    img: "/img/tarotcards/cups-07-seven.jpg",
    meaning: {
      love: "상상과 현실을 구분해야 합니다. 상대를 이상화하면 판단이 흐려집니다.",
      money: "선택지가 많아 보이지만 실속은 다를 수 있습니다. 허황된 제안을 조심하세요.",
      study: "하고 싶은 것이 많아 집중이 흩어집니다. 하나를 정해서 끝내야 합니다.",
    },
  },
  {
    name: "컵 8",
    keywords: "이별, 포기, 탐색",
    img: "/img/tarotcards/cups-08-eight.jpg",
    meaning: {
      love: "마음이 떠난 관계는 정리가 필요할 수 있습니다. 더 나은 방향을 찾아야 합니다.",
      money: "만족 없는 일이나 소비를 내려놓을 때입니다. 손해보다 방향 전환이 중요합니다.",
      study: "맞지 않는 공부법을 버리고 새 방식을 찾아야 합니다. 이동이 필요한 카드입니다.",
    },
  },
  {
    name: "컵 9",
    keywords: "만족, 소원, 즐거움",
    img: "/img/tarotcards/cups-09-nine.jpg",
    meaning: {
      love: "원하던 감정적 만족을 느낄 수 있습니다. 기분 좋은 만남과 호감이 있습니다.",
      money: "작은 소원 성취나 만족스러운 보상이 있습니다. 즐거운 소비도 가능합니다.",
      study: "작은 성취감이 자신감을 줍니다. 내가 잘하고 있다는 느낌을 받을 수 있습니다.",
    },
  },
  {
    name: "컵 10",
    keywords: "행복, 가족, 완성",
    img: "/img/tarotcards/cups-10-ten.jpg",
    meaning: {
      love: "안정적이고 행복한 관계운입니다. 가족 같은 편안함과 깊은 만족이 있습니다.",
      money: "생활 안정과 만족스러운 흐름이 있습니다. 가족이나 공동체와 관련된 돈도 좋습니다.",
      study: "주변의 응원을 받으며 공부하기 좋습니다. 안정된 환경이 성과를 돕습니다.",
    },
  },
  {
    name: "컵 페이지",
    keywords: "감수성, 메시지, 호감",
    img: "/img/tarotcards/cups-11-page.jpg",
    meaning: {
      love: "귀여운 호감이나 메시지가 올 수 있습니다. 감정 표현이 서툴러도 진심이 있습니다.",
      money: "작은 제안이나 아이디어가 들어옵니다. 현실성 확인은 필요합니다.",
      study: "상상력과 감수성이 필요한 공부에 좋습니다. 흥미를 살려 접근하세요.",
    },
  },
  {
    name: "컵 나이트",
    keywords: "고백, 낭만, 제안",
    img: "/img/tarotcards/cups-12-knight.jpg",
    meaning: {
      love: "로맨틱한 제안이나 고백 운이 있습니다. 다정한 표현이 관계를 움직입니다.",
      money: "감정에 끌린 소비가 생길 수 있습니다. 좋아 보이는 제안도 계산해보세요.",
      study: "흥미가 생기는 주제를 따라가면 잘 됩니다. 감성적인 동기가 도움이 됩니다.",
    },
  },
  {
    name: "컵 퀸",
    keywords: "공감, 배려, 감정",
    img: "/img/tarotcards/cups-13-queen.jpg",
    meaning: {
      love: "깊은 공감과 배려가 관계를 좋게 만듭니다. 상대의 마음을 잘 읽을 수 있습니다.",
      money: "감정적 소비를 조절해야 합니다. 필요한 사람을 돕되 내 기준도 지키세요.",
      study: "이해력과 몰입이 좋아집니다. 감정 기복만 관리하면 공부가 잘 됩니다.",
    },
  },
  {
    name: "컵 킹",
    keywords: "성숙, 안정, 감정조절",
    img: "/img/tarotcards/cups-14-king.jpg",
    meaning: {
      love: "성숙하고 안정적인 감정 표현이 필요합니다. 감정을 다스리면 관계가 깊어집니다.",
      money: "차분한 판단이 돈을 지켜줍니다. 주변 상황에 흔들리지 않는 것이 중요합니다.",
      study: "감정 기복을 잡으면 꾸준히 나아갑니다. 안정적인 페이스를 유지하세요.",
    },
  },
  {
    name: "소드 에이스",
    keywords: "진실, 판단, 명확함",
    img: "/img/tarotcards/swords-01-ace.jpg",
    meaning: {
      love: "솔직한 대화가 필요합니다. 애매한 감정을 명확히 말하면 관계가 정리됩니다.",
      money: "빠르고 정확한 판단이 필요합니다. 숫자와 사실을 기준으로 결정하세요.",
      study: "핵심 개념을 날카롭게 잡기 좋습니다. 정리와 요약이 잘 됩니다.",
    },
  },
  {
    name: "소드 2",
    keywords: "갈등, 보류, 침묵",
    img: "/img/tarotcards/swords-02-two.jpg",
    meaning: {
      love: "마음을 닫고 결정을 미루기 쉽습니다. 대화를 피하면 답도 늦어집니다.",
      money: "두 선택 사이에서 망설일 수 있습니다. 결정 전 정보를 더 확인하세요.",
      study: "무엇부터 해야 할지 정하지 못합니다. 우선순위 하나를 고르는 것이 시작입니다.",
    },
  },
  {
    name: "소드 3",
    keywords: "상처, 이별, 아픔",
    img: "/img/tarotcards/swords-03-three.jpg",
    meaning: {
      love: "상처 주는 말이나 실망이 생길 수 있습니다. 아픈 진실을 피하지 말아야 합니다.",
      money: "손실이나 아쉬운 소식이 있을 수 있습니다. 감정적으로 대응하면 손해가 커집니다.",
      study: "틀린 부분을 인정해야 다음으로 넘어갑니다. 실패 분석이 필요합니다.",
    },
  },
  {
    name: "소드 4",
    keywords: "휴식, 회복, 정지",
    img: "/img/tarotcards/swords-04-four.jpg",
    meaning: {
      love: "잠시 거리를 두고 마음을 회복해야 합니다. 쉬어야 다시 볼 수 있습니다.",
      money: "큰 움직임보다 재정비가 좋습니다. 지출을 멈추고 상황을 점검하세요.",
      study: "휴식이 필요한 카드입니다. 잠깐 멈춘 뒤 다시 시작하면 효율이 오릅니다.",
    },
  },
  {
    name: "소드 5",
    keywords: "패배, 다툼, 이기심",
    img: "/img/tarotcards/swords-05-five.jpg",
    meaning: {
      love: "이기려는 말싸움은 관계를 해칩니다. 이겨도 마음은 멀어질 수 있습니다.",
      money: "이득을 봐도 뒤끝이 남을 수 있습니다. 무리한 경쟁과 계산을 조심하세요.",
      study: "경쟁심이 독이 될 수 있습니다. 남을 이기기보다 내 약점을 보완하세요.",
    },
  },
  {
    name: "소드 6",
    keywords: "이동, 회복, 전환",
    img: "/img/tarotcards/swords-06-six.jpg",
    meaning: {
      love: "힘든 흐름에서 조금씩 벗어납니다. 관계가 더 나은 방향으로 이동합니다.",
      money: "불안정한 상태가 서서히 안정됩니다. 환경을 바꾸면 돈 흐름도 나아집니다.",
      study: "공부 환경을 바꾸면 도움이 됩니다. 막힌 상태에서 벗어나는 카드입니다.",
    },
  },
  {
    name: "소드 7",
    keywords: "속임수, 전략, 회피",
    img: "/img/tarotcards/swords-07-seven.jpg",
    meaning: {
      love: "숨기는 말이나 애매한 태도를 조심해야 합니다. 솔직하지 않으면 문제가 됩니다.",
      money: "편법이나 꼼수는 위험합니다. 계약과 조건을 꼼꼼히 확인하세요.",
      study: "요령만 찾다가 기본을 놓칠 수 있습니다. 정직하게 실력을 쌓아야 합니다.",
    },
  },
  {
    name: "소드 8",
    keywords: "제한, 두려움, 갇힘",
    img: "/img/tarotcards/swords-08-eight.jpg",
    meaning: {
      love: "스스로 만든 불안에 갇힐 수 있습니다. 생각보다 선택지는 남아 있습니다.",
      money: "방법이 없어 보이지만 완전히 막힌 것은 아닙니다. 작은 해결책부터 찾으세요.",
      study: "못한다는 생각이 공부를 막습니다. 쉬운 문제부터 풀며 자신감을 회복하세요.",
    },
  },
  {
    name: "소드 9",
    keywords: "걱정, 불안, 악몽",
    img: "/img/tarotcards/swords-09-nine.jpg",
    meaning: {
      love: "걱정이 실제보다 커질 수 있습니다. 혼자 상상하지 말고 확인이 필요합니다.",
      money: "돈 걱정이 판단을 흐릴 수 있습니다. 숫자로 정리하면 불안이 줄어듭니다.",
      study: "불안과 수면 부족이 문제입니다. 컨디션을 회복해야 공부도 됩니다.",
    },
  },
  {
    name: "소드 10",
    keywords: "끝, 절망, 내려놓음",
    img: "/img/tarotcards/swords-10-ten.jpg",
    meaning: {
      love: "힘든 국면이 끝에 가까워졌습니다. 붙잡기보다 정리하고 회복해야 합니다.",
      money: "최악은 지나가고 있습니다. 손실을 인정하고 복구 계획을 세우세요.",
      study: "실패를 끝으로 보고 다시 시작해야 합니다. 무너진 계획을 새로 짜세요.",
    },
  },
  {
    name: "소드 페이지",
    keywords: "관찰, 정보, 질문",
    img: "/img/tarotcards/swords-11-page.jpg",
    meaning: {
      love: "상대의 행동을 관찰하게 됩니다. 섣부른 판단보다 질문과 확인이 필요합니다.",
      money: "정보 수집이 먼저입니다. 돈을 움직이기 전에 조건을 더 알아보세요.",
      study: "질문하고 찾아보는 태도가 좋습니다. 궁금한 것을 그냥 넘기지 마세요.",
    },
  },
  {
    name: "소드 나이트",
    keywords: "돌파, 논쟁, 속도",
    img: "/img/tarotcards/swords-12-knight.jpg",
    meaning: {
      love: "말이 빨라지고 상대를 몰아붙일 수 있습니다. 속도보다 배려가 필요합니다.",
      money: "빠른 판단은 좋지만 공격적인 선택은 조심하세요. 급하게 움직이면 실수합니다.",
      study: "단숨에 파고드는 집중력이 있습니다. 어려운 문제를 돌파하기 좋습니다.",
    },
  },
  {
    name: "소드 퀸",
    keywords: "냉정, 분석, 독립",
    img: "/img/tarotcards/swords-13-queen.jpg",
    meaning: {
      love: "감정에 휘둘리지 않는 선 긋기가 필요합니다. 냉정하지만 솔직한 태도가 좋습니다.",
      money: "분석력이 돈을 지켜줍니다. 필요 없는 지출을 정확히 잘라내세요.",
      study: "논리와 정리가 강해집니다. 개념을 구조화하면 성과가 납니다.",
    },
  },
  {
    name: "소드 킹",
    keywords: "판단, 권위, 논리",
    img: "/img/tarotcards/swords-14-king.jpg",
    meaning: {
      love: "명확한 기준과 책임 있는 대화가 중요합니다. 감정보다 원칙을 세우세요.",
      money: "전략적으로 판단하면 좋은 결정을 합니다. 큰돈일수록 계획이 필요합니다.",
      study: "계획, 분석, 시험 전략에 강합니다. 머리로 정리하고 체계적으로 움직이세요.",
    },
  },
  {
    name: "펜타클 에이스",
    keywords: "기회, 돈, 현실",
    img: "/img/tarotcards/pentacles-01-ace.jpg",
    meaning: {
      love: "현실적으로 안정된 인연이 들어올 수 있습니다. 오래 갈 가능성을 봐야 합니다.",
      money: "새로운 수입, 선물, 일자리 기회가 있습니다. 현실적인 이득이 보입니다.",
      study: "기초를 다지기 좋은 시작입니다. 작은 성과가 장기 실력으로 이어집니다.",
    },
  },
  {
    name: "펜타클 2",
    keywords: "균형, 조절, 변화",
    img: "/img/tarotcards/pentacles-02-two.jpg",
    meaning: {
      love: "관계와 일상의 균형을 맞춰야 합니다. 한쪽으로 치우치면 피곤해집니다.",
      money: "수입과 지출을 유연하게 조절해야 합니다. 우선순위가 중요합니다.",
      study: "여러 과목을 동시에 관리해야 합니다. 시간 배분을 잘하면 버틸 수 있습니다.",
    },
  },
  {
    name: "펜타클 3",
    keywords: "협업, 기술, 평가",
    img: "/img/tarotcards/pentacles-03-three.jpg",
    meaning: {
      love: "함께 맞춰가며 관계를 쌓는 흐름입니다. 서로의 노력이 중요합니다.",
      money: "협업과 실력이 수입으로 이어집니다. 평가받는 자리에서 좋은 결과가 있습니다.",
      study: "피드백을 받으면 실력이 빨리 늡니다. 혼자보다 함께 배우는 것이 좋습니다.",
    },
  },
  {
    name: "펜타클 4",
    keywords: "소유, 절약, 집착",
    img: "/img/tarotcards/pentacles-04-four.jpg",
    meaning: {
      love: "상대를 소유하려 하거나 마음을 너무 닫을 수 있습니다. 여유가 필요합니다.",
      money: "아끼는 힘은 좋지만 지나친 집착은 흐름을 막습니다. 필요한 투자도 봐야 합니다.",
      study: "아는 방식만 고집할 수 있습니다. 새로운 풀이법을 받아들이면 좋아집니다.",
    },
  },
  {
    name: "펜타클 5",
    keywords: "부족, 고립, 어려움",
    img: "/img/tarotcards/pentacles-05-five.jpg",
    meaning: {
      love: "외로움이나 부족함을 느낄 수 있습니다. 혼자 견디기보다 도움을 요청하세요.",
      money: "금전 압박이 있을 수 있습니다. 지출을 줄이고 현실적인 지원을 찾아야 합니다.",
      study: "혼자 끙끙대면 더 어려워집니다. 질문하거나 도움을 받아야 합니다.",
    },
  },
  {
    name: "펜타클 6",
    keywords: "나눔, 지원, 균형",
    img: "/img/tarotcards/pentacles-06-six.jpg",
    meaning: {
      love: "주고받는 균형이 중요합니다. 한쪽만 베푸는 관계는 조정이 필요합니다.",
      money: "도움, 지원, 보너스 같은 흐름이 있습니다. 나눔과 균형이 돈운을 좋게 합니다.",
      study: "가르치거나 배우며 함께 성장합니다. 도움을 주고받는 공부가 좋습니다.",
    },
  },
  {
    name: "펜타클 7",
    keywords: "기다림, 투자, 성장",
    img: "/img/tarotcards/pentacles-07-seven.jpg",
    meaning: {
      love: "관계가 천천히 자랍니다. 당장 답을 요구하기보다 시간을 두고 보세요.",
      money: "투자한 만큼 결과가 늦게 나옵니다. 조급해하지 말고 과정을 점검하세요.",
      study: "바로 성적이 오르지 않아도 누적되고 있습니다. 꾸준함을 믿어야 합니다.",
    },
  },
  {
    name: "펜타클 8",
    keywords: "노력, 반복, 숙련",
    img: "/img/tarotcards/pentacles-08-eight.jpg",
    meaning: {
      love: "성실한 태도가 신뢰를 만듭니다. 화려함보다 꾸준함이 관계를 키웁니다.",
      money: "일한 만큼 버는 정직한 흐름입니다. 기술을 갈고닦으면 수입이 늘어납니다.",
      study: "반복 연습과 문제풀이에 가장 좋습니다. 꾸준히 쌓으면 확실히 늡니다.",
    },
  },
  {
    name: "펜타클 9",
    keywords: "풍요, 독립, 여유",
    img: "/img/tarotcards/pentacles-09-nine.jpg",
    meaning: {
      love: "혼자서도 충분히 빛나는 상태입니다. 자존감이 올라가 매력이 커집니다.",
      money: "노력의 보상과 여유가 생길 수 있습니다. 독립적인 수입 관리에 좋습니다.",
      study: "자기관리와 독학 능력이 빛납니다. 혼자 계획을 지켜 성과를 냅니다.",
    },
  },
  {
    name: "펜타클 10",
    keywords: "자산, 가족, 안정",
    img: "/img/tarotcards/pentacles-10-ten.jpg",
    meaning: {
      love: "장기적으로 안정된 관계를 기대할 수 있습니다. 가족이나 미래 이야기에 좋습니다.",
      money: "자산, 저축, 장기 재정에 좋은 카드입니다. 안정된 기반을 만들 수 있습니다.",
      study: "긴 목표를 완성하는 힘이 있습니다. 꾸준히 해온 공부가 결실을 맺습니다.",
    },
  },
  {
    name: "펜타클 페이지",
    keywords: "공부, 기초, 가능성",
    img: "/img/tarotcards/pentacles-11-page.jpg",
    meaning: {
      love: "천천히 알아가는 현실적인 호감입니다. 작지만 진지한 관심이 있습니다.",
      money: "돈 공부나 저축을 시작하기 좋습니다. 작은 금액부터 관리하세요.",
      study: "기초 개념을 배우기에 좋습니다. 성실하게 시작하면 가능성이 큽니다.",
    },
  },
  {
    name: "펜타클 나이트",
    keywords: "성실, 꾸준함, 책임",
    img: "/img/tarotcards/pentacles-12-knight.jpg",
    meaning: {
      love: "느리지만 믿을 수 있는 관계입니다. 성실한 태도가 진심을 보여줍니다.",
      money: "꾸준한 관리가 가장 큰 이득입니다. 빠른 돈보다 안정된 돈이 맞습니다.",
      study: "매일 반복하는 루틴이 성과를 만듭니다. 느려도 멈추지 않는 것이 중요합니다.",
    },
  },
  {
    name: "펜타클 퀸",
    keywords: "돌봄, 안정, 실속",
    img: "/img/tarotcards/pentacles-13-queen.jpg",
    meaning: {
      love: "편안하고 돌보는 관계운입니다. 상대에게 안정감을 줄 수 있습니다.",
      money: "생활 재정과 실속 관리에 강합니다. 현실적인 소비가 돈을 지켜줍니다.",
      study: "안정된 환경에서 공부가 잘 됩니다. 몸과 마음을 챙기면 집중이 좋아집니다.",
    },
  },
  {
    name: "펜타클 킹",
    keywords: "성공, 재산, 현실감",
    img: "/img/tarotcards/pentacles-14-king.jpg",
    meaning: {
      love: "책임감 있고 안정적인 관계를 뜻합니다. 현실적인 미래를 생각하기 좋습니다.",
      money: "재정 안정과 큰 성과를 기대할 수 있습니다. 실속 있는 선택이 돈을 키웁니다.",
      study: "현실적인 목표를 세우면 확실히 이룹니다. 결과 중심의 공부 전략이 좋습니다.",
    },
  },
];

const Tratot_simple: React.FC = () => {
  const mode = import.meta.env.MODE;
  const [categories] = useState<Category[]>(["love", "money", "study"]);
  const [tarotCards] = useState<TarotCard[]>(initialTarotCards);
  const [selectedCategory, setSelectedCategory] = useState<Category>("love");

  return (
    <main style={{ padding: "32px", maxWidth: "960px", margin: "0 auto" }}>
      <h1>Tarot Simple</h1>
      <p>mode: {mode}</p>

      <section>
  <h2>카테고리 선택</h2>

  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value as Category)}
    style={{
      padding: "8px",
      fontSize: "16px",
      borderRadius: "6px",
      border: "1px solid #ccc",
    }}
  >
    {categories.map((category) => (
      <option key={category} value={category}>
        {categoryLabels[category]}
      </option>
    ))}
  </select>

  <p>선택한 카테고리: {selectedCategory}</p>
  <p>화면 표시 이름: {categoryLabels[selectedCategory]}</p>
</section>

      <section>
        <h2>자료구조화된 카드 목록: {tarotCards.length}장</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "12px",
          }}
        >
          {tarotCards.map((card) => (
            <article
              key={card.img}
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#fff",
              }}
            >
              <img
                src={card.img}
                alt={card.name}
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "2 / 3.4",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
              <h3 style={{ margin: "8px 0 4px" }}>{card.name}</h3>
              <p style={{ margin: "0 0 8px" }}>keywords: {card.keywords}</p>
              <pre
                style={{
                  margin: 0,
                  padding: "8px",
                  overflow: "auto",
                  fontSize: "11px",
                  background: "#f6f6f6",
                  borderRadius: "6px",
                }}
              >
                {JSON.stringify(card, null, 2)}
              </pre>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export { initialTarotCards };
export default Tratot_simple;
