import { MetadataRoute } from 'next';
import { appConfig } from '@/config';

/**
 * Sitemap 路由生成逻辑说明：
 *
 * 1. 路由列表（routes）：定义实际存在的页面路由
 *    - 空字符串 '' 表示主页
 *    - 例如：['', '/about', '/documentation']
 *
 * 2. 语言列表（locales）：从 config.ts 获取支持的语言
 *    - 当前支持：['en', 'zh']
 *
 * 3. URL 生成规则：
 *    - 默认语言（en）：https://favicon-extractor.app
 *    - 其他语言（zh）：https://favicon-extractor.app/zh
 *
 * 4. 生成的 sitemap 条目：
 *    - 每个路由 × 每个语言 = 总条目数
 *    - 例如：1 个路由 × 2 个语言 = 2 个条目
 *
 * 5. 如何添加新路由：
 *    - 在 routes 数组中添加新路由
 *    - 例如：const routes = ['', '/about'];
 *    - sitemap 会自动为每个语言生成对应的 URL
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = appConfig.siteUrl;
  const locales = appConfig.i18n.locales;
  const defaultLocale = appConfig.i18n.defaultLocale;

  const urls: MetadataRoute.Sitemap = [];

  // 为每个语言生成主页 URL
  locales.forEach((locale) => {
    const url = locale === defaultLocale ? siteUrl : `${siteUrl}/${locale}`;
    urls.push({
      url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, loc === defaultLocale ? siteUrl : `${siteUrl}/${loc}`])
        ),
      },
    });
  });

  return urls;
}
