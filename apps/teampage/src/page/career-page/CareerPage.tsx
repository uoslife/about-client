'use client';
import { ArticleBanner } from '@/shared/screens/ArticleBanner';
import { CareerMainSection } from './CareerMainSection';
import { useSendViewAmplitudeEvent } from '@/entities/analytics/useSendViewAmplitudeEvent';
import { RouteByAuthProvider } from '@/entities/auth/RouteByAuthContext';

export default function CareerPage() {
  useSendViewAmplitudeEvent('VIEW_TAB', {
    tab_name: 'career',
  });
  return (
    <RouteByAuthProvider route="/" targetRole={['FULL_MEMBER', 'ADMIN']}>
      <div className="flex flex-col gap-16 mb-8 sm:mb-60 w-full">
        <ArticleBanner
          title="Career"
          description={
            '선배들의 여정과 후기를 통해,\n또 다른 누군가의 길에 용기와 영감을 더합니다.'
          }
        />
        <CareerMainSection />
      </div>
    </RouteByAuthProvider>
  );
}
