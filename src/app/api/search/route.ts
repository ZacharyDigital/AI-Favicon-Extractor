import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  url: string;
  type: 'doc' | 'blog';
}

// 简单的内存搜索实现
function searchInContent(query: string, locale: string): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  // 搜索文档
  const docsPath = path.join(process.cwd(), 'content', 'docs', locale);
  if (fs.existsSync(docsPath)) {
    const files = fs.readdirSync(docsPath);
    files.forEach((file) => {
      if (file.endsWith('.mdx')) {
        const content = fs.readFileSync(path.join(docsPath, file), 'utf-8');
        const withoutFrontmatter = content.replace(/^---[\s\S]*?---/, '');

        if (withoutFrontmatter.toLowerCase().includes(lowerQuery)) {
          const lines = withoutFrontmatter.split('\n');
          const titleLine = lines.find((line) => line.startsWith('# '));
          const title = titleLine ? titleLine.replace('# ', '') : file.replace('.mdx', '');

          results.push({
            id: `doc-${file}`,
            title,
            content: withoutFrontmatter.substring(0, 500),
            url: `/${locale}/docs/${file.replace('.mdx', '')}`,
            type: 'doc',
          });
        }
      }
    });
  }

  // 搜索博客
  const blogPath = path.join(process.cwd(), 'content', 'blog', locale);
  if (fs.existsSync(blogPath)) {
    const files = fs.readdirSync(blogPath);
    files.forEach((file) => {
      if (file.endsWith('.mdx')) {
        const content = fs.readFileSync(path.join(blogPath, file), 'utf-8');
        const withoutFrontmatter = content.replace(/^---[\s\S]*?---/, '');

        if (withoutFrontmatter.toLowerCase().includes(lowerQuery)) {
          const lines = withoutFrontmatter.split('\n');
          const titleLine = lines.find((line) => line.startsWith('# '));
          const title = titleLine ? titleLine.replace('# ', '') : file.replace('.mdx', '');

          results.push({
            id: `blog-${file}`,
            title,
            content: withoutFrontmatter.substring(0, 500),
            url: `/${locale}/blog/${file.replace('.mdx', '')}`,
            type: 'blog',
          });
        }
      }
    });
  }

  return results.slice(0, 10);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const locale = searchParams.get('locale') || 'en';

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = searchInContent(query, locale);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 });
  }
}
