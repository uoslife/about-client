'use client';
import { WritingButton } from '@shared/component/buttons';
import { useState } from 'react';
import { Card } from '@/shared/component/card';
import type { Content } from '@/shared/component/card/types';
import { Pagination } from '@/shared/component/pagination';
import { SearchField } from '@/shared/component/search-field';
import { TabButton } from '@/shared/component/TabButton';
import { Text } from '@/shared/component/Text';
import { ArticleMainSectionContainer } from '@/shared/layouts/ArticleMainSectionContainer';
import { CategoryEnum } from '../write-page/WritePage';

const DUMMY_CONTENT: Content[] = [
  {
    id: 1,
    authorId: 'career_author_1',
    authorName: '정인우',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
    category: '취업/인턴',
    title: '네이버 백엔드 개발자 합격 후기',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3시간 전
    viewCount: 12,
  },
  {
    id: 2,
    authorId: 'career_author_2',
    authorName: '박인턴',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    category: '취업/인턴',
    title: '카카오페이 백엔드 개발자 합격 후기',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12시간 전
    viewCount: 10,
  },
  {
    id: 3,
    authorId: 'career_author_3',
    authorName: '김은서',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
    category: '대외활동',
    title: '리멤버 Community 프로덕트 매니저 후기',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1일 전
    viewCount: 8,
  },
  {
    id: 4,
    authorId: 'career_author_4',
    authorName: '정인우',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
    category: '취업/인턴',
    title: '개발자 포트폴리오 제작 가이드',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2일 전
    viewCount: 6,
  },
  {
    id: 5,
    authorId: 'career_author_5',
    authorName: '조종빈',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
    category: '대외활동',
    title: '미리디 - 웹에디터 프론트엔드 개발자 인턴 경험',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4일 전
    viewCount: 4,
  },
];

const CategoryKorean = {
  [CategoryEnum.EMPLOYMENT]: '채용',
  [CategoryEnum.EXTERNAL_ACTIVITY]: '대외활동',
};

export const CATEGORYS = ['전체', ...Object.values(CategoryKorean)] as const;

export function CareerMainSection() {
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
      <WritingButton from="CAREER" className="fixed bottom-6 right-8" />
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
          link={`/career/${content.id}`}
        />
      ))}
    </div>
  );
}
