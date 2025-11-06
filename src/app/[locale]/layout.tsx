import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getMessagesForLocale } from "@/i18n";
import { appConfig, type LocaleType } from "@/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://favicon-extractor.app';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t('meta.title'),
      template: "%s | Favicon Extractor"
    },
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
    authors: [{ name: 'Favicon Extractor Team' }],
    creator: 'Favicon Extractor',
    publisher: 'Favicon Extractor',
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
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      url: siteUrl,
      title: t('meta.og_title'),
      description: t('meta.description'),
      siteName: 'Favicon Extractor',
      images: [
        {
          url: '/og-image.png',
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
      images: ['/twitter-image.png'],
      creator: t('meta.twitter_creator'),
    },
    verification: {
      google: 'your-google-verification-code',
    },
    alternates: {
      canonical: siteUrl,
      languages: {
        'en': `${siteUrl}`,
        'zh': `${siteUrl}/zh`,
        'es': `${siteUrl}/es`,
        'de': `${siteUrl}/de`,
        'fr': `${siteUrl}/fr`,
        'ja': `${siteUrl}/ja`,
      }
    },
    manifest: '/manifest.webmanifest',
    category: 'technology',
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
        { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        { url: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', type: 'image/png' }
      ],
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = (await params) as { locale: LocaleType };

  // 验证语言是否有效
  if (!appConfig.i18n.locales.includes(locale)) {
    notFound();
  }

  // 获取翻译消息
  const messages = await getMessagesForLocale(locale);

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KVW4H6PX"
            height="0"
            width="0"
            className="gtm-noscript-iframe"
            title="Google Tag Manager"
          ></iframe>
        </noscript>
        
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>

        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KVW4H6PX');
          `}
        </Script>
      </body>
    </html>
  );
}
