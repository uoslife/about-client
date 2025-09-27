'use client';
import { ArticleBanner } from '@/shared/screens/ArticleBanner';
import { MomentsMainSection } from './MomentsMainSection';
import { useSendViewAmplitudeEvent } from '@/entities/analytics/useSendViewAmplitudeEvent';
import { RouteByAuthProvider } from '@/entities/auth/RouteByAuthContext';

export default function MomentsPage() {
  useSendViewAmplitudeEvent('VIEW_TAB', {
    tab_name: 'moments',
  });
  return (
    <RouteByAuthProvider
      route="/"
      targetRole={['FULL_MEMBER', 'ASSOCIATE_MEMBER', 'ADMIN']}
    >
      <div className="flex flex-col gap-16 mb-60">
        <ArticleBanner
          title="Moments"
          description="시대생의 모든 순간을 담아, 시간이 지나도 마음에 남을 이야기를 이어갑니다."
        />
        <MomentsMainSection />
      </div>
    </RouteByAuthProvider>
  );
}
