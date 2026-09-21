import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export const runtime = "nodejs";

type Props = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const session = await auth();
  const params = await searchParams;

  if (session?.user) {
    redirect(params.callbackUrl || "/admin");
  }

  async function loginAction(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const callbackUrl = String(formData.get("callbackUrl") || "/admin");

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: callbackUrl,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/admin/login?error=CredentialsSignin");
      }
      throw error;
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-subtle px-5">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-8 shadow-[var(--shadow-subtle)]">
        <div className="mb-1 h-1 w-12 rounded-sm bg-primary" aria-hidden />
        <p className="mt-4 text-sm font-bold text-primary">Plan Chevrolet</p>
        <h1 className="display mt-1 text-3xl text-foreground">Admin</h1>
        <p className="mt-2 text-sm text-muted">
          Ingresá con tu cuenta para ver los leads.
        </p>

        {params.error ? (
          <p className="mt-4 text-sm text-error">
            Credenciales inválidas. Probá de nuevo.
          </p>
        ) : null}

        <form action={loginAction} className="mt-8 flex flex-col gap-4">
          <input
            type="hidden"
            name="callbackUrl"
            value={params.callbackUrl || "/admin"}
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-bold">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="field-input w-full"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-bold">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="field-input w-full"
            />
          </div>
          <button type="submit" className="btn-primary mt-2 w-full">
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
