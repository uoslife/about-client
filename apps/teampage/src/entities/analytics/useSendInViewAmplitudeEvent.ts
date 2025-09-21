import { useEffect, useRef } from 'react';
import { useAnalytics } from './useAnalytics';
import {
  AmplitudeEventName,
  AmplitudeEventParameterMap,
} from './AmplitudeEventParameterMap';

export const useSendInViewAmplitudeEvent = <T extends AmplitudeEventName>(
  eventName: T,
  eventProperties?: ReturnType<(typeof AmplitudeEventParameterMap)[T]>,
) => {
  const ref = useRef<HTMLDivElement>(null);

  const { trackEvent } = useAnalytics();
  useEffect(() => {
    if (!ref.current) return;

    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          trackEvent(eventName, eventProperties);
          intersectionObserver.disconnect();
        }
      });
    });
    intersectionObserver.observe(ref.current);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [trackEvent, eventName, eventProperties]);

  return { ref };
};
