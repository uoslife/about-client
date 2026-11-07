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
