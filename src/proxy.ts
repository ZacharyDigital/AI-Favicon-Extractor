import { appConfig } from '@/config';
import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

export default async function proxy(req: NextRequest) {
  // 1. 添加自定义请求头（用于后续获取完整 URL）
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set('x-request-url', req.url);

  // 2. 创建修改后的请求对象
  const modifiedRequest = new NextRequest(req.url, {
    headers: reqHeaders,
    method: req.method,
    body: req.body,
  });

  // 3. 创建 next-intl 中间件
  const intlMiddleware = createMiddleware({
    locales: appConfig.i18n.locales,
    defaultLocale: appConfig.i18n.defaultLocale,

    // as-needed: 默认语言不显示前缀
    // 例如: /about (en), /zh/about (zh)
    localePrefix: 'as-needed',

    // 禁用自动语言检测，始终使用默认语言（除非 URL 中明确指定）
    // 这样访问 / 始终显示英文，需要其他语言时访问 /zh, /ja 等
    localeDetection: false,

    // 自动生成 hreflang 链接（SEO）
    alternateLinks: true,
  });

  return intlMiddleware(modifiedRequest);
}

// 4. 匹配器配置：排除 API 和静态资源
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
