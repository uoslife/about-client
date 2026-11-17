import type { Cafeteria, MealTime, SaveMenusBody } from '../model';

const USE_CAFETERIA_MOCK = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_CAFETERIA_MOCK === '1';

const CAN_SAVE_TO_API = process.env.NODE_ENV !== 'development' || process.env.NEXT_PUBLIC_CAFETERIA_ALLOW_SAVE === '1';

/** mock 저장소. 배포 빌드에서는 import 자체가 지워져 스냅샷(107KB) 청크가 만들어지지 않는다. */
const loadCafeteriaMock = () =>
  process.env.NODE_ENV === 'development'
    ? import('./mock')
    : Promise.reject(new Error('학식 mock은 개발 서버에서만 쓸 수 있습니다.'));

/** next.config.mjs rewrite가 apis(UOSLIFE_APIS_ORIGIN, 기본 apis.uoslife.com)로 넘긴다. apis CORS가 localhost:3000을 막아서 직접 부르지 않는다. */
const BASE_URL = '/uoslife-apis';

/**
 * 학식 API 전용 fetch. banners·flags와 달리 BFF 없이 rewrite 경로로 apis를 바로 부름
 */
const requestCafeteriaApi = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message || '요청에 실패했습니다.');
  }

  // POST /cafeterias는 빈 본문으로 200을 준다.
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
};

type SaveMenusInput = {
  date: string;
  mealTime: MealTime;
  /** 저장 직전 서버 값. mock은 이걸로 HOT 표시를 이어 붙인다. */
  prev: Cafeteria;
  next: Cafeteria;
  body: SaveMenusBody;
};

type CafeteriaApi = {
  getMenus: (date: string) => Promise<unknown>;
  saveMenus: (input: SaveMenusInput) => Promise<void>;
};

const httpApi: CafeteriaApi = {
  getMenus: (date) => requestCafeteriaApi<unknown>(`/cafeterias/menus?date=${encodeURIComponent(date)}`),
  saveMenus: async ({ body }) => {
    if (!CAN_SAVE_TO_API) {
      throw new Error('개발 서버에서는 반영하지 않습니다. NEXT_PUBLIC_CAFETERIA_ALLOW_SAVE=1로 켜야 합니다.');
    }
    await requestCafeteriaApi<void>('/cafeterias', { method: 'POST', body: JSON.stringify(body) });
  },
};

const mockApi: CafeteriaApi = {
  getMenus: async (date) => (await loadCafeteriaMock()).getMockMenus(date),
  saveMenus: async ({ date, mealTime, prev, next }) =>
    (await loadCafeteriaMock()).saveMockCafeteria(date, mealTime, prev, next),
};

/** 학식 조회·저장 API. 개발 서버에서 NEXT_PUBLIC_CAFETERIA_MOCK=1이면 메모리 mock 저장소를 쓴다. */
export const cafeteriaApi = USE_CAFETERIA_MOCK ? mockApi : httpApi;
