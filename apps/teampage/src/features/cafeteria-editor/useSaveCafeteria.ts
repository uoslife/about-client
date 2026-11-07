'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SaveCafeteriaVariables } from '@/entities/cafeteria';
import {
  cafeteriaKeys,
  cafeteriaMenusQueryOptions,
  findCafeteria,
  getCafeteriaOrigin,
  isSameCafeteria,
  requestCafeteriaApi,
  toSaveMenusBody,
} from '@/entities/cafeteria';

/** 편집하는 사이 서버 값이 바뀜. 화면은 이걸 받으면 "덮어쓸까요?"를 묻고 force로 다시 부른다. */
export class CafeteriaConflictError extends Error {
  constructor(cafeteriaName: string) {
    super(`편집하는 사이 ${cafeteriaName} 메뉴가 바뀌었습니다.`);
    this.name = 'CafeteriaConflictError';
  }
}

export const useSaveCafeteria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ date, mealTime, loaded, next, force }: SaveCafeteriaVariables) => {
      const latest = await queryClient.fetchQuery(cafeteriaMenusQueryOptions(date));
      const prev = findCafeteria(latest, mealTime, next.id);
      if (!prev) throw new Error(`${date} ${mealTime}에 ${next.name}이(가) 없습니다.`);
      if (!force && !isSameCafeteria(prev, loaded)) throw new CafeteriaConflictError(next.name);

      const body = toSaveMenusBody({ date, mealTime, origin: getCafeteriaOrigin(next.id, next.name), prev, next });
      await requestCafeteriaApi<void>('/cafeterias', { method: 'POST', body: JSON.stringify(body) });
    },
    onSuccess: (_data, { date }) => queryClient.invalidateQueries({ queryKey: cafeteriaKeys.menus(date) }),
  });
};
