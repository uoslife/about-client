import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../auth/useAuth';

const NON_MEMBER_ID_KEY = 'NON_MEMBER_ID';

export const useNonMemberId = () => {
  const { session } = useAuth();
  const nonMemberId = useMemo(() => {
    if (session?.accessToken) {
      return undefined;
    }
    if (localStorage.getItem(NON_MEMBER_ID_KEY)) {
      return localStorage.getItem(NON_MEMBER_ID_KEY) ?? undefined;
    }
    const uuid = uuidv4();
    localStorage.setItem(NON_MEMBER_ID_KEY, uuid);
    return uuid;
  }, [session?.accessToken]);

  const authorizationHeader = useMemo(() => {
    if (nonMemberId) {
      return {};
    }
    return {
      Authorization: `Bearer ${session?.accessToken}`,
    };
  }, [nonMemberId, session?.accessToken]);

  return { nonMemberId, authorizationHeader };
};
