'use client';
import { useState, type ReactNode } from 'react';
import { PhoneFrame } from '@/shared/component/PhoneFrame';
import { Icon, Tabs } from '@/shared/component/ds';

/** 학식 편집 화면을 이루는 조각. 배치(데스크톱/모바일)만 다르고 내용은 같다. */
export type EditorSlots = {
  title: string;
  before: ReactNode;
  form: ReactNode;
  actions: ReactNode;
  after: ReactNode;
};

const TITLE = 'text-[17px] font-semibold leading-[1.3] text-[#0f172a]';

function PhoneColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="flex min-w-0 max-w-[410px] flex-1 flex-col items-center gap-[10px]">
      <h2 className="text-[15px] font-bold text-[#334155]">{title}</h2>
      <PhoneFrame>{children}</PhoneFrame>
    </section>
  );
}

const Arrow = () => (
  <div
    aria-hidden="true"
    className="flex h-[40px] w-[40px] shrink-0 items-center justify-center self-center rounded-full border border-[#e2e8f0] bg-white text-[#64748b]"
  >
    <Icon name="keyboardArrowRight" size={20} />
  </div>
);

/** lg 이상: Before 폰 → 수정 폼 → After 폰 3단. 화면이 좁아지면 셋이 같이 줄어든다. */
export function DesktopEditorLayout({ title, before, form, actions, after }: EditorSlots) {
  return (
    <div className="hidden items-start justify-center gap-[12px] lg:flex">
      <PhoneColumn title="Before">{before}</PhoneColumn>
      <Arrow />
      {/* 수정 폼. 폰과 높이를 맞추고 폼만 안에서 스크롤, 버튼은 아래에 고정 */}
      <section
        aria-label={title}
        className="mt-[30px] flex h-[864px] min-w-0 max-w-[560px] flex-1 flex-col gap-[12px] rounded-[12px] border border-[#e2e8f0] bg-white p-[16px]"
      >
        <h2 className={TITLE}>{title}</h2>
        <div className="min-h-0 flex-1 overflow-y-auto p-[2px] pb-[8px]">{form}</div>
        {actions}
      </section>
      <Arrow />
      <PhoneColumn title="After">{after}</PhoneColumn>
    </div>
  );
}

type MobileView = 'before' | 'edit' | 'after';

const MOBILE_VIEWS: { value: MobileView; label: string }[] = [
  { value: 'before', label: '기존' },
  { value: 'edit', label: '수정' },
  { value: 'after', label: '미리보기' },
];

/** lg 미만: 기존/수정/미리보기를 탭으로 하나씩 보이고, 되돌리기·반영은 화면 아래에 붙인다. */
export function MobileEditorLayout({ title, before, form, actions, after }: EditorSlots) {
  const [view, setView] = useState<MobileView>('before');
  return (
    <div className="flex flex-col gap-[12px] lg:hidden">
      <h2 className={TITLE}>{title}</h2>
      <Tabs label="보기" idPrefix="cafeteria-view" items={MOBILE_VIEWS} value={view} onChange={setView} />
      <div
        role="tabpanel"
        id={`cafeteria-view-panel-${view}`}
        aria-labelledby={`cafeteria-view-tab-${view}`}
        className={view === 'edit' ? 'py-[12px]' : undefined}
      >
        {view === 'before' && before}
        {view === 'edit' && form}
        {view === 'after' && after}
      </div>
      {actions && (
        <div className="sticky bottom-0 border-t border-[#e2e8f0] bg-white py-[10px] max-md:pb-[26px]">{actions}</div>
      )}
    </div>
  );
}
