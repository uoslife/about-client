import * as amplitude from '@amplitude/analytics-browser';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
} from 'react';

type AnalyticsContextProps = {
  trackEvent: (
    eventName: string,
    eventProperties?: Record<string, any>,
  ) => void;
};

const AnalyticsContext = createContext<AnalyticsContextProps>(
  {} as AnalyticsContextProps,
);

export const trackEvent = (
  eventName: string,
  eventProperties?: Record<string, any>,
) => {
  amplitude.logEvent(eventName, eventProperties);
};

const AnalyticsContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  if (!process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
    throw new Error('AMPLITUDE_API_KEY is not set');
  }
  useEffect(() => {
    amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!, {
      autocapture: true,
    });
  }, []);

  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => useContext(AnalyticsContext);

export default AnalyticsContextProvider;
