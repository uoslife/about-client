import { Section01 } from './section/Section01';
import { Section02 } from './section/Section02';
import { Section03 } from './section/Section03';
import { Section04 } from './section/Section04';
import { Section06 } from './section/Section06';
import { Section07 } from './section/Section07';
import { Section09 } from './section/Section09';
import { SectionMain } from './section/SectionMain';

export default async function MainPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <main>
        <SectionMain />
        <Section01 />
        <Section02 />
        <Section03 />
        <Section04 />
        <Section06 />
        <Section07 />
        <Section09 />
      </main>
    </div>
  );
}
