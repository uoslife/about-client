import { PostSection } from '@/features/post/PostSection';
import { mockPostData } from './mockPost';
import { PostType } from '@/features/post/PostHeader';

export async function Post({
  id,
  category,
}: {
  id: string;
  category: PostType;
}) {
  console.log('TODO: id 기반으로 데이터 조회', id);
  return <PostSection type={category} post={mockPostData} />;
}
