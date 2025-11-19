import _RecruitingPage from '@/page/Recruiting-page';
import { Metadata } from 'next';
import metaData from '@/shared/const/seo.config';

export const metadata: Metadata = {
  title: 'Recruiting - UOSLIFE',
  description: '시대생의 모집 정보입니다.',
  alternates: {
    canonical: '/recruiting',
  },
  openGraph: {
    title: 'Recruiting - UOSLIFE',
    description: '시대생의 모집 정보입니다.',
    url: `${metaData.siteUrl}/recruiting`,
    type: 'website',
  },
};

export default function CareerPage() {
  return <_RecruitingPage />;
}
