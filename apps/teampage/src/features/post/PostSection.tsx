'use client';

import { useFindArticle } from '@uoslife/api';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { useNonMemberId } from '@/entities/member-id/useNonmemberId';
import { ErrorFallback } from '@/shared/component/ErrorFallback';
import { Markdown } from '@/shared/component/markdown/Markdown';
import { PostFooter } from './PostFooter';
import { PostHeader, type PostType } from './PostHeader';
import { PrevNext } from './PrevNext';

export function PostSection({ type, id }: { type: PostType; id: number }) {
  const { nonMemberId } = useNonMemberId();
  const { data: post } = useFindArticle(id, {
    nonMemberId: nonMemberId,
  });
  if (!post) return null;

  return (
    <ErrorBoundary errorComponent={() => <ErrorFallback />}>
      <div className="flex flex-col gap-[100px] items-center justify-start w-[880px] mx-auto mt-[140px] mb-[140px]">
        <div className="flex flex-col gap-[60px] items-start justify-start w-full">
          <PostHeader post={post} type={type} />
          <div className="flex flex-col gap-[60px] items-start justify-start w-full">
            {post.thumbnailUrl && (
              <div
                className="h-[400px] rounded-2xl w-full bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: `url('${post.thumbnailUrl}')` }}
              />
            )}

            <div className="w-full">
              <Markdown content={post.content || ''} />
            </div>
          </div>
        </div>

        <PostFooter
          postId={post.id}
          likeCount={post.likeCount}
          isLike={post.isLike}
          postAuthorId={post.authorId}
        />
        <PrevNext
          prevArticle={post.prevArticle}
          nextArticle={post.nextArticle}
          currentType={type}
        />
      </div>
    </ErrorBoundary>
  );
}
