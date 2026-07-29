import type {
  ArticleDetailResponse,
  ArticleListItem,
  CommentResponse,
  MyInfoResponse,
  NotificationLogResponse,
  ScheduledNotificationResponse,
} from '@uoslife/api';
import { SpaceIdEnum } from '@/shared/const/category';
import type { PeopleData } from '@/features/notion/NotionType';

// 로컬 개발/프로토타이핑 전용 목데이터.
// 실 서버(about-api.uoslife.com)를 MSW로 차단했을 때 화면이 비지 않도록 채워 넣는다.

export const MOCK_MY_INFO: MyInfoResponse = {
  id: 'mock-user-id',
  email: 'mock.user@uoslife.com',
  firstName: '테스터',
  lastName: '목',
  name: '목테스터',
  role: 'ADMIN',
  phoneNumber: '010-0000-0000',
  generation: '10기',
};

const THUMBNAILS = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
];

const CATEGORY_BY_SPACE: Record<number, string[]> = {
  [SpaceIdEnum.TECH]: ['DEVELOP', 'DESIGN', 'MARKETING', 'PM'],
  [SpaceIdEnum.CAREER]: ['EMPLOYMENT', 'EXTERNAL_ACTIVITY'],
  [SpaceIdEnum.MOMENTS]: ['DEVELOP', 'DESIGN'],
};

const buildArticleList = (spaceId: number): ArticleListItem[] => {
  const categories = CATEGORY_BY_SPACE[spaceId] ?? ['DEVELOP'];
  return Array.from({ length: 12 }).map((_, i) => ({
    id: spaceId * 1000 + i + 1,
    authorId: `mock-author-${i % 3}`,
    authorName: ['김시대', '이생', '박팀'][i % 3],
    title: `[Mock] space ${spaceId} 샘플 게시글 ${i + 1}`,
    category: categories[i % categories.length] as ArticleListItem['category'],
    summary: '로컬 프로토타이핑을 위한 목데이터 게시글입니다.',
    viewCount: 10 * (i + 1),
    thumbnailUrl: THUMBNAILS[i % THUMBNAILS.length],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));
};

export const MOCK_ARTICLES_BY_SPACE: Record<number, ArticleListItem[]> = {
  [SpaceIdEnum.TECH]: buildArticleList(SpaceIdEnum.TECH),
  [SpaceIdEnum.CAREER]: buildArticleList(SpaceIdEnum.CAREER),
  [SpaceIdEnum.MOMENTS]: buildArticleList(SpaceIdEnum.MOMENTS),
};

export const findMockArticleListItem = (articleId: number): ArticleListItem | undefined => {
  return Object.values(MOCK_ARTICLES_BY_SPACE)
    .flat()
    .find((article) => article.id === articleId);
};

export const buildMockArticleDetail = (articleId: number): ArticleDetailResponse => {
  const listItem = findMockArticleListItem(articleId);
  return {
    id: articleId,
    authorId: listItem?.authorId ?? 'mock-author-0',
    authorName: listItem?.authorName ?? '김시대',
    title: listItem?.title ?? `[Mock] 게시글 ${articleId}`,
    category: listItem?.category,
    summary: listItem?.summary ?? '로컬 프로토타이핑을 위한 목데이터 게시글입니다.',
    content: '# 목데이터 본문\n\n이 게시글은 MSW로 생성된 목데이터입니다. 실 서버로는 어떤 요청도 나가지 않습니다.',
    viewCount: listItem?.viewCount ?? 0,
    thumbnailUrl: listItem?.thumbnailUrl ?? THUMBNAILS[0],
    likeCount: 3,
    isLike: false,
    createdAt: listItem?.createdAt ?? new Date().toISOString(),
  };
};

export const MOCK_COMMENTS_BY_ARTICLE: Record<number, CommentResponse[]> = {};

export const getMockComments = (articleId: number): CommentResponse[] => {
  if (!MOCK_COMMENTS_BY_ARTICLE[articleId]) {
    MOCK_COMMENTS_BY_ARTICLE[articleId] = [
      {
        id: articleId * 10 + 1,
        articleId,
        isMember: true,
        isMine: false,
        memberId: 'mock-author-1',
        nickname: '이생',
        content: '좋은 글 감사합니다! (목데이터)',
        createdAt: new Date(),
      },
    ];
  }
  return MOCK_COMMENTS_BY_ARTICLE[articleId];
};

export const MOCK_SCHEDULED_NOTIFICATIONS: ScheduledNotificationResponse[] = [
  {
    id: 1,
    title: '[Mock] 예약 알림',
    message: '로컬 프로토타이핑용 목 알림입니다.',
    path: '/',
    author: '목테스터',
    type: 'BACKOFFICE',
    scheduledAt: new Date(Date.now() + 86400000),
    status: 'SCHEDULED',
    createdAt: new Date(),
  },
];

export const MOCK_NOTIFICATION_LOGS: NotificationLogResponse[] = [
  {
    startTime: new Date(Date.now() - 3600000),
    endTime: new Date(),
    status: 'SUCCESS',
    author: '목테스터',
    target: 'ALL',
    title: '[Mock] 발송 완료 알림',
    message: '로컬 프로토타이핑용 목 로그입니다.',
    path: '/',
  },
];

export const MOCK_PEOPLE_DATA: PeopleData[] = [
  {
    name: '김시대',
    generation: '10기',
    position: 'Developer',
    major: '컴퓨터과학과',
    career: '3년차 프론트엔드 개발자',
    summary: '로컬 프로토타이핑을 위한 목데이터 팀원입니다.',
    link_github: 'https://github.com',
  },
  {
    name: '이생',
    generation: '10기',
    position: 'Designer',
    major: '시각디자인학과',
    summary: '로컬 프로토타이핑을 위한 목데이터 팀원입니다.',
  },
];
