import type { SessionType } from '@/app/provider/session-provider';

export const isMockAuthEnabled = () => process.env.MOCK_AUTH === 'true';

// 로컬 프로토타이핑 전용 목 세션. Keycloak 로그인 없이 "로그인된" 상태를 만들기 위해 사용한다.
export const MOCK_SESSION: SessionType = {
  user: {
    name: '목로그인테스터',
    email: 'mock.user@uoslife.com',
    image: null,
  },
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  idToken: 'mock-id-token',
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
} as SessionType;
