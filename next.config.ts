import type { NextConfig } from 'next';
import nextIntlPlugin from 'next-intl/plugin';

const withNextIntl = nextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  // React Compiler
  reactCompiler: true,

  // Docker 部署优化
  output: 'standalone',

  // 图片优化
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // 性能优化
  compress: true,
  poweredByHeader: false,

  // 安全 Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
