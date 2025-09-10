'use client';
import React from 'react';
import { ArticleDetailResponse } from '@uoslife/api';
import { Markdown } from '@/shared/component/markdown/Markdown';
import { PostHeader, PostType } from './PostHeader';
import { PostFooter } from './PostFooter';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import { ErrorFallback } from '@/shared/component/ErrorFallback';

export function PostSection({
  type,
  post,
}: {
  type: PostType;
  post: ArticleDetailResponse;
}) {
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

        <PostFooter likeCount={post.likeCount} comments={post.comments} />
      </div>
    </ErrorBoundary>
  );
}
