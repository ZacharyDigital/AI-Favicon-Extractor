import { getTranslations } from 'next-intl/server';

interface FooterProps {
  locale: string;
}

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations({ locale });
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200 px-4 py-8">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        {/* Logo + Copyright */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 text-[#7f13ec]">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
            </svg>
          </div>
          <span className="text-sm text-slate-500">
            {t('footer.copyright', { year: currentYear })}
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-sm text-slate-500">
          <a className="transition-colors hover:text-[#7f13ec]" href="#terms">
            {t('footer.terms')}
          </a>
          <a className="transition-colors hover:text-[#7f13ec]" href="#privacy">
            {t('footer.privacy')}
          </a>
          <a className="transition-colors hover:text-[#7f13ec]" href="#contact">
            {t('footer.contact')}
          </a>
        </div>
      </div>
    </footer>
  );
}
