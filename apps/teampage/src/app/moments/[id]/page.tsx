import { Post } from '@/widgets/post/Post';

export default function MomentsPostPage({
  params,
}: {
  params: { id: string };
}) {
  return <Post id={params.id} category="moments" />;
}
