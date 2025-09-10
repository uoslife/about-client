import { PostSection } from '@/features/post/PostSection';
import { PostType } from '@/features/post/PostHeader';
// import { findArticle } from '@uoslife/api';
import { mockPostData } from './mockPost';

export async function Post({
  id,
  category,
}: {
  id: number;
  category: PostType;
}) {
  console.log(id);
  // const { data } = await findArticle(id);
  return <PostSection type={category} post={mockPostData} />;
}
