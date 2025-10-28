import { MetadataRoute } from 'next';
import metaData from '@/shared/const/seo.config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/write/'],
      },
    ],
    sitemap: `${metaData.siteUrl}/sitemap.xml`,
  };
}

