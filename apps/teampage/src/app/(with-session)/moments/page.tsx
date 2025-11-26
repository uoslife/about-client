import _MomentsPage from '@/page/moments-page';
import { Metadata } from 'next';
import metaData from '@/shared/const/seo.config';

export const metadata: Metadata = {
  title: 'Moments - UOSLIFE',
  description: '시대생의 순간들을 공유합니다.',
  alternates: {
    canonical: '/moments',
  },
  openGraph: {
    title: 'Moments - UOSLIFE',
    description: '시대생의 순간들을 공유합니다.',
    url: `${metaData.siteUrl}/moments`,
    type: 'website',
  },
};

export default function MomentsPage() {
  return <_MomentsPage />;
}
