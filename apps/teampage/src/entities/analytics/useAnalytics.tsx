import * as amplitude from '@amplitude/analytics-browser';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { AmplitudeEventName } from './AmplitudeEventParameterMap';
import { AmplitudeEventParameterMap } from './AmplitudeEventParameterMap';
import { makeBaseProperty } from './utils/makeBaseProperty';
import { useUser } from '../api/useUser';

declare global {
  interface Window {
    dataLayer: {
      event: AmplitudeEventName;
      properties: ReturnType<
        (typeof AmplitudeEventParameterMap)[AmplitudeEventName]
      >;
    }[];
  }
}

window.dataLayer = window.dataLayer || [];

type AnalyticsContextProps = {
  trackEvent: <T extends AmplitudeEventName>(
    eventName: T,
    eventProperties?: ReturnType<(typeof AmplitudeEventParameterMap)[T]>,
  ) => void;
};

const AnalyticsContext = createContext<AnalyticsContextProps>(
  {} as AnalyticsContextProps,
);

const AnalyticsContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { role, isUserInitialized } = useUser();
  if (!process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
    throw new Error('AMPLITUDE_API_KEY is not set');
  }
  useEffect(() => {
    amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!, {
      autocapture: true,
    });
  }, []);

  const trackEvent = useCallback(
    <T extends AmplitudeEventName>(
      eventName: T,
      eventProperties?: ReturnType<(typeof AmplitudeEventParameterMap)[T]>,
    ) => {
      if (!isUserInitialized) return;
      const properties = {
        ...eventProperties,
        ...makeBaseProperty(role ?? 'GUEST'),
      };
      amplitude.logEvent(eventName, properties);
      window.dataLayer.push({
        event: eventName,
        properties,
      });
    },
    [role, isUserInitialized],
  );

  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => useContext(AnalyticsContext);

export default AnalyticsContextProvider;
