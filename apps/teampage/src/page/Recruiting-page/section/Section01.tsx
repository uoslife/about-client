'use client';

import { Text } from '@/shared/component/Text';
import React from 'react';

export function Section01() {
  return (
    <>
      <DesktopView />
      <MobileView />
    </>
  );
}

const DesktopView = () => {
  return (
    <div
      className="hidden md:flex justify-center items-center bg-center bg-no-repeat bg-cover min-h-screen"
      style={{ backgroundImage: "url('/img/recruit/logo.png')" }}
    >
      <div className="flex flex-col w-[1280px] gap-8 text-left">
        <p className="w-fit text-[220px] font-bold leading-[100%] tracking-[-4.4px] text-[#222227]">UOSLIFE</p>
        <div className="flex justify-between">
          <div className="flex flex-col gap-2 text-[18px] font-medium text-[#222227] justify-end">
            <div className="flex items-center gap-3">
              <p>11월 24일부터</p>
              <span className="inline-block h-[2px] w-[45px] bg-[#222227]" />
            </div>
            <p>11월 30일까지</p>
          </div>
          <p className="w-fit text-[220px] font-bold leading-[100%] tracking-[-4.4px] text-[#222227]">6기 모집</p>
        </div>
      </div>
    </div>
  );
};

const MobileView = () => {
  return (
    <div className="flex md:hidden flex-col gap-7">
      <div
        className="flex pt-8 justify-center items-center bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: "url('/img/recruit/logo.png')" }}
      >
        <div className="flex flex-col items-center">
          <Text variant="heading-80-b" color="grey-900">
            UOSLIFE
          </Text>
          <Text variant="heading-80-b" color="grey-900">
            6기 모집
          </Text>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <Text variant="title-18-b" color="grey-900">
          11월 24일부터
        </Text>
        <span className="inline-block h-[2px] w-[45px] bg-[#222227]" />
        <Text variant="title-18-b" color="grey-900">
          11월 30일까지
        </Text>
      </div>
    </div>
  );
};
