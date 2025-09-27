'use client';
import { useFindArticle } from '@uoslife/api';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { useNonMemberId } from '@/entities/member-id/useNonmemberId';
import { ErrorFallback } from '@/shared/component/ErrorFallback';
import { Markdown } from '@/shared/component/markdown/Markdown';
import { PostFooter } from './PostFooter';
import { PostHeader } from './PostHeader';
import { PrevNext } from './PrevNext';
import { SpaceType } from '@/shared/const/category';

export function PostSection({ type, id }: { type: SpaceType; id: number }) {
  const { nonMemberId } = useNonMemberId();
  const { data: post } = useFindArticle(id, {
    nonMemberId: nonMemberId,
  });
  if (!post) return null;

  return (
    <ErrorBoundary errorComponent={() => <ErrorFallback />}>
      <div className="flex flex-col gap-8 md:gap-[100px] items-center justify-start w-full max-w-[880px] mx-auto mt-8 md:mt-[140px] mb-8 md:mb-[140px] px-4 md:px-0">
        <div className="flex flex-col gap-6 md:gap-[60px] items-start justify-start w-full">
          <PostHeader post={post} type={type} />
          <div className="flex flex-col gap-6 md:gap-[60px] items-start justify-start w-full">
            {post.thumbnailUrl && (
              <div
                className="h-[173px] md:h-[400px] rounded-2xl w-full bg-center bg-cover bg-no-repeat"
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
