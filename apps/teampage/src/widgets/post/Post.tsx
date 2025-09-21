'use client';
import { PostSection } from '@/features/post/PostSection';
import { PostType } from '@/features/post/PostHeader';
import { useSendViewAmplitudeEvent } from '@/entities/analytics/useSendViewAmplitudeEvent';

export function Post({ id, category }: { id: number; category: PostType }) {
  useSendViewAmplitudeEvent('VIEW_ARTICLE', {
    tab_name: category,
    article_id: id.toString(),
  });
  return <PostSection type={category} id={id} />;
}
