import { MetadataRoute } from 'next';

/**
 * 动态生成 Web App Manifest
 * 提供 PWA 支持和多语言元数据
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AI Favicon Extractor - The Most Comprehensive Tool',
    short_name: 'Favicon Extractor',
    description:
      'Extract all favicons from any website with deep crawling. Supports HTML, Web Manifest, BrowserConfig.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    categories: ['utilities', 'productivity', 'developer tools'],
    lang: 'en',
    dir: 'ltr',
  };
}
