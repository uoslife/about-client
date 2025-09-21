import { Post } from '@/widgets/post/Post';

export default function MomentsPostPage({
  params,
}: {
  params: { id: number };
}) {
  return <Post id={params.id} category="moments" />;
}
