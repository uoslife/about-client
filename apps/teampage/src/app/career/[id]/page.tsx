import { Post } from '@/widgets/post/Post';

export default function CareerPostPage({ params }: { params: { id: number } }) {
  return <Post id={params.id} category="CAREER" />;
}
