'use client';
import { useAnalytics } from '@/entities/analytics/useAnalytics';
import { useSendInViewAmplitudeEvent } from '@/entities/analytics/useSendInViewAmplitudeEvent';
import { Text } from '@shared/component/Text';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

export function Section09() {
  const { trackEvent } = useAnalytics();
  const { ref } = useSendInViewAmplitudeEvent('SCROLL_HOME', {
    tab_name: 'home',
    scroll_section: '6_recruit',
  });
  return (
    <div
      className={twMerge(
        `w-full`,
        `bg-[url(/img/section09_bg.webp)] bg-object-cover bg-right-bottom relative flex flex-col justify-center px-[180px] h-[600px] max-md:px-[18px]`,
        `max-md:flex-col max-md:gap-6 max-md:h-[300px] max-md:p-[inherit] max-md:bg-center max-md:bg-no-repeat`,
        `max-md:bg-[url(/img/home_section09_bg.png)] bg-cover max-md:m-0`,
      )}
      ref={ref}
    >
      <div className="flex flex-col gap-9 items-start max-md:w-full max-md:h-full max-md:pt-8 max-md:justify-start max-md:p-9">
        <div className="flex flex-col gap-4">
          <Text variant="title-60-b" color="white" className="max-md:whitespace-nowrap max-md:text-title-24-b">
            시대생에 합류하고 싶다면?
          </Text>
          <Text variant="title-24-m" color="grey-100" className="max-md:text-body-14-m">
            다음 모집 소식을 가장 먼저 이메일로 받아보세요.
          </Text>
        </div>
        <Link
          href="https://forms.gle/JntWWCzKjzRwZbaJ7"
          target="_blank"
          className="bg-white px-7 py-4 rounded-[32px] max-md:px-4 max-md:py-[6px]"
          onClick={() => {
            trackEvent('CLICK_RECRUIT_ALERT');
          }}
        >
          <Text variant="title-24-b" className="max-md:text-body-16-b">
            모집 알림 받기
          </Text>
        </Link>
      </div>
    </div>
  );
}
