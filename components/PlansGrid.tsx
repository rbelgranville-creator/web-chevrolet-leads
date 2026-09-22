import Image from "next/image";
import type { PlanView } from "@/lib/plans";

type Props = {
  plans: PlanView[];
};

export default function PlansGrid({ plans }: Props) {
  if (!plans.length) {
    return (
      <p className="text-muted">
        Todavía no hay planes cargados. Ejecutá{" "}
        <code className="font-bold text-primary">npm run scrape:plans</code>.
      </p>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {plans.map((plan) => (
        <li
          key={plan.slug}
          className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-subtle)]"
        >
          <div className="relative aspect-[16/10] bg-subtle">
            {plan.imagePath ? (
              <Image
                src={plan.imagePath}
                alt={plan.name}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted">
                Sin imagen
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2 p-5">
            <h3 className="display text-xl text-foreground">{plan.name}</h3>
            {plan.priceFrom ? (
              <p className="text-base font-bold text-foreground">
                Desde: {plan.priceFrom}
              </p>
            ) : null}
            {plan.tagline ? (
              <p className="text-sm leading-relaxed text-muted">{plan.tagline}</p>
            ) : null}
            {plan.features.length > 0 ? (
              <ul className="mt-1 space-y-1 text-sm text-muted">
                {plan.features.slice(0, 3).map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            ) : null}
            <a
              href="#contacto"
              className="btn-primary mt-auto w-full text-sm sm:w-auto"
            >
              Solicitá tu plan
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
