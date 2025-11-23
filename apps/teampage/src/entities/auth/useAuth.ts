'use client';
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
  const { data: rawSession, status } = useSession();

  const safeParseSession = (session: Session): session is SessionType => {
    if ('accessToken' in session && 'refreshToken' in session) {
      return true;
    }
    return false;
  };

  const session =
    rawSession && safeParseSession(rawSession)
      ? {
          ...rawSession,
          user: {
            ...rawSession.user,
            name: parseUserName(rawSession.user?.name || ''),
          },
        }
      : null;

  const handleSignOut = async () => {
    signOut({ redirect: false });
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
    signOut: handleSignOut,
  };
};
