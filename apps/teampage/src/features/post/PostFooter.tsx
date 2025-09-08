import { Text } from '@/shared/component/Text';
import { CommentResponse } from '@uoslife/api';

type PostFooterProps = {
  likeCount: number;
  comments: CommentResponse[];
};

export const PostFooter = ({ likeCount, comments }: PostFooterProps) => {
  return (
    <>
      <div className="flex gap-8 items-center">
        <button className="border border-grey-100 border-solid flex gap-2 items-center px-5 py-3 rounded-[40px]">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg className="w-5 h-[18px]" viewBox="0 0 20 18" fill="none">
              <path
                d="M10 17.5L8.55 16.2C3.4 11.6 0 8.5 0 4.75C0 2.1 2.1 0 4.75 0C6.25 0 7.7 0.7 8.55 1.8C9.4 0.7 10.85 0 12.25 0C14.9 0 17 2.1 17 4.75C17 8.5 13.6 11.6 8.45 16.2L10 17.5Z"
                fill="#E9E9EE"
              />
            </svg>
          </div>
          <Text variant="body-18-m" color="grey-700">
            좋아요
          </Text>
          <Text variant="title-24-b" color="grey-700">
            {likeCount}
          </Text>
        </button>

        <div className="flex gap-2 items-center">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg className="w-[18px] h-5" viewBox="0 0 18 20" fill="none">
              <path
                d="M15 0H3C1.35 0 0 1.35 0 3V14C0 15.65 1.35 17 3 17H15L18 20V3C18 1.35 16.65 0 15 0Z"
                fill="#44444C"
              />
            </svg>
          </div>
          <Text variant="body-18-m" color="grey-800">
            공유하기
          </Text>
        </div>
      </div>

      <div className="flex flex-col gap-9 items-start justify-start w-full">
        <div className="flex flex-col gap-4 items-start justify-start w-[880px]">
          <Text variant="body-16-m" color="grey-900">
            댓글 {comments.length}개
          </Text>
          <div className="flex flex-col gap-4 items-end justify-start w-full">
            <textarea
              className="bg-grey-50 p-5 rounded-[20px] w-full min-h-[60px] resize-none border-none outline-none text-grey-900 placeholder:text-grey-500"
              placeholder="허위사실, 욕설, 사칭 등의 댓글은 통보없이 삭제될 수 있습니다."
              style={{ fontSize: '18px', fontWeight: '500', lineHeight: '1.4' }}
            />
            <button className="bg-grey-400 flex items-center justify-center h-12 px-5 py-1 rounded-[12px]">
              <Text variant="body-20-m" color="white">
                댓글 남기기
              </Text>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-start justify-start w-full">
          <div className="flex flex-col gap-5 items-start justify-start w-full">
            <div className="bg-grey-50 flex flex-col gap-3 items-start justify-start px-8 py-7 rounded-[20px] w-[880px]">
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-3 items-center">
                  <div className="flex gap-2 items-center">
                    <div className="w-7 h-7 bg-grey-300 rounded-full" />
                    <Text variant="body-18-b" color="grey-900">
                      작성자
                    </Text>
                  </div>
                  <Text variant="body-16-m" color="grey-500">
                    2025년 8월 17일
                  </Text>
                </div>
                <div className="flex gap-3 items-center">
                  <Text variant="body-14-m" color="grey-500">
                    수정
                  </Text>
                  <div className="bg-grey-200 h-2 rounded w-px" />
                  <Text variant="body-14-m" color="grey-500">
                    삭제
                  </Text>
                </div>
              </div>
              <Text variant="body-18-m" color="grey-900">
                댓글
              </Text>
            </div>

            <div className="bg-grey-50 flex flex-col gap-3 items-start justify-start px-8 py-7 rounded-[20px] w-[880px]">
              <div className="flex gap-3 items-center">
                <div className="flex gap-2 items-center">
                  <div className="w-7 h-7 bg-grey-300 rounded-full" />
                  <Text variant="body-18-b" color="grey-900">
                    작성자
                  </Text>
                </div>
                <Text variant="body-16-m" color="grey-500">
                  2025년 8월 17일
                </Text>
              </div>
              <Text variant="body-18-m" color="grey-900">
                댓글
              </Text>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
