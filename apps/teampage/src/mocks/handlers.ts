import { http, HttpResponse } from 'msw';

/**
 * 로컬 개발용 MSW 핸들러 (목로그인 + 프로덕션 격리).
 *
 * axios baseURL(NEXT_PUBLIC_API_BASE_URL)이 기본값으로는 실제 프로덕션
 * (https://about-api.uoslife.com) 을 가리키므로, `.env.local`에서 존재하지
 * 않는 로컬 주소(API_ORIGIN)로 돌려두고 여기서 목킹한다.
 *
 * ⚠️ 패턴은 반드시 API_ORIGIN 으로 범위를 좁힐 것. 범위 없는 '*' 를 쓰면
 * Next.js 자체 요청(RSC 네비게이션, /api/auth/*, 정적 파일, HMR)까지 전부
 * 가로채 앱이 통째로 깨진다.
 */

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:9999';

const MOCK_ME = {
  id: 'mock-user-0001',
  email: 'mock@uoslife.team',
  firstName: '업',
  lastName: '목',
  name: '목업',
  role: 'ADMIN' as const,
  phoneNumber: '01000000000',
  generation: '10',
};

export const handlers = [
  http.get(`${API_ORIGIN}/auth/me`, () => HttpResponse.json(MOCK_ME)),

  // 그 외 GET (API_ORIGIN 범위 내): 프로덕션 차단, 빈 배열 응답.
  // 이 앱의 목록형 엔드포인트(/notifications/logs, /notifications/scheduled 등)가
  // 응답을 바로 .filter()/.map() 하므로 null 이 아닌 [] 을 기본값으로 둔다.
  http.get(`${API_ORIGIN}/*`, ({ request }) => {
    console.warn('[mock] 미정의 GET → 빈 배열 응답:', request.url);
    return HttpResponse.json([], { status: 200 });
  }),
  // 쓰기 요청 전부 차단 (API_ORIGIN 범위 내, 실 서버로 안 나감)
  http.all(`${API_ORIGIN}/*`, ({ request }) => {
    console.warn(`[mock] 쓰기 차단 (${request.method}):`, request.url);
    return HttpResponse.json({ mocked: true }, { status: 200 });
  }),
];
