import { Text } from '@/shared/component/Text';
import { CommentResponse } from '@uoslife/api';
import Image from 'next/image';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

type CommentProps = {
  comment: CommentResponse;
};

export const Comment = ({ comment }: CommentProps) => {
  const [editText, setEditText] = useState(comment.content);
  const [isEditing, setIsEditing] = useState(false);
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
            {isEditing ? (
              <button
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
                onClick={() => {
                  confirm('등록하시겠습니까?');
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
              <button
                onClick={() => {
                  confirm('삭제하시겠습니까?');
                }}
                className="cursor-pointer"
              >
                <Text variant="body-14-m" color="grey-500">
                  삭제
                </Text>
              </button>
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
