import NextAuth from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../auth';
import { isMockAuthEnabled, MOCK_SESSION } from '@/shared/mocks/session';

const handler = NextAuth(authOptions);

// next-auth/react의 SessionProvider는 마운트/포커스 시마다 /api/auth/session을 다시 fetch한다.
// MOCK_AUTH가 켜져 있으면 실제 Keycloak 세션 체크 대신 목 세션을 그대로 돌려줘서
// 로그인 상태가 리프레시 도중 풀리지 않게 한다.
export async function GET(req: NextRequest, ctx: { params: { nextauth: string[] } }) {
  if (isMockAuthEnabled() && req.nextUrl.pathname.endsWith('/session')) {
    return NextResponse.json(MOCK_SESSION);
  }
  return handler(req, ctx);
}

export { handler as POST };
