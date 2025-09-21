'use client';

import { useEffect, useState } from 'react';
import { WritingButton } from '@/shared/component/buttons';
import { Card, CardSkeletonList } from '@/shared/component/card';
import { Pagination } from '@/shared/component/pagination';
import { SearchField } from '@/shared/component/search-field';
import { TabButton } from '@/shared/component/TabButton';
import { Text } from '@/shared/component/Text';
import {
  CAREER_CATEGORIES,
  CategoryKorean,
  CategoryKoreanWithAll,
  SortKorean,
  SpaceIdEnum,
} from '@/shared/const/category';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { ArticleListEmptyContainer } from '@/shared/layouts/ArticleListEmptyContainer';
import { ArticleMainSectionContainer } from '@/shared/layouts/ArticleMainSectionContainer';
import { ArticleProvider, useArticle } from '@/shared/provider/ArticleProvider';
import { useAnalytics } from '@/entities/analytics/useAnalytics';

export function CareerMainSection() {
  return (
    <ArticleProvider spaceId={SpaceIdEnum.CAREER}>
      <ArticleMainSectionContainer>
        <TopBar />
        <ArticleList />
        <CareerPagination />
        <WritingButton from="CAREER" className="fixed bottom-6 right-8" />
      </ArticleMainSectionContainer>
    </ArticleProvider>
  );
}

function TopBar() {
  const { state, dispatch } = useArticle();
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 300);
  const { trackEvent } = useAnalytics();
  useEffect(() => {
    dispatch({ type: 'SET_KEYWORD', payload: debouncedKeyword });
  }, [debouncedKeyword, dispatch]);

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <div className="flex flex-row gap-2 items-center ">
          {CAREER_CATEGORIES.map((cat) => (
            <TabButton
              key={cat}
              clicked={state.category === cat}
              onClick={() => {
                dispatch({ type: 'SET_CATEGORY', payload: cat });
              }}
            >
              {CategoryKoreanWithAll[cat]}
            </TabButton>
          ))}
        </div>
        <SearchField
          size="small"
          placeholder="제목을 입력해주세요"
          value={keyword}
          onChange={(e) => {
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
            {SortKorean[state.sort]}
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
                onClick={() => {
                  dispatch({ type: 'SET_SORT', payload: 'LATEST' });
                  trackEvent('CLICK_FILTER', {
                    tab_name: 'career',
                    filter_name: '최신순',
                  });
                }}
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
                onClick={() => {
                  dispatch({ type: 'SET_SORT', payload: 'POPULAR' });
                  trackEvent('CLICK_FILTER', {
                    tab_name: 'career',
                    filter_name: '인기순',
                  });
                }}
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

function ArticleList() {
  const { articles, isLoading, error } = useArticle();

  if (isLoading) return <CardSkeletonList.B />;
  if (error) return <ArticleListEmptyContainer />;

  if (articles.length === 0) return <ArticleListEmptyContainer />;

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

function CareerPagination() {
  const { totalPages, state, dispatch } = useArticle();

  return (
    <Pagination
      totalPages={totalPages}
      currentPage={state.page}
      onPageChange={(page) => dispatch({ type: 'SET_PAGE', payload: page })}
      className="my-10"
    />
  );
}
