import { useMe } from '@uoslife/api';
import { useEffect, useState } from 'react';

export const useUser = () => {
  const [isUserInitialized, setIsUserInitialized] = useState(false);
  const { data: me, isLoading, isError } = useMe();
  useEffect(() => {
    if (me || isError || !isLoading) {
      setIsUserInitialized(true);
    }
  }, [me, isLoading, isError]);
  return { role: me?.role, isUserInitialized };
};
