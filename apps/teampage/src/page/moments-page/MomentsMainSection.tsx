'use client';

import { useEffect, useState } from 'react';
import { WritingButton } from '@/shared/component/buttons';
import { Card, CardSkeletonList } from '@/shared/component/card';
import { Pagination } from '@/shared/component/pagination';
import { SearchField } from '@/shared/component/search-field';
import { Text } from '@/shared/component/Text';
import { SpaceIdEnum } from '@/shared/const/category';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { ArticleListEmptyContainer } from '@/shared/layouts/ArticleListEmptyContainer';
import { ArticleMainSectionContainer } from '@/shared/layouts/ArticleMainSectionContainer';
import { ArticleProvider, useArticle } from '@/shared/provider/ArticleProvider';

export function MomentsMainSection() {
  return (
    <ArticleProvider spaceId={SpaceIdEnum.MOMENTS}>
      <ArticleMainSectionContainer>
        <TopBar />
        <ArticleList />
        <MomentsPagination />
        <WritingButton from="MOMENTS" className="fixed bottom-6 right-8" />
      </ArticleMainSectionContainer>
    </ArticleProvider>
  );
}

function TopBar() {
  const { dispatch } = useArticle();
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    dispatch({ type: 'SET_KEYWORD', payload: debouncedKeyword });
  }, [debouncedKeyword, dispatch]);

  return (
    <div className="flex justify-between items-center">
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
  const { articles, isLoading, error } = useArticle();

  if (isLoading) return <CardSkeletonList.A />;
  if (error) return <ArticleListEmptyContainer />;

  return (
    <div className="grid grid-cols-1 gap-y-10 max-w-pc w-full">
      {articles.map((content) => (
        <Card.A
          key={content.id}
          content={content}
          link={`/career/${content.id}`}
        />
      ))}
    </div>
  );
}

function MomentsPagination() {
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
