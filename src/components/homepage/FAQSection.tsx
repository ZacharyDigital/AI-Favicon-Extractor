interface FAQItem {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

interface FAQSectionProps {
  title: string;
  subtitle: string;
  faqs: FAQItem[];
}

export function FAQSection({ title, subtitle, faqs }: FAQSectionProps) {
  return (
    <section className="flex flex-col gap-10 px-4 py-10">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-4xl font-bold leading-tight text-[#191022]">{title}</h2>
        <p className="max-w-2xl text-base font-normal leading-normal text-slate-600">{subtitle}</p>
      </div>
      <div className="mx-auto w-full max-w-3xl space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group border-b border-slate-200 pb-4"
            {...(faq.defaultOpen ? { open: true } : {})}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <h3 className="text-lg font-medium text-[#191022]">{faq.question}</h3>
              <svg
                className="h-6 w-6 text-slate-500 transition-transform duration-300 group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p className="mt-4 text-slate-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
