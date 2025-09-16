'use client';
import { useQueryClient } from '@tanstack/react-query';
import {
  getFindCommentQueryKey,
  useAddReaction,
  useCreateComment,
  useFindComment,
} from '@uoslife/api';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useNonMemberId } from '@/entities/member-id/useNonmemberId';
import { Text } from '@/shared/component/Text';
import { useToast } from '@/shared/component/toast';
import { generateNonMemberNickName } from '@/shared/utils/generateNonMemberNickname';
import { Comment } from './Comment';

type PostFooterProps = {
  likeCount: number;
  isLike: boolean;
  postId: number;
};

export const PostFooter = ({ likeCount, isLike, postId }: PostFooterProps) => {
  const pathname = usePathname();
  const routeType = pathname.split('/')[1];

  const queryClient = useQueryClient();
  const { nonMemberId, authorizationHeader } = useNonMemberId();
  const { data: comments } = useFindComment(postId, {
    query: {
      queryKey: [...getFindCommentQueryKey(postId), authorizationHeader],
    },
  });
  const { toast } = useToast();
  const [like, setLike] = useState(isLike);
  const [commentText, setCommentText] = useState('');
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(likeCount);

  const { mutate: addReaction } = useAddReaction({
    mutation: {
      onMutate: async () => {
        setLike(true);
        setOptimisticLikeCount((prev) => prev + 1);
      },
      onError: () => {
        setTimeout(() => {
          setLike(false);
          setOptimisticLikeCount(likeCount);
          toast('좋아요 처리 중 오류가 발생했습니다.', 2000);
        }, 500);
      },
    },
  });
  const { mutate: addComment } = useCreateComment({
    mutation: {
      onMutate: async () => {
        setCommentText('');
      },
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: getFindCommentQueryKey(postId),
        });
      },
      onError: () => {
        toast('댓글 작성 중 오류가 발생했습니다.', 2000);
      },
    },
  });

  return (
    <>
      <div className="flex gap-8 items-center">
        <button
          type="button"
          className={`flex gap-2 items-center px-5 py-3 box-border rounded-[40px] transition-all duration-200 ${
            like
              ? 'bg-[#222227] border-[1.6px] border-solid border-[#222227]'
              : 'bg-white border-[1.6px] border-solid border-[#e9e9ee]'
          }`}
          onClick={() => {
            addReaction({
              articleId: postId,
              data: { nonMemberId: nonMemberId },
            });
          }}
          disabled={like}
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <Image
              src={like ? '/svg/heart_fill.svg' : '/svg/heart_empty.svg'}
              alt="좋아요"
              width={24}
              height={24}
              className={`${like && 'brightness-0 invert'}`}
            />
          </div>
          <Text
            variant="body-18-m"
            color={like ? 'white' : 'grey-700'}
            className="font-medium"
          >
            좋아요
          </Text>
          <Text
            variant="title-24-b"
            color={like ? 'white' : 'grey-700'}
            className="font-bold"
          >
            {optimisticLikeCount}
          </Text>
        </button>

        {routeType !== 'career' && (
          <button
            type="button"
            onClick={() => {
              toast('URL 링크가 복사되었습니다.', 1000);
              navigator.clipboard.writeText(window.location.href);
            }}
            className="flex gap-2 items-center cursor-pointer"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <Image
                src={'/svg/share.svg'}
                alt="공유하기"
                width={24}
                height={24}
              />
            </div>
            <Text variant="body-18-m" color="grey-800">
              공유하기
            </Text>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-9 items-start justify-start w-full">
        <div className="flex flex-col gap-4 items-start justify-start w-[880px]">
          <Text variant="body-16-m" color="grey-900">
            댓글 {comments?.length ?? 0}개
          </Text>
          <div className="flex flex-col gap-4 items-end justify-start w-full">
            <div className="relative w-full">
              <TextareaAutosize
                className={`bg-[#f7f7f9] box-border p-5 rounded-[20px] w-full resize-none border-none outline-none text-[#222227] placeholder:text-[#a2a2ae] text-[18px] font-medium leading-[1.6] ${
                  commentText.length >= 1 ? 'ring-[1.6px] ring-[#222227]' : ''
                }`}
                placeholder="허위사실, 욕설, 사칭 등의 댓글은 통보없이 삭제될 수 있습니다."
                minRows={1}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                addComment({
                  articleId: postId,
                  data: {
                    content: commentText,
                    nonMemberId: nonMemberId,
                    nonMemberNickName: generateNonMemberNickName(),
                  },
                });
              }}
              className={`box-border flex gap-2.5 h-12 items-center justify-center px-5 py-1 rounded-[12px] transition-all duration-200 ${
                commentText.length >= 1
                  ? 'bg-[#222227] cursor-pointer'
                  : 'bg-[#bfbfcb] cursor-not-allowed'
              }`}
              disabled={commentText.length < 1}
            >
              <Text variant="body-20-m" color="white" className="font-medium">
                댓글 남기기
              </Text>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-start justify-start w-full">
          <div className="flex flex-col gap-5 items-start justify-start w-full">
            {comments?.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
