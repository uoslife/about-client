import {
  isRecruitingApplicationActive,
  recruitingApplyButtonLabel,
  recruitingCallToAction,
} from '@/page/Recruiting-page/config';
import { useAnalytics } from '@/entities/analytics/useAnalytics';

export function Recruitbutton({ className = '' }) {
  const { trackEvent } = useAnalytics();
  const applicationActive = isRecruitingApplicationActive();
  const label = applicationActive ? recruitingApplyButtonLabel() : recruitingCallToAction.notifyLabel;
  return (
    <button
      onClick={() => {
        trackEvent('CLICK_RECRUIT_BUTTON', undefined);
        window.open(
          applicationActive ? recruitingCallToAction.applyFormUrl : recruitingCallToAction.notifyFormUrl,
          '_blank',
        );
      }}
      className={`flex justify-center items-center h-[4.25rem] px-10 gap-2.5 rounded-xl bg-[#222227] ${className}
      max-md:h-12 max-md:px-7 max-md:rounded-lg`}
    >
      <span className="text-white text-2xl font-bold leading-[150%] max-md:text-base max-md:leading-[160%]">
        {label}
      </span>
    </button>
  );
}
