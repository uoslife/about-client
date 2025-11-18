import _RecruitPage from '@/page/recruit-page';
import { Metadata } from 'next';
import metaData from '@/shared/const/seo.config';

export const metadata: Metadata = {
  title: 'Recruit - UOSLIFE',
  description: '시대생 채용 페이지입니다.',
  alternates: {
    canonical: '/recruit',
  },
  openGraph: {
    title: 'Recruit - UOSLIFE',
    description: '시대생 채용 페이지입니다.',
    url: `${metaData.siteUrl}/recruit`,
    type: 'website',
  },
};

export default function RecruitPage() {
  return <_RecruitPage />;
}

