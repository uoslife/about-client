import { ArticleDetailResponse } from '@uoslife/api';

export const mockPostData: ArticleDetailResponse = {
  id: 1,
  authorId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  authorName: '김개발',
  title: 'Next.js 13 App Router 완전 정복하기',
  category: 'DEVELOP',
  summary:
    'Next.js 13의 새로운 App Router를 활용한 모던 웹 개발 방법을 알아봅시다.',
  content: `
  # Next.js 13 App Router 완전 정복하기
  
  Next.js 13에서 도입된 App Router는 기존의 Pages Router와는 완전히 다른 패러다임을 제공합니다.
  
  ![Next.js App Router 구조도](https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800)
  
  ## 주요 특징
  
  1. **파일 시스템 기반 라우팅**
  2. **Server Components 지원**
  3. **Streaming과 Suspense**
  4. **개선된 데이터 페칭**
  
  ![개발 환경 설정](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800)
  
  ## 시작하기
  
  \`\`\`bash
  npx create-next-app@latest my-app --experimental-app
  \`\`\`
  
  App Router를 사용하면 더욱 직관적이고 성능이 뛰어난 웹 애플리케이션을 구축할 수 있습니다.
  
  ![완성된 애플리케이션 예시](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800)
    `,
  viewCount: 1247,
  thumbnailUrl:
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
  likeCount: 42,
  createdAt: '2024-09-06T10:30:00Z',
  prevArticle: {
    id: 2,
    writerId: '2fa85f64-5717-4562-b3fc-2c963f66afa6',
    writerName: '박디자인',
    title: '디자인 시스템 구축하기',
    summary: '일관된 사용자 경험을 위한 디자인 시스템 구축 방법',
    viewCount: 892,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800',
    createdAt: new Date('2024-09-05T14:20:00Z'),
  },
  nextArticle: {
    id: 3,
    writerId: '4fa85f64-5717-4562-b3fc-2c963f66afa6',
    writerName: '이마케팅',
    title: '효과적인 콘텐츠 마케팅 전략',
    summary: '타겟 오디언스에게 다가가는 콘텐츠 마케팅 노하우',
    viewCount: 634,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    createdAt: new Date('2024-09-07T09:15:00Z'),
  },
  comments: [
    {
      id: 1,
      articleId: 1,
      isMember: true,
      memberId: '1fa85f64-5717-4562-b3fc-2c963f66afa6',
      nickname: '김댓글',
      profileImageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      content: '정말 유용한 글이네요! App Router 도입을 고려해봐야겠어요.',
      createdAt: new Date('2024-09-06T11:30:00Z'),
    },
    {
      id: 2,
      articleId: 1,
      isMember: false,
      nonMemberId: 'anonymous_user_123',
      nickname: '익명사용자',
      profileImageUrl:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      content: '감사합니다. 많은 도움이 되었습니다.',
      createdAt: new Date('2024-09-06T12:15:00Z'),
    },
    {
      id: 3,
      articleId: 1,
      isMember: true,
      memberId: '5fa85f64-5717-4562-b3fc-2c963f66afa6',
      nickname: '박개발자',
      profileImageUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      content:
        'Server Components 부분이 특히 인상깊네요. 실제 프로젝트에 적용해보겠습니다.',
      createdAt: new Date('2024-09-06T13:45:00Z'),
    },
  ],
};
