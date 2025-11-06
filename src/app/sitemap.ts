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
  // 使用统一配置的站点 URL
  const siteUrl = appConfig.siteUrl;

  // 只包含实际存在的路由
  // 添加新路由时，在此数组中添加路径
  const routes = [''];

  // 从配置中获取支持的语言列表
  const locales = appConfig.i18n.locales;

  // 为每个语言和路由生成 sitemap 条目
  const entries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.forEach((route) => {
      // 生成 URL：默认语言不显示前缀，其他语言显示语言前缀
      const url =
        locale === appConfig.i18n.defaultLocale
          ? `${siteUrl}${route}` // 默认语言：https://favicon-extractor.app
          : `${siteUrl}/${locale}${route}`; // 其他语言：https://favicon-extractor.app/zh

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
        // 为每个 URL 添加所有语言的 hreflang 链接
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
