import { PostSection } from '@/features/post/PostSection';
import { mockPostData } from './mockPost';

export async function Post({ id }: { id: string }) {
  console.log('TODO: id 기반으로 데이터 조회', id);

  return <PostSection type="tech" post={mockPostData} />;
}
