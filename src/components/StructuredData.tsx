import { getTranslations } from 'next-intl/server';

interface StructuredDataProps {
  locale: string;
}

export async function StructuredData({ locale }: StructuredDataProps) {
  const t = await getTranslations({ locale });

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t('meta.title'),
    description: t('meta.description'),
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://favicon-extractor.app',
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
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
