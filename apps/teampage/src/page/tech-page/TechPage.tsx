'use client';
import { ArticleBanner } from '@/shared/screens/ArticleBanner';
import { TechMainSection } from './TechMainSection';
import { useSendViewAmplitudeEvent } from '@/entities/analytics/useSendViewAmplitudeEvent';

export default function TechPage() {
  useSendViewAmplitudeEvent('VIEW_TAB', {
    tab_name: 'tech',
  });
  return (
    <div className="flex flex-col gap-16 mb-8 sm:mb-60 w-full">
      <ArticleBanner
        title="Tech"
        description={
          '시대생의 모든 순간을 담아,\n시간이 지나도 마음에 남을 이야기를 이어갑니다.'
        }
      />
      <TechMainSection />
    </div>
  );
}
