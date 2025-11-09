interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesHighlightProps {
  title: string;
  subtitle: string;
  features: Feature[];
}

export function FeaturesHighlight({ title, subtitle, features }: FeaturesHighlightProps) {
  return (
    <section className="flex flex-col gap-10 px-4 py-10 @container">
      <div className="flex flex-col gap-4">
        <h1 className="max-w-[720px] text-[32px] font-bold leading-tight tracking-light text-[#191022] @[480px]:text-4xl">
          {title}
        </h1>
        <p className="max-w-[720px] text-base font-normal leading-normal text-slate-600">
          {subtitle}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-1 flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="text-[#7f13ec]">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {feature.icon === 'auto_awesome' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                )}
                {feature.icon === 'photo_size_select_large' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                )}
                {feature.icon === 'download' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                )}
                {feature.icon === 'memory' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                )}
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-bold leading-tight text-[#191022]">{feature.title}</h2>
              <p className="text-sm font-normal leading-normal text-slate-600">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
