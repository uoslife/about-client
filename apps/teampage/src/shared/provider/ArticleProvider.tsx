'use client';

import type { ArticleListItem } from '@uoslife/api';
import { useSearchArticlesInfinite } from '@uoslife/api';
import type React from 'react';
import { createContext, useContext, useMemo, useReducer } from 'react';
import type {
  CategoryTypeWithALL,
  SortType,
  SpaceIdEnum,
} from '@/shared/const/category';

// 상태 타입 정의
interface ArticleState {
  page: number;
  sort: SortType;
  category: CategoryTypeWithALL;
  keyword: string;
}

// 액션 타입 정의
type ArticleAction =
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_SORT'; payload: SortType }
  | { type: 'SET_CATEGORY'; payload: CategoryTypeWithALL }
  | { type: 'SET_KEYWORD'; payload: string }
  | { type: 'RESET_FILTERS' };

// Context 타입 정의
interface ArticleContextType {
  state: ArticleState;
  dispatch: React.Dispatch<ArticleAction>;

  articles: ArticleListItem[];
  totalPages: number;
  isLoading: boolean;
  error: any;
}

// 초기 상태
const initialState: ArticleState = {
  page: 1,
  sort: 'LATEST',
  category: 'ALL',
  keyword: '',
};

// 리듀서 함수
function articleReducer(
  state: ArticleState,
  action: ArticleAction,
): ArticleState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_SORT':
      return { ...state, sort: action.payload, page: 1 }; // 정렬 변경시 첫 페이지로
    case 'SET_CATEGORY':
      return { ...state, category: action.payload, page: 1 }; // 카테고리 변경시 첫 페이지로
    case 'SET_KEYWORD':
      return { ...state, keyword: action.payload, page: 1 }; // 검색시 첫 페이지로
    case 'RESET_FILTERS':
      return initialState;
    default:
      return state;
  }
}

// Context 생성
const ArticleContext = createContext<ArticleContextType | null>(null);

interface ArticleProviderProps {
  children: React.ReactNode;
  spaceId: SpaceIdEnum;
  allowedCategories?: readonly CategoryTypeWithALL[];
}

// Provider 컴포넌트
export function ArticleProvider({ children, spaceId }: ArticleProviderProps) {
  const [state, dispatch] = useReducer(articleReducer, initialState);

  // API 호출
  const { data, isLoading, error } = useSearchArticlesInfinite(
    {
      spaceId: spaceId,
      page: Math.max(state.page - 1, 0),
      size: 10,
      category: state.category === 'ALL' ? undefined : state.category,
      sortBy: state.sort === 'POPULAR' ? 'VIEW_COUNT' : 'CREATED_AT',
      sortOrder: 'DESC',
      keyword: state.keyword || undefined,
    },
    {
      query: {
        getNextPageParam: (lastPage) => {
          if (!lastPage.last) {
            return (lastPage.number ?? 0) + 1;
          }
          return undefined;
        },
      },
    },
  );

  // 메모화된 값들
  const contextValue = useMemo<ArticleContextType>(
    () => ({
      state,
      dispatch,
      articles: data?.pages.flatMap((page) => page.content ?? []) ?? [],
      totalPages: data?.pages[0]?.totalPages ?? 0,
      isLoading,
      error,
    }),
    [state, dispatch, data, isLoading, error],
  );

  return (
    <ArticleContext.Provider value={contextValue}>
      {children}
    </ArticleContext.Provider>
  );
}

// 커스텀 훅
export function useArticle() {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error('useArticle must be used within a ArticleProvider');
  }
  return context;
}
