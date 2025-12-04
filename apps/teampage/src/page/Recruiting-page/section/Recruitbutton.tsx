import { ISINRANGE } from '../Recruitingpage';
import { useAnalytics } from '@/entities/analytics/useAnalytics';

export function Recruitbutton({ className = '' }) {
  const { trackEvent } = useAnalytics();
  const status = ISINRANGE == true ? '6기 지원하기' : '다음 모집 알림 받기';
  return (
    <button
      onClick={() => {
        trackEvent('CLICK_RECRUIT_BUTTON', undefined);
        window.open(
          ISINRANGE
            ? 'https://docs.google.com/forms/d/e/1FAIpQLSeBv_mC-gD4WdQAbYZ6RPHDmuiHLey44AaU5XBeDgxLkSqcKQ/viewform'
            : 'http://forms.gle/JntWWCzKjzRwZbaJ7',
          '_blank',
        );
      }}
      className={`flex justify-center items-center h-[4.25rem] px-10 gap-2.5 rounded-xl bg-[#222227] ${className}
      max-md:h-12 max-md:px-7 max-md:rounded-lg`}
    >
      <span className="text-white text-2xl font-bold leading-[150%] max-md:text-base max-md:leading-[160%]">
        {status}
      </span>
    </button>
  );
}
