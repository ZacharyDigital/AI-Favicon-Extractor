'use client';

import { useLocale } from 'next-intl';
import { usePathname } from '@/lib/i18n';
import { useSearchParams } from 'next/navigation';
import { appConfig, type LocaleType } from '@/config';
import { Languages, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const currentLocale = useLocale() as LocaleType;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locales, labels, flags } = appConfig.i18n;

  const switchLanguage = (locale: string) => {
    const params = searchParams.toString();
    // 使用 window.location 确保完整页面刷新和语言切换
    const url = `/${locale}${pathname}${params ? `?${params}` : ''}`;
    window.location.assign(url);
  };

  const currentFlag = flags[currentLocale];
  const currentLabel = labels[currentLocale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-9 w-full justify-between gap-2 border-input bg-background px-3 text-sm font-medium',
            'hover:bg-accent hover:text-accent-foreground',
            'focus:outline-none focus:ring-1 focus:ring-ring',
            'sm:w-auto sm:min-w-[140px]'
          )}
          aria-label="Select Language"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-base leading-none flex-shrink-0" aria-hidden="true">
              {currentFlag}
            </span>
            <span className="truncate hidden sm:inline-block">{currentLabel}</span>
            <span className="truncate sm:hidden">{currentLocale.toUpperCase()}</span>
          </div>
          <Languages className="h-4 w-4 opacity-50 flex-shrink-0" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn(
          'w-[200px] sm:w-[220px]',
          'max-h-[var(--radix-dropdown-menu-content-available-height)]',
          'overflow-y-auto'
        )}
      >
        {locales.map((locale) => {
          const isActive = locale === currentLocale;
          const flag = flags[locale];
          const label = labels[locale];

          return (
            <DropdownMenuItem
              key={locale}
              onClick={() => switchLanguage(locale)}
              className={cn(
                'cursor-pointer flex items-center gap-3 px-3 py-2.5',
                'focus:bg-accent focus:text-accent-foreground',
                'transition-colors',
                isActive && 'bg-accent/50 font-medium'
              )}
            >
              <span
                className="text-base leading-none flex-shrink-0 w-6 text-center"
                aria-hidden="true"
              >
                {flag}
              </span>
              <span className="flex-1 text-sm">{label}</span>
              {isActive && (
                <Check className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
