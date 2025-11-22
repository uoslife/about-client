'use client';

import { forwardRef } from 'react';
import { Recruitbutton } from './Recruitbutton';

export const Section06 = forwardRef<HTMLDivElement, any>((_, ref) => {
  return (
    <div
      ref={ref}
      className="w-full flex flex-col justify-center items-center h-[30rem] gap-2.5 flex-shrink-0 bg-[radial-gradient(ellipse_at_bottom,rgba(70,134,255,0.3),rgba(255,255,255,0.1))] max-md:h-[22.5rem] max-md:gap-2.5 max-md:shrink-0"
    >
      <div className="flex flex-col items-center gap-12 max-md:gap-7">
        <div className="flex flex-col items-center gap-3 max-md:gap-3">
          <h3 className="text-center font-bold text-[4.5rem] leading-[120%] bg-gradient-to-r from-black via-blue-600 to-blue-200 bg-clip-text text-transparent max-md:text-[2rem] max-md:leading-[140%]">
            UOSLIFE에서 <br />
            여러분을 기다립니다
          </h3>
          <p className="text-center text-[#54545C] text-[1.125rem] font-medium leading-[160%] max-md:text-sm w-[100%] max-md:w-[80%]">
            11/30(일) 오후 11시 59분까지 하단의 링크를 통해 지원서를 제출해 주세요.
          </p>
        </div>
        <Recruitbutton />
      </div>
    </div>
  );
});

Section06.displayName = 'Section06';
