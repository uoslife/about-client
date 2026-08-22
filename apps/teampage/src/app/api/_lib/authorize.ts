import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/auth';

/**
 * route handler 전용 인가.
 *
 * app 레이어에 두는 이유: next-auth 설정(`app/auth.ts`)을 참조해야 하는데,
 * entities/shared 는 app 을 import 할 수 없다(FSD 규칙, eslint 로 강제됨).
 * flags 전용도 아니라서 route handler 들이 공유하도록 app/api/_lib 에 둔다.
 *
 * `RoleGuard.tsx`는 클라이언트 `useEffect` 리다이렉트라 인가가 아니다.
 * 서버에서 세션을 직접 확인하고, role은 next-auth 세션이 아니라
 * 백엔드 `/auth/me`에서 가져온다. (`entities/api/useUser.ts` 참고)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://about-api.uoslife.com/';

interface Me {
  id?: number;
  role?: string;
  email?: string;
  name?: string;
}

export interface Authorized {
  accessToken: string;
  me: Me;
  /** 감사 로그(private 문서 updatedBy)에 남길 식별자 */
  actor: string;
}

export class AuthError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const authorize = async (): Promise<Authorized> => {
  const session = (await getServerSession(authOptions)) as { accessToken?: string; user?: { email?: string } } | null;

  if (!session?.accessToken) {
    throw new AuthError(401, '로그인이 필요합니다.');
  }

  const meUrl = new URL('/auth/me', API_BASE_URL).toString();
  const response = await fetch(meUrl, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new AuthError(401, '사용자 정보를 확인할 수 없습니다.');
  }

  const me = (await response.json()) as Me;

  if (!me.role || me.role === 'GUEST') {
    throw new AuthError(403, '접근 권한이 없습니다.');
  }

  return {
    accessToken: session.accessToken,
    me,
    actor: me.email || session.user?.email || me.name || String(me.id ?? 'unknown'),
  };
};

/**
 * AWS SDK 는 실패 사유를 `name` 에 담는다. 이름만 노출한다 — 버킷·키·자격증명은
 * 담기지 않고, 이게 없으면 운영자가 500 을 보고도 권한 문제인지 알 수 없다.
 */
const awsErrorName = (error: unknown): string | null => {
  const name = (error as { name?: string })?.name;
  if (typeof name !== 'string') return null;
  return /^(AccessDenied|NoSuchBucket|InvalidAccessKeyId|SignatureDoesNotMatch|CredentialsProviderError|ExpiredToken|NetworkingError|TimeoutError)$/.test(
    name,
  )
    ? name
    : null;
};

export const toErrorResponse = (error: unknown) => {
  if (error instanceof AuthError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  console.error('[api]', error);

  const reason = awsErrorName(error);
  if (reason) {
    return NextResponse.json(
      { message: `저장소에 접근하지 못했습니다. (${reason})`, reason },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 });
};
