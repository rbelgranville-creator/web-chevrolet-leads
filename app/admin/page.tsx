import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { listLeads } from "@/lib/db";
import LeadsTable from "@/components/LeadsTable";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AdminPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const { q } = await searchParams;
  const query = (q || "").trim();
  const leads = listLeads(query);

  const rows = leads.map((lead) => ({
    id: String(lead.id),
    fullName: lead.full_name,
    email: lead.email,
    planName: lead.plan_name || lead.plan_slug,
    createdAt: lead.created_at
      ? new Date(
          lead.created_at.includes("T")
            ? lead.created_at
            : `${lead.created_at.replace(" ", "T")}Z`
        ).toISOString()
      : "",
  }));

  async function logoutAction() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <main className="min-h-screen bg-subtle px-5 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-surface px-5 py-5 shadow-[var(--shadow-card)]">
          <div>
            <p className="text-sm font-bold text-primary">Panel</p>
            <h1 className="display text-3xl text-foreground">Leads</h1>
            <p className="mt-1 text-sm text-muted">
              Sesión: {session.user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-bold text-primary hover:underline"
            >
              Ver web
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="btn-secondary !py-1.5 !text-sm">
                Salir
              </button>
            </form>
          </div>
        </header>

        <form className="mt-6 flex flex-wrap gap-2" method="get">
          <input
            name="q"
            defaultValue={query}
            placeholder="Buscar por nombre, email o plan…"
            className="field-input w-full max-w-md"
          />
          <button type="submit" className="btn-primary">
            Filtrar
          </button>
        </form>

        <div className="mt-8 rounded-lg border border-border bg-surface shadow-[var(--shadow-card)]">
          <LeadsTable leads={rows} />
        </div>
      </div>
    </main>
  );
}
