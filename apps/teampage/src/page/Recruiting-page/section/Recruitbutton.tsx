import {
  recruitingApplicationPhase,
  recruitingApplyButtonLabel,
  recruitingCallToAction,
  recruitingUpcomingButtonLabel,
} from '@/page/Recruiting-page/config';
import { useAnalytics } from '@/entities/analytics/useAnalytics';

export function Recruitbutton({ className = '' }) {
  const { trackEvent } = useAnalytics();
  const phase = recruitingApplicationPhase();
  const applicationActive = phase === 'active';
  const label =
    phase === 'upcoming'
      ? recruitingUpcomingButtonLabel()
      : applicationActive
        ? recruitingApplyButtonLabel()
        : recruitingCallToAction.notifyLabel;
  return (
    <button
      disabled={phase === 'upcoming'}
      onClick={() => {
        trackEvent('CLICK_RECRUIT_BUTTON', undefined);
        window.open(
          applicationActive ? recruitingCallToAction.applyFormUrl : recruitingCallToAction.notifyFormUrl,
          '_blank',
        );
      }}
      className={`flex justify-center items-center h-[4.25rem] px-10 gap-2.5 rounded-xl bg-[#222227] disabled:cursor-default ${className}
      max-md:h-12 max-md:px-7 max-md:rounded-lg`}
    >
      <span className="text-white text-2xl font-bold leading-[150%] max-md:text-base max-md:leading-[160%]">
        {label}
      </span>
    </button>
  );
}
