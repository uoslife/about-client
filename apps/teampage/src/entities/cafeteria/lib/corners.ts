const DEFAULT_PRICES: Record<string, Record<string, number>> = {
  학생회관: { B코너: 5000, C코너: 3800 },
  자연과학관: { '': 6000 },
  이룸라운지: { '': 7000 },
};

/** 서버가 MAIN 빈 가격에 넣을 값. 없으면 null(앱에 "6,000원"으로 잘못 보인다). */
export const getDefaultPrice = (cafeteriaName: string, corner: string | null | undefined): number | null =>
  DEFAULT_PRICES[cafeteriaName]?.[corner ?? 'DEFAULT'] ?? DEFAULT_PRICES[cafeteriaName]?.[''] ?? null;

const CORNER_OPTIONS: Record<string, string[]> = {
  학생회관: ['B코너', 'C코너', 'D코너'],
  이룸라운지: ['A코너', 'B코너'],
};

export const getCornerOptions = (cafeteriaName: string) => CORNER_OPTIONS[cafeteriaName] ?? [];
