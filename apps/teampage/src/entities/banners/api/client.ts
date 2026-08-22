import type { BannersApiErrorBody } from '../model';
import type { BannerIssue } from '../lib/validate';

/**
 * 상태 코드를 값으로 들고 다니는 에러.
 *
 * 호출부가 409(다른 사람이 먼저 저장함)를 나머지 실패와 다르게 처리해야 한다.
 * 메시지 문자열을 비교하는 방식이면 서버 문구를 다듬는 순간 조용히 깨진다.
 *
 * `issues` 는 path 를 함께 들고 다닌다. 폼이 오류를 해당 입력 아래에 붙이려면
 * 메시지만으로는 어느 필드인지 알 수 없다.
 */
export class BannersApiError extends Error {
  status: number;

  issues: BannerIssue[];

  constructor(status: number, message: string, issues: BannerIssue[] = []) {
    super(message);
    this.name = 'BannersApiError';
    this.status = status;
    this.issues = issues;
  }
}

/**
 * banners API 전용 fetch.
 *
 * 읽기(entities)와 쓰기(features) 양쪽이 쓰므로 entity 에 둔다 — features 는
 * entities 를 import 할 수 있지만 그 반대는 안 되기 때문이다.
 *
 * FormData 본문에는 Content-Type 을 붙이지 않는다. 직접 붙이면 multipart 경계
 * 문자열이 빠져 서버가 파싱하지 못한다.
 */
export const requestBannersApi = async <T>(input: string, init?: RequestInit): Promise<T> => {
  const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData;

  const response = await fetch(input, {
    ...init,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | (BannersApiErrorBody & { issues?: { path?: string; message?: string }[] })
      | null;
    throw new BannersApiError(
      response.status,
      body?.message || '요청에 실패했습니다.',
      (body?.issues ?? [])
        .filter((issue) => issue.message)
        .map((issue) => ({ path: issue.path ?? '', message: issue.message ?? '' })),
    );
  }

  return (await response.json()) as T;
};
