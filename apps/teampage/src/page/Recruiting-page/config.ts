/**
 * 리크루팅 페이지에서 시즌마다 바뀔 수 있는 카피·일정·에셋 경로를 한곳에서 관리합니다.
 */

export const recruitingAssets = {
  heroLogoBackground: '/img/recruit/hero-7th.png',
  angleBracket: '/img/recruit/anglebracket.svg',
} as const;

export const recruitingBrand = {
  name: 'UOSLIFE',
  /** 예: 7기 모집 */
  cohortLabel: '7기 모집',
} as const;

export const recruitingCallToAction = {
  applyFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeYQLw0Qs2fzp59UsB1vtODDOw1k-uEBA2yM9iHDsQrs1dVaw/viewform?usp=dialog',
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
    open: '11월 9일(월)',
    due: '11월 19일(목)',
    dueTimeNote: '오후 11시 59분까지',
  },
  firstRoundResult: '11월 20일(금)',
  secondInterview: {
    start: '11월 23일(월)',
    end: '11월 29일(일)',
  },
  finalResult: '12월 1일(화)',
  onboardingWorkshop: '일정 및 장소는 추후 안내 예정',
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
  return recruitingApplicationPhase(now) === 'active';
}

export type RecruitingApplicationPhase = 'upcoming' | 'active' | 'ended';

/** 서류 접수 기준 모집 단계 — 시작 전(upcoming) / 접수 중(active) / 마감 후(ended), KST 기준 */
export function recruitingApplicationPhase(now: Date = new Date()): RecruitingApplicationPhase {
  const year = recruitingApplicationSeasonYear;
  const { month: openM, day: openD } = parseMonthDayFromRecruitingLabel(recruitingDates.documentSubmission.open);
  const { month: dueM, day: dueD } = parseMonthDayFromRecruitingLabel(recruitingDates.documentSubmission.due);
  const start = recruitingInstantKST(year, openM, openD, 0, 0, 0, 0);
  const end = recruitingInstantKST(year, dueM, dueD, 23, 59, 59, 999);
  const t = now.getTime();
  if (t < start.getTime()) return 'upcoming';
  if (t <= end.getTime()) return 'active';
  return 'ended';
}

/** `11월 24일(월)` → `11월 24일` — 히어로 기간 문구 등에 사용 */
export function recruitingDateWithoutWeekday(dayLabel: string): string {
  return dayLabel.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

/** KST 기준 월로 다가올 방학을 여름/겨울 중 하나로 — 3~8월이면 여름, 나머지는 겨울 */
export function recruitingVacationProjectSeasonWord(now: Date = new Date()): '여름' | '겨울' {
  const month = Number(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', month: 'numeric' }).format(now));
  return month >= 3 && month <= 8 ? '여름' : '겨울';
}

/** `5월 10일(일)` → `5/10(일)` — 모집 마감 안내 등 */
export function recruitingDocumentDueSlashWithWeekday(): string {
  return recruitingSlashWithWeekday(recruitingDates.documentSubmission.due);
}

/** `11월 9일(월)` → `11/9(월)` */
function recruitingSlashWithWeekday(dayLabel: string): string {
  const weekMatch = dayLabel.match(/\(([^)]+)\)\s*$/);
  const weekday = weekMatch ? weekMatch[1] : '';
  const { month, day } = parseMonthDayFromRecruitingLabel(recruitingDateWithoutWeekday(dayLabel));
  return `${month}/${day}(${weekday})`;
}

/** 모집 시작 전 지원 버튼 라벨 — 예: `11/9(월) 지원 시작` */
export function recruitingUpcomingButtonLabel(): string {
  return `${recruitingSlashWithWeekday(recruitingDates.documentSubmission.open)} 지원 시작`;
}

/** 히어로(Section01) — 서류 접수 일정과 동일 소스 */
export const recruitingPeriod = {
  rangeStartLabel: `${recruitingDateWithoutWeekday(recruitingDates.documentSubmission.open)}부터`,
  rangeEndLabel: `${recruitingDateWithoutWeekday(recruitingDates.documentSubmission.due)}까지`,
} as const;

/** Section04 상단 헤드라인 */
export const recruitingHeadline = {
  lines: ['IT 기술을 통해', '서울시립대학교 구성원을', '연결하는 프로덕트를'] as const,
  lastLinePrefix: '만들어갈 팀원을 ',
  lastLineSuffix: '모집합니다.',
} as const;

export const recruitingTargetAudience = {
  sectionTitle: '모집 대상',
  primaryTitle: 'IT 서비스에 관심 있는 서울시립대학교 재학생 및 졸업생',
  primaryNote: '졸업생의 경우, 졸업 후 0~2년 재직자에 한함',
  durationRequirement: '최소 1년(2학기) 이상 활동할 수 있는 사람',
} as const;

export const recruitingSectionTitles = {
  fields: '모집 분야',
  schedule: '모집 일정',
} as const;

/** Section02 — Team / 시너자이즈 / 멘토 */
export const recruitingSection02 = {
  learnMoreHref: '/' as const,
  learnMoreLabel: '시대생 자세히 알아보기',
  teamHeading: 'Team UOSLIFE',
  introParagraphs: [
    'UOSLIFE(시대생)는 서울시립대학교 학우들에게 편리하고 즐거운 학교생활을 위한 서비스를 만들어가는 IT 소프트웨어 동아리입니다. 시대생 앱을 운영하며 시간표, 공지사항, 시대팅 등 대학 생활을 위한 다양한 서비스를 제공하고 있습니다.',
    '2027년에는 대학 생활의 본질적 가치를 확장하는 새로운 기능과 경험을 선보이며, 학우들의 일상 속에 더욱 깊이 스며드는 플랫폼으로 성장할 것입니다. 아울러 구성원들이 자율적으로 협업하고 함께 배우는 문화를 바탕으로, 캠퍼스 내에서 지속 가능한 IT 생태계를 만들어 나가고자 합니다.',
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
  descriptionContinued: '다양한 업계의 구성원이 지속적인 시너지를 주고 받을 수 있는 관계를 만들어갑니다.',
  logoSvgCount: 14,
  /** loopTiles는 그 줄의 로고 개수와 같아야 이음새 없이 반복됨 (모바일은 앞 6개 / 나머지로 나뉨) */
  carousel: {
    desktop: { tilePx: 200, gapPx: 20, loopTiles: 14, durationSec: 31 },
    mobileRow1: { tilePx: 120, gapPx: 12, loopTiles: 6, durationSec: 18 },
    mobileRow2: { tilePx: 120, gapPx: 12, loopTiles: 8, durationSec: 24 },
  },
} as const;

/** Section04 모집 분야 상세 — 세 블록의 이모지·제목 */
export const recruitingFieldDetailLabels = {
  do: { emoji: '💻', heading: '이런 일을 해요' },
  with: { emoji: '🙌', heading: '이런 분과 함께하고 싶어요' },
  recommend: { emoji: '💡', heading: '이런 분에게 추천해요' },
} as const;

export type RecruitingFieldDetailBlock = { readonly tag: string; readonly items: readonly string[] };

export type RecruitingFieldDetail = {
  readonly do: RecruitingFieldDetailBlock;
  readonly with: RecruitingFieldDetailBlock;
  readonly recommend: RecruitingFieldDetailBlock;
};

export type RecruitingFieldSubRole = RecruitingFieldDetail & { readonly subrole: string };

export type RecruitingFieldRole =
  | (RecruitingFieldDetail & { readonly role: string; readonly type: 'one' })
  | { readonly role: string; readonly type: 'two'; readonly content: readonly RecruitingFieldSubRole[] };

export const recruitingRoles: RecruitingFieldRole[] = [
  {
    role: '기획자',
    type: 'one',
    do: {
      tag: 'End-to-End 기획',
      items: [
        'SQL·Mixpanel 데이터와 VOC로 앱의 개선점을 찾고, 해결할 기능을 기획해요.',
        '새로운 사업 기회를 찾아 서비스와 비즈니스 모델로 발전시켜요.',
        'AI로 아이디어를 빠르게 구현하며, 기획부터 출시 후 운영까지 전 과정을 관리해요.',
      ],
    },
    with: {
      tag: '논리와 실행력',
      items: [
        '논리적으로 문제를 발견하고, 원인을 정의해 해결할 수 있는 사람',
        '근거를 바탕으로 의견을 전하고, 더 나은 결과를 위해 소통하는 사람',
        'UOSLIFE 활동에 충분한 시간을 쏟고, 맡은 일을 끝까지 완수하는 사람',
      ],
    },
    recommend: {
      tag: '도전과 성장',
      items: [
        '시대생 프로덕트에 관심이 있는 사람',
        'AI를 적극 활용해 정량적 성과가 담긴 경험을 만들고 싶은 사람',
        '대학 생활에서 기억에 남을 도전을 하며 문제해결력과 소통 역량을 키우고 싶은 사람',
      ],
    },
  },
  {
    role: '디자이너',
    type: 'one',
    do: {
      tag: 'UI/UX 경험 설계',
      items: [
        '사용자의 니즈와 행동을 분석해 편리하고 직관적인 서비스 경험을 설계해요.',
        '디자인 시스템과 UI 컴포넌트를 체계화해 일관된 브랜드 경험을 만들어요.',
        '기획·개발 챕터와 협업해 디자인이 실제 서비스로 완성도 있게 구현되도록 해요.',
      ],
    },
    with: {
      tag: '사용자 중심',
      items: [
        'UI/UX에 관심이 있고, 사용자 중심의 디자인을 고민하는 사람',
        '새로운 트렌드에 관심이 많고, 다양한 시도를 즐기며 함께 배우고 성장하고 싶은 사람',
        '기획·마케팅·개발팀과 원활하게 소통하며 아이디어를 구체화할 수 있는 사람',
      ],
    },
    recommend: {
      tag: '실서비스 디자인',
      items: [
        '내 아이디어를 실제 서비스에 반영해 보고 싶은 사람',
        '사용자 테스트로 문제를 발견하고, UX 개선까지 직접 이끌어 보고 싶은 사람',
        '실서비스의 디자인 시스템을 처음부터 함께 구축해 보고 싶은 사람',
      ],
    },
  },
  {
    role: '개발자',
    type: 'two',
    content: [
      {
        subrole: 'Front-End',
        do: {
          tag: '개발부터 운영까지',
          items: [
            'React와 TypeScript로 시대생 앱의 새 기능을 개발하고 기존 기능을 개선해요.',
            '기획·디자인·백엔드 챕터와 함께 구현부터 코드 리뷰, QA, 배포·운영까지 진행해요.',
            '유지보수하기 좋은 코드베이스를 만들고, AI와 자동화 도구로 반복 업무를 줄여요.',
          ],
        },
        with: {
          tag: '책임감 있는 개발',
          items: [
            '동료를 존중하고, 테스트·QA·배포까지 맡은 역할을 책임감 있게 완수하는 사람',
            '기존 코드의 맥락을 이해하고, 다음 구성원을 위해 좋은 코드를 남기려는 사람',
            'AI를 활용하되, 생성된 코드의 동작 원리를 이해하고 설명할 수 있는 사람',
          ],
        },
        recommend: {
          tag: '실전 성장',
          items: [
            '일회성 프로젝트를 넘어, 2.1만 다운로드 실서비스를 개발 및 운영해 보고 싶은 사람',
            '성능 최적화, UX 개선, 서비스 안정성까지 깊이 고민해 보고 싶은 사람',
            '코드 리뷰로 함께 성장하고, 정량 성과가 담긴 포트폴리오를 만들고 싶은 사람',
          ],
        },
      },
      {
        subrole: 'Back-End',
        do: {
          tag: '지속 가능한 서버',
          items: [
            '신입부터 시대생 서버의 신규 기능 개발에 참여해요.',
            '기능 구현에 그치지 않고, 유지보수하기 좋은 구조와 방법을 함께 논의해요.',
            '코드리뷰·문서화 규칙을 바탕으로 프론트·기획·인프라와 협업해요.',
          ],
        },
        with: {
          tag: '기본기와 몰입',
          items: [
            '서버 개발 CS 지식을 갖추고, 자신의 프로젝트를 깊이 있게 설명할 수 있는 사람',
            'AI를 적극적으로 활용하는 사람 (인프라·AI 경험 우대)',
            '최소 1년, 주 20시간 이상, 방학 중에도 활동에 몰입할 수 있는 사람',
          ],
        },
        recommend: {
          tag: '단계적 성장',
          items: [
            '실유저가 쓰는 서비스의 서버를 직접 개발하고 운영해 보고 싶은 사람',
            '작은 수정부터 기능 개발까지, 리드·알럼나이와 함께 성장하고 싶은 사람',
            '코드리뷰로 유지보수하기 좋은 코드를 배우고 싶은 사람',
          ],
        },
      },
    ],
  },
  {
    role: '마케터',
    type: 'one',
    do: {
      tag: '데이터 기반 그로스',
      items: [
        'Mixpanel·Redash·BigQuery로 유입·이탈 지점을 찾고 그로스 전략을 세워요.',
        '인스타그램, 앱 내 배너·팝업·푸시, 오프라인까지 캠페인을 직접 기획·실행해요.',
        '세그먼트 타겟팅과 딥링크로 캠페인 전환율을 측정하고, 다음 실행을 개선해요.',
      ],
    },
    with: {
      tag: '끝까지 실행하는 열정',
      items: [
        '규모와 상관없이 직접 기획하고 실행해 본 마케팅 경험이 있는 사람',
        '감이 아닌 데이터와 근거로 판단하고, 결과의 이유를 끝까지 파고드는 사람',
        'UOSLIFE 활동에 우선순위를 두고, 최소 1년간 열정을 쏟을 수 있는 사람',
      ],
    },
    recommend: {
      tag: '정량 성과',
      items: [
        '기획서에서 멈추지 않고, 내 아이디어를 실제 캠페인으로 실행해 보고 싶은 사람',
        '내 캠페인의 유저 반응을 확인하며, 정량 성과를 포트폴리오로 남기고 싶은 사람',
        '실제 데이터로 콘텐츠·CRM·데이터를 아우르는 그로스 마케팅을 경험하고픈 사람',
      ],
    },
  },
];

/** `{기수}와 활동을 함께할 멘토` — Section02 */
export function recruitingMentorSectionHeading(): string {
  const cohort = recruitingBrand.cohortLabel.replace(/\s*모집\s*$/, '').trim();
  return `${cohort}와 활동을 함께할 멘토`;
}

/** Section05 FAQ */
export const recruitingFaqSectionTitle = '자주 묻는 질문';

export type RecruitingFaqItem = { question: string; answer: readonly string[] };

/** 표시 시점(KST 월) 기준으로 방학 프로젝트 문구 반영 */
export function buildRecruitingFaqItems(now: Date = new Date()): ReadonlyArray<RecruitingFaqItem> {
  const vacationSeason = recruitingVacationProjectSeasonWord(now);

  return [
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
        `매 방학 시즌에는 신규 기능 개발 프로젝트를 진행하며, 이 경우 격주 토요일에 전일(10AM.-10PM.)으로 모여 코어 타임을 갖고 있습니다. 이번 ${vacationSeason}방학 프로젝트 일정은 추후 안내될 예정입니다.`,
        '*모든 모임은 오프라인 대면으로 진행되고 있으며 프로젝트 상황에 따라 달라질 수 있습니다.',
      ],
    },
    {
      question: 'Q. 졸업생도 지원이 가능한가요?',
      answer: [
        '1년간 꾸준히 활동할 수 있고 배우고자 하는 열의가 충분하다면, 누구든 지원이 가능합니다. 현재도 재학생, 휴학생, 졸업생 중 활발히 활동하시는 분들이 계십니다.',
        '하지만, 매월 둘째 주, 넷째 주에 진행하는 정기 회의 (목요일 7시 30분)와 방학 기간 동안의 *프로젝트 코어 타임은 반드시 참여해야 한다는 점은 꼭 숙지해 주세요!',
        '*프로젝트 코어 타임: 방학 기간 중 격주 토요일 전일',
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
      question: 'Q. UOSLIFE Alumni (졸업생 및 동문)도 함께 활동하나요?',
      answer: [
        '네, 함께 활동합니다. 학기에 따라 다르지만 UOSLIFE 동아리를 졸업한 Alumni들도 지속적으로 활동하고 있습니다.',
        '방학 프로젝트 및 현직자 특강 등을 통해 재학생들의 성장을 지원하고, 내부 네트워킹 및 현직자 모임을 통해 지속적으로 교류하고 있습니다.',
      ],
    },
  ];
}

/** Section06 — 모집 종료 시 노출 문구 */
export const recruitingSection06Inactive = {
  headlineLine1: '모집 기간이',
  headlineLine2: '종료되었어요',
  detail: '다음 모집 알림을 받으면 빠르게 지원할 수 있어요!',
} as const;

/** Section06 — 모집 진행 중 타이틀·소개 문구 (마감 안내 줄은 마감 일정에서 생성) */
export const recruitingSection06Active = {
  headlineLine1: '시대생, 모든 시대인을',
  headlineLine2: '— 연결하다',
  introLines: ['아이디어를 실행으로, 실행을 성과로.', '기획·개발·디자인·마케팅에서, 열정적인 당신을 기다리고 있습니다.'],
} as const;

/** 모집 중 Section06 보조 문단 — `documentSubmission.due` · `dueTimeNote` 단일 소스 */
export function buildRecruitingSection06DeadlineDetail(): string {
  const md = recruitingDocumentDueSlashWithWeekday();
  const timeCore = recruitingDates.documentSubmission.dueTimeNote.replace(/\s*까지\s*$/, '').trim();
  return `${md} ${timeCore}까지 하단의 링크를 통해 지원해 주세요.`;
}

/** 모집 단계에 따라 Section06 타이틀·보조 문단 결정 (시작 전에도 모집 소개 문구를 보여줌) */
export function resolveRecruitingSection06Texts(now?: Date): {
  headlineLine1: string;
  headlineLine2: string;
  detailLines: readonly string[];
} {
  const phase = recruitingApplicationPhase(now);
  if (phase !== 'ended') {
    const lastLine =
      phase === 'active'
        ? buildRecruitingSection06DeadlineDetail()
        : `${recruitingSlashWithWeekday(recruitingDates.documentSubmission.open)}부터 지원할 수 있어요.`;
    return {
      headlineLine1: recruitingSection06Active.headlineLine1,
      headlineLine2: recruitingSection06Active.headlineLine2,
      detailLines: [...recruitingSection06Active.introLines, lastLine],
    };
  }
  return {
    headlineLine1: recruitingSection06Inactive.headlineLine1,
    headlineLine2: recruitingSection06Inactive.headlineLine2,
    detailLines: [recruitingSection06Inactive.detail],
  };
}

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
    title: '합격자 온보딩 워크샵',
    date: recruitingDates.onboardingWorkshop,
    footnote: '*1박 2일 참여 필수',
  },
];
