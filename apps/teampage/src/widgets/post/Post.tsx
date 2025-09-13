import { PostSection } from '@/features/post/PostSection';
import { PostType } from '@/features/post/PostHeader';
import { findArticle } from '@uoslife/api';

export async function Post({
  id,
  category,
}: {
  id: number;
  category: PostType;
}) {
  const { data } = await findArticle(id);
  return <PostSection type={category} post={data} />;
}
