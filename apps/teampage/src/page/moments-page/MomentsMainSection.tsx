'use client';
import { useState } from 'react';
import { WritingButton } from '@/shared/component/buttons';
import { Card } from '@/shared/component/card';
import type { Content } from '@/shared/component/card/types';
import { Pagination } from '@/shared/component/pagination';
import { SearchField } from '@/shared/component/search-field';
import { Text } from '@/shared/component/Text';
import { ArticleMainSectionContainer } from '@/shared/layouts/ArticleMainSectionContainer';

const DUMMY_CONTENT: Content[] = [
  {
    id: 1,
    authorId: 'moments_author_1',
    authorName: '이서현',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    category: '동아리활동',
    title: 'UOSLIFE 2024년 1학기 정기모임 회의',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4시간 전
  },
  {
    id: 2,
    authorId: 'moments_author_2',
    authorName: '유현승',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
    category: '동아리활동',
    title: '2025 UOSLIFE MT 기록',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18시간 전
  },
  {
    id: 3,
    authorId: 'moments_author_3',
    authorName: '조종빈',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    category: '동아리활동',
    title: '시대생 축제 주점 기록',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2일 전
  },
  {
    id: 4,
    authorId: 'moments_author_4',
    authorName: '송수아',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
    category: '동아리활동',
    title: 'UOSLIFE 팀페이지 리뉴얼 프로젝트',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5일 전
  },
  {
    id: 5,
    authorId: 'moments_author_5',
    authorName: '김고은',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    category: '동아리활동',
    title: '프론트엔드 신입 기수 온보딩',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7일 전
  },
];

export function MomentsMainSection() {
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
      <WritingButton from="MOMENTS" className="fixed bottom-6 right-8" />
    </ArticleMainSectionContainer>
  );
}

function TopBar() {
  return (
    <div className="flex justify-between items-center">
      <SearchField size="small" placeholder="제목을 입력해주세요" />
      <div className="group relative">
        <div className="flex items-center gap-1.5 py-2 px-5 cursor-default">
          <Text variant="body-18-m" color="grey-900">
            연도 전체
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
              >
                연도 전체
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
    <div className="grid grid-cols-2 gap-x-4 gap-y-20 max-w-pc w-full">
      {DUMMY_CONTENT.map((content) => (
        <Card.A
          key={content.id}
          content={content}
          link={`/moments/${content.id}`}
        />
      ))}
    </div>
  );
}
