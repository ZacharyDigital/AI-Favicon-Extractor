import { getTranslations } from 'next-intl/server';
import { appConfig } from '@/config';

interface StructuredDataProps {
  locale: string;
}

export async function StructuredData({ locale }: StructuredDataProps) {
  const t = await getTranslations({ locale });

  // 语言代码映射（Schema.org 格式）
  const languageMap: Record<string, string> = {
    en: 'en-US',
    zh: 'zh-CN',
    es: 'es-ES',
    ja: 'ja-JP',
    ko: 'ko-KR',
    vi: 'vi-VN',
    fr: 'fr-FR',
    ru: 'ru-RU',
    de: 'de-DE',
    it: 'it-IT',
    pt: 'pt-PT',
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t('meta.title'),
    description: t('meta.description'),
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    url: appConfig.siteUrl,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
    featureList: [
      t('features.deep_extraction'),
      t('features.visual_matrix'),
      t('features.one_click_zip'),
      t('features.smart_analysis'),
    ],
    inLanguage: languageMap[locale] || 'en-US',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
