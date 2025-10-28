import _TechPage from '@/page/tech-page';
import { Metadata } from 'next';
import metaData from '@/shared/const/seo.config';

export const metadata: Metadata = {
  title: 'Tech - UOSLIFE',
  description: '시대생의 기술 블로그입니다.',
  alternates: {
    canonical: `${metaData.siteUrl}/tech`,
  },
  openGraph: {
    title: 'Tech - UOSLIFE',
    description: '시대생의 기술 블로그입니다.',
    url: `${metaData.siteUrl}/tech`,
    type: 'website',
  },
};

export default function TechPage() {
  return <_TechPage />;
}
