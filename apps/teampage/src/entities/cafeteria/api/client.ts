/**
 * 상태 코드를 값으로 들고 다니는 에러.
 *
 * apis가 실제로 준 status만 담는다. 편집 충돌은 서버가 아니라 우리가 판단하는 것이라
 * features/cafeteria-editor 의 `CafeteriaConflictError` 로 따로 던진다.
 */
export class CafeteriaApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'CafeteriaApiError';
    this.status = status;
  }
}

/** next.config.mjs rewrite가 apis.uoslife.com으로 넘긴다. apis CORS가 localhost:3000을 막아서 직접 부르지 않는다. */
const BASE_URL = '/uoslife-apis';

/**
 * 학식 API 전용 fetch. banners·flags와 달리 BFF 없이 rewrite 경로로 apis를 바로 부름
 */
export const requestCafeteriaApi = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new CafeteriaApiError(response.status, body?.message || '요청에 실패했습니다.');
  }

  // POST /cafeterias는 빈 본문으로 200을 준다.
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
};
