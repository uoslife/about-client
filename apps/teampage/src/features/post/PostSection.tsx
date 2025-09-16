'use client';
import React from 'react';
import { useFindArticle } from '@uoslife/api';
import { Markdown } from '@/shared/component/markdown/Markdown';
import { PostHeader, PostType } from './PostHeader';
import { PostFooter } from './PostFooter';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { ErrorFallback } from '@/shared/component/ErrorFallback';
import { useNonMemberId } from '@/entities/member-id/useNonmemberId';

export function PostSection({ type, id }: { type: PostType; id: number }) {
  const { nonMemberId, authorizationHeader } = useNonMemberId();
  const { data: post } = useFindArticle(
    id,
    {
      nonMemberId: nonMemberId,
    },
    {
      axios: {
        headers: authorizationHeader,
      },
    },
  );
  if (!post) return null;

  return (
    <ErrorBoundary errorComponent={() => <ErrorFallback />}>
      <div className="flex flex-col gap-[100px] items-center justify-start w-[880px] mx-auto mt-[140px] mb-[140px]">
        <div className="flex flex-col gap-[60px] items-start justify-start w-full">
          <PostHeader post={post.data} type={type} />
          <div className="flex flex-col gap-[60px] items-start justify-start w-full">
            {post.data.thumbnailUrl && (
              <div
                className="h-[400px] rounded-2xl w-full bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: `url('${post.data.thumbnailUrl}')` }}
              />
            )}

            <div className="w-full">
              <Markdown content={post.data.content || ''} />
            </div>
          </div>
        </div>

        <PostFooter
          postId={post.data.id}
          likeCount={post.data.likeCount}
          isLike={post.data.isLike}
        />
      </div>
    </ErrorBoundary>
  );
}
