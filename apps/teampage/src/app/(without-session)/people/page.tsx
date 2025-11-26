import _PeoplePage from '@pages/people-page';
import { Metadata } from 'next';
import metaData from '@/shared/const/seo.config';

export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
  title: '시대생 팀원 소개',
  description: '서로 다른 열정을 모아, 하나의 가능성을 만드는 시대생팀을 소개합니다.',
  alternates: {
    canonical: '/people',
  },
  openGraph: {
    title: '시대생 팀원 소개',
    description: '서로 다른 열정을 모아, 하나의 가능성을 만드는 시대생팀을 소개합니다.',
    url: `${metaData.siteUrl}/people`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '시대생 팀원 소개',
    description: '서로 다른 열정을 모아, 하나의 가능성을 만드는 시대생팀을 소개합니다.',
  },
};

export default function PeoplePage() {
  return <_PeoplePage />;
}
