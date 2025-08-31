'use client';
import { useState } from 'react';
import { Card } from '@/shared/component/card';
import type { Content } from '@/shared/component/card/types';
import { Pagination } from '@/shared/component/pagination';
import { SearchField } from '@/shared/component/search-field';
import { TabButton } from '@/shared/component/TabButton';
import { Text } from '@/shared/component/Text';
import { ArticleMainSectionContainer } from '@/shared/layouts/ArticleMainSectionContainer';

const DUMMY_CONTENT: Content = {
  id: 0,
  authorId: 'abc',
  authorName: '문정민',
  thumbnailUrl: '',
  category: 'Category',
  title:
    '문정민 최고 문정민 최고 문정민 최고 문정민 최고 문정민 최고 문정민 최고 문정민 최고 문정민 최고 문정민 최고 문정민 최고 문정민 최고',
  createdAt: new Date().toISOString(),
};

const CATEGORYS = ['전체', 'PM', '마케팅', '디자인', '개발'] as const;

export function TechMainSection() {
  const [page, setPage] = useState(1);

  return (
    <ArticleMainSectionContainer>
      <TopBar />
      <ArticleList />
      <Pagination
        totalPages={10}
        currentPage={page}
        onPageChange={setPage}
        className="my-10"
      />
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
      {Array.from({ length: 5 }).map((_, index) => (
        <Card.B key={index} content={DUMMY_CONTENT} />
      ))}
    </div>
  );
}
