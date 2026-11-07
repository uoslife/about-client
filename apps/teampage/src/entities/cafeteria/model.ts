import { z } from 'zod';

export const MEAL_TIMES = ['BREAKFAST', 'LUNCH', 'DINNER'] as const;
export const mealTimeSchema = z.enum(MEAL_TIMES);
export type MealTime = z.infer<typeof mealTimeSchema>;

export const menuItemSchema = z.object({
  role: z.string().nullish(),
  name: z.string().nullish(),
  side: z.array(z.string()).nullish(),
  price: z.number().int().nullish(),
  isPopular: z.boolean(),
});

export const cornerSchema = z.object({
  corner: z.string().nullish(),
  items: z.array(menuItemSchema),
});

export const cafeteriaSchema = z.object({
  id: z.string(),
  name: z.string(),
  isPinned: z.boolean(),
  menus: z.array(cornerSchema),
  extra: z.array(z.string()).nullish(),
});

export const menusResponseSchema = z.object({
  date: z.iso.date(),
  hasNextWeekData: z.boolean(),
  availableTimes: z.array(mealTimeSchema),
  menusByMealTime: z.partialRecord(mealTimeSchema, z.object({ cafeterias: z.array(cafeteriaSchema) })),
});

export type MenuItem = z.infer<typeof menuItemSchema>;
export type Corner = z.infer<typeof cornerSchema>;
export type Cafeteria = z.infer<typeof cafeteriaSchema>;
export type MenusResponse = z.infer<typeof menusResponseSchema>;

/** apis `POST /cafeterias` body. 이름은 웹훅이지만 일반 저장 API다. 변환은 `lib/toSaveMenusBody.ts`. */
export type SaveMenusBody = {
  cafeteria_menus: {
    origin: { id: string; code: string; name: string; target_url: string };
    menus: {
      meal_date: string;
      meal_time: MealTime;
      corner: string | null;
      content: {
        items: { role: string | null; name: string | null; side: string[]; price: number | null }[];
        extra: string[];
      };
    }[];
  };
};

/** 저장 단위 `일자 + 끼 + 식당`. `loaded`는 편집을 시작할 때 불러온 서버 값이다. */
export type SaveCafeteriaVariables = {
  date: string;
  mealTime: MealTime;
  loaded: Cafeteria;
  next: Cafeteria;
  /** 그사이 서버 값이 바뀌었어도 덮어쓴다. `CafeteriaConflictError`를 받은 뒤 사용자가 확인했을 때만 켠다. */
  force?: boolean;
};
