interface Testimonial {
  content: string;
  userName: string;
  userRole: string;
  avatarUrl: string;
}

interface TestimonialsProps {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

export function Testimonials({ title, subtitle, testimonials }: TestimonialsProps) {
  return (
    <section className="flex flex-col gap-10 px-4 py-10">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-4xl font-bold leading-tight text-[#191022]">{title}</h2>
        <p className="max-w-2xl text-base font-normal leading-normal text-slate-600">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6"
          >
            <p className="text-base font-normal leading-relaxed text-slate-600">
              &ldquo;{testimonial.content}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div
                className="aspect-square h-10 w-10 rounded-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url("${testimonial.avatarUrl}")` }}
                role="img"
                aria-label={`${testimonial.userName} avatar`}
              />
              <div className="flex flex-col">
                <p className="text-sm font-bold text-[#191022]">{testimonial.userName}</p>
                <p className="text-xs text-slate-500">{testimonial.userRole}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
