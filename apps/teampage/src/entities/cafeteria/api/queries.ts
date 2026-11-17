import { queryOptions } from '@tanstack/react-query';
import { menusResponseSchema } from '../model';
import { cafeteriaApi } from './client';

/** 학식의 쿼리 키. 저장 후 무엇을 무효화할지 features/cafeteria-editor가 알아야 해서 한곳에 둔다. */
export const cafeteriaKeys = {
  all: ['cafeteria'] as const,
  menus: (date: string) => [...cafeteriaKeys.all, 'menus', date] as const,
};

export const cafeteriaMenusQueryOptions = (date: string) =>
  queryOptions({
    queryKey: cafeteriaKeys.menus(date),
    queryFn: async () => menusResponseSchema.parse(await cafeteriaApi.getMenus(date)),
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
  });
