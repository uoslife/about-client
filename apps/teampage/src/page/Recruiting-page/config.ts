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

/**
 * 일정·히어로 등 모든 노출 일자의 단일 소스.
 * 표기 형식: `M월 D일(요일)` — 요일 없는 짧은 문구는 `recruitingDateWithoutWeekday`로 파생합니다.
 */
export const recruitingDates = {
  documentSubmission: {
    open: '11월 24일(월)',
    due: '11월 30일(일)',
    dueTimeNote: '오후 11시 59분 까지',
  },
  firstRoundResult: '12월 2일(화)',
  secondInterview: {
    start: '12월 3일(수)',
    end: '12월 6일(토)',
  },
  finalResult: '12월 7일(일)',
  onboarding: '12월 28일(일)',
  workshop: {
    start: '1월 3일(토)',
    end: '1월 4일(일)',
  },
} as const;

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
