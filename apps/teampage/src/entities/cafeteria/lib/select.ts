import type { Cafeteria, MealTime, MenusResponse } from '../model';

export const findCafeteria = (menus: MenusResponse, mealTime: MealTime, id: string) =>
  menus.menusByMealTime[mealTime]?.cafeterias.find((cafeteria) => cafeteria.id === id);

export const isSameCafeteria = (a: Cafeteria, b: Cafeteria) => JSON.stringify(a) === JSON.stringify(b);
