import { appConfig } from "@/config";
import { createNavigation } from "next-intl/navigation";

/**
 * 创建语言感知的导航工具
 * 
 * - Link: 自动添加语言前缀的链接组件
 * - useRouter: 语言感知的路由器
 * - usePathname: 获取不带语言前缀的路径
 * - redirect: 语言感知的重定向
 */
export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales: appConfig.i18n.locales,
  defaultLocale: appConfig.i18n.defaultLocale,
  localePrefix: "as-needed"
});
