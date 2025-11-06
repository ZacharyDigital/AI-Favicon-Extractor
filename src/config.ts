// 国际化配置中心
const locales = ['en', 'zh'] as const;
const defaultLocale = 'en' as const;

export type LocaleType = (typeof locales)[number];

/**
 * 应用配置中心
 * 所有环境变量统一在此配置，避免在多个文件中重复定义
 */
export const appConfig = {
  // 应用基础信息
  appDomain: process.env.NODE_ENV === 'development' ? 'localhost:3001' : 'www.aifavicon.com',
  appRootDomain: 'www.aifavicon.com',
  appName: 'AI Favicon Extractor',
  appDescription: 'The most comprehensive favicon extraction tool',

  // 站点 URL - 统一配置
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aifavicon.com',

  // API 配置 - 统一配置
  // 注意：API 地址不应在代码中硬编码，必须通过环境变量 NEXT_PUBLIC_API_URL 配置
  // 开发环境默认值仅用于本地开发，生产环境必须通过环境变量配置
  // 如果未配置且不是开发环境，使用空字符串（需要确保环境变量已配置）
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : ''),

  // 国际化配置
  i18n: {
    locales,
    defaultLocale,
    labels: {
      en: 'English',
      zh: '中文',
    } as Record<LocaleType, string>,
  },

  // GTM 配置
  gtmId: 'GTM-KVW4H6PX',

  // 搜索引擎验证码配置
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
    bing: process.env.BING_VERIFICATION_CODE,
    yandex: process.env.YANDEX_VERIFICATION_CODE,
    yahoo: process.env.YAHOO_VERIFICATION_CODE,
    baidu: process.env.BAIDU_VERIFICATION_CODE,
    naver: process.env.NAVER_VERIFICATION_CODE,
  },
} as const;
