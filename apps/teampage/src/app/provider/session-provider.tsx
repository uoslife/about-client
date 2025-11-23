'use client';
import { setAccessToken } from '@uoslife/api';
import { Session } from 'next-auth';
import { SessionProvider as _SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

export type SessionType = Nullable<Session & { accessToken: string; refreshToken: string; idToken: string }>;

export const SessionProvider = async ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: SessionType | null;
}) => {
  // api instance에 access token 설정
  useEffect(() => {
    if (!session) return;
    const token = session.accessToken ?? null;
    setAccessToken(token);
  }, [session]);

  return (
    <_SessionProvider session={session} refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      {children}
    </_SessionProvider>
  );
};

declare global {
  export type Nullable<T> = T | null;
}
