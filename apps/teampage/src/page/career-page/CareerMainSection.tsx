'use client';

import { useState } from 'react';
import { WritingButton } from '@/shared/component/buttons';
import { Card, CardSkeletonList } from '@/shared/component/card';
import { Pagination } from '@/shared/component/pagination';
import { SearchField } from '@/shared/component/search-field';
import { TabButton } from '@/shared/component/TabButton';
import {
  CAREER_CATEGORIES,
  CategoryKoreanWithAll,
  SpaceIdEnum,
} from '@/shared/const/category';

import { ArticleListEmptyContainer } from '@/shared/layouts/ArticleListEmptyContainer';
import { ArticleMainSectionContainer } from '@/shared/layouts/ArticleMainSectionContainer';
import { ArticleProvider, useArticle } from '@/shared/provider/ArticleProvider';
import { useAnalytics } from '@/entities/analytics/useAnalytics';
import { useAuth } from '@/entities/auth/useAuth';

export function CareerMainSection() {
  return (
    <ArticleProvider spaceId={SpaceIdEnum.CAREER}>
      <ArticleMainSectionContainer>
        <TopBar />
        <ArticleList />
        <CareerPagination />
        <WritingButtonArea />
      </ArticleMainSectionContainer>
    </ArticleProvider>
  );
}

function TopBar() {
  const { state, dispatch } = useArticle();
  const [keyword, setKeyword] = useState('');
  const { trackEvent } = useAnalytics();

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
          onClear={() => {
            setKeyword('');
            dispatch({ type: 'SET_KEYWORD', payload: '' });
          }}
          onChange={(e) => {
            if (e.target.value === '') {
              dispatch({ type: 'SET_KEYWORD', payload: '' });
            }
            setKeyword(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              dispatch({ type: 'SET_KEYWORD', payload: keyword });
              dispatch({ type: 'SET_CATEGORY', payload: 'ALL' });
              e.currentTarget.blur();
              trackEvent('SEARCH_KEYWORD', {
                tab_name: 'career',
                keyword,
              });
            }
          }}
        />
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
          showViewCount={false}
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

function WritingButtonArea() {
  const auth = useAuth();
  if (auth.status !== 'authenticated') {
    return null;
  }
  return <WritingButton from="CAREER" className="fixed bottom-6 right-8" />;
}
