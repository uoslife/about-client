import { useMe } from '@uoslife/api';

export const useUser = () => {
  const { data: me } = useMe();
  return { role: me?.role };
};
