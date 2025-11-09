interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
  badge?: string;
}

interface PricingPlansProps {
  title: string;
  subtitle: string;
  plans: PricingPlan[];
  ctaButtonText: string;
}

export function PricingPlans({ title, subtitle, plans, ctaButtonText }: PricingPlansProps) {
  return (
    <section className="flex flex-col gap-10 px-4 py-10">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-4xl font-bold leading-tight text-[#191022]">{title}</h2>
        <p className="max-w-2xl text-base font-normal leading-normal text-slate-600">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`flex flex-col p-6 ${
              plan.highlighted
                ? 'relative border-2 border-[#7f13ec] bg-[#7f13ec]/5'
                : 'border border-slate-200 bg-white'
            } rounded-lg`}
          >
            {plan.badge && plan.highlighted && (
              <span className="absolute -mt-3 right-6 top-0 rounded-full bg-[#7f13ec] px-3 py-1 text-xs font-bold text-white">
                {plan.badge}
              </span>
            )}
            <h3 className="text-lg font-bold text-[#191022]">{plan.name}</h3>
            <p className="mt-4 text-4xl font-bold text-[#191022]">
              {plan.price}{' '}
              <span className="text-base font-normal text-slate-500">{plan.period}</span>
            </p>
            <p className="mt-2 h-10 text-sm text-slate-500">{plan.description}</p>
            <ul className="mt-6 space-y-4 text-sm text-slate-700">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center gap-3">
                  <svg
                    className={`h-5 w-5 ${plan.highlighted ? 'text-[#7f13ec]' : 'text-green-500'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`mt-8 w-full rounded-lg px-4 text-center text-sm font-bold transition-colors ${
                plan.highlighted
                  ? 'h-10 bg-[#7f13ec] text-white hover:bg-[#7f13ec]/90'
                  : 'h-10 bg-slate-100 text-[#191022] hover:bg-slate-200'
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <button className="flex h-12 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#7f13ec] px-6 text-base font-bold leading-normal tracking-[0.015em] text-white transition-colors hover:bg-[#7f13ec]/90">
          <span className="truncate">{ctaButtonText}</span>
        </button>
      </div>
    </section>
  );
}
