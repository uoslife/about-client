import * as amplitude from '@amplitude/analytics-browser';
import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect } from 'react';
import { AmlitudeEventNameMapper, AmplitudeEventName } from './AmplitudeEventParameterMap';
import { AmplitudeEventParameterMap } from './AmplitudeEventParameterMap';
import { makeBaseProperty } from './utils/makeBaseProperty';
import { useUser } from '../api/useUser';
import ReactGA from 'react-ga4';

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
  const { role, isLoading, userId } = useUser();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || !process.env.NEXT_PUBLIC_GA4_TRACKING_ID) {
      throw new Error('AMPLITUDE_API_KEY or GA4_TRACKING_ID is not set');
    }
    // Amplitude 초기화
    amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!, {
      autocapture: true,
    });
    // ReactGA 초기화
    ReactGA.initialize([
      {
        trackingId: process.env.NEXT_PUBLIC_GA4_TRACKING_ID,
        gaOptions: { userId: userId },
      },
    ]);
  }, [userId]);

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
      if (isLoading) return;

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
      ReactGA.event(AmlitudeEventNameMapper[eventName], properties);
    },
    [role, isLoading],
  );

  return <AnalyticsContext.Provider value={{ trackEvent }}>{children}</AnalyticsContext.Provider>;
};

export const useAnalytics = () => useContext(AnalyticsContext);

export default AnalyticsContextProvider;
