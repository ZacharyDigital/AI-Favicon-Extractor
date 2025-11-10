import type { Metadata } from 'next';
import { FaviconExtractor } from '@/components/FaviconExtractor';
import { StructuredData } from '@/components/StructuredData';
import { Header } from '@/components/homepage/Header';
import { HeroSection } from '@/components/homepage/HeroSection';
import { ExamplesGallery } from '@/components/homepage/ExamplesGallery';
import { FeaturesHighlight } from '@/components/homepage/FeaturesHighlight';
import { Testimonials } from '@/components/homepage/Testimonials';
import { PricingPlans } from '@/components/homepage/PricingPlans';
import { FAQSection } from '@/components/homepage/FAQSection';
import { Footer } from '@/components/homepage/Footer';
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
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f7f6f8] font-['Space_Grotesk',sans-serif]">
      <StructuredData locale={locale} />

      {/* Layout Container */}
      <div className="flex h-full flex-1 flex-col">
        <div className="flex flex-1 justify-center px-4 py-5 md:px-10 lg:px-20 xl:px-40">
          <div className="layout-content-container flex w-full max-w-[1400px] flex-1 flex-col">
            {/* Header */}
            <Header locale={locale} />

            {/* Main Content */}
            <main className="flex flex-col gap-10 md:gap-16">
              {/* Hero Section */}
              <HeroSection
                translations={{
                  title: t('page.hero.title'),
                  subtitle: t('page.hero.subtitle'),
                  placeholder: t('page.hero.placeholder'),
                  button: t('page.hero.button'),
                }}
              />

              {/* Core Function Section */}
              <section id="extract" className="px-4 py-10">
                <div className="mb-8 text-center">
                  <h2 className="mb-4 text-3xl font-bold text-[#191022]">{t('features.title')}</h2>
                  <p className="text-slate-600">{t('features.description')}</p>
                </div>
                <FaviconExtractor />
              </section>

              {/* Examples Gallery */}
              <ExamplesGallery title={t('page.examples.title')} />

              {/* Features Highlight */}
              <FeaturesHighlight
                title={t('page.features_highlight.title')}
                subtitle={t('page.features_highlight.subtitle')}
                features={[
                  {
                    icon: 'auto_awesome',
                    title: t('page.features_highlight.unlimited_styles.title'),
                    description: t('page.features_highlight.unlimited_styles.desc'),
                  },
                  {
                    icon: 'photo_size_select_large',
                    title: t('page.features_highlight.high_resolution.title'),
                    description: t('page.features_highlight.high_resolution.desc'),
                  },
                  {
                    icon: 'download',
                    title: t('page.features_highlight.instant_download.title'),
                    description: t('page.features_highlight.instant_download.desc'),
                  },
                  {
                    icon: 'memory',
                    title: t('page.features_highlight.ai_powered.title'),
                    description: t('page.features_highlight.ai_powered.desc'),
                  },
                ]}
              />

              {/* Testimonials */}
              <Testimonials
                title={t('page.testimonials.title')}
                subtitle={t('page.testimonials.subtitle')}
                testimonials={[
                  {
                    content: t('page.testimonials.user1.content'),
                    userName: t('page.testimonials.user1.name'),
                    userRole: t('page.testimonials.user1.role'),
                    avatarUrl:
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuAggRMIeUI85NP4VyS35gjdZ-oJL-iz0soUv8-prNQJ0cr52Dy7HoVAEnMi1EElyulhoUTPK4NCJWLewKwwtR6fPcyfqaOwn_cRLMHYzAFRUtLRv2eRTfSQZ4pGsVpgsKofqiXqslckmPRaKALu24tUZ-ecv-8LtYYDi6AO05yw_V2n-BKNhjyG1coDSYssPvXf7YZEIBC1_-W3mYRR5rZPX-bPh1ACJcs-ajvkh2XrXD1FVIkSNi7GjCZmMkOEtq3v6Y4_4VDiyHc',
                  },
                  {
                    content: t('page.testimonials.user2.content'),
                    userName: t('page.testimonials.user2.name'),
                    userRole: t('page.testimonials.user2.role'),
                    avatarUrl:
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuDT2Jgf2eT7aNkWD4kuQ69qrz9eO_4R8Vu0_1n1mO3pegb-MnJTiBvW05aLkbRB-i4re_xjoLjPRODqdkDIxnJ-aSaSSQ54XuwCz_z39jUatRcldewiY8nQme8wKhargTLjteVck_n3qmkZwa3rzLLT5d1Ey--nwOG_aPeVhj875Qfl7YuTlLPDAzZs2kbVo-JeYjpk8DlRZo5O-AF4-6lv6XIQe7Q317V9e875QA-Mfau-AaSZuEYG7FBSR1bRHiBgWfEkRd99HW4',
                  },
                  {
                    content: t('page.testimonials.user3.content'),
                    userName: t('page.testimonials.user3.name'),
                    userRole: t('page.testimonials.user3.role'),
                    avatarUrl:
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuA5LeIZ0nsbl5twbwwgXZQLpzHtNoRDVbNIQBa78ogWPF0rioYtBFianVnzJ3prEf9JYI-kf_nUExKeQ-tQpUxTn-jGQPyMFFQJfh9iyzuyc7ROt_qrrNAtgTTq5KR9tjQtGzcYyJbFEU5XwwT3qAuCviCbo2c6cRnjYCTSNkH7QjxbWWCd6gF7gtRWiMs243MPQBLqfTK9L5gZ_2aJ3OFnzz_lsLCrgZ6AyKSqSNQ19DxS4OTTTAdYCd8a3M1CXYKw34QpqOwmmvQ',
                  },
                ]}
              />

              {/* Pricing Plans */}
              <PricingPlans
                title={t('page.pricing.title')}
                subtitle={t('page.pricing.subtitle')}
                ctaButtonText={t('page.pricing.cta_button')}
                plans={[
                  {
                    name: t('page.pricing.free.name'),
                    price: t('page.pricing.free.price'),
                    period: t('page.pricing.free.period'),
                    description: t('page.pricing.free.desc'),
                    features: [
                      t('page.pricing.free.feature1'),
                      t('page.pricing.free.feature2'),
                      t('page.pricing.free.feature3'),
                    ],
                    buttonText: t('page.pricing.free.button'),
                  },
                  {
                    name: t('page.pricing.pro.name'),
                    price: t('page.pricing.pro.price'),
                    period: t('page.pricing.pro.period'),
                    description: t('page.pricing.pro.desc'),
                    features: [
                      t('page.pricing.pro.feature1'),
                      t('page.pricing.pro.feature2'),
                      t('page.pricing.pro.feature3'),
                      t('page.pricing.pro.feature4'),
                    ],
                    buttonText: t('page.pricing.pro.button'),
                    highlighted: true,
                    badge: t('page.pricing.pro.badge'),
                  },
                  {
                    name: t('page.pricing.business.name'),
                    price: t('page.pricing.business.price'),
                    period: t('page.pricing.business.period'),
                    description: t('page.pricing.business.desc'),
                    features: [
                      t('page.pricing.business.feature1'),
                      t('page.pricing.business.feature2'),
                      t('page.pricing.business.feature3'),
                    ],
                    buttonText: t('page.pricing.business.button'),
                  },
                ]}
              />

              {/* FAQ Section */}
              <FAQSection
                title={t('page.faq.title')}
                subtitle={t('page.faq.subtitle')}
                faqs={[
                  {
                    question: t('page.faq.q1.question'),
                    answer: t('page.faq.q1.answer'),
                    defaultOpen: true,
                  },
                  {
                    question: t('page.faq.q2.question'),
                    answer: t('page.faq.q2.answer'),
                  },
                  {
                    question: t('page.faq.q3.question'),
                    answer: t('page.faq.q3.answer'),
                  },
                  {
                    question: t('page.faq.q4.question'),
                    answer: t('page.faq.q4.answer'),
                  },
                  {
                    question: t('page.faq.q5.question'),
                    answer: t('page.faq.q5.answer'),
                  },
                ]}
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
