import { useQueryClient } from '@tanstack/react-query';
import {
  type CommentResponse,
  getFindCommentQueryKey,
  useDeleteComment,
  useUpdateComment,
} from '@uoslife/api';
import Image from 'next/image';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { useUser } from '@/entities/api/useUser';
import { useNonMemberId } from '@/entities/member-id/useNonmemberId';
import { Text } from '@/shared/component/Text';
import { useToast } from '@/shared/component/toast';

type CommentProps = {
  comment: CommentResponse;
  postAuthorId: string;
};

export const Comment = ({ comment, postAuthorId }: CommentProps) => {
  const { role } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editText, setEditText] = useState(comment.content);
  const [isEditing, setIsEditing] = useState(false);
  const { authorizationHeader } = useNonMemberId();
  const { mutate: deleteComment } = useDeleteComment({
    mutation: {
      onMutate: async () => {
        setIsEditing(false);
      },
      onError: () => {
        toast('삭제 중 오류가 발생했습니다.', 2000);
        setIsEditing(false);
      },
      onSuccess: () => {
        toast('삭제되었습니다.', 2000);
        queryClient.invalidateQueries({
          queryKey: [
            ...getFindCommentQueryKey(comment.articleId),
            authorizationHeader,
          ],
        });
      },
    },
  });

  const { mutate: updateComment } = useUpdateComment({
    mutation: {
      onMutate: async () => {
        setIsEditing(false);
      },
      onError: () => {
        toast('수정 중 오류가 발생했습니다.', 2000);
        setIsEditing(false);
      },
      onSuccess: () => {
        toast('수정되었습니다.', 2000);
        queryClient.invalidateQueries({
          queryKey: [
            ...getFindCommentQueryKey(comment.articleId),
            authorizationHeader,
          ],
        });
      },
    },
  });

  return (
    <div className="bg-grey-50 flex flex-col gap-3 items-start justify-start px-8 py-7 rounded-[20px] w-[880px]">
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-3 items-center">
          <div className="flex gap-2 items-center">
            <Image
              src={
                comment.memberId === postAuthorId
                  ? '/img/member.png'
                  : '/img/non_member.png'
              }
              alt={`${comment.nickname} 프로필`}
              width={28}
              height={28}
              className="w-7 h-7 rounded-full object-cover"
            />
            <Text variant="body-18-b" color="grey-900">
              {comment.nickname}
            </Text>
          </div>
          <Text variant="body-16-m" color="grey-500">
            {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </div>
        {(comment.isMine || role === 'ADMIN') && (
          <div className="flex gap-3 items-center">
            {isEditing ? (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                }}
                className="cursor-pointer"
              >
                <Text variant="body-14-m" color="grey-500">
                  취소
                </Text>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                }}
                className="cursor-pointer"
              >
                <Text variant="body-14-m" color="grey-500">
                  수정
                </Text>
              </button>
            )}
            <div className="bg-grey-200 h-2 rounded w-px" />
            {isEditing ? (
              <button
                type="button"
                onClick={() => {
                  updateComment({
                    articleId: comment.articleId,
                    commentId: comment.id,
                    data: { content: editText },
                  });
                }}
                className={isEditing ? 'cursor-pointer' : 'cursor-not-allowed'}
              >
                <Text
                  variant="body-14-m"
                  color={editText.length >= 5 ? 'primary-ui' : 'grey-500'}
                >
                  등록
                </Text>
              </button>
            ) : (
              (role === 'ADMIN' || comment.isMine) && (
                <button
                  type="button"
                  onClick={() => {
                    deleteComment({
                      articleId: comment.articleId,
                      commentId: comment.id,
                    });
                  }}
                  className="cursor-pointer"
                >
                  <Text variant="body-14-m" color="grey-500">
                    삭제
                  </Text>
                </button>
              )
            )}
          </div>
        )}
      </div>
      {isEditing ? (
        <TextareaAutosize
          className={`bg-[#f7f7f9] box-border p-5 rounded-[20px] w-full resize-none border-[1.6px] outline-none text-[#222227] placeholder:text-[#a2a2ae] text-[18px] font-medium leading-[1.6] ${
            editText.length >= 5 ? 'ring-[1.6px] ring-[#222227]' : ''
          }`}
          onChange={(e) => {
            setEditText(e.target.value);
          }}
          value={editText}
        />
      ) : (
        <Text variant="body-18-m" color="grey-900">
          {comment.content}
        </Text>
      )}
    </div>
  );
};
