import { Post } from '@/widgets/post/Post';

export default function TechPostPage({ params }: { params: { id: string } }) {
  return <Post id={params.id} />;
}
