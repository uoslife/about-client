'use client';
import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Session } from 'next-auth';

type SessionType = {
  accessToken: string;
  refreshToken: string;
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

  return {
    session,
    status,
    signIn,
    signOut,
  };
};
