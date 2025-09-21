'use client';
import dynamic from 'next/dynamic';
import AnalyticsContextProvider from '@/entities/analytics/useAnalytics';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/shared/component/toast/ToastContext';
import { ConfirmModalProvider } from '@/shared/component/confirm-modal/ConfirmModalContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const DimRenderer = dynamic(
  () =>
    import('@/widgets/renderer/DimRenderer').then((mod) => ({
      default: mod.DimRenderer,
    })),
  {
    ssr: false,
  },
);

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      <AnalyticsContextProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <ConfirmModalProvider>
              {children}
              <DimRenderer />
            </ConfirmModalProvider>
          </ToastProvider>
        </QueryClientProvider>
      </AnalyticsContextProvider>
    </SessionProvider>
  );
};
