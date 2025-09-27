'use client';
import { PostSection } from '@/features/post/PostSection';
import { useSendViewAmplitudeEvent } from '@/entities/analytics/useSendViewAmplitudeEvent';
import { SpaceType } from '@/shared/const/category';
import { TabName } from '@/entities/analytics/AmplitudePropertyType';

export function Post({ id, category }: { id: number; category: SpaceType }) {
  useSendViewAmplitudeEvent('VIEW_ARTICLE', {
    tab_name: category.toLowerCase() as TabName,
    article_id: id.toString(),
  });
  return <PostSection type={category} id={id} />;
}
