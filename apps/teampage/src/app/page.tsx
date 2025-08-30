import { Section01 } from '@/features/home/screens/section/Section01';
import { SectionMain } from '@/features/home/screens/section/SectionMain';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <main>
        <SectionMain />
        <Section01 />
      </main>
    </div>
  );
}
