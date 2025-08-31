import { ArticleBanner } from '@/shared/screens/ArticleBanner';
import { TechMainSection } from './TechMainSection';

export default function TechPage() {
  return (
    <div className="flex flex-col gap-16 mb-60">
      <ArticleBanner
        title="Tech"
        description="시대생의 모든 순간을 담아, 시간이 지나도 마음에 남을 이야기를 이어갑니다."
      />
      <TechMainSection />
    </div>
  );
}
