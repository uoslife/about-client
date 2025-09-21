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
  const hasSentEvent = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  const { trackEvent } = useAnalytics();
  useEffect(() => {
    if (!ref.current || typeof window === 'undefined') return;

    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          !hasSentEvent.current && trackEvent(eventName, eventProperties);
          hasSentEvent.current = true;
          intersectionObserver.disconnect();
        }
      });
    });
    intersectionObserver.observe(ref.current);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [trackEvent, eventName, eventProperties, hasSentEvent]);

  return { ref };
};
