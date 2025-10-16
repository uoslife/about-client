'use client';
import { useAnalytics } from '@/entities/analytics/useAnalytics';
import { Divider } from '@shared/component/Divider';
import { Text } from '@shared/component/Text';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  const { trackEvent } = useAnalytics();

  return (
    <div className="bg-grey-800 pb-[60px] px-[120px] pt-40 w-full mx-auto max-md:py-[20px] max-md:px-[16px]">
      <div className="flex flex-row gap-4 max-w-pc justify-between items-end w-full mx-auto max-md:flex-col max-md:items-start">
        <div className="flex flex-col gap-4 items-start max-md:flex-row max-md:gap-2 max-md:items-center">
          <div className="relative h-[45px] w-32 max-md:h-[22px] max-md:w-[35px]">
            <Image
              src={'/svg/uoslife_logo.svg'}
              alt="UOSLIFE Logo"
              fill={true}
              objectFit="contain"
              style={{
                filter: 'invert(1)',
              }}
            />
          </div>
          <Text variant="body-18-m" color="grey-300" className='max-md:text-[14px]'>
            UOSLIFE (시대생, 서울시립대 중앙 IT 동아리)
          </Text>
        </div>
        <div className="flex gap-[34px] items-center max-md:gap-2">
          <Link
            href="mailto:support@uoslife.team"
            onClick={() => {
              trackEvent('CLICK_FOOTER', {
                footer_name: 'mail',
              });
            }}
          >
            <Text variant="body-20-m" className="text-white max-md:text-[14px]" >
              Team UOSLIFE E-Mail
            </Text>
          </Link>
          <Divider
            orientation="vertical"
            thickness="px"
            color="bg-grey-700"
            className="h-3"
          />
          <Link href="https://uoslife.notion.site/" target="_blank">
            <Text variant="body-20-m" className="text-white max-md:text-[14px]">
              Term of Service
            </Text>
          </Link>
        </div>
        <div className="flex gap-5 items-center justify-center max-md:gap-3">
          <Link
            href="https://instagram.com/uoslife_official"
            target="_blank"
            rel="noopener"
            className="hover:bg-grey-700 rounded-xl"
            onClick={() => {
              trackEvent('CLICK_FOOTER', {
                footer_name: 'instagram',
              });
            }}
          >
            <Image
              src="/svg/instagram.svg"
              alt="instagram icon"
              width={44}
              height={44}
              style={{
                filter: 'invert(1)',
              }}
            />
          </Link>
          <Link
            href="https://github.com/uoslife"
            target="_blank"
            rel="noopener"
            className="hover:bg-grey-700 rounded-xl"
            onClick={() => {
              trackEvent('CLICK_FOOTER', {
                footer_name: 'github',
              });
            }}
          >
            <Image
              src="/svg/github.svg"
              alt="github icon"
              width={44}
              height={44}
              style={{
                filter: 'invert(1)',
              }}
            />
          </Link>
          <Link
            href="http://pf.kakao.com/_gMEHK"
            target="_blank"
            rel="noopener"
            className="hover:bg-grey-700 rounded-xl"
            onClick={() => {
              trackEvent('CLICK_FOOTER', {
                footer_name: 'kakao',
              });
            }}
          >
            <Image
              src="/svg/kakao.svg"
              alt="kakao icon"
              width={44}
              height={44}
              style={{
                filter: 'invert(1)',
              }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
