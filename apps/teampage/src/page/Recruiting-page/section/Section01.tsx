'use client';

import React from 'react';
import Image from 'next/image';

export function Section01() {
  return (
    <>
      <div className="absolute inset-0 -z-10">
        {'배경 이미지 영역'}
        <Image src="/img/recruit/rightlogo.svg" alt="background logo" width={1215} height={762} />
      </div>
      <div className="absolute inset-0 -z-10">
        {'배경 이미지 영역'}
        <Image src="/img/recruit/leftlogo.svg" alt="background logo" width={1215} height={762} />
      </div>
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6 py-20">
        {/* 메인 컨텐츠 영역 */}
        <div className="flex w-full max-w-[1440px] flex-col gap-16">
          {/* 메인 텍스트 */}
          <div className="flex w-full flex-col gap-8 text-left">
            <p className="text-[220px] font-bold leading-[100%] tracking-[-4.4px] text-[#222227]">UOSLIFE</p>
            <p className="ml-[520px] text-[220px] font-bold leading-[100%] tracking-[-4.4px] text-[#222227]">
              6기 모집
            </p>
            <div className="mt-[-100px] flex flex-col gap-2 text-[18px] font-medium text-[#222227]">
              <div className="flex items-center gap-3">
                <p>11월 24일부터</p>
                <span className="inline-block h-[2px] w-[45px] bg-[#222227]" />
              </div>
              <p>11월 30일까지</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
