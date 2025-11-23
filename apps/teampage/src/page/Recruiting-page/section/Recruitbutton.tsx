import { useAnalytics } from '@/entities/analytics/useAnalytics';

export function Recruitbutton({ className = '' }) {
  const { trackEvent } = useAnalytics();
  const now = new Date();
  const startDate = new Date('2024-11-24T00:00:00');
  const endDate = new Date('2024-11-30T23:59:59');

  const isInRange = now >= startDate && now <= endDate;
  const status = isInRange == true ? '6기 지원하기' : '다음 모집 알림 받기';
  return (
    <button
      onClick={() => {
        trackEvent('CLICK_RECRUIT_BUTTON', undefined);
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
