# AI Favicon Extractor - 项目开发规则

本文档定义了 AI Favicon Extractor 项目的开发规范、架构原则和最佳实践。

---

## 📋 目录

1. [技术栈与版本要求](#技术栈与版本要求)
2. [项目架构原则](#项目架构原则)
3. [服务端渲染（SSR）规范](#服务端渲染ssr规范)
4. [组件开发规范](#组件开发规范)
5. [国际化（i18n）规范](#国际化i18n规范)
6. [SEO 优化规范](#seo-优化规范)
7. [代码风格与质量](#代码风格与质量)
8. [类型安全规范](#类型安全规范)
9. [状态管理规范](#状态管理规范)
10. [性能优化规范](#性能优化规范)
11. [安全规范](#安全规范)
12. [测试规范](#测试规范)
13. [Git 提交规范](#git-提交规范)
14. [环境变量管理](#环境变量管理)

---

## 技术栈与版本要求

### 核心技术栈

- **框架**: Next.js 16.0.1+ (App Router)
- **React**: 19.2.0+
- **TypeScript**: 5.x
- **Node.js**: >=20.9.0
- **包管理器**: npm

### 主要依赖

- **国际化**: next-intl 4.4.0+
- **样式**: Tailwind CSS 4.x
- **UI 组件**: Radix UI 系列
- **表单**: React Hook Form 7.66.0+ + Zod 4.1.12+
- **HTTP 客户端**: Axios 1.13.1+
- **图标**: Lucide React 0.548.0+

### 开发工具

- **代码检查**: ESLint 9.x
- **代码格式化**: Prettier 3.6.2+
- **Git Hooks**: Husky 9.1.7+
- **版本管理**: standard-version 9.5.0+

---

## 项目架构原则

### 1. 服务端优先架构

**原则**: 所有组件默认使用服务端渲染（SSR），仅在必要时使用客户端渲染（CSR）。

**理由**:

- 更好的 SEO
- 更快的首次内容绘制（FCP）
- 减少客户端 JavaScript 负载

**实施规则**:

```typescript
// ✅ 正确：默认服务端组件
export async function ServerComponent() {
  const t = await getTranslations();
  return <div>{t('content')}</div>;
}

// ✅ 正确：仅在需要交互时使用客户端
'use client';
export function InteractiveComponent() {
  const [state, setState] = useState();
  return <button onClick={() => setState()}>Click</button>;
}

// ❌ 错误：不必要的客户端组件
'use client';
export function UnnecessaryClientComponent() {
  return <div>Static content</div>; // 无交互，应为服务端组件
}
```

### 2. 目录结构规范

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # 国际化路由
│   │   ├── layout.tsx     # 布局（SSR）
│   │   └── page.tsx       # 页面（SSR）
│   ├── manifest.ts        # PWA Manifest
│   ├── robots.ts          # Robots.txt
│   └── sitemap.ts         # Sitemap.xml
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   └── [业务组件].tsx
├── lib/                  # 工具函数
├── types/                # TypeScript 类型定义
├── config.ts             # 统一配置中心
└── i18n.ts              # 国际化配置
```

### 3. 配置中心化

**规则**: 所有配置必须集中在 `src/config.ts`，避免硬编码。

```typescript
// ✅ 正确：使用配置中心
import { appConfig } from '@/config';
const apiUrl = appConfig.apiUrl;

// ❌ 错误：硬编码
const apiUrl = 'https://api.example.com';
```

---

## 服务端渲染（SSR）规范

### 1. 组件分类规则

#### 服务端组件（默认）

**使用场景**:

- 静态内容展示
- 数据获取
- SEO 关键内容
- 元数据生成

**示例**:

```typescript
// 页面级服务端组件
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function Page({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return <main>{t('content')}</main>;
}
```

#### 客户端组件

**使用场景**（仅限以下情况）:

- 表单交互和状态管理
- 事件处理（onClick, onChange 等）
- 浏览器 API（window, document）
- React Hooks（useState, useEffect 等）
- 第三方交互库（需要客户端的）

**示例**:

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function FormComponent() {
  const [data, setData] = useState(null);
  const form = useForm();

  const handleSubmit = (formData) => {
    // 处理表单
  };

  return <form onSubmit={form.handleSubmit(handleSubmit)}>...</form>;
}
```

### 2. SSR 兼容组件规范

**原则**: 展示型组件应设计为 SSR 兼容，通过 props 接收数据。

```typescript
// ✅ 正确：SSR 兼容组件
interface AnalysisPanelProps {
  analysis: IconAnalysis;
  translations: {
    title: string;
    excellent: string;
    // ... 其他翻译
  };
}

export function AnalysisPanel({ analysis, translations }: AnalysisPanelProps) {
  // 无客户端依赖，可在服务端和客户端使用
  return <div>{translations.title}</div>;
}

// ❌ 错误：不必要的客户端依赖
'use client';
import { useTranslations } from 'next-intl';

export function AnalysisPanel({ analysis }) {
  const t = useTranslations(); // 仅为获取翻译就使用客户端
  return <div>{t('title')}</div>;
}
```

### 3. 静态生成规范

**要求**: 所有多语言页面必须使用 `generateStaticParams` 预渲染。

```typescript
// ✅ 必须：静态生成所有语言版本
export async function generateStaticParams() {
  return appConfig.i18n.locales.map((locale) => ({
    locale,
  }));
}
```

### 4. 水合错误预防

**规则**: 避免客户端和服务端 HTML 不匹配。

```typescript
// ✅ 正确：处理客户端特定逻辑
'use client';

export function ClientOnlyComponent() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return <div className="h-9 w-auto min-w-[140px]" />; // 占位符
  }

  return <div>{/* 客户端内容 */}</div>;
}

// ❌ 错误：直接使用 window
export function BadComponent() {
  return <div>{window.location.href}</div>; // 服务端无 window
}
```

---

## 组件开发规范

### 1. 命名规范

- **组件文件**: PascalCase，如 `FaviconExtractor.tsx`
- **工具函数**: camelCase，如 `analyzeFavicons.ts`
- **类型定义**: PascalCase，如 `IconAnalysis`
- **常量**: UPPER_SNAKE_CASE，如 `DEFAULT_LOCALE`

### 2. 组件结构

```typescript
// 1. 导入（分组排序）
import { useState } from 'react';              // React 核心
import { useForm } from 'react-hook-form';     // 第三方库
import { Button } from '@/components/ui/button'; // 本地组件
import { fetchData } from '@/lib/api';         // 工具函数
import type { MyType } from '@/types';         // 类型

// 2. 类型定义
interface ComponentProps {
  title: string;
  data: MyType;
}

// 3. 组件实现
export function MyComponent({ title, data }: ComponentProps) {
  // 3.1 Hooks
  const [state, setState] = useState();

  // 3.2 派生状态
  const derivedValue = useMemo(() => compute(data), [data]);

  // 3.3 事件处理
  const handleClick = useCallback(() => {
    setState(newValue);
  }, []);

  // 3.4 副作用
  useEffect(() => {
    // 副作用逻辑
  }, [dependencies]);

  // 3.5 渲染
  return <div>{title}</div>;
}

// 4. 子组件（如果仅在此文件使用）
function SubComponent() {
  return <div>Sub</div>;
}
```

### 3. Props 设计原则

- **必需 props**: 不设默认值
- **可选 props**: 使用 `?` 标记
- **回调函数**: 以 `on` 开头，如 `onClick`, `onSubmit`
- **布尔值**: 以 `is/has/should` 开头，如 `isLoading`, `hasError`

```typescript
interface ButtonProps {
  children: React.ReactNode; // 必需
  variant?: 'default' | 'outline'; // 可选
  isLoading?: boolean; // 可选布尔值
  onClick?: () => void; // 可选回调
}
```

### 4. UI 组件规范

- 使用 Radix UI 作为基础
- 使用 `class-variance-authority` 管理变体
- 使用 `tailwind-merge` 合并样式
- 使用 `cn` 工具函数处理 className

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white',
        outline: 'border border-input',
      },
      size: {
        default: 'h-9 px-4',
        sm: 'h-8 px-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

---

## 国际化（i18n）规范

### 1. 多语言支持

**支持语言**: 11 种语言（en, zh, es, ja, ko, vi, fr, ru, de, it, pt）

**默认语言**: English (en)

### 2. 翻译文件规范

**位置**: `public/i18n/[locale].json`

**结构**: 扁平化结构，使用点号分隔

```json
{
  "meta": {
    "title": "Favicon Extractor",
    "description": "Extract all favicons from any website"
  },
  "header": {
    "title": "AI Favicon Extractor",
    "subtitle": "The most comprehensive tool"
  },
  "form": {
    "placeholder": "Enter website URL",
    "button_extract": "Extract",
    "button_extracting": "Extracting..."
  }
}
```

### 3. 翻译使用规范

#### 服务端组件

```typescript
import { getTranslations } from 'next-intl/server';

export async function ServerComponent({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return <h1>{t('header.title')}</h1>;
}
```

#### 客户端组件

```typescript
'use client';
import { useTranslations } from 'next-intl';

export function ClientComponent() {
  const t = useTranslations();
  return <h1>{t('header.title')}</h1>;
}
```

#### SSR 兼容组件（推荐）

```typescript
interface Props {
  translations: {
    title: string;
    subtitle: string;
  };
}

export function SSRCompatibleComponent({ translations }: Props) {
  return <h1>{translations.title}</h1>;
}

// 使用方
const t = await getTranslations({ locale });
<SSRCompatibleComponent
  translations={{
    title: t('header.title'),
    subtitle: t('header.subtitle'),
  }}
/>
```

### 4. URL 路由规范

- 默认语言（en）: `/` 或 `/page`
- 其他语言: `/:locale/page`（如 `/zh`, `/es`）
- 使用 `next-intl` 的 `localePrefix: "as-needed"`

### 5. 语言代码映射

**OpenGraph**: `en_US`, `zh_CN` 等（下划线）
**Schema.org**: `en-US`, `zh-CN` 等（连字符）

```typescript
const localeMap: Record<string, string> = {
  en: 'en_US', // OpenGraph
  zh: 'zh_CN',
  // ...
};

const languageMap: Record<string, string> = {
  en: 'en-US', // Schema.org
  zh: 'zh-CN',
  // ...
};
```

---

## SEO 优化规范

### 1. 元数据生成

**要求**: 所有页面必须实现 `generateMetadata`。

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: ['favicon', 'extractor', 'icon'],

    // OpenGraph
    openGraph: {
      type: 'website',
      locale: localeMap[locale] || 'en_US',
      url: currentUrl,
      title: t('meta.og_title'),
      description: t('meta.description'),
      siteName: appConfig.appName,
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
      images: [`${siteUrl}/twitter-image.png`],
    },

    // Robots
    robots: {
      index: true,
      follow: true,
    },

    // Alternates
    alternates: {
      canonical: currentUrl,
      languages: languageUrls,
    },
  };
}
```

### 2. 结构化数据

**要求**: 使用 JSON-LD 格式，服务端渲染。

```typescript
export async function StructuredData({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t('meta.title'),
    description: t('meta.description'),
    applicationCategory: 'UtilitiesApplication',
    inLanguage: languageMap[locale] || 'en-US',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
```

### 3. Sitemap 和 Robots

**Sitemap** (`app/sitemap.ts`):

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  appConfig.i18n.locales.forEach((locale) => {
    routes.forEach((route) => {
      const url = locale === defaultLocale ? `${siteUrl}${route}` : `${siteUrl}/${locale}${route}`;

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
        alternates: {
          languages: languageAlternates,
        },
      });
    });
  });

  return entries;
}
```

**Robots** (`app/robots.ts`):

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${appConfig.siteUrl}/sitemap.xml`,
  };
}
```

### 4. PWA Manifest

**动态生成** (`app/manifest.ts`):

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AI Favicon Extractor',
    short_name: 'Favicon Extractor',
    description: 'Extract all favicons from any website',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
```

---

## 代码风格与质量

### 1. Prettier 配置

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### 2. ESLint 规则

- 使用 Next.js 推荐配置
- 启用 TypeScript 严格模式
- 使用 `eslint-config-next`

### 3. 导入顺序

```typescript
// 1. React 和 Next.js
import { useState } from 'react';
import { redirect } from 'next/navigation';

// 2. 第三方库
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// 3. 组件
import { Button } from '@/components/ui/button';

// 4. 工具函数
import { cn } from '@/lib/utils';

// 5. 类型
import type { MyType } from '@/types';

// 6. 配置
import { appConfig } from '@/config';
```

### 4. 注释规范

```typescript
/**
 * 复杂函数的 JSDoc 注释
 * @param url - 网站 URL
 * @param options - 配置选项
 * @returns Promise<FaviconResponse>
 */
export async function fetchFavicons(
  url: string,
  options?: RequestOptions
): Promise<FaviconResponse> {
  // 实现
}

// 单行注释：解释为什么这样做
const apiUrl = url.replace(/\/+$/, ''); // 移除尾部斜杠
```

---

## 类型安全规范

### 1. TypeScript 严格模式

**要求**: 启用所有严格检查。

```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### 2. 类型定义位置

- **全局类型**: `src/types/`
- **组件 Props**: 组件文件内
- **API 响应**: `src/types/api.ts`
- **配置类型**: `src/config.ts`

### 3. 类型导出规范

```typescript
// ✅ 正确：使用 type 关键字导出类型
export type IconAnalysis = {
  score: number;
  totalIcons: number;
  hasSVG: boolean;
};

// ✅ 正确：使用 interface 导出接口
export interface FaviconResponse {
  found: Icon[];
  fallbacks: Icon[];
  metadata: Metadata;
}

// ❌ 错误：导出值类型（应导出类型本身）
export const IconAnalysisType = { ... };
```

### 4. 避免 any

```typescript
// ✅ 正确：使用具体类型
function process(data: FaviconData): Result {
  return data.icons;
}

// ❌ 错误：使用 any
function process(data: any): any {
  return data.icons;
}

// ✅ 接受：在确实不知道类型时使用 unknown
function process(data: unknown): Result {
  if (isValidData(data)) {
    return data.icons;
  }
}
```

---

## 状态管理规范

### 1. 表单状态

**要求**: 使用 `react-hook-form` + `zod` 验证。

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  url: z.string()
    .min(1, { message: 'URL is required' })
    .url({ message: 'Invalid URL' }),
});

type FormData = z.infer<typeof formSchema>;

export function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    // 处理提交
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('url')} />
      {form.formState.errors.url && (
        <span>{form.formState.errors.url.message}</span>
      )}
    </form>
  );
}
```

### 2. 组件状态

```typescript
// ✅ 正确：使用 useState
const [isLoading, setIsLoading] = useState(false);
const [data, setData] = useState<Data | null>(null);

// ✅ 正确：复杂状态使用 useReducer
const [state, dispatch] = useReducer(reducer, initialState);
```

### 3. 全局状态

**原则**: 优先使用 React Context，避免引入额外状态库。

```typescript
// contexts/ThemeContext.tsx
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

---

## 性能优化规范

### 1. 图片优化

```typescript
// ✅ 正确：使用 Next.js Image 组件
import Image from 'next/image';

<Image
  src="/icon.png"
  alt="Icon"
  width={100}
  height={100}
  loading="lazy"
/>

// ❌ 错误：直接使用 img 标签
<img src="/icon.png" alt="Icon" />
```

### 2. 代码分割

```typescript
// ✅ 正确：动态导入大型组件
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // 仅在必要时禁用 SSR
});
```

### 3. React Compiler

**已启用**: `reactCompiler: true` in `next.config.ts`

无需手动使用 `useMemo` 和 `useCallback`（除非有特殊需求）。

### 4. 防抖和节流

```typescript
import { useCallback } from 'react';
import { debounce } from 'lodash-es';

const debouncedSearch = useCallback(
  debounce((query: string) => {
    // 搜索逻辑
  }, 300),
  []
);
```

---

## 安全规范

### 1. 环境变量

**规则**:

- 敏感信息必须使用环境变量
- 客户端变量必须以 `NEXT_PUBLIC_` 开头
- 永远不要提交 `.env.local` 到 Git

```typescript
// ✅ 正确：使用环境变量
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ❌ 错误：硬编码敏感信息
const apiKey = 'sk-1234567890abcdef';
```

### 2. XSS 防护

```typescript
// ✅ 正确：React 自动转义
<div>{userInput}</div>

// ⚠️ 谨慎：仅在必要时使用 dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />

// ✅ 使用 DOMPurify 清理 HTML
import DOMPurify from 'isomorphic-dompurify';
const clean = DOMPurify.sanitize(dirty);
```

### 3. CORS 和 Headers

**Next.js Config**:

```typescript
async headers() {
  return [{
    source: '/:path*',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
    ],
  }];
}
```

---

## 测试规范

### 1. 单元测试

**工具**: Jest + React Testing Library

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 2. 集成测试

**工具**: Playwright

```typescript
import { test, expect } from '@playwright/test';

test('favicon extraction flow', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[name="url"]', 'https://example.com');
  await page.click('button[type="submit"]');
  await expect(page.locator('.icon-card')).toBeVisible();
});
```

---

## Git 提交规范

### 1. Commit Message 格式

**遵循**: [Conventional Commits](https://www.conventionalcommits.org/)

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型** (type):

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例**:

```
feat(i18n): add German and Italian language support

- Add de.json and it.json translation files
- Update locale configuration
- Add language flags to LanguageSwitcher

Closes #123
```

### 2. 分支管理

- `main`: 生产分支
- `develop`: 开发分支
- `feature/*`: 功能分支
- `fix/*`: 修复分支
- `release/*`: 发布分支

### 3. PR 规范

- 标题清晰描述变更
- 包含相关 issue 编号
- 代码必须通过所有检查（lint, test, build）
- 至少一人 review

---

## 环境变量管理

### 1. 必需的环境变量

创建 `.env.local` 文件：

```bash
# 站点 URL
NEXT_PUBLIC_SITE_URL=https://www.aifavicon.com

# API 地址
NEXT_PUBLIC_API_URL=http://localhost:3001

# 搜索引擎验证（可选）
GOOGLE_VERIFICATION_CODE=
BING_VERIFICATION_CODE=
YANDEX_VERIFICATION_CODE=
YAHOO_VERIFICATION_CODE=
BAIDU_VERIFICATION_CODE=
NAVER_VERIFICATION_CODE=
```

### 2. 开发环境

```bash
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. 生产环境

```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://www.aifavicon.com
NEXT_PUBLIC_API_URL=https://api.aifavicon.com
```

---

## 部署规范

### 1. Docker 部署

**已配置**: `output: 'standalone'` in `next.config.ts`

### 2. 构建命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 生产启动
npm run start

# 代码检查
npm run lint

# 自动修复
npm run lint:fix
```

### 3. 版本发布

```bash
# 补丁版本（0.0.x）
npm run release:patch

# 次版本（0.x.0）
npm run release:minor

# 主版本（x.0.0）
npm run release:major

# 推送发布
npm run publish:release
```

---

## 最佳实践检查清单

在开发新功能前，请确认：

- [ ] 组件默认使用服务端渲染
- [ ] 仅在必要时使用 `'use client'`
- [ ] 实现 `generateStaticParams` 用于多语言页面
- [ ] 实现 `generateMetadata` 用于 SEO
- [ ] 使用 `src/config.ts` 管理配置
- [ ] 翻译文本集中在 `public/i18n/` 目录
- [ ] 类型定义完整且严格
- [ ] 使用 `react-hook-form` + `zod` 处理表单
- [ ] 遵循 Prettier 格式规范
- [ ] 遵循 Conventional Commits 提交规范
- [ ] 敏感信息使用环境变量
- [ ] 测试覆盖关键功能

---

## 常见问题（FAQ）

### Q: 何时使用客户端组件？

A: 仅在以下情况使用：

- 需要 React Hooks（useState, useEffect 等）
- 需要事件处理（onClick, onChange 等）
- 需要浏览器 API（window, document）
- 第三方库要求客户端渲染

### Q: 如何优化组件为 SSR 兼容？

A: 通过 props 传递数据，避免使用客户端 Hooks：

```typescript
// 优化前
'use client';
function Component() {
  const t = useTranslations();
  return <div>{t('title')}</div>;
}

// 优化后
function Component({ title }: { title: string }) {
  return <div>{title}</div>;
}
```

### Q: 如何处理环境特定的配置？

A: 使用 `src/config.ts` 和环境变量：

```typescript
export const appConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
};
```

---

**文档版本**: 1.0.0  
**最后更新**: 2025-11-09  
**维护者**: AI Favicon Extractor Team
