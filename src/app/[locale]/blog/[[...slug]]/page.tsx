import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { appConfig } from '@/config';
import fs from 'fs';
import path from 'path';
import { SearchDialog } from '@/components/SearchDialog';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { ArticleToolbar } from '@/components/ArticleToolbar';
import { ArrowLeft, Clock, Calendar, User, Tag } from 'lucide-react';
import Image from 'next/image';

interface BlogPageProps {
  params: Promise<{
    locale: string;
    slug?: string[];
  }>;
}

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  coverImage?: string;
}

// 生成静态参数
export async function generateStaticParams() {
  const locales = appConfig.i18n.locales;
  const params: { locale: string; slug?: string[] }[] = [];

  for (const locale of locales) {
    params.push({ locale, slug: ['getting-started'] });
  }

  return params;
}

// 生成元数据
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const currentUrl = `${appConfig.siteUrl}/${locale}/blog`;

  const alternates: Record<string, string> = {};
  appConfig.i18n.locales.forEach((loc) => {
    alternates[loc] = `${appConfig.siteUrl}/${loc}/blog`;
  });

  return {
    title: t('blog.meta.title'),
    description: t('blog.meta.description'),
    alternates: {
      canonical: currentUrl,
      languages: alternates,
    },
    openGraph: {
      title: t('blog.meta.og_title'),
      description: t('blog.meta.description'),
      url: currentUrl,
      siteName: appConfig.appName,
      locale: locale,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('blog.meta.og_title'),
      description: t('blog.meta.description'),
      creator: t('meta.twitter_creator'),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// 读取博客内容
async function getBlogContent(locale: string, slug?: string[]): Promise<string | null> {
  try {
    const fileName = slug?.join('/') || 'getting-started';
    const filePath = path.join(process.cwd(), 'content', 'blog', locale, `${fileName}.mdx`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const withoutFrontmatter = content.replace(/^---[\s\S]*?---/, '');
    return withoutFrontmatter.trim();
  } catch (error) {
    return null;
  }
}

// 获取所有博客文章
async function getAllBlogPosts(locale: string): Promise<BlogPost[]> {
  const blogPath = path.join(process.cwd(), 'content', 'blog', locale);

  if (!fs.existsSync(blogPath)) {
    return [];
  }

  const files = fs.readdirSync(blogPath);
  const posts: BlogPost[] = [];

  for (const file of files) {
    if (file.endsWith('.mdx')) {
      const content = fs.readFileSync(path.join(blogPath, file), 'utf-8');
      const slug = file.replace('.mdx', '');

      // 提取 frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      const frontmatter: Record<string, string> = {};

      if (frontmatterMatch) {
        const lines = frontmatterMatch[1].split('\n');
        lines.forEach((line) => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length) {
            frontmatter[key.trim()] = valueParts.join(':').trim();
          }
        });
      }

      // 提取第一张图片作为封面
      const withoutFrontmatter = content.replace(/^---[\s\S]*?---/, '');
      const imageMatch = withoutFrontmatter.match(/!\[.*?\]\((.*?)\)/);
      const coverImage = imageMatch ? imageMatch[1] : undefined;

      // 提取描述（第一个段落）
      const lines = withoutFrontmatter.split('\n').filter((line) => line.trim());
      const descLine = lines.find((line) => !line.startsWith('#') && line.trim().length > 0);

      posts.push({
        slug,
        title: frontmatter.title || slug,
        description: frontmatter.description || descLine || '',
        date: frontmatter.date || 'Nov 10, 2025',
        author: frontmatter.author || 'AI Favicon Team',
        category: frontmatter.category || 'Tutorial',
        readTime: '8 min read',
        coverImage,
      });
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });

  // 如果没有 slug，显示博客列表
  if (!slug || slug.length === 0) {
    const posts = await getAllBlogPosts(locale);

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* 现代化导航栏 */}
        <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex h-16 items-center justify-center px-4 md:px-10 lg:px-20 xl:px-40">
            <div className="flex w-full max-w-[1400px] items-center justify-between">
              <div className="flex items-center gap-8">
                <a href={`/${locale}`} className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600" />
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
                  <a
                    href={`/${locale}/docs`}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {t('header.nav.docs')}
                  </a>
                  <a href={`/${locale}/blog`} className="text-sm font-medium text-purple-600">
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

        {/* 页面头部 */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex justify-center px-4 py-12 md:px-10 lg:px-20 xl:px-40">
            <div className="w-full max-w-[1400px]">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Blog</h1>
              <p className="mt-4 text-lg text-gray-600">
                Latest news, tips, and tutorials about favicon extraction and generation
              </p>
            </div>
          </div>
        </div>

        {/* 博客文章网格 */}
        <div className="flex justify-center px-4 py-12 md:px-10 lg:px-20 xl:px-40">
          <div className="w-full max-w-[1400px]">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <a
                  key={post.slug}
                  href={`/${locale}/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:border-purple-300 hover:shadow-xl"
                >
                  {/* 封面图片 */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-6xl font-bold text-purple-300">
                          {post.title.charAt(0)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 文章信息 */}
                  <div className="flex flex-1 flex-col p-6">
                    {/* 分类标签 */}
                    <div className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                      <Tag className="h-3 w-3" />
                      {post.category}
                    </div>

                    {/* 标题 */}
                    <h2 className="mb-3 text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {/* 描述 */}
                    <p className="mb-4 flex-1 text-sm text-gray-600 line-clamp-3">
                      {post.description}
                    </p>

                    {/* 元信息 */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* 空状态 */}
            {posts.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-gray-500">No blog posts available yet.</p>
              </div>
            )}
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

  // 显示博客详情
  const content = await getBlogContent(locale, slug);

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 现代化导航栏 */}
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 items-center justify-center px-4 md:px-10 lg:px-20 xl:px-40">
          <div className="flex w-full max-w-[1400px] items-center justify-between">
            <div className="flex items-center gap-8">
              <a href={`/${locale}`} className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
                <a
                  href={`/${locale}/docs`}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('header.nav.docs')}
                </a>
                <a href={`/${locale}/blog`} className="text-sm font-medium text-purple-600">
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
        <div className="w-full max-w-[1400px] py-8">
          {/* 返回按钮 */}
          <div className="py-8">
            <a
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to blog
            </a>
          </div>

          {/* 博客文章 */}
          <article className="pb-16">
            {/* 文章头部 */}
            <header className="mb-8 space-y-4">
              {/* 标签 */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                  <Tag className="h-3 w-3" />
                  Tutorial
                </span>
              </div>

              {/* 标题 */}
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Getting Started with AI Favicon Extractor
              </h1>

              {/* 元信息 */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                    <div className="flex h-full items-center justify-center text-white font-semibold">
                      AT
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 font-medium text-gray-900">
                      <User className="h-3 w-3" />
                      AI Favicon Team
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Nov 10, 2025</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>8 min read</span>
                </div>
              </div>
            </header>

            {/* 文章工具栏 */}
            <ArticleToolbar
              content={content}
              title="Getting Started with AI Favicon Extractor"
              locale={locale}
            />

            {/* 文章内容 */}
            <div className="prose prose-lg prose-purple max-w-none">
              <MarkdownRenderer content={content} />
            </div>

            {/* 文章底部 */}
            <div className="mt-12 space-y-6">
              {/* 分隔线 */}
              <div className="border-t border-gray-200" />

              {/* 分享按钮 */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Share this article</p>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Twitter
                  </button>
                  <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    LinkedIn
                  </button>
                  <button className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* 相关文章 */}
          <div className="border-t border-gray-200 py-12">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">Related Articles</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <a
                href={`/${locale}/blog/getting-started`}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-purple-300 hover:shadow-lg"
              >
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                  <Tag className="h-3 w-3" />
                  Tutorial
                </div>
                <h4 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  Getting Started Guide
                </h4>
                <p className="mt-2 text-sm text-gray-500">
                  Learn how to extract favicons from any website
                </p>
                <div className="mt-4 text-xs text-gray-400">5 min read</div>
              </a>
              <a
                href={`/${locale}/blog/best-practices`}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-purple-300 hover:shadow-lg"
              >
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                  <Tag className="h-3 w-3" />
                  Tips
                </div>
                <h4 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  Best Practices
                </h4>
                <p className="mt-2 text-sm text-gray-500">Tips for creating perfect favicons</p>
                <div className="mt-4 text-xs text-gray-400">7 min read</div>
              </a>
            </div>
          </div>
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
