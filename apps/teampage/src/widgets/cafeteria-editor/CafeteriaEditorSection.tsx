'use client';
import { useEffect } from 'react';
import { CAFETERIA_ORIGINS, CafeteriaCardList } from '@/entities/cafeteria';
import { CafeteriaForm, FormActions } from '@/features/cafeteria-editor';
import { Text } from '@/shared/component/Text';
import { DesktopEditorLayout, MobileEditorLayout, type EditorSlots } from './EditorLayouts';
import { MealDateBar } from './MealDateBar';
import { useCafeteriaEditor } from './useCafeteriaEditor';

/** 이 화면을 떠나도 되는지. dirty면 확인 후 이동, saving이면 이동 불가(반영 결과·충돌 확인을 받을 화면이 사라짐). */
export type LeaveState = 'clean' | 'dirty' | 'saving';

/** 백오피스 학식 편집 탭. 조회 상태를 처리하고 화면 조각을 만들어 데스크톱·모바일 배치에 넘긴다. */
export function CafeteriaEditorSection({ onLeaveStateChange }: { onLeaveStateChange: (state: LeaveState) => void }) {
  const state = useCafeteriaEditor();

  // 백오피스 탭을 옮길 때 확인할 수 있게 알린다. 다시 열면 새로 마운트되며 그때 값으로 덮인다.
  const leaveState: LeaveState = state.saving ? 'saving' : state.dirty ? 'dirty' : 'clean';
  useEffect(() => {
    onLeaveStateChange(leaveState);
  }, [leaveState, onLeaveStateChange]);

  if (state.query.isLoading) {
    return (
      <Text variant="body-16-m" color="grey-600">
        불러오는 중입니다.
      </Text>
    );
  }
  // 이미 불러온 값이 있으면 재조회가 실패해도 편집 화면을 지킨다(반영 직전 재조회 실패 포함).
  if (state.query.isError && !state.query.data) {
    return (
      <Text variant="body-16-m" color="grey-600">
        {state.query.error instanceof Error ? state.query.error.message : '학식을 불러오지 못했습니다.'}
      </Text>
    );
  }

  const currentId = state.currentId ?? undefined;
  const title = state.before ? `${state.before.name} 선택` : '식당이 없는 끼니예요';
  const beforeList = (
    <CafeteriaCardList cafeterias={state.cafeterias} selectedId={currentId} onSelect={state.selectCafeteria} />
  );
  const afterList = <CafeteriaCardList cafeterias={state.afterList} scrollToId={currentId} showPopular={false} />;
  // 반영 중에는 입력을 잠근다. 성공하면 폼 값을 새 서버 값으로 다시 만들어 그사이 입력이 사라진다.
  const form = state.editor && (
    <fieldset disabled={state.saving} className="min-w-0">
      <CafeteriaForm editor={state.editor} />
    </fieldset>
  );
  const actions = state.editor && (
    <FormActions
      dirty={state.editor.dirty}
      canSave={state.editor.canSave}
      saving={state.saving}
      onReset={state.reset}
      onSave={state.save}
    />
  );

  const slots: EditorSlots = { title, before: beforeList, form, actions, after: afterList };

  return (
    <div className="flex w-full flex-col gap-[24px]">
      <MealDateBar
        date={state.date}
        mealTime={state.mealTime}
        sourceUrl={currentId ? CAFETERIA_ORIGINS[currentId]?.targetUrl : undefined}
        onShiftDay={state.shiftDay}
        onSelectMealTime={state.selectMealTime}
      />
      {/* 두 배치를 다 그리고 CSS(lg)로 하나만 보인다. 같은 조각을 넘기므로 상태는 하나다. */}
      <DesktopEditorLayout {...slots} />
      <MobileEditorLayout {...slots} />
    </div>
  );
}
