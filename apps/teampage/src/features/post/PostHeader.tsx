import { useUser } from '@/entities/api/useUser';
import { useAuth } from '@/entities/auth/useAuth';
import { useNonMemberId } from '@/entities/member-id/useNonmemberId';
import { useConfirmModal } from '@/shared/component/confirm-modal';
import { Tag } from '@/shared/component/Tag';
import { Text } from '@/shared/component/Text';
import { useToast } from '@/shared/component/toast';
import { ArticleDetailResponse, useDeleteArticle } from '@uoslife/api';
import { useRouter } from 'next/navigation';

export type PostType = 'tech' | 'career' | 'moments';

interface PostHeaderProps {
  post: ArticleDetailResponse;
  type: PostType;
}

export const PostHeader = (props: PostHeaderProps) => {
  const { authorizationHeader } = useNonMemberId();
  const { role } = useUser();
  const { toast } = useToast();
  const { session } = useAuth();
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
    axios: {
      headers: authorizationHeader,
    },
  });

  return (
    <div className="flex flex-col gap-7 items-start justify-start w-full">
      <div className="flex flex-col gap-5 items-start justify-start w-full">
        <Text variant="title-48-b" color="grey-900" className="w-full" as="h1">
          {post.title}
        </Text>

        {post.category && <Tag color="white">{post.category}</Tag>}
      </div>

      <div className="flex items-start justify-between w-full">
        <div className="flex gap-3 items-center">
          <Text variant="body-18-m" color="grey-500">
            {post.authorName}
          </Text>
          <div className="bg-grey-400 h-2.5 w-px" />
          <Text variant="body-18-m" color="grey-500">
            {new Date(post.createdAt).toLocaleDateString('ko-KR')}
          </Text>
          {(type === 'tech' || type === 'career') && (
            <>
              <div className="bg-grey-400 h-2.5 w-px" />
              <Text variant="body-18-m" color="grey-500">
                조회수 {post.viewCount.toLocaleString()}
              </Text>
            </>
          )}
        </div>

        {(session?.user?.name === post.authorName || role === 'ADMIN') && (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => {
                sessionStorage.setItem('editPost', JSON.stringify(post));
                window.location.href = `/write?edit=true&from=${type}`;
              }}
              className="cursor-pointer"
            >
              <Text variant="body-14-m" color="grey-500">
                수정
              </Text>
            </button>
            <div className="bg-grey-100 h-2.5 rounded w-px" />
            <button
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
              <Text variant="body-14-m" color="grey-500">
                삭제
              </Text>
            </button>
          </div>
        )}
      </div>

      <div className="bg-grey-100 h-px w-full" />
    </div>
  );
};
