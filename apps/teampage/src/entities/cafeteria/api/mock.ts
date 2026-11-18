import { menusResponseSchema, type Cafeteria, type MealTime, type MenusResponse } from '../model';
import { previewSaved } from '../lib/preview';
import { MOCK_MENUS } from './mockMenus';

const snapshots = new Map<string, MenusResponse>(
  Object.entries(MOCK_MENUS).map(([date, response]) => [date, menusResponseSchema.parse(response)]),
);

/** 스냅샷에 없는 날짜는 아무 날의 식당 구성을 빌려 메뉴만 비운다. 네트워크로 새지 않게. */
const emptyResponse = (date: string): MenusResponse => {
  const template = snapshots.values().next().value as MenusResponse;
  return {
    date,
    hasNextWeekData: false,
    availableTimes: template.availableTimes,
    menusByMealTime: Object.fromEntries(
      Object.entries(template.menusByMealTime).map(([mealTime, group]) => [
        mealTime,
        { cafeterias: (group?.cafeterias ?? []).map((cafeteria) => ({ ...cafeteria, menus: [], extra: [] })) },
      ]),
    ),
  };
};

const store = new Map<string, MenusResponse>();

const read = (date: string) => {
  if (!store.has(date)) store.set(date, structuredClone(snapshots.get(date) ?? emptyResponse(date)));
  return store.get(date)!;
};

export const getMockMenus = (date: string): MenusResponse => structuredClone(read(date));

export const saveMockCafeteria = (date: string, mealTime: MealTime, prev: Cafeteria, next: Cafeteria) => {
  const response = read(date);
  const group = response.menusByMealTime[mealTime];
  if (!group) throw new Error(`${date} ${mealTime} 메뉴가 없습니다.`);

  const popular = new Set(
    prev.menus.flatMap((menu) => menu.items.filter((item) => item.isPopular).map((item) => item.name ?? '')),
  );
  const saved = previewSaved(next);
  const withPopular: Cafeteria = {
    ...saved,
    menus: saved.menus.map((menu) => ({
      ...menu,
      items: menu.items.map((item) => ({ ...item, isPopular: popular.has(item.name ?? '') })),
    })),
  };
  group.cafeterias = group.cafeterias.map((cafeteria) => (cafeteria.id === next.id ? withPopular : cafeteria));
};
