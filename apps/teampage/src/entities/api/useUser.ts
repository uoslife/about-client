import { useMe } from '@uoslife/api';
import { useNonMemberId } from '../member-id/useNonmemberId';

export const useUser = () => {
  const { authorizationHeader } = useNonMemberId();
  const { data: me } = useMe({ axios: { headers: authorizationHeader } });
  return { role: me?.data.role };
};
