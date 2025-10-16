'use client';
import { useAnalytics } from '@/entities/analytics/useAnalytics';
import { useSendInViewAmplitudeEvent } from '@/entities/analytics/useSendInViewAmplitudeEvent';
import { Text } from '@shared/component/Text';
import Image from 'next/image';

export function Section03() {
  const { trackEvent } = useAnalytics();
  const { ref } = useSendInViewAmplitudeEvent('SCROLL_HOME', {
    tab_name: 'home',
    scroll_section: '2_app_download',
  });
  return (
    <div
      className="relative flex flex-col items-center justify-center gap-40 my-32 pb-[512px]"
      ref={ref}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="text-4xl font-bold">
          <Text variant="title-28-b" color="grey-500" className='max-md:text-title-18-b'>
            How We Make It Real
          </Text>
        </div>
        <div className="text-gray-500 text-xl">
          <Text as="h2" variant="title-60-b" className='max-md:text-title-24-b'>
            <span>시대생은 </span>
            <Text as="span" variant="title-60-b" color="primary-gradiant" className='max-md:text-title-24-b'>
              PM · 개발 · 디자인 · 마케팅{' '}
            </Text>
            <span>챕터로 조직되어</span>
            <br />
            <span>아이디어를 실제 서비스로 구현합니다.</span>
          </Text>
        </div>
      </div>
      <div className="relative flex flex-row justify-between gap-40 pb-[420px]">
        <div className="flex flex-col gap-4 mt-[54px]">
          <Text variant="title-28-b" color="primary-ui" className='max-md:text-title-16-b'>
            시간표 · 공지사항
          </Text>
          <Text
            variant="title-48-b"
            className="whitespace-pre-line max-md:text-title-20-b"
          >{`학교 생활에 꼭\n필요한\n유틸리티부터`}</Text>
        </div>
        <div className="flex flex-row gap-4">
          <Image
            src={'/img/section03_mock_01.webp'}
            alt={''}
            width={340}
            height={740}
            className="pb-32"
          />
          <Image
            src={'/img/section03_mock_02.webp'}
            alt={''}
            width={340}
            height={740}
            className="pt-32"
          />
        </div>

        <div className="absolute bottom-0 flex flex-row-reverse items-end justify-between gap-20">
          <div className="flex flex-col gap-4 mt-[54px] pb-40">
            <Text variant="title-28-b" color="primary-ui">
              시대팅
            </Text>
            <Text
              variant="title-48-b"
              className="whitespace-pre-line"
            >{`대학생활을 더 풍요롭게\n만들어주는 매칭 서비스까지`}</Text>
          </div>
          <Image
            src={'/img/section03_mock_03.webp'}
            alt={''}
            width={340}
            height={740}
          />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full px-8 rounded-[62px] h-[600px] flex flex-col items-center justify-end gap-8 pb-12">
        <Image
          src="/img/section03_bg.webp"
          alt="section 03 background"
          fill
          className="absolute -z-10 top-0 left-0 w-full"
        />
        <div className="flex flex-col gap-5 items-center">
          <Image
            src="/img/uoslife_logo_white.png"
            alt="uoslife_logo_white"
            height={72}
            width={72}
            className="rounded-2xl"
          />
          <Text
            variant="title-40-b"
            color="white"
            className="whitespace-pre-line text-center"
          >{`새로운 연결을 확장하는\n서비스를 운영하고 있습니다.`}</Text>
        </div>
        <div className="flex flex-row gap-3">
          <a
            href="https://apps.apple.com/kr/app/%EC%8B%9C%EB%8C%80%EC%83%9D-%EB%82%B4-%EC%86%90%EC%95%88%EC%9D%98-%EC%84%9C%EC%9A%B8%EC%8B%9C%EB%A6%BD%EB%8C%80%ED%95%99%EA%B5%90/id1514073192"
            target="_blank"
            rel="noopener"
            className="flex flex-row gap-2 items-center justify-center rounded-xl px-4 py-2 bg-grey-800"
            onClick={() => {
              trackEvent('CLICK_DOWNLOAD', {
                platform: 'ios',
              });
            }}
          >
            <Image
              src="/svg/ios_logo.svg"
              alt="ios logo"
              height={19}
              width={22}
            />
            <Text
              variant="body-14-m"
              color="white"
              className="flex items-center gap-1"
            >
              <Text as="span" variant="body-16-b" color="white">
                iOS 앱
              </Text>
              다운로드
            </Text>
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.beyondconnect.uoslife&hl=ko"
            target="_blank"
            rel="noopener"
            className="flex flex-row gap-2 items-center justify-center rounded-xl px-4 py-2 bg-grey-800"
            onClick={() => {
              trackEvent('CLICK_DOWNLOAD', {
                platform: 'android',
              });
            }}
          >
            <Image
              src="/svg/google_play_logo.svg"
              alt="google play logo"
              height={19}
              width={22}
            />
            <Text
              variant="body-14-m"
              color="white"
              className="flex items-center gap-1"
            >
              <Text as="span" variant="body-16-b" color="white">
                Android 앱
              </Text>
              다운로드
            </Text>
          </a>
        </div>
      </div>
    </div>
  );
}
