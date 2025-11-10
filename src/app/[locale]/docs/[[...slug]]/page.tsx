import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { appConfig } from '@/config';
import fs from 'fs';
import path from 'path';
import { DocsSidebar } from '@/components/DocsSidebar';
import { SearchDialog } from '@/components/SearchDialog';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { ArticleToolbar } from '@/components/ArticleToolbar';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

interface DocPageProps {
  params: Promise<{
    locale: string;
    slug?: string[];
  }>;
}

// 生成静态参数
export async function generateStaticParams() {
  const locales = appConfig.i18n.locales;
  const params: { locale: string; slug?: string[] }[] = [];

  for (const locale of locales) {
    // 首页
    params.push({ locale, slug: undefined });

    // 可以添加更多文档页面
  }

  return params;
}

// 生成元数据
export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const currentUrl = `${appConfig.siteUrl}/${locale}/docs`;

  const alternates: Record<string, string> = {};
  appConfig.i18n.locales.forEach((loc) => {
    alternates[loc] = `${appConfig.siteUrl}/${loc}/docs`;
  });

  return {
    title: t('docs.meta.title'),
    description: t('docs.meta.description'),
    alternates: {
      canonical: currentUrl,
      languages: alternates,
    },
    openGraph: {
      title: t('docs.meta.og_title'),
      description: t('docs.meta.description'),
      url: currentUrl,
      siteName: appConfig.appName,
      locale: locale,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('docs.meta.og_title'),
      description: t('docs.meta.description'),
      creator: t('meta.twitter_creator'),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// 读取 MDX 文件内容
async function getDocContent(locale: string, slug?: string[]): Promise<string | null> {
  try {
    const fileName = slug?.join('/') || 'index';
    const filePath = path.join(process.cwd(), 'content', 'docs', locale, `${fileName}.mdx`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    // 简单读取内容，移除frontmatter
    const content = fs.readFileSync(filePath, 'utf-8');
    const withoutFrontmatter = content.replace(/^---[\s\S]*?---/, '');
    return withoutFrontmatter.trim();
  } catch (error) {
    return null;
  }
}

export default async function DocsPage({ params }: DocPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });

  const content = await getDocContent(locale, slug);

  if (!content) {
    notFound();
  }

  // 文档导航结构
  const navItems = [
    {
      title: t('docs.nav.getting_started'),
      href: `/${locale}/docs`,
      items: [
        { title: t('docs.nav.introduction'), href: `/${locale}/docs` },
        { title: t('docs.nav.installation'), href: `/${locale}/docs/installation` },
      ],
    },
    {
      title: t('docs.nav.features'),
      href: `/${locale}/docs/features`,
      items: [
        { title: t('docs.nav.extraction'), href: `/${locale}/docs/features/extraction` },
        { title: t('docs.nav.generation'), href: `/${locale}/docs/features/generation` },
      ],
    },
  ];

  const currentPath = `/${locale}/docs${slug ? `/${slug.join('/')}` : ''}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 现代化导航栏 */}
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 items-center justify-center px-4 md:px-10 lg:px-20 xl:px-40">
          <div className="flex w-full max-w-[1400px] items-center justify-between">
            <div className="flex items-center gap-8">
              <a href={`/${locale}`} className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {appConfig.appName}
                </span>
              </a>
              <div className="hidden md:flex items-center gap-6">
                <a
                  href={`/${locale}`}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('header.nav.home')}
                </a>
                <a href={`/${locale}/docs`} className="text-sm font-medium text-blue-600">
                  {t('header.nav.docs')}
                </a>
                <a
                  href={`/${locale}/blog`}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('header.nav.blog')}
                </a>
                <a
                  href={`/${locale}/image-generator`}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('header.nav.generate_image')}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <SearchDialog
                locale={locale}
                translations={{
                  searchPlaceholder: t('search.placeholder'),
                  searching: t('search.searching'),
                  noResults: t('search.no_results'),
                  startTyping: t('search.start_typing'),
                  closeHint: t('search.close_hint'),
                  openHint: t('search.open_hint'),
                  docs: t('search.docs'),
                  blog: t('search.blog'),
                }}
              />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <div className="flex justify-center px-4 md:px-10 lg:px-20 xl:px-40">
        <div className="flex w-full max-w-[1400px] gap-8 py-8">
          {/* 侧边栏导航 */}
          <DocsSidebar items={navItems} currentPath={currentPath} />

          {/* 文档内容 */}
          <main className="min-w-0 flex-1">
            {/* 返回链接 */}
            <a
              href={`/${locale}/docs`}
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Docs
            </a>

            {/* 文档内容卡片 */}
            <article className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm lg:p-12">
              <div className="prose prose-lg prose-blue max-w-none">
                <div className="not-prose mb-8">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Last updated: Nov 10, 2025</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>5 min read</span>
                    </div>
                  </div>
                </div>

                {/* 文章工具栏 */}
                <ArticleToolbar content={content} title="Documentation" locale={locale} />

                <MarkdownRenderer content={content} />
              </div>

              {/* 分页导航 */}
              <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
                <a
                  href="#"
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Next
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </a>
              </div>
            </article>

            {/* 相关文档 */}
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Related Documentation</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <a
                  href={`/${locale}/docs/getting-started`}
                  className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
                >
                  <h4 className="font-medium text-gray-900">Getting Started</h4>
                  <p className="mt-1 text-sm text-gray-500">Learn the basics of using our tool</p>
                </a>
                <a
                  href={`/${locale}/docs/api-reference`}
                  className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
                >
                  <h4 className="font-medium text-gray-900">API Reference</h4>
                  <p className="mt-1 text-sm text-gray-500">Complete API documentation</p>
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="mt-24 border-t border-gray-200 bg-white">
        <div className="flex justify-center px-4 py-12 md:px-10 lg:px-20 xl:px-40">
          <div className="w-full max-w-[1400px] text-center text-sm text-gray-500">
            <p>&copy; 2025 {appConfig.appName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
