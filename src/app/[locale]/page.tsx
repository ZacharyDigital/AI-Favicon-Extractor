import type { Metadata } from 'next';
import { Package } from 'lucide-react';
import { FaviconExtractor } from '@/components/FaviconExtractor';
import { StructuredData } from '@/components/StructuredData';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { getTranslations } from 'next-intl/server';
import { appConfig } from '@/config';

// 使用统一配置的站点 URL
const siteUrl = appConfig.siteUrl;

// 静态生成所有语言版本的页面（SSG）
export async function generateStaticParams() {
  return appConfig.i18n.locales.map((locale) => ({
    locale,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const currentUrl = locale === appConfig.i18n.defaultLocale ? siteUrl : `${siteUrl}/${locale}`;

  // 生成所有语言的 hreflang 链接
  const alternates: Record<string, string> = {};
  appConfig.i18n.locales.forEach((loc) => {
    alternates[loc] = loc === appConfig.i18n.defaultLocale ? siteUrl : `${siteUrl}/${loc}`;
  });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: [
      'favicon extractor',
      'favicon downloader',
      'icon extractor',
      'website icons',
      'web manifest',
      'browserconfig',
      'apple touch icon',
      'favicon crawler',
      'deep crawler',
      'favicon fetcher',
      'icon download',
      'website favicon',
    ],
    alternates: {
      canonical: currentUrl,
      languages: alternates,
    },
    openGraph: {
      type: 'website',
      locale: (() => {
        const localeMap: Record<string, string> = {
          en: 'en_US',
          zh: 'zh_CN',
          es: 'es_ES',
          ja: 'ja_JP',
          ko: 'ko_KR',
          vi: 'vi_VN',
          fr: 'fr_FR',
          ru: 'ru_RU',
          de: 'de_DE',
          it: 'it_IT',
          pt: 'pt_PT',
        };
        return localeMap[locale] || 'en_US';
      })(),
      url: currentUrl,
      title: t('meta.og_title') || t('meta.title'),
      description: t('meta.description'),
      siteName: 'Favicon Extractor',
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Favicon Extractor - Extract website icons',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
      images: [`${siteUrl}/twitter-image.png`],
      creator: t('meta.twitter_creator'),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <StructuredData locale={locale} />

      {/* Header */}
      <header className="border-b border-gray-300 bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('header.title')}
                </span>
              </h1>
              <p className="mt-1 text-sm text-gray-600">{t('header.subtitle')}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-lg">
                <Package className="h-4 w-4" />
                {t('common.powered_by')}
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <FaviconExtractor />

        {/* Static SEO Content - Empty State (Server-rendered) */}
        <section className="mx-auto mt-16 max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-gradient-to-br from-blue-100 to-purple-100 p-6">
              <Package className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('features.title')}</h2>
          <p className="mb-8 text-gray-600">{t('features.description')}</p>
          <div className="grid gap-4 text-left sm:grid-cols-2">
            {[
              { title: t('features.deep_extraction'), desc: t('features.deep_extraction_desc') },
              { title: t('features.visual_matrix'), desc: t('features.visual_matrix_desc') },
              { title: t('features.one_click_zip'), desc: t('features.one_click_zip_desc') },
              { title: t('features.smart_analysis'), desc: t('features.smart_analysis_desc') },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-400 hover:bg-white transition-all duration-300"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-300 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-600 sm:px-6 lg:px-8">
          <p>{t('footer.text')}</p>
        </div>
      </footer>
    </div>
  );
}
