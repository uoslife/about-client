'use client';
import { useEffect } from 'react';
import { useAnalytics } from './useAnalytics';
import { AmplitudeEventName } from './AmplitudeEventParameterMap';
import { EventPropertyType } from './useAnalytics';

export const useSendViewAmplitudeEvent = (
  eventName: AmplitudeEventName,
  eventProperties?: EventPropertyType[AmplitudeEventName],
) => {
  const { trackEvent } = useAnalytics();
  useEffect(() => {
    trackEvent(eventName, eventProperties);
  }, [trackEvent, eventName, eventProperties]);
};
