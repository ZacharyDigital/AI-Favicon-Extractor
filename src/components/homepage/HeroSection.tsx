interface HeroSectionProps {
  translations: {
    title: string;
    subtitle: string;
    placeholder: string;
    button: string;
  };
}

export function HeroSection({ translations }: HeroSectionProps) {
  return (
    <section className="mt-10 md:mt-20">
      <div className="@container">
        <div className="flex flex-col gap-6 px-4 py-10 @[864px]:flex-row @[864px]:items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6 @[480px]:gap-8 @[864px]:w-1/2 @[864px]:justify-center">
            <div className="flex flex-col gap-2 text-left">
              <h1 className="text-4xl font-bold leading-tight tracking-[-0.033em] text-[#191022] @[480px]:text-5xl">
                {translations.title}
              </h1>
              <h2 className="text-base font-normal leading-normal text-slate-600">
                {translations.subtitle}
              </h2>
            </div>

            {/* Search Input (Decorative, jumps to extract section) */}
            <label className="flex h-14 w-full min-w-40 max-w-[480px] flex-col @[480px]:h-16">
              <div className="flex h-full w-full flex-1 items-stretch rounded-lg">
                <div className="flex items-center justify-center rounded-l-lg border border-r-0 border-slate-300 bg-white pl-4 text-slate-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  className="form-input flex h-full w-full min-w-0 flex-1 resize-none overflow-hidden rounded-none border-y border-slate-300 bg-white px-4 text-sm font-normal leading-normal text-[#191022] placeholder:text-slate-500 focus:outline-0 focus:ring-2 focus:ring-[#7f13ec]/50 @[480px]:text-base"
                  placeholder={translations.placeholder}
                  type="text"
                  readOnly
                />
                <div className="flex items-center justify-center rounded-r-lg border border-l-0 border-slate-300 bg-white pr-2">
                  <a
                    href="#extract"
                    className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#7f13ec] px-4 text-sm font-bold leading-normal tracking-[0.015em] text-white transition-colors hover:bg-[#7f13ec]/90 @[480px]:h-12 @[480px]:px-5 @[480px]:text-base"
                  >
                    <span className="truncate">{translations.button}</span>
                  </a>
                </div>
              </div>
            </label>
          </div>

          {/* Right Visual */}
          <div
            className="aspect-square w-full rounded-lg bg-cover bg-center bg-no-repeat @[864px]:w-1/2"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCacaHv3Pn_CK8qBS8inupyx9hOE6qW04Lo5UFmjbFDNtD1ESMCECJ3b7hQ9wZJ0cuXTpFwVrwhJ0do0x5MgCPuuAwaZ_I9zC4DogLafgK8bbDjNrNWN_c3WfoYEdb23RhNcbrg8UnymcumI-6gPw9tl_1zZjnwaIWM3VThfR_eQZgjtihQRaPxPGQEHlN1WputqLFWrScciHvXva7VtxD0Ai4Eqoi4tkw9jd6mZ7Hx19EiwE1AD0xkNDu4awTUWvDXsqLKtphtSd8")`,
            }}
            role="img"
            aria-label="AI-generated favicon examples showcase"
          />
        </div>
      </div>
    </section>
  );
}
