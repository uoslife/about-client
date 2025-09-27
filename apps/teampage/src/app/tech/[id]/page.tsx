import { Post } from '@/widgets/post/Post';

export default function TechPostPage({ params }: { params: { id: number } }) {
  return <Post id={params.id} category="TECH" />;
}
