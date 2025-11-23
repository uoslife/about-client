'use client';
import { useSession, signIn, signOut as _signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { useMemo } from 'react';

type SessionType = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
} & Session;

const parseUserName = (name: string) => {
  return name.split(' ').reverse().join('');
};

export const useAuth = () => {
  const { data: rawSession, status } = useSession();

  const safeParseSession = (session: Session): session is SessionType => {
    if ('accessToken' in session && 'refreshToken' in session) {
      return true;
    }
    return false;
  };

  const session = useMemo(() => {
    if (!(rawSession && safeParseSession(rawSession))) return null;

    return {
      ...rawSession,
      user: {
        ...rawSession.user,
        name: parseUserName(rawSession.user?.name || ''),
      },
    };
  }, [rawSession]);

  const signOut = async () => {
    _signOut({ redirect: false });
    if (!process.env.NEXT_PUBLIC_NEXTAUTH_URL || !session) throw new Error('NEXT_PUBLIC_NEXTAUTH_URL is not defined');

    const keycloakLogoutUrl =
      `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/logout?` +
      `redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_NEXTAUTH_URL)}`;

    window.location.href = keycloakLogoutUrl;
  };

  return {
    session,
    status,
    signIn,
    signOut,
  };
};
