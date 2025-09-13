'use client';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/shared/component/toast/ToastContext';
import { Toast } from '@/shared/component/toast/Toast';
import { useToastContext } from '@/shared/component/toast/ToastContext';

const ToastRenderer = () => {
  const { message, isVisible, hideToast } = useToastContext();
  return <Toast message={message} isVisible={isVisible} onClose={hideToast} />;
};

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {children}
          <ToastRenderer />
        </ToastProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};
