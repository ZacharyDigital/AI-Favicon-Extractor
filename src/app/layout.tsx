import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Favicon Extractor - The Most Comprehensive Tool",
    template: "%s | Favicon Extractor"
  },
  description: "Extract all favicons from any website with deep crawling. Supports HTML, Web Manifest, BrowserConfig, and provides intelligent analysis with download options.",
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
    locale: 'en_US',
    url: siteUrl,
    title: 'Favicon Extractor - The Most Comprehensive Tool',
    description: 'Extract all favicons from any website with deep crawling. Supports HTML, Web Manifest, BrowserConfig, and provides intelligent analysis with download options.',
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
    title: 'Favicon Extractor - The Most Comprehensive Tool',
    description: 'Extract all favicons from any website with deep crawling. Supports HTML, Web Manifest, BrowserConfig.',
    images: ['/twitter-image.png'],
    creator: '@faviconextractor',
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'technology',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
