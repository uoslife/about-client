'use client';
import dynamic from 'next/dynamic';
import AnalyticsContextProvider from '@/entities/analytics/useAnalytics';
import { ToastProvider } from '@/shared/component/toast/ToastContext';
import { ConfirmModalProvider } from '@/shared/component/confirm-modal/ConfirmModalContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { DeviceProvider } from '@/shared/provider/DeviceProvider';
import { MSWProvider } from '@/shared/mocks/MSWProvider';

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
    <QueryClientProvider client={queryClient}>
      <AnalyticsContextProvider>
        <ToastProvider>
          <DeviceProvider>
            <ConfirmModalProvider>
              <MSWProvider>
                {children}
                <DimRenderer />
              </MSWProvider>
            </ConfirmModalProvider>
          </DeviceProvider>
        </ToastProvider>
      </AnalyticsContextProvider>
    </QueryClientProvider>
  );
};
