import { http, HttpResponse } from 'msw';
import type { PageArticleListItem } from '@uoslife/api';
import {
  MOCK_MY_INFO,
  MOCK_ARTICLES_BY_SPACE,
  buildMockArticleDetail,
  getMockComments,
  MOCK_SCHEDULED_NOTIFICATIONS,
  MOCK_NOTIFICATION_LOGS,
} from './data';
import { MOCK_SESSION } from './session';

// 실 API(about-api.uoslife.com 등)로 나가는 모든 요청을 여기서 가로챈다.
// 개별 엔드포인트는 화면에 맞는 목데이터를 돌려주고, 나머지(쓰기 포함)는 성공 스텁으로 처리해
// 실 서버·실 DB에는 어떤 요청도 도달하지 않게 한다.
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://about-api.uoslife.com/').replace(/\/$/, '');

const url = (path: string) => `${API_BASE}${path}`;

const toPage = (items: unknown[], page: number, size: number): PageArticleListItem => {
  const start = page * size;
  const content = items.slice(start, start + size);
  const totalPages = Math.max(1, Math.ceil(items.length / size));

  return {
    content: content as PageArticleListItem['content'],
    totalElements: items.length,
    totalPages,
    number: page,
    size,
    numberOfElements: content.length,
    first: page === 0,
    last: page >= totalPages - 1,
    empty: content.length === 0,
    pageable: { pageNumber: page, pageSize: size, paged: true, unpaged: false },
    sort: { sorted: true, unsorted: false, empty: false },
  };
};

export const handlers = [
  // --- 인증/프로필 ---
  http.get(url('/auth/me'), () => HttpResponse.json(MOCK_MY_INFO)),

  // --- 게시글 목록/검색 ---
  http.get(url('/articles'), ({ request }) => {
    const { searchParams } = new URL(request.url);
    const spaceId = Number(searchParams.get('spaceId'));
    const category = searchParams.get('category');
    const keyword = searchParams.get('keyword');
    const page = Number(searchParams.get('page') ?? 0);
    const size = Number(searchParams.get('size') ?? 10);

    let items = MOCK_ARTICLES_BY_SPACE[spaceId] ?? [];
    if (category) items = items.filter((a) => a.category === category);
    if (keyword) items = items.filter((a) => a.title.includes(keyword));

    return HttpResponse.json(toPage(items, page, size));
  }),

  // --- 게시글 작성/삭제(전체) ---
  http.post(url('/articles'), async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ ...buildMockArticleDetail(Date.now()), ...body }, { status: 201 });
  }),
  http.delete(url('/articles'), () => new HttpResponse(null, { status: 204 })),
  http.delete(url('/articles/comments'), () => new HttpResponse(null, { status: 204 })),

  // --- 이미지 업로드 ---
  http.post(url('/articles/uploadThumbnailImage'), () =>
    HttpResponse.json({ url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800' }),
  ),
  http.post(url('/articles/uploadImage'), () =>
    HttpResponse.json({ url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800' }),
  ),

  // --- 게시글 상세/수정/삭제 ---
  http.get(url('/articles/:articleId'), ({ params }) => {
    return HttpResponse.json(buildMockArticleDetail(Number(params.articleId)));
  }),
  http.patch(url('/articles/:articleId'), async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ ...buildMockArticleDetail(Number(params.articleId)), ...body });
  }),
  http.delete(url('/articles/:articleId'), () => new HttpResponse(null, { status: 204 })),

  // --- 좋아요 ---
  http.post(url('/articles/:articleId/likes'), () => HttpResponse.json({ isLike: true })),

  // --- 댓글 ---
  http.get(url('/articles/:articleId/comments'), ({ params }) =>
    HttpResponse.json(getMockComments(Number(params.articleId))),
  ),
  http.post(url('/articles/:articleId/comments'), async ({ params, request }) => {
    const body = (await request.json()) as { content: string; nonMemberNickName?: string };
    const articleId = Number(params.articleId);
    const comment = {
      id: Date.now(),
      articleId,
      isMember: true,
      isMine: true,
      memberId: MOCK_MY_INFO.id,
      nickname: body.nonMemberNickName ?? MOCK_MY_INFO.name,
      content: body.content,
      createdAt: new Date(),
    };
    getMockComments(articleId).push(comment);
    return HttpResponse.json(comment, { status: 201 });
  }),
  http.patch(url('/articles/:articleId/comments/:commentId'), async ({ params, request }) => {
    const body = (await request.json()) as { content: string };
    const comments = getMockComments(Number(params.articleId));
    const comment = comments.find((c) => c.id === Number(params.commentId));
    if (comment) comment.content = body.content;
    return HttpResponse.json(comment ?? { ...body, id: Number(params.commentId) });
  }),
  http.delete(url('/articles/:articleId/comments/:commentId'), ({ params }) => {
    const comments = getMockComments(Number(params.articleId));
    const idx = comments.findIndex((c) => c.id === Number(params.commentId));
    if (idx >= 0) comments.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // --- 알림(백오피스) ---
  // 예약 발송(scheduledAt 포함)은 MOCK_SCHEDULED_NOTIFICATIONS에 실제로 추가해야
  // "예약 내역" 조회 시 방금 등록한 예약이 함께 보인다.
  http.post(url('/notifications'), async ({ request }) => {
    const body = (await request.json()) as {
      title: string;
      message: string;
      path?: string;
      scheduledAt?: string;
      // fileName은 실 API 스펙에 없는 로컬 목 전용 필드(파일로 유저 지정 시 "타겟" 칸 표시용)
      recipient?: { fileName?: string };
    };
    const id = Date.now();

    if (body.scheduledAt) {
      MOCK_SCHEDULED_NOTIFICATIONS.unshift({
        id,
        title: body.title,
        message: body.message,
        path: body.path,
        author: MOCK_SESSION?.user?.name ?? '목로그인테스터',
        type: body.recipient?.fileName || 'BACKOFFICE',
        scheduledAt: new Date(body.scheduledAt),
        status: 'SCHEDULED',
        createdAt: new Date(),
      });
    }

    return HttpResponse.json({ id, scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : new Date() });
  }),
  http.get(url('/notifications/scheduled'), () => HttpResponse.json(MOCK_SCHEDULED_NOTIFICATIONS)),
  http.get(url('/notifications/logs'), () => HttpResponse.json(MOCK_NOTIFICATION_LOGS)),
  http.delete(url('/notifications/scheduled/:id'), ({ params }) => {
    const id = Number(params.id);
    const idx = MOCK_SCHEDULED_NOTIFICATIONS.findIndex((n) => n.id === id);
    if (idx >= 0) MOCK_SCHEDULED_NOTIFICATIONS.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // --- 그 외 모든 API 요청은 실 서버로 나가지 않도록 안전한 기본 스텁 처리 ---
  http.all(url('/*'), ({ request }) => {
    console.warn(`[MSW] Unmocked request stubbed: ${request.method} ${request.url}`);
    if (request.method === 'GET') return HttpResponse.json({});
    return HttpResponse.json({ success: true }, { status: 200 });
  }),
];
