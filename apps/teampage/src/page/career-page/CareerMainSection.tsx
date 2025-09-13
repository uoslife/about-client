'use client';

import type { ArticleListItem } from '@uoslife/api';
import { useSearchArticlesInfinite } from '@uoslife/api';
import { useState } from 'react';
import { WritingButton } from '@/shared/component/buttons';
import { Card, CardSkeletonList } from '@/shared/component/card';
import { Pagination } from '@/shared/component/pagination';
import { SearchField } from '@/shared/component/search-field';
import { TabButton } from '@/shared/component/TabButton';
import { Text } from '@/shared/component/Text';
import {
  CategoryAllEnum,
  CategoryEnum,
  CategoryKoreanWithAll,
  type CategoryTypeWithALL,
  SortKorean,
  type SortType,
  SpaceIdEnum,
} from '@/shared/const/category';
import { ArticleListEmptyContainer } from '@/shared/layouts/ArticleListEmptyContainer';
import { ArticleMainSectionContainer } from '@/shared/layouts/ArticleMainSectionContainer';

export const CATEGORYS = [
  CategoryAllEnum.ALL,
  CategoryEnum.EMPLOYMENT,
  CategoryEnum.EXTERNAL_ACTIVITY,
] as const;

export function CareerMainSection() {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<SortType>('LATEST');
  const [category, setCategory] = useState<CategoryTypeWithALL>('ALL');
  const [keyword, setKeyword] = useState('');
  // const { session } = useAuth();
  const { data, isLoading } = useSearchArticlesInfinite(
    {
      spaceId: SpaceIdEnum.TECH,
      page: Math.max(page - 1, 0),

      size: 10,
      category: category === 'ALL' ? undefined : category,
      sortBy: sort === 'POPULAR' ? 'VIEW_COUNT' : 'CREATED_AT',
      sortOrder: 'DESC',
      keyword: keyword || undefined,
    },
    {
      query: {
        getNextPageParam: (lastPage) => {
          if (!lastPage.data.last) {
            return (lastPage.data.number ?? 0) + 1;
          }
          return undefined;
        },
      },
    },
  );

  const articles = data?.pages.flatMap((page) => page.data.content ?? []) ?? [];
  const totalPages = data?.pages[0]?.data.totalPages ?? 0;

  return (
    <ArticleMainSectionContainer>
      <TopBar
        sort={sort}
        setSort={setSort}
        category={category}
        setCategory={setCategory}
        setKeyword={setKeyword}
      />
      {isLoading ? (
        <CardSkeletonList.B />
      ) : articles.length > 0 ? (
        <ArticleList articles={articles} />
      ) : (
        <ArticleListEmptyContainer />
      )}
      <Pagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
        className="my-10"
      />
      <WritingButton from="CAREER" className="fixed bottom-6 right-8" />
    </ArticleMainSectionContainer>
  );
}

type TopBarProps = {
  sort: SortType;
  setSort: (sort: SortType) => void;
  category: CategoryTypeWithALL;
  setCategory: (category: CategoryTypeWithALL) => void;
  setKeyword: (keyword: string) => void;
};

function TopBar({
  sort,
  setSort,
  category,
  setCategory,
  setKeyword,
}: TopBarProps) {
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
              {CategoryKoreanWithAll[cat]}
            </TabButton>
          ))}
        </div>
        <SearchField
          size="small"
          placeholder="제목을 입력해주세요"
          onChange={(e) => {
            if (e.target.value === '') setKeyword('');
            setKeyword(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            }
          }}
        />
      </div>
      <div className="group relative">
        <div className="flex items-center gap-1.5 py-2 px-5 cursor-default">
          <Text variant="body-18-m" color="grey-900">
            {SortKorean[sort]}
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
                onClick={() => setSort('LATEST')}
              >
                {SortKorean.LATEST}
              </Text>
            </div>
          </button>
          <button type="button" className="w-full group/career">
            <div className="box-border content-stretch flex flex-row gap-2.5 h-11 items-center justify-center px-4 py-1.5 relative rounded-[40px] w-full hover:bg-gray-100">
              <Text
                variant="body-18-m"
                className="group-hover/career:text-primary-ui"
                onClick={() => setSort('POPULAR')}
              >
                {SortKorean.POPULAR}
              </Text>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

type ArticleListProps = {
  articles: ArticleListItem[];
};

function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="grid grid-cols-1 gap-y-10 max-w-pc w-full">
      {articles.map((content) => (
        <Card.B
          key={content.id}
          content={content}
          link={`/career/${content.id}`}
        />
      ))}
    </div>
  );
}
