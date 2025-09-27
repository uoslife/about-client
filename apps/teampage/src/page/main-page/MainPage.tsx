import { Suspense } from 'react';
import { Section01 } from './section/Section01';
import { Section02 } from './section/Section02';
import { Section03 } from './section/Section03';
import { Section04 } from './section/Section04';
import { Section05 } from './section/Section05';
import { Section06 } from './section/Section06';
import { Section07 } from './section/Section07';
import { Section08 } from './section/Section08';
import { Section09 } from './section/Section09';
import { SectionMain } from './section/SectionMain';

export default async function MainPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <main>
        <SectionMain />
        <Suspense>
          <Section01 />
          {/* TODO: 디자인 확정에 따른 모바일 적용 및 div 분리 라인 삭제 */}
            <div className="hidden md:block">
              <Section02 />
              <Section03 />
              <Section04 />
              <Section05 />
              <Section06 />
              <Section07 />
              <Section08 />
              <Section09 />
            </div>
        </Suspense>
      </main>
    </div>
  );
}
