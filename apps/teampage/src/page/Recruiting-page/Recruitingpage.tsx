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
  const ref2 = useRef<HTMLDivElement>(null);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref2.current) {
        return;
      }

      const section06Top = ref2.current.getBoundingClientRect().top;
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
        

        {isInRange &&showButton && <Recruitbutton className={`fixed top-3/4 left-1/2 -translate-x-1/2 -translate-y-3/4`} />}

        <section id="">
          <Section01 />
          <Section02 />
          <Section03 />
          <Section04 />
          <Section05 />
        </section>
        <Section06 ref={ref2} />
        <Section07 />
      </main>
    </div>
  );
}
