/**
 * 리크루팅 페이지에서 시즌마다 바뀔 수 있는 카피·일정·에셋 경로를 한곳에서 관리합니다.
 */

export const recruitingAssets = {
  heroLogoBackground: '/img/recruit/logo.png',
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
