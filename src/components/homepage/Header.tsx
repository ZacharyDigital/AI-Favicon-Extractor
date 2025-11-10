import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface HeaderProps {
  locale: string;
}

export async function Header({ locale }: HeaderProps) {
  const t = await getTranslations({ locale });

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 px-4 py-3 sm:px-10">
      {/* Logo + Brand Name */}
      <div className="flex items-center gap-4 text-[#191022]">
        <div className="h-6 w-6 text-[#7f13ec]">
          <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
          </svg>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#191022]">
          {t('header.brand')}
        </h2>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden flex-1 justify-end gap-8 md:flex">
        <div className="flex items-center gap-9">
          <a
            className="text-sm font-medium leading-normal text-slate-700 transition-colors hover:text-[#7f13ec]"
            href={`/${locale}`}
          >
            {t('header.nav.home')}
          </a>
          <a
            className="text-sm font-medium leading-normal text-slate-700 transition-colors hover:text-[#7f13ec]"
            href={`/${locale}/docs`}
          >
            {t('header.nav.docs')}
          </a>
          <a
            className="text-sm font-medium leading-normal text-slate-700 transition-colors hover:text-[#7f13ec]"
            href={`/${locale}/blog`}
          >
            {t('header.nav.blog')}
          </a>
          <a
            className="text-sm font-medium leading-normal text-slate-700 transition-colors hover:text-[#7f13ec]"
            href={`/${locale}/image-generator`}
          >
            {t('header.nav.generate_image')}
          </a>
        </div>

        {/* Language Switcher + Sign Up Button */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <button className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#7f13ec] px-4 text-sm font-bold leading-normal tracking-[0.015em] text-white transition-colors hover:bg-[#7f13ec]/90">
            <span className="truncate">{t('header.signup')}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu (Language Switcher only for now) */}
      <div className="flex items-center gap-4 md:hidden">
        <LanguageSwitcher />
      </div>
    </header>
  );
}
