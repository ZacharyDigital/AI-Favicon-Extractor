import { MetadataRoute } from 'next';
import { appConfig } from '@/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://favicon-extractor.app';
  // 只包含实际存在的路由
  const routes = [''];
  const locales = appConfig.i18n.locales;

  // 为每个语言和路由生成 sitemap 条目
  const entries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.forEach((route) => {
      const url =
        locale === appConfig.i18n.defaultLocale
          ? `${siteUrl}${route}`
          : `${siteUrl}/${locale}${route}`;

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : route === '/about' || route === '/documentation' ? 0.8 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [
              loc,
              loc === appConfig.i18n.defaultLocale
                ? `${siteUrl}${route}`
                : `${siteUrl}/${loc}${route}`,
            ])
          ),
        },
      });
    });
  });

  return entries;
}
