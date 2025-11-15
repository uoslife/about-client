import { Suspense } from 'react';
import { Section01 } from './section/Section01';
import { Section02 } from './section/Section02';
import { Section03 } from './section/Section03';
import { Section04 } from './section/Section04';
import { Section05 } from './section/Section05';
import { Section06 } from './section/Section06';
import { Section07 } from './section/Section07';
import { SectionMain } from './section/SectionMain';

export default async function RecruitingPage() {
  return (
    <div className="flex flex-col  gap-40 items-center w-[800px] bg-[#FFF]">
      <main>
        <SectionMain />
        <Suspense>
          <Section01 />
          <Section02 />
          <Section03 />
          <Section04 />
          <Section05 />
          <Section06 />
          <Section07 />
        </Suspense>
      </main>
    </div>
  );
}
