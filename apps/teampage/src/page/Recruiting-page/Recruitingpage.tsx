'use client';
import { useEffect, useRef, useState } from 'react';
import { Section01 } from './section/Section01';
import { Section02 } from './section/Section02';
import { Section03 } from './section/Section03';
import { Section04 } from './section/Section04';
import { Section05 } from './section/Section05';
import { Section06 } from './section/Section06';
import { Section07 } from './section/Section07';
import { Recruitbutton } from './section/Recruitbutton';
import { useSendViewAmplitudeEvent } from '@/entities/analytics/useSendViewAmplitudeEvent';

export const ISINRANGE = false;

export default function RecruitingPage() {
  const ref5 = useRef<HTMLDivElement>(null);
  const [showButton, setShowButton] = useState(true);

  // 이벤트 리스너로 현재 스크롤의 위치를 파악해서
  // ref5에 저장된 위치와 비교함.
  // 오프셋을 42.5*8 만큼 줘서(버튼이 떠있는 위치, 수정 할수도)
  // 섹션6에 버튼이 닿았을 때 발동하게 함
  useEffect(() => {
    const handleScroll = () => {
      if (!ref5.current) {
        return;
      }

      const section06Top = ref5.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (section06Top + 30 * 8 <= windowHeight) {
        setShowButton(false);
      } else {
        setShowButton(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showButton]);

  useSendViewAmplitudeEvent('VIEW_TAB', {
    tab_name: 'recruiting',
  });

  return (
    <div className="flex flex-col  gap-40 items-center w-full bg-[#FFF]">
      <main className="w-full">
        {showButton && (
          <Recruitbutton className={`fixed top-[83.333%] left-1/2 -translate-x-1/2 -translate-y-[83.333%] z-10`} />
        )}

        <Section01 />
        <Section02 />
        <Section03 />
        <Section04 />
        <Section05 />
        <Section06 ref={ref5} />
        <Section07 />
      </main>
    </div>
  );
}
