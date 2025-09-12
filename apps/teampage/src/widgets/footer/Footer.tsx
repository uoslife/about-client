import { Divider } from '@shared/component/Divider';
import { Text } from '@shared/component/Text';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <div className="bg-grey-800 pb-[60px] pt-40 w-full mx-auto">
      <div className="flex flex-row gap-4 max-w-pc justify-between items-end w-full mx-auto">
        <div className="flex flex-col gap-4 items-start">
          <div className="relative h-[45px] w-32">
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
          <Text variant="body-18-m" color="grey-300">
            UOSLIFE (시대생, 서울시립대 중앙 IT 동아리)
          </Text>
        </div>
        <div className="flex gap-[34px] items-center">
          <Link href="mailto:support@uoslife.team">
            <Text variant="body-20-m" className="text-white">
              Team UOSLIFE E-Mail
            </Text>
          </Link>
          <Divider
            orientation="vertical"
            thickness="px"
            color="bg-grey-700"
            className="h-3"
          />
          <Link
            href="https://www.notion.so/uoslife/2025-182de257e4b180968679ec4c30392b52?source=copy_link"
            target="_blank"
          >
            <Text variant="body-20-m" className="text-white">
              Term of Service
            </Text>
          </Link>
        </div>
        <div className="flex gap-5 items-center justify-center">
          <Link
            href="https://instagram.com/uoslife_official"
            target="_blank"
            rel="noopener"
            className="hover:bg-grey-700 rounded-xl"
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
