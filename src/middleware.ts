import { appConfig } from "@/config";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  // 1. 添加自定义请求头（用于后续获取完整 URL）
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set('x-request-url', req.url);

  // 2. 创建修改后的请求对象
  const modifiedRequest = new NextRequest(req.url, {
    headers: reqHeaders,
    method: req.method,
    body: req.body
  });

  // 3. 创建 next-intl 中间件
  const intlMiddleware = createMiddleware({
    locales: appConfig.i18n.locales,
    defaultLocale: appConfig.i18n.defaultLocale,
    
    // as-needed: 默认语言不显示前缀
    // 例如: /about (en), /zh/about (zh)
    localePrefix: "as-needed",
    
    // 自动检测用户语言偏好
    localeDetection: true,
    
    // 自动生成 hreflang 链接（SEO）
    alternateLinks: true
  });

  return intlMiddleware(modifiedRequest);
}

// 4. 匹配器配置：排除 API 和静态资源
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

