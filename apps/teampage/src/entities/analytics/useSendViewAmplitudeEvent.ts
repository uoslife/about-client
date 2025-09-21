'use client';
import { useEffect } from 'react';
import { useAnalytics } from './useAnalytics';
import {
  AmplitudeEventName,
  AmplitudeEventParameterMap,
} from './AmplitudeEventParameterMap';

export const useSendViewAmplitudeEvent = <T extends AmplitudeEventName>(
  eventName: T,
  eventProperties?: ReturnType<(typeof AmplitudeEventParameterMap)[T]>,
) => {
  const { trackEvent } = useAnalytics();
  useEffect(() => {
    trackEvent(eventName, eventProperties);
  }, [trackEvent, eventName, eventProperties]);
};
