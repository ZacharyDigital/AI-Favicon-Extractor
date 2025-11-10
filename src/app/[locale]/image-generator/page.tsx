import type { Metadata } from 'next';
import { StructuredData } from '@/components/StructuredData';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { getTranslations } from 'next-intl/server';
import { appConfig } from '@/config';
import ImageGenerator from '@/components/image-generator';

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

  const currentUrl =
    locale === appConfig.i18n.defaultLocale
      ? `${siteUrl}/image-generator`
      : `${siteUrl}/${locale}/image-generator`;

  const alternates: Record<string, string> = {};
  appConfig.i18n.locales.forEach((loc) => {
    alternates[loc] =
      loc === appConfig.i18n.defaultLocale
        ? `${siteUrl}/image-generator`
        : `${siteUrl}/${loc}/image-generator`;
  });

  return {
    title: t('image_generator.meta.title'),
    description: t('image_generator.meta.description'),
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
      title: t('image_generator.meta.og_title') || t('image_generator.meta.title'),
      description: t('image_generator.meta.description'),
      siteName: 'Favicon Extractor',
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Favicon Generator - Generate favicon from image',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('image_generator.meta.title'),
      description: t('image_generator.meta.description'),
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

export default async function ImageGeneratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f7f6f8] font-['Space_Grotesk',sans-serif]">
      <StructuredData locale={locale} />

      {/* Layout Container */}
      <div className="flex h-full flex-1 flex-col">
        <div className="flex flex-1 justify-center px-4 py-5 md:px-10 lg:px-20 xl:px-40">
          <div className="layout-content-container flex w-full max-w-[1400px] flex-1 flex-col">
            {/* Header */}
            <Header locale={locale} />

            {/* Main Content */}
            <main className="flex-1 py-8">
              {/* Page Title */}
              <div className="mb-8 flex flex-col gap-4 px-4">
                <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-[#191022]">
                  {t('image_generator.title')}
                </h1>
                <p className="text-base font-normal leading-normal text-slate-600">
                  {t('image_generator.subtitle')}
                </p>
              </div>

              {/* Generator Component (Client) */}
              <ImageGenerator
                translations={{
                  uploadTitle: t('image_generator.upload_title'),
                  uploadDesc: t('image_generator.upload_desc'),
                  browseFiles: t('image_generator.browse_files'),
                  background: t('image_generator.background'),
                  transparentBackground: t('image_generator.transparent_background'),
                  padding: t('image_generator.padding'),
                  shape: t('image_generator.shape'),
                  livePreview: t('image_generator.live_preview'),
                  packageTitle: t('image_generator.package_title'),
                  instantGenerate: t('image_generator.instant_generate'),
                  downloadAllZip: t('image_generator.download_all_zip'),
                  previewBrowserLight: t('image_generator.preview_browser_light'),
                  previewBrowserDark: t('image_generator.preview_browser_dark'),
                  previewGoogleLight: t('image_generator.preview_google_light'),
                  previewGoogleDark: t('image_generator.preview_google_dark'),
                  previewAppleTouch: t('image_generator.preview_apple_touch'),
                  previewAndroidHome: t('image_generator.preview_android_home'),
                  previewAndroidSplash: t('image_generator.preview_android_splash'),
                  previewAndroidSwitch: t('image_generator.preview_android_switch'),
                  previewWindows: t('image_generator.preview_windows'),
                }}
              />
            </main>

            {/* Footer */}
            <Footer locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
