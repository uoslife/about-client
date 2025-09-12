'use client';
import { useState } from 'react';
import { WritingButton } from '@/shared/component/buttons';
import { Card } from '@/shared/component/card';
import type { Content } from '@/shared/component/card/types';
import { Pagination } from '@/shared/component/pagination';
import { SearchField } from '@/shared/component/search-field';
import { TabButton } from '@/shared/component/TabButton';
import { Text } from '@/shared/component/Text';
import { ArticleMainSectionContainer } from '@/shared/layouts/ArticleMainSectionContainer';

const DUMMY_CONTENT: Content[] = [
  {
    id: 0,
    authorId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    authorName: '김개발',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    category: '개발',
    title: 'Next.js 13 App Router 완전 정복하기',
    createdAt: '2024-09-06T10:30:00Z',
  },
  {
    id: 1,
    authorId: 'tech_author_1',
    authorName: '김개발',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    category: '개발',
    title: 'React 18의 새로운 기능들과 성능 최적화 전략',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간 전
  },
  {
    id: 2,
    authorId: 'tech_author_2',
    authorName: '박프로덕트',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    category: 'PM',
    title: '사용자 경험을 위한 프로덕트 매니지먼트 가이드',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6시간 전
  },
  {
    id: 3,
    authorId: 'tech_author_3',
    authorName: '이디자인',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800',
    category: '디자인',
    title: 'Figma를 활용한 효율적인 디자인 시스템 구축하기',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1일 전
  },
  {
    id: 4,
    authorId: 'tech_author_4',
    authorName: '최마케팅',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    category: '마케팅',
    title: '개발자를 위한 데이터 기반 마케팅 전략',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2일 전
  },
  {
    id: 5,
    authorId: 'tech_author_5',
    authorName: '정백엔드',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    category: '개발',
    title: 'Node.js와 TypeScript로 안정적인 API 서버 구축하기',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3일 전
  },
];

const CATEGORYS = ['전체', 'PM', '마케팅', '디자인', '개발'] as const;

export function TechMainSection() {
  const [page, setPage] = useState(1);

  return (
    <ArticleMainSectionContainer>
      <TopBar />
      <ArticleList />
      <Pagination
        totalPages={1}
        currentPage={page}
        onPageChange={setPage}
        className="my-10"
      />
      <WritingButton from="tech" className="fixed bottom-6 right-8" />
    </ArticleMainSectionContainer>
  );
}

function TopBar() {
  const [sort, setSort] = useState<'최신순' | '인기순'>('최신순');
  const [category, setCategory] = useState<(typeof CATEGORYS)[number]>('전체');

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <div className="flex flex-row gap-2 items-center ">
          {CATEGORYS.map((cat) => (
            <TabButton
              key={cat}
              clicked={category === cat}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </TabButton>
          ))}
        </div>
        <SearchField size="small" placeholder="제목을 입력해주세요" />
      </div>
      <div className="group relative">
        <div className="flex items-center gap-1.5 py-2 px-5 cursor-default">
          <Text variant="body-18-m" color="grey-900">
            {sort}
          </Text>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Chevron Right</title>
            <path
              d="M4 6L8 10L12 6"
              stroke="#A2A2AE"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="z-10 hidden group-hover:block absolute top-full bg-white box-border flex-col gap-2 items-start justify-start p-[12px] rounded-2xl left-1/2 -translate-x-1/2 w-full px-2 shadow-[0px_0px_12px_0px_rgba(18,18,18,0.1)]">
          <button type="button" className="w-full group/career">
            <div className="box-border content-stretch flex flex-row gap-2.5 h-11 items-center justify-center px-4 py-1.5 relative rounded-[40px] w-full hover:bg-gray-100">
              <Text
                variant="body-18-m"
                className="group-hover/career:text-primary-ui"
                onClick={() => setSort('최신순')}
              >
                최신순
              </Text>
            </div>
          </button>
          <button type="button" className="w-full group/career">
            <div className="box-border content-stretch flex flex-row gap-2.5 h-11 items-center justify-center px-4 py-1.5 relative rounded-[40px] w-full hover:bg-gray-100">
              <Text
                variant="body-18-m"
                className="group-hover/career:text-primary-ui"
                onClick={() => setSort('인기순')}
              >
                인기순
              </Text>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function ArticleList() {
  return (
    <div className="grid grid-cols-1 gap-y-10 max-w-pc w-full">
      {DUMMY_CONTENT.map((content) => (
        <Card.B
          key={content.id}
          content={content}
          link={`/tech/${content.id}`}
        />
      ))}
    </div>
  );
}

export const TECH_CONTENT_MOCK: Content[] = [
  {
    id: 1,
    authorId: 'frontend-lead',
    authorName: '김프롱',
    thumbnailUrl: '/img/section02_value_01.webp',
    title: 'React 최적화, useMemo와 useCallback 제대로 사용하기',
    summary: '불필요한 렌더링을 방지하여 성능을 개선하는 방법을 알아봅니다.',
    category: '개발',
    viewCount: 152,
    createdAt: '2025-09-10T10:00:00Z',
  },
  {
    id: 2,
    authorId: 'backend-lead',
    authorName: '박백둥',
    thumbnailUrl: '/img/section02_value_02.webp',
    title: 'Spring Boot에서 JPA N+1 문제 해결하기',
    summary:
      '지연 로딩과 페치 조인을 활용하여 데이터베이스 쿼리 효율을 높이는 전략을 소개합니다.',
    category: '개발',
    viewCount: 230,
    createdAt: '2025-09-09T14:00:00Z',
  },
  {
    id: 3,
    authorId: 'infra-lead',
    authorName: '최인프',
    thumbnailUrl: '/img/section02_value_03.webp',
    title: 'Docker와 Github Actions로 CI/CD 파이프라인 구축하기',
    summary:
      '애플리케이션을 자동으로 빌드, 테스트, 배포하는 과정을 자동화하는 방법을 알아봅니다.',
    category: '개발',
    viewCount: 188,
    createdAt: '2025-09-08T18:00:00Z',
  },
];
