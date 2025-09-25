'use client';
import dynamic from 'next/dynamic';
import AnalyticsContextProvider from '@/entities/analytics/useAnalytics';
import { SessionProvider, useSession } from 'next-auth/react';
import { ToastProvider } from '@/shared/component/toast/ToastContext';
import { ConfirmModalProvider } from '@/shared/component/confirm-modal/ConfirmModalContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { useEffect } from 'react';
import { setAccessToken } from '@uoslife/api';

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
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      <SessionTokenBridge />
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

function SessionTokenBridge() {
  const { data: session } = useSession();
  useEffect(() => {
    const token = (session as any)?.accessToken ?? null;
    setAccessToken(token);
  }, [session]);
  return null;
}