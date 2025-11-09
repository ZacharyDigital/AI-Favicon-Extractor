import { type MetadataRoute } from 'next';
import { appConfig } from '@/config';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = appConfig.siteUrl;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
