"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/lib/i18n";
import { useSearchParams } from "next/navigation";
import { appConfig, type LocaleType } from "@/config";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const currentLocale = useLocale() as LocaleType;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locales, labels } = appConfig.i18n;

  const switchLanguage = (locale: string) => {
    const params = searchParams.toString();
    const url = `/${locale}${pathname}${params ? `?${params}` : ''}`;
    window.location.href = url;
  };

  return (
    <div className="relative inline-block text-left">
      <select
        value={currentLocale}
        onChange={(e) => switchLanguage(e.target.value)}
        className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        aria-label="Select Language"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {labels[locale]}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <Languages className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}

