/**
 * 리크루팅 페이지에서 시즌마다 바뀔 수 있는 카피·일정·에셋 경로를 한곳에서 관리합니다.
 */

export const recruitingAssets = {
  heroLogoBackground: '/img/recruit/logo.png',
  angleBracket: '/img/recruit/anglebracket.svg',
} as const;

export const recruitingBrand = {
  name: 'UOSLIFE',
  /** 예: 7기 모집 */
  cohortLabel: '6기 모집',
} as const;

export const recruitingCallToAction = {
  applyFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeBv_mC-gD4WdQAbYZ6RPHDmuiHLey44AaU5XBeDgxLkSqcKQ/viewform',
  notifyFormUrl: 'http://forms.gle/JntWWCzKjzRwZbaJ7',
  notifyLabel: '다음 모집 알림 받기',
} as const;

/** 지원하기 버튼 라벨 — `cohortLabel`(예: `6기 모집`)과 단일 소스 */
export function recruitingApplyButtonLabel(): string {
  return `${recruitingBrand.cohortLabel.replace(/\s*모집\s*$/, '').trim()} 지원하기`;
}

/**
 * 일정·히어로 등 모든 노출 일자의 단일 소스.
 * 표기 형식: `M월 D일(요일)` — 요일 없는 짧은 문구는 `recruitingDateWithoutWeekday`로 파생합니다.
 */
export const recruitingDates = {
  documentSubmission: {
    open: '5월 4일(월)',
    due: '5월 10일(일)',
    dueTimeNote: '오후 11시 59분 까지',
  },
  firstRoundResult: '5월 17일(일)',
  secondInterview: {
    start: '5월 27일(수)',
    end: '5월 30일(토)',
  },
  finalResult: '5월 31일(일)',
  onboarding: '6월 27일(토)',
  workshop: {
    start: '7월 11일(토)',
    end: '7월 12일(일)',
  },
} as const;

/**
 * 서류 접수(`documentSubmission`) 일정이 적용되는 연도 — 한국 시간(KST) 기준 달력 연도.
 * 매 모집 시즌 바뀔 때 월·일과 함께 이 값도 맞춰 수정합니다.
 */
export const recruitingApplicationSeasonYear = 2026;

function parseMonthDayFromRecruitingLabel(label: string): { month: number; day: number } {
  const matched = label.match(/(\d+)\s*월\s*(\d+)\s*일/);
  if (!matched) {
    throw new Error(`Invalid recruiting date label: ${label}`);
  }
  return { month: Number(matched[1]), day: Number(matched[2]) };
}

/** 한국 시간 시·분을 해당 순간의 UTC `Date`로 변환 */
function recruitingInstantKST(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
  ms = 0,
): Date {
  const pad = (n: number) => String(n).padStart(2, '0');
  const msStr = String(ms).padStart(3, '0');
  return new Date(`${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}.${msStr}+09:00`);
}

/**
 * 현재 시각이 서류 접수 기간 안인지 — 시작일 00:00 ~ 마감일 23:59:59.999 KST.
 * `recruitingDates.documentSubmission`과 `recruitingApplicationSeasonYear`만 수정하면 버튼 분기가 따라갑니다.
 */
export function isRecruitingApplicationActive(now: Date = new Date()): boolean {
  const year = recruitingApplicationSeasonYear;
  const { month: openM, day: openD } = parseMonthDayFromRecruitingLabel(recruitingDates.documentSubmission.open);
  const { month: dueM, day: dueD } = parseMonthDayFromRecruitingLabel(recruitingDates.documentSubmission.due);
  const start = recruitingInstantKST(year, openM, openD, 0, 0, 0, 0);
  const end = recruitingInstantKST(year, dueM, dueD, 23, 59, 59, 999);
  const t = now.getTime();
  return t >= start.getTime() && t <= end.getTime();
}

/** `11월 24일(월)` → `11월 24일` — 히어로 기간 문구 등에 사용 */
export function recruitingDateWithoutWeekday(dayLabel: string): string {
  return dayLabel.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

/** 히어로(Section01) — 서류 접수 일정과 동일 소스 */
export const recruitingPeriod = {
  rangeStartLabel: `${recruitingDateWithoutWeekday(recruitingDates.documentSubmission.open)}부터`,
  rangeEndLabel: `${recruitingDateWithoutWeekday(recruitingDates.documentSubmission.due)}까지`,
} as const;

/** Section04 상단 헤드라인 */
export const recruitingHeadline = {
  lines: ['IT 기술을 통해', '서울시립대학교 구성원을', '연결하는 프로덕트를'] as const,
  lastLinePrefix: '만들어갈 인재를 ',
  lastLineSuffix: '모집합니다.',
} as const;

export const recruitingTargetAudience = {
  sectionTitle: '모집 대상',
  primaryTitle: 'IT 서비스에 관심 있는 서울시립대학교 재학생 및 졸업생',
  primaryNote: '졸업생의 경우, 졸업 후 0~2년 재직자에 한함',
  durationRequirement: '최소 1년(2학기) 이상 활동할 수 있는 사람',
} as const;

export const recruitingSectionTitles = {
  fields: { line1: '모집 분야 및', line2: '우대 사항' },
  schedule: '모집 일정',
} as const;

/** Section02 — Team / 시너자이즈 / 멘토 */
export const recruitingSection02 = {
  learnMoreHref: '/' as const,
  learnMoreLabel: '시대생 자세히 알아보기',
  teamHeading: 'Team UOSLIFE',
  introParagraphs: [
    'UOSLIFE(시대생)는 서울시립대학교 학우들에게 편리하고 즐거운 학교생활을 위한 서비스를 만들어가는 IT 소프트웨어 동아리입니다. 시대생 앱을 운영하며 시간표, 공지사항, 시대팅 등 대학 생활을 위한 다양한 서비스를 제공하고 있습니다.',
    '2026년에는 대학 생활의 본질적 가치를 확장하는 새로운 기능과 경험을 선보이며, 학우들의 일상 속에 더욱 깊이 스며드는 플랫폼으로 성장할 것입니다. 아울러 구성원들이 자율적으로 협업하고 함께 배우는 문화를 바탕으로, 캠퍼스 내에서 지속 가능한 IT 생태계를 만들어 나가고자 합니다.',
  ],
  synergizeHeadingLine1: 'Synergize',
  synergizeHeadingLine2: 'with Alumni',
  synergizeParagraphs: [
    '샌프란시스코 실리콘밸리의 성공 배경에는, Pay it forward라 불리는 IT 업계 선후배 사이의 멘토 문화가 핵심으로 자리 잡고 있습니다.',
    '그리고 UOSLIFE는 업계 다방면에서 활동하는 선배들과 직접 소통하며 성장할 수 있는 곳입니다.',
    "'UOSLIFE'는 5년 전 시작한 시대생 앱을 시작으로 선후배가 함께 어우러져 다양한 IT 서비스를 운영하고 있습니다.",
  ],
  mentors: [
    { company: '네이버', name: '정인우', role: 'Back-end Engineer', src: '/img/recruit/mentor1.svg' },
    { company: '카카오페이', name: '김나연', role: 'Back-end Engineer', src: '/img/recruit/mentor2.svg' },
    { company: '미리디', name: '조종빈', role: 'Front-end Engineer', src: '/img/recruit/mentor3.svg' },
    { company: 'SKT', name: '배서현', role: 'Infra Engineer', src: '/img/recruit/mentor4.svg' },
    { company: '리멤버', name: '김은서', role: 'Product Manager', src: '/img/recruit/mentor5.svg' },
    { company: 'PwC컨설팅', name: '문정민', role: 'Consultant', src: '/img/recruit/mentor6.svg' },
    { company: '그릿스탠다드', name: '정희윤', role: 'UXUI Designer', src: '/img/recruit/mentor7.svg' },
    { company: '에코마케팅', name: '우채윤', role: 'Marketer', src: '/img/recruit/mentor8.svg' },
  ],
} as const;

/** Section03 — Alumni Network 로고 캐러셀 */
export const recruitingSection03 = {
  title: 'Alumni Network',
  description:
    '네이버, 카카오페이, 라인, 리멤버 등 국내 최고의 IT 회사부터 SKT, 현대자동차, NH투자증권, 한국은행 등 유수의 대기업/금융권까지',
  descriptionContinued:
    '다양한 업계의 구성원이 지속적인 시너지를 주고 받을 수 있는 관계를 만들어갑니다.',
  logoSvgCount: 11,
  carousel: {
    desktop: { tilePx: 200, gapPx: 20, loopTiles: 9, durationSec: 20 },
    mobileRow1: { tilePx: 120, gapPx: 12, loopTiles: 5, durationSec: 15 },
    mobileRow2: { tilePx: 120, gapPx: 12, loopTiles: 4, durationSec: 15 },
  },
} as const;

/** Section04 모집 분야 상세 블록 라벨 */
export const recruitingFieldDetailLabels = {
  responsibilitiesHeading: '하는 일',
  partnerHeading: '이런 사람과 함께 하고 싶어요',
} as const;

export type RecruitingFieldWithItem = string | { readonly kind: 'bullet'; readonly text: string };

export type RecruitingFieldSubRole = {
  readonly subrole: string;
  readonly do: readonly string[];
  readonly with: readonly RecruitingFieldWithItem[];
};

export type RecruitingFieldRole =
  | {
      readonly role: string;
      readonly type: 'one';
      readonly do: readonly string[];
      readonly with: readonly RecruitingFieldWithItem[];
    }
  | {
      readonly role: string;
      readonly type: 'two';
      readonly content: readonly RecruitingFieldSubRole[];
    };

export const recruitingRoles: RecruitingFieldRole[] = [
  {
    role: '기획자',
    type: 'one',
    do: [
      '기획 챕터는 프로덕트 출시 관련 계획, 일정 수립 등을 조직 차원에서 고민하고 결정해요.',
      '우리가 개선해야 할 문제점은 무엇인지, 사용자에게 필요한 것이 무엇인지 고민하고 그에 맞는 해결 방법을 제시해요.',
    ],
    with: [
      '사용자 관점에서 접근하고, 문제를 해결하기 위해 주도적으로 실행한 경험이 있으신 분',
      '데이터를 수집하고 다각도에서 유저를 분석하는 것에 관심이 있으신 분',
    ],
  },
  {
    role: '디자이너',
    type: 'one',
    do: [
      '디자인 챕터는 사용자가 우리 서비스를 재미있고 편하게 이용할 수 있도록 웹/앱을 설계하고, 직관적인 UI 경험을 만들어갑니다.',
      '기획팀과 협업해 사용자의 불편을 직접 확인하고, 이를 해결할 수 있는 UI 아이디어를 고민하고 빠르게 시도합니다.',
    ],
    with: [
      'Figma 또는 Adobe Illustrator 사용이 가능하신 분',
      '‘내 취향’이 아닌 사용자가 원하는 것을 탐구하고 실험하시는 분',
      '왜 이렇게 디자인했는지에 대한 논리와 근거를 바탕으로 작업하는 분',
      '다양한 웹/앱 사례를 살펴보고 우리 서비스에 가장 적합한 UI를 찾아 적용하시는 분',
    ],
  },
  {
    role: '개발자',
    type: 'two',
    content: [
      {
        subrole: 'Front-End',
        do: [
          '사용자에게 가장 먼저 보이는 화면을 만들고, 더 나은 경험을 설계하는 일을 합니다.',
          'React, TypeScript, Next.js 등 모던 자바스크립트 프레임워크·라이브러리을 통해 서비스를 구현합니다',
          '디자인과 사용자 경험(UX)을 고려한 개발을 통해 ‘보이는 기술’을 만드는 팀입니다.',
        ],
        with: [
          '새로운 기술을 배우는 걸 즐기고, 스스로 성장에 열정이 있는 분',
          '코드뿐 아니라 사용자 경험(UX)에도 관심이 많은 분',
          '완성도 높은 결과물을 위해 세세한 디테일을 놓치지 않는 분',
          '아래 기술 스택에 익숙하신 분',
          { kind: 'bullet', text: 'React (Vite) / Javascript(Typescript)' },
        ],
      },
      {
        subrole: 'Back-End',
        do: [
          '신규 기능을 설계 → 개발 → 배포까지 end-to-end로 경험해요.',
          '현업 BE 선배들과 코드 리뷰/소통으로 함께 성장해요.',
          '실제 운영 사례를 포트폴리오로 남길 수 있어요.',
        ],
        with: [
          '비 개발자와도 커뮤니케이션이 원활하신 분',
          '디자인 패턴, 아키텍처에 대해 고민해 본 경험이 있으면 좋아요.',
          '아래 기술 스택에 익숙하신 분',
          { kind: 'bullet', text: 'Kotlin(or Java) / Spring Boot / RDBMS(예: PostgreSQL, MySQL)' },
        ],
      },
    ],
  },
  {
    role: '마케터',
    type: 'one',
    do: [
      '마케팅 챕터는 서비스의 가치를 알리고, 서비스의 Growth를 실현하는 역할을 맡고 있어요.',
      'SNS, 팀 페이지의 콘텐츠 기획 및 운영을 통해 서비스 인지도와 브랜드 이미지를 강화해요.',
      'CRM 활동(App Push 등)을 통해 유저의 재방문과 유지율을 높여요.',
    ],
    with: [
      '온∙오프라인 마케팅 방안에 대한 다양한 아이디어와 실행 및 제작 능력이 있으신 분',
      '유저 여정과 지표 분석에 관심이 많거나, 서비스 성장을 고민하고 싶은 분',
    ],
  },
];

/** `{기수}와 활동을 함께할 멘토` — Section02 */
export function recruitingMentorSectionHeading(): string {
  const cohort = recruitingBrand.cohortLabel.replace(/\s*모집\s*$/, '').trim();
  return `${cohort}와 활동을 함께할 멘토`;
}

/** Section05 FAQ */
export const recruitingFaqSectionTitle = '자주 묻는 질문';

export const recruitingFaqItems: ReadonlyArray<{ question: string; answer: readonly string[] }> = [
  {
    question: 'Q. 시대생 앱은 어떻게 생겨 났나요?',
    answer: [
      '2020년 5월, 코로나19로 인한 서울시립대학교의 동문 단절로 인한 문제를 해결하고자 학부생 4명이 모여 시작했습니다.',
      '비대면 수업 지원, 코로나 학번의 소통 단절, 동문 연결의 부재 등 서울시립대 내의 연결이 필요한 모든 영역을 IT 기술을 통해 해결하고 혁신하고자 했고, 그 결과 서울시립대의 대표 IT 프로덕트 시대생과 UOSLIFE 동아리가 탄생했습니다.',
      'UOSLIFE는 IT 업계를 희망하는 재학생부터, 현직 주니어로 있는 졸업생들까지 서로의 고민을 공유하고 도우며 이제는 교내를 넘어 국내 IT 업계 최고의 엘리트 공동체로 성장하고자 하는 비전을 갖고 있습니다.',
    ],
  },
  {
    question: 'Q. 정기 모임은 언제, 어디서 하나요?',
    answer: [
      'UOSLIFE는 격주 목요일 저녁 7시 30분에 정기 팀 회의를 진행하고 있습니다. 팀 회의는 각 TF의 활동 공유&친목 도모를 위해 진행되며 가벼운 뒤풀이가 있을 수 있습니다.',
      '매 방학 시즌에는 신규 기능 개발 프로젝트를 진행하며, 이 경우 격주 토요일에 전일(10AM.-10PM.)으로 모여 코어 타임을 갖고 있습니다. 이번 겨울 프로젝트는 1/3(토)를 기점으로 진행될 예정입니다.',
      '*모든 모임은 오프라인 대면으로 진행되고 있으며 프로젝트 상황에 따라 달라질 수 있습니다.',
    ],
  },
  {
    question: 'Q. 졸업생도 지원이 가능한가요?',
    answer: [
      '1년간 꾸준히 활동할 수 있고 배우고자 하는 열의가 충분하다면, 누구든 지원이 가능합니다. 현재도 재학생, 휴학생, 졸업생 중 활발히 활동하시는 분들이 계십니다.',
      '하지만, 매월 둘째 주, 넷째 주에 진행하는 정기 회의 (목요일 7시 30분)와 방학 기간 동안의 *프로젝트 코어 타임은 반드시 참여해야 한다는 점은 꼭 숙지해 주세요!',
      '*프로젝트 코어 타임: 1월 3일부터 격주 토요일 전일',
    ],
  },
  {
    question: 'Q. 실력이 뛰어난 사람만 지원할 수 있나요?',
    answer: [
      'UOSLIFE에서는 1년간 꾸준히 활동할 수 있는지, 그리고 성장하고자 하는 의지가 충분한지를 가장 중요하게 생각합니다.',
      '그러나 교육보다는 프로젝트 진행 중심이기에 내부 현직 특강, 기초 교육 외에는 별도의 체계적인 교육 커리큘럼을 진행하고 있지 않습니다. 따라서, 동아리 활동 외에도 개인적인 노력이 함께 되어야 함을 알아주시길 바랍니다.',
    ],
  },
  {
    question: 'Q. UOSLIFE Alummi (졸업생 및 동문)도 함께 활동하나요?',
    answer: [
      '네, 함께 활동합니다. 학기에 따라 다르지만 UOSLIFE 동아리를 졸업한 Alumni들도 지속적으로 활동하고 있습니다.',
      '방학 프로젝트 및 현직자 특강 등을 통해 재학생들의 성장을 지원하고, 내부 네트워킹 및 현직자 모임을 통해 지속적으로 교류하고 있습니다.',
    ],
  },
];

/** Section06 — 모집 종료 안내 */
export const recruitingSection06 = {
  headlineLine1: '모집 기간이',
  headlineLine2: '종료되었어요',
  description: '다음 모집 알림을 받으면 빠르게 지원할 수 있어요!',
} as const;

/** Section07 — 문의 카드 */
export const recruitingSection07 = {
  headlineLine1: '더 궁금한 게 있다면',
  headlineLine2: '아래를 통해 문의해 주세요',
  kakaoHref: 'https://pf.kakao.com/_gMEHK',
  kakaoCardTitleSuffix: '에 궁금한 점이나 의견이 있다면?',
  kakaoCardLinkLabel: '시대생 카카오톡 채널 바로가기',
  instagramHref: 'https://www.instagram.com/uoslife_official/',
  instagramCardTitleSuffix: '의 실시간 소식을 알고 싶다면?',
  instagramCardLinkLabel: '시대생 인스타그램 바로가기',
  brandAccentName: 'UOSLIFE',
} as const;

export type RecruitingScheduleEntry =
  | {
      kind: 'documentSubmission';
      title: string;
      openDate: string;
      dueDate: string;
      dueTimeNote: string;
    }
  | {
      kind: 'singleDay';
      title: string;
      date: string;
      footnote?: string;
    }
  | {
      kind: 'dateRange';
      title: string;
      startDate: string;
      endDate: string;
      footnote?: string;
    };

export const recruitingSchedule: RecruitingScheduleEntry[] = [
  {
    kind: 'documentSubmission',
    title: '1차 서류 모집',
    openDate: recruitingDates.documentSubmission.open,
    dueDate: recruitingDates.documentSubmission.due,
    dueTimeNote: recruitingDates.documentSubmission.dueTimeNote,
  },
  {
    kind: 'singleDay',
    title: '1차 결과 발표',
    date: recruitingDates.firstRoundResult,
  },
  {
    kind: 'dateRange',
    title: '2차 대면 면접',
    startDate: recruitingDates.secondInterview.start,
    endDate: recruitingDates.secondInterview.end,
    footnote: '*면접 일정 및 장소는 추후 안내',
  },
  {
    kind: 'singleDay',
    title: '최종 결과 발표',
    date: recruitingDates.finalResult,
    footnote: '*개별 안내 예정',
  },
  {
    kind: 'singleDay',
    title: '합격자 온보딩',
    date: recruitingDates.onboarding,
  },
  {
    kind: 'dateRange',
    title: '합격자 워크샵',
    startDate: recruitingDates.workshop.start,
    endDate: recruitingDates.workshop.end,
    footnote: '*1박 2일 참여 필수',
  },
];
