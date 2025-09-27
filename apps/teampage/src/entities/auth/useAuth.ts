'use client';
import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Session } from 'next-auth';

type SessionType = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
} & Session;

const parseUserName = (name: string) => {
  return name.split(' ').reverse().join('');
};

export const useAuth = () => {
  const [session, setSession] = useState<SessionType | null>(null);
  const { data: rawSession, status } = useSession();

  const safeParseSession = (session: Session): session is SessionType => {
    if ('accessToken' in session && 'refreshToken' in session) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (rawSession && safeParseSession(rawSession)) {
      const session = {
        ...rawSession,
        user: {
          ...rawSession.user,
          name: parseUserName(rawSession.user?.name || ''),
        },
      };
      setSession(session);
    }
  }, [rawSession]);

  const handleSignOut = async () => {
    signOut({ redirect: false });
    if (!process.env.NEXT_PUBLIC_NEXTAUTH_URL || !session)
      throw new Error('NEXT_PUBLIC_NEXTAUTH_URL is not defined');

    // keycloak server에서 로그아웃 시키도록 수정

    const keycloakLogoutUrl =
      `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/logout?` +
      `redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_NEXTAUTH_URL)}`;

    // TODO: 로그아웃시, 로그아웃 페이지에서 진행하지 않고 바로 홈페이지로 redirect 하도록 수정 필요
    // const keycloakLogoutUrl =
    //   `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/logout?` +
    //   `id_token_hint=${session?.idToken}&` +
    //   `post_logout_redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_NEXTAUTH_URL)}`;

    window.location.href = keycloakLogoutUrl;
  };

  return {
    session,
    status,
    signIn,
    signOut: handleSignOut,
  };
};
