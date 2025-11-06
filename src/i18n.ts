import { LocaleType, appConfig } from "@/config";
import deepmerge from "deepmerge";
import type { AbstractIntlMessages } from "next-intl";
import { getRequestConfig } from "next-intl/server";

/**
 * 加载单个语言文件
 */
export const getLocale = async (
  locale: string,
): Promise<AbstractIntlMessages> => {
  return (await import(`../public/i18n/${locale}.json`)).default as AbstractIntlMessages
};

/**
 * 合并默认语言与当前语言（回退机制）
 * 非默认语言会自动合并英文翻译作为回退
 */
export const getMessagesForLocale = async (
  locale: string,
): Promise<AbstractIntlMessages> => {
  const localeMessages = await getLocale(locale);
  
  // 如果是默认语言，直接返回
  if (locale === appConfig.i18n.defaultLocale) {
    return localeMessages;
  }
  
  // 非默认语言：先加载英文，再合并当前语言
  const defaultLocaleMessages = await getLocale(
    appConfig.i18n.defaultLocale,
  );
  
  try {
    // 使用 deepmerge 深度合并对象
    // 当前语言的翻译会覆盖默认语言
    return deepmerge(defaultLocaleMessages, localeMessages);
  } catch (error: any) {
    console.error("getMessagesForLocale deepmerge:", error.message);
    // 出错时回退到默认语言
    return defaultLocaleMessages;
  }
};

/**
 * Next-intl 配置导出
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // 通常 requestLocale 来自 middleware
  let locale = await requestLocale;
  
  // 如果 locale 无效，使用默认语言
  if (!locale || !appConfig.i18n.locales.includes(locale as LocaleType)) {
    locale = appConfig.i18n.defaultLocale;
  }
  
  return {
    locale,
    messages: await getMessagesForLocale(locale),
  };
});

