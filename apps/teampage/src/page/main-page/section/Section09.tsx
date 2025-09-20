import { Text } from '@shared/component/Text';
import Image from 'next/image';
import Link from 'next/link';

export function Section09() {
  return (
    <div className="relative flex flex-col justify-center px-[240px] h-[600px]">
      <Image
        src="/img/section09_bg.webp"
        alt="section09 background"
        fill
        placeholder="blur"
        unoptimized
        blurDataURL="/img/section09_bg.webp"
        className="object-cover -z-10"
      />
      <div className="flex flex-col gap-9 items-start">
        <div className="flex flex-col gap-4">
          <Text variant="title-60-b" color="white">
            시대생에 합류하고 싶다면?
          </Text>
          <Text variant="title-24-m" color="grey-100">
            다음 모집 소식을 가장 먼저 이메일로 받아보세요.
          </Text>
        </div>
        <Link
          href="https://docs.google.com/forms/d/1O61Rt-m2OOX9KbCMG-CtkGR-2ytaEgsRiXB2STQKxi4/edit"
          target="_blank"
          className="bg-white px-7 py-4 rounded-[32px]"
        >
          <Text variant="title-24-b">모집 알림 받기</Text>
        </Link>
      </div>
    </div>
  );
}
