import * as amplitude from '@amplitude/analytics-browser';
import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect } from 'react';
import { AmlitudeEventNameMapper, AmplitudeEventName } from './AmplitudeEventParameterMap';
import { AmplitudeEventParameterMap } from './AmplitudeEventParameterMap';
import { makeBaseProperty } from './utils/makeBaseProperty';
import { useUser } from '../api/useUser';

declare global {
  interface Window {
    dataLayer: {
      event: (typeof AmlitudeEventNameMapper)[AmplitudeEventName];
      properties: (typeof AmplitudeEventParameterMap)[AmplitudeEventName] extends undefined
        ? undefined
        : ReturnType<Exclude<(typeof AmplitudeEventParameterMap)[AmplitudeEventName], undefined>>;
    }[];
  }
}

export type EventPropertyType = {
  [K in AmplitudeEventName]: (typeof AmplitudeEventParameterMap)[K] extends undefined
    ? undefined
    : ReturnType<Exclude<(typeof AmplitudeEventParameterMap)[K], undefined>>;
};

if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
}

const AnalyticsContext = createContext<{
  trackEvent: (eventName: AmplitudeEventName, eventProperties?: EventPropertyType[AmplitudeEventName]) => void;
}>(
  {} as {
    trackEvent: (eventName: AmplitudeEventName, eventProperties?: EventPropertyType[AmplitudeEventName]) => void;
  },
);

const AnalyticsContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { role, isUserInitialized } = useUser();
  if (!process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
    throw new Error('AMPLITUDE_API_KEY is not set');
  }
  useEffect(() => {
    amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!, {
      autocapture: true,
    });
  }, []);

  /**
   * 기본속성
   * 1. device (pc, mobile)
   * 2. member_role (guest, associate_member, full_member, admin)
   * @description Amplitude 이벤트를 추적하는 함수
   * @param eventName - 이벤트 이름
   * @param eventProperties - 이벤트 속성
   * @returns void
   */
  const trackEvent = useCallback(
    (eventName: AmplitudeEventName, eventProperties?: EventPropertyType[AmplitudeEventName]) => {
      if (!isUserInitialized) return;

      const properties = {
        ...eventProperties,
        ...makeBaseProperty(role ?? 'GUEST'),
        event_space: 'teampage',
      };

      if (typeof window !== 'undefined') {
        window.dataLayer.push({
          event: AmlitudeEventNameMapper[eventName],
          properties: properties as any,
        });
      }
      const isProduction = process.env.NODE_ENV === 'production';
      if (!isProduction) return;
      amplitude.logEvent(AmlitudeEventNameMapper[eventName], properties);
    },
    [role, isUserInitialized],
  );

  return <AnalyticsContext.Provider value={{ trackEvent }}>{children}</AnalyticsContext.Provider>;
};

export const useAnalytics = () => useContext(AnalyticsContext);

export default AnalyticsContextProvider;
