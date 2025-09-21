import { useCallback } from 'react';
import { useToastActions } from './ToastContext';

export const useToast = () => {
  const { showToast, hideToast } = useToastActions();

  const toast = useCallback(
    (message: string, duration?: number) => {
      showToast(message, duration);
    },
    [showToast],
  );

  return {
    toast,
    hideToast,
  };
};
