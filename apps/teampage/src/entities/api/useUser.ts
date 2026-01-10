import { useMe } from '@uoslife/api';
import { useSession } from 'next-auth/react';

export const useUser = () => {
  const { data: session } = useSession();

  const { data: me, isLoading } = useMe({
    query: {
      enabled: !!session,
      retry: false,
    },
  });

  return {
    role: me?.role,
    userId: me?.id,
    isLoading,
  };
};
