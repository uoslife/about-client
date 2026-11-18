'use client';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cafeteriaMenusQueryOptions, previewSaved, type MealTime } from '@/entities/cafeteria';
import { CafeteriaConflictError, useCafeteriaForm, useSaveCafeteria } from '@/features/cafeteria-editor';
import { useConfirmModal } from '@/shared/component/confirm-modal';
import { useToast } from '@/shared/component/toast';

const pad = (value: number) => String(value).padStart(2, '0');
const toDateString = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const shiftDate = (date: string, days: number) => {
  const next = new Date(`${date}T12:00:00`);
  next.setDate(next.getDate() + days);
  return toDateString(next);
};

/** 앱 학식 탭과 같은 기준(10시 전 조식, 15시 전 중식). */
const currentMealTime = (): MealTime => {
  const hour = new Date().getHours();
  if (hour < 10) return 'BREAKFAST';
  if (hour < 15) return 'LUNCH';
  return 'DINNER';
};

export const useCafeteriaEditor = () => {
  const [date, setDate] = useState(() => toDateString(new Date()));
  const [mealTime, setMealTime] = useState<MealTime>(currentMealTime);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saveCount, setSaveCount] = useState(0);

  const query = useQuery(cafeteriaMenusQueryOptions(date));
  const saveMutation = useSaveCafeteria();
  const { open: openConfirmModal } = useConfirmModal();
  const { toast } = useToast();

  const cafeterias = useMemo(() => query.data?.menusByMealTime[mealTime]?.cafeterias ?? [], [query.data, mealTime]);
  const currentId = cafeterias.some((cafeteria) => cafeteria.id === selectedId)
    ? selectedId
    : cafeterias[0]?.id ?? null;
  const before = cafeterias.find((cafeteria) => cafeteria.id === currentId);

  const editor = useCafeteriaForm(before, `${date}|${mealTime}|${currentId}|${saveCount}`);
  const dirty = editor?.dirty ?? false;

  const afterList = useMemo(() => {
    if (!editor) return cafeterias;
    const after = previewSaved(editor.next);
    return cafeterias.map((cafeteria) => (cafeteria.id === after.id ? after : cafeteria));
  }, [cafeterias, editor]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const saving = saveMutation.isPending;

  const guard = (move: () => void) => {
    // 반영 중에는 이동하지 않는다. 성공하면 폼 값을 새 서버 값으로 다시 만드니 그사이 화면이 바뀌면 안 된다.
    if (saving) return;
    if (!dirty) {
      move();
      return;
    }
    openConfirmModal({
      title: '반영하지 않고 이동하시겠습니까?',
      description: '변경한 내용이 사라집니다.',
      confirmText: '이동',
      cancelText: '계속 편집',
      variant: 'danger',
      onConfirm: move,
    });
  };

  const save = (force = false) => {
    if (!editor) return;
    saveMutation.mutate(
      { date, mealTime, loaded: editor.form.loaded, next: editor.next, force },
      {
        onSuccess: () => {
          setSaveCount((count) => count + 1);
          toast('반영했습니다.');
        },
        onError: (error) => {
          if (error instanceof CafeteriaConflictError) {
            if (window.confirm(`${error.message} 덮어쓸까요?`)) save(true);
            return;
          }
          toast(error instanceof Error ? error.message : '반영에 실패했습니다.');
        },
      },
    );
  };

  return {
    date,
    mealTime,
    query,
    currentId,
    before,
    cafeterias,
    afterList,
    editor,
    saving,
    dirty,
    selectCafeteria: (id: string) => id !== currentId && guard(() => setSelectedId(id)),
    shiftDay: (days: number) => guard(() => setDate((current) => shiftDate(current, days))),
    selectMealTime: (next: MealTime) => next !== mealTime && guard(() => setMealTime(next)),
    reset: () => editor?.dispatch({ type: 'reset' }),
    save: () => save(),
  };
};
