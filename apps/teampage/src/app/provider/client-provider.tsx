'use client';
import dynamic from 'next/dynamic';
import AnalyticsContextProvider from '@/entities/analytics/useAnalytics';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/shared/component/toast/ToastContext';
import { ConfirmModalProvider } from '@/shared/component/confirm-modal/ConfirmModalContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Session } from 'next-auth';

const DimRenderer = dynamic(
  () =>
    import('@/widgets/renderer/DimRenderer').then((mod) => ({
      default: mod.DimRenderer,
    })),
  {
    ssr: false,
  },
);

export const ClientProvider = ({ children, session }: { children: React.ReactNode; session: Session | null }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider session={session} refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      {/* <SessionTokenBridge /> */}
      <QueryClientProvider client={queryClient}>
        <AnalyticsContextProvider>
          <ToastProvider>
            <ConfirmModalProvider>
              {children}
              <DimRenderer />
            </ConfirmModalProvider>
          </ToastProvider>
        </AnalyticsContextProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};
