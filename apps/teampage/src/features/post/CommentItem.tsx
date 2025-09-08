import { Text } from '@/shared/component/Text';
import { CommentResponse } from '@uoslife/api';
import Image from 'next/image';

type CommentItemProps = {
  comment: CommentResponse;
};

export const CommentItem = ({ comment }: CommentItemProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-grey-50 flex flex-col gap-3 items-start justify-start px-8 py-7 rounded-[20px] w-[880px]">
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-3 items-center">
          <div className="flex gap-2 items-center">
            <Image
              src={comment.profileImageUrl}
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
            {formatDate(comment.createdAt)}
          </Text>
        </div>
        {comment.isMember && (
          <div className="flex gap-3 items-center">
            <button className="cursor-pointer">
              <Text variant="body-14-m" color="grey-500">
                수정
              </Text>
            </button>
            <div className="bg-grey-200 h-2 rounded w-px" />
            <button className="cursor-pointer">
              <Text variant="body-14-m" color="grey-500">
                삭제
              </Text>
            </button>
          </div>
        )}
      </div>
      <Text variant="body-18-m" color="grey-900">
        {comment.content}
      </Text>
    </div>
  );
};
