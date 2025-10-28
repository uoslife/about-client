import _CareerPage from '@/page/career-page';
import { Metadata } from 'next';
import metaData from '@/shared/const/seo.config';

export const metadata: Metadata = {
  title: 'Career - UOSLIFE',
  description: '시대생의 커리어 이야기입니다.',
  alternates: {
    canonical: `${metaData.siteUrl}/career`,
  },
  openGraph: {
    title: 'Career - UOSLIFE',
    description: '시대생의 커리어 이야기입니다.',
    url: `${metaData.siteUrl}/career`,
    type: 'website',
  },
};

export default function CareerPage() {
  return <_CareerPage />;
}
