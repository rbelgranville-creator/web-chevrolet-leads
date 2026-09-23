import Image from "next/image";
import Link from "next/link";
import { getActivePlans } from "@/lib/plans";
import LeadForm from "@/components/LeadForm";
import PlansGrid from "@/components/PlansGrid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const plans = await getActivePlans();
  const heroImage = plans.find((p) => p.imagePath)?.imagePath;

  return (
    <main className="flex flex-1 flex-col bg-background text-foreground">
      <header className="page-gutter absolute inset-x-0 top-0 z-20 border-b border-transparent bg-gradient-to-b from-black/55 to-transparent">
        <div className="container-chevy flex items-center justify-between py-4 md:py-5">
          <Link href="/" className="text-lg font-bold tracking-tight text-inverse">
            Chevrolet
          </Link>
          <nav className="flex items-center gap-5 text-sm font-bold text-inverse">
            <a href="#planes" className="hover:underline">
              Modelos
            </a>
            <a href="#contacto" className="btn-primary !py-2 !text-sm">
              Solicitá tu plan
            </a>
          </nav>
        </div>
      </header>

      <section className="relative min-h-[88svh] overflow-hidden bg-primary-dark">
        {heroImage ? (
          <Image
            src={heroImage}
            alt="Chevrolet 0 km con Plan Chevrolet"
            fill
            priority
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
        <div className="page-gutter relative z-10 flex min-h-[88svh] items-end pb-16 pt-28 md:items-center md:pb-0">
          <div className="container-chevy max-w-2xl">
            <p className="animate-rise text-sm font-bold text-accent">
              Plan Chevrolet
            </p>
            <h1 className="display animate-rise-delay mt-3 text-[clamp(2.5rem,5vw,4.75rem)] text-inverse">
              Financiá hasta el 100%
              <br className="hidden sm:block" /> de tu nuevo 0&nbsp;km
            </h1>
            <p className="animate-rise-delay mt-4 max-w-md text-lg text-white/85">
              Plan de ahorro en pesos, con condiciones claras. Elegí tu modelo y
              solicitá tu plan: un asesor te contacta.
            </p>
            <div className="animate-rise-delay mt-8 flex flex-wrap gap-3">
              <a href="#contacto" className="btn-primary">
                Solicitá tu plan
              </a>
              <a
                href="#planes"
                className="btn-secondary border-white/50 bg-transparent text-inverse hover:border-white hover:bg-white/10 hover:text-inverse"
              >
                Conocé más
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="planes" className="page-gutter bg-background py-16 md:py-24">
        <div className="container-chevy">
          <h2 className="display text-[clamp(1.6rem,3vw,2.5rem)]">
            Elegí tu 0&nbsp;km
          </h2>
          <p className="mt-3 max-w-xl text-muted">
            Modelos disponibles con Plan Chevrolet. Precios de referencia del
            sitio oficial.
          </p>
          <div className="mt-10 md:mt-12">
            <PlansGrid plans={plans} />
          </div>
        </div>
      </section>

      <section className="page-gutter bg-subtle py-14 md:py-20">
        <div className="container-chevy grid gap-6 md:grid-cols-2">
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 md:p-8">
            <h2 className="display text-2xl">¿Todavía tenés dudas?</h2>
            <p className="mt-3 text-muted">
              Dejanos tus datos en el formulario y te ayudamos a elegir el plan
              que mejor se adapta a vos.
            </p>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-primary-dark p-6 text-inverse md:p-8">
            <h2 className="display text-2xl">Financiá hasta el 100%</h2>
            <p className="mt-3 text-white/85">
              Plan de ahorro en pesos, con cuotas accesibles y acompañamiento en
              cada paso.
            </p>
          </div>
        </div>
      </section>

      <section
        id="contacto"
        className="page-gutter border-t border-border bg-background py-16 md:py-24"
      >
        <div className="container-chevy grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="display text-[clamp(1.6rem,3vw,2.5rem)]">
              Solicitá tu plan
            </h2>
            <p className="mt-3 max-w-md text-muted">
              Completá el formulario y un experto Chevrolet se pondrá en
              contacto con vos.
            </p>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-border bg-subtle p-6 md:p-8">
            <LeadForm plans={plans} />
          </div>
        </div>
      </section>

      <footer className="page-gutter border-t border-border bg-subtle py-8 text-sm text-muted">
        <div className="container-chevy flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>Plan Chevrolet</span>
          <Link href="/admin" className="font-bold text-primary hover:underline">
            Acceso admin
          </Link>
        </div>
      </footer>
    </main>
  );
}
