'use client';
import { ArticleBanner } from '@/shared/screens/ArticleBanner';
import { CareerMainSection } from './CareerMainSection';
import { useSendViewAmplitudeEvent } from '@/entities/analytics/useSendViewAmplitudeEvent';

export default function CareerPage() {
  useSendViewAmplitudeEvent('VIEW_TAB', {
    tab_name: 'career',
  });
  return (
    <div className="flex flex-col gap-16 mb-60">
      <ArticleBanner
        title="Career"
        description="선배들의 여정과 후기를 통해, 또 다른 누군가의 길에 용기와 영감을 더합니다."
      />
      <CareerMainSection />
    </div>
  );
}
