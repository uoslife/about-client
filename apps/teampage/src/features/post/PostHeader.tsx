import { type ArticleDetailResponse, useDeleteArticle } from '@uoslife/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/entities/auth/useAuth';
import { useConfirmModal } from '@/shared/component/confirm-modal';
import { Tag } from '@/shared/component/Tag';
import { Text } from '@/shared/component/Text';
import { useToast } from '@/shared/component/toast';
import { SpaceType } from '@/shared/const/category';
import { useUser } from '@/entities/api/useUser';

export type PostType = 'tech' | 'career' | 'moments';

interface PostHeaderProps {
  post: ArticleDetailResponse;
  type: SpaceType;
}

export const PostHeader = (props: PostHeaderProps) => {
  const { toast } = useToast();
  const { session } = useAuth();
  const { role } = useUser();
  const { post, type } = props;
  const { open: openConfirmModal } = useConfirmModal();
  const router = useRouter();

  const { mutate: deleteArticle } = useDeleteArticle({
    mutation: {
      onSuccess: () => {
        router.push(`/${type}`);
      },
      onError: () => {
        toast('삭제 중 오류가 발생했습니다.', 2000);
      },
    },
  });

  return (
    <div className="flex flex-col gap-4 md:gap-7 items-start justify-start w-full">
      <div className="flex flex-col gap-3 md:gap-5 items-start justify-start w-full">
        <Text
          variant="title-48-b"
          color="grey-900"
          className="w-full text-2xl md:text-5xl"
          as="h1"
        >
          {post.title}
        </Text>

        {post.category && <Tag color="white">{post.category}</Tag>}
      </div>

      <div className="flex flex-col md:flex-row items-start md:justify-between w-full gap-3 md:gap-0">
        <div className="flex flex-wrap gap-2 md:gap-3 items-center">
          <Text
            variant="body-18-m"
            color="grey-500"
            className="text-sm md:text-lg"
          >
            {post.authorName}
          </Text>
          <div className="bg-grey-400 h-2.5 w-px" />
          <Text
            variant="body-18-m"
            color="grey-500"
            className="text-sm md:text-lg"
          >
            {new Date(post.createdAt).toLocaleDateString('ko-KR')}
          </Text>
          {type === 'TECH' && (
            <>
              <div className="bg-grey-400 h-2.5 w-px" />
              <Text
                variant="body-18-m"
                color="grey-500"
                className="text-sm md:text-lg"
              >
                조회수 {post.viewCount.toLocaleString()}
              </Text>
            </>
          )}
        </div>

        <div className="flex gap-2 items-center">
          {session?.user?.name === post.authorName && (
            <button
              type="button"
              onClick={() => {
                console.log(post, type);
                sessionStorage.setItem('editPost', JSON.stringify(post));
                window.location.href = `/write?edit=true&from=${type}`;
              }}
              className="cursor-pointer"
            >
              <Text
                variant="body-14-m"
                color="grey-500"
                className="text-xs md:text-sm"
              >
                수정
              </Text>
            </button>
          )}
          <div className="bg-grey-100 h-2.5 rounded w-px" />
          {(session?.user?.name === post.authorName || role === 'ADMIN') && (
            <button
              type="button"
              onClick={() => {
                openConfirmModal({
                  title: '게시글을 삭제하시겠습니까?',
                  description: '삭제된 게시물은 복구할 수 없습니다.',
                  confirmText: '삭제',
                  cancelText: '취소',
                  onConfirm: () => {
                    deleteArticle({ articleId: post.id });
                  },
                });
              }}
              className="cursor-pointer"
            >
              <Text
                variant="body-14-m"
                color="grey-500"
                className="text-xs md:text-sm"
              >
                삭제
              </Text>
            </button>
          )}
        </div>
      </div>

      <div className="bg-grey-100 h-px w-full" />
    </div>
  );
};
