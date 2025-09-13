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

export const CATEGORYS = ['전체', 'PM', '마케팅', '디자인', '개발'] as const;

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
      <WritingButton from="TECH" className="fixed bottom-6 right-8" />
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
      {/* TODO: Change To Real Data */}
      {TECH_CONTENT_MOCK.map((content) => (
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
    authorName: '공은배',
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
    authorName: '정인우',
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
    authorName: '이준수',
    thumbnailUrl: '/img/section02_value_03.webp',
    title: 'Docker와 Github Actions로 CI/CD 파이프라인 구축하기',
    summary:
      '애플리케이션을 자동으로 빌드, 테스트, 배포하는 과정을 자동화하는 방법을 알아봅니다.',
    category: '개발',
    viewCount: 188,
    createdAt: '2025-09-08T18:00:00Z',
  },
];
