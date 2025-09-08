import { Post } from '@/widgets/post/Post';

export default function CareerPostPage({ params }: { params: { id: string } }) {
  return <Post id={params.id} category="career" />;
}
