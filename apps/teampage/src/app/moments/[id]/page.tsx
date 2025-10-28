import { Post } from '@/widgets/post/Post';
import { Metadata } from 'next';
import { findArticle } from '@uoslife/api';
import metaData from '@/shared/const/seo.config';

export async function generateMetadata({
  params,
}: {
  params: { id: number };
}): Promise<Metadata> {
  try {
    const article = await findArticle(params.id);

    return {
      title: article.title,
      description: article.summary || article.title,
      alternates: {
        canonical: `/moments/${params.id}`,
      },
      openGraph: {
        title: article.title,
        description: article.summary || article.title,
        url: `${metaData.siteUrl}/moments/${params.id}`,
        type: 'article',
        images: article.thumbnailUrl
          ? [
              {
                url: article.thumbnailUrl,
                alt: article.title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.summary || article.title,
        images: article.thumbnailUrl ? [article.thumbnailUrl] : undefined,
      },
    };
  } catch (error) {
    return {
      title: 'Moments 글',
      description: '시대생 Moments 글을 확인해보세요',
    };
  }
}

export default function MomentsPostPage({
  params,
}: {
  params: { id: number };
}) {
  return <Post id={params.id} category="MOMENTS" />;
}
