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

export default function RecruitingPage() {
  const now = new Date();
  const startDate = new Date('2024-11-24T00:00:00');
  const endDate = new Date('2024-11-30T23:59:59');
  const isInRange = now >= startDate && now <= endDate;
  const ref5 = useRef<HTMLDivElement>(null);
  const [showButton, setShowButton] = useState(true);

  console.log(isInRange);
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

      if (section06Top + 42.5 * 8 <= windowHeight) {
        console.log(section06Top);
        console.log(windowHeight);
        setShowButton(false);
      } else {
        setShowButton(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showButton]);

  return (
    <div className="flex flex-col  gap-40 items-center w-full bg-[#FFF]">
      <main className="w-full">
        {showButton && <Recruitbutton className={`fixed top-3/4 left-1/2 -translate-x-1/2 -translate-y-3/4`} />}
        {/* 버튼 isInRange && 붙여서 랜더링 안되게 */}

        <Section01 />
        <Section02 />
        <Section03 />
        <Section04 />
        <Section05 />
        {/* 나중에 1~5는 기간 검사해서 랜더링 안되게 */}
        <Section06 ref={ref5} />
        <Section07 />
      </main>
    </div>
  );
}
