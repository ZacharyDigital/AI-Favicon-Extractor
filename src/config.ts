// 国际化配置中心
const locales = ['en', 'zh', 'es', 'de', 'fr', 'ja'] as const;
const defaultLocale = "en" as const;

export type LocaleType = typeof locales[number];

export const appConfig = {
  appDomain: process.env.NODE_ENV === 'development' 
    ? "localhost:3001" 
    : "favicon-extractor.app",
  appRootDomain: "favicon-extractor.app",
  appName: "AI Favicon Extractor",
  appDescription: "The most comprehensive favicon extraction tool",
  
  // 国际化配置
  i18n: {
    locales,
    defaultLocale,
    labels: {
      "en": "English",
      "zh": "中文",
      "es": "Español",
      "de": "Deutsch",
      "fr": "Français",
      "ja": "日本語"
    } as Record<LocaleType, string>
  },
  
  // GTM 配置
  gtmId: "GTM-KVW4H6PX",
  
  // API 配置
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
}

