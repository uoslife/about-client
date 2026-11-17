'use client';
import { MEAL_TIMES, type MealTime } from '@/entities/cafeteria';
import { Icon, Tabs, buttonClassName } from '@/shared/component/ds';

const MEAL_LABEL: Record<MealTime, string> = { BREAKFAST: '조식', LUNCH: '중식', DINNER: '석식' };
const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];

type MealDateBarProps = {
  date: string;
  mealTime: MealTime;
  /** 선택한 식당의 원문 식단표(학교 홈페이지). 식당이 없으면 링크를 숨긴다. */
  sourceUrl?: string;
  onShiftDay: (days: number) => void;
  onSelectMealTime: (mealTime: MealTime) => void;
};

const MOVE_BUTTON =
  'flex items-center justify-center rounded-[8px] border border-[#cbd5e1] p-[6px] text-[#334155] shadow-[0_1px_2px_rgba(15,23,42,0.06)]';

/**
 * 날짜·끼니 선택기. 앱 학식 탭 상단과 같은 uoslife-ds MovableDate + Tab 모양(ds/Tabs).
 */
export function MealDateBar({ date, mealTime, sourceUrl, onShiftDay, onSelectMealTime }: MealDateBarProps) {
  const [year, month, day] = date.split('-');
  const weekday = WEEKDAY[new Date(`${date}T12:00:00`).getDay()];

  const sourceLink = (className: string) =>
    sourceUrl && (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonClassName({ size: 'xs', variant: 'weak', color: 'blue' })} ${className}`}
      >
        원문 보기
        <Icon name="openInNew" size={14} />
        <span className="sr-only">(새 창)</span>
      </a>
    );

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-[8px] lg:max-w-none lg:flex-row lg:items-center lg:justify-center lg:gap-[24px]">
      <div className="flex items-center gap-[16px]">
        <button type="button" aria-label="이전 날짜" className={MOVE_BUTTON} onClick={() => onShiftDay(-1)}>
          <Icon name="keyboardArrowLeft" size={20} />
        </button>
        <span className="flex w-[130px] justify-between text-[19px] font-medium leading-[1.3] text-[#334155]">
          <span>{`${year}.${month}.${day}`}</span>
          <span>({weekday})</span>
        </span>
        <button type="button" aria-label="다음 날짜" className={MOVE_BUTTON} onClick={() => onShiftDay(1)}>
          <Icon name="keyboardArrowRight" size={20} />
        </button>
        {sourceLink('ml-auto lg:hidden')}
      </div>
      <div className="lg:w-[360px]">
        <Tabs
          label="끼니"
          items={MEAL_TIMES.map((time) => ({ value: time, label: MEAL_LABEL[time] }))}
          value={mealTime}
          onChange={onSelectMealTime}
        />
      </div>
      {sourceLink('max-lg:hidden')}
    </div>
  );
}
