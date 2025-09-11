'use client';

import { Text } from '@shared/component/Text';
import Image from 'next/image';
import { useCallback } from 'react';

export function Section09() {
  const handlePressGetRecruitmentNotice = useCallback(() => {
    alert('모집 알림 받기 기능은 준비중이에요.');
  }, []);
  return (
    <div className="relative flex flex-col justify-center px-[240px] h-[600px]">
      <Image
        src="/img/section09_bg.webp"
        alt="section06 background"
        fill
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
        <button
          type="button"
          className="bg-white px-7 py-4 rounded-[32px]"
          onClick={handlePressGetRecruitmentNotice}
        >
          <Text variant="title-24-b">모집 알림 받기</Text>
        </button>
      </div>
    </div>
  );
}
