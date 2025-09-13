import { useToastContext } from './ToastContext';

export const useToast = () => {
  const { showToast, hideToast } = useToastContext();

  const toast = (message: string, duration?: number) => {
    showToast(message, duration);
  };

  return {
    toast,
    hideToast,
  };
};
