import type { FlagsApiErrorBody } from '../model';

/**
 * 상태 코드를 값으로 들고 다니는 에러.
 *
 * 호출부가 409(다른 사람이 먼저 저장함)를 나머지 실패와 다르게 처리해야 한다.
 * 메시지 문자열을 비교하는 방식이면 서버 문구를 다듬는 순간 조용히 깨진다.
 */
export class FlagsApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'FlagsApiError';
    this.status = status;
  }
}

/**
 * flags API 전용 fetch.
 *
 * 읽기(entities)와 쓰기(features) 양쪽이 쓰므로 entity 에 둔다 — features 는
 * entities 를 import 할 수 있지만 그 반대는 안 되기 때문이다.
 */
export const requestFlagsApi = async <T>(input: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as FlagsApiErrorBody | null;
    throw new FlagsApiError(response.status, body?.message || '요청에 실패했습니다.');
  }

  return (await response.json()) as T;
};
