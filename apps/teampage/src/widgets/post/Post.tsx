import { PostSection } from '@/features/post/PostSection';
import { PostType } from '@/features/post/PostHeader';

export async function Post({
  id,
  category,
}: {
  id: number;
  category: PostType;
}) {
  return <PostSection type={category} id={id} />;
}
