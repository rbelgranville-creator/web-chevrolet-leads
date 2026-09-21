"use client";

import { useState, type FormEvent } from "react";
import type { PlanView } from "@/lib/plans";

type Props = {
  plans: PlanView[];
};

export default function LeadForm({ plans }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.get("fullName"),
          email: data.get("email"),
          planSlug: data.get("planSlug"),
          website: data.get("website"),
        }),
      });

      const json = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok) {
        setStatus("error");
        setMessage(json.error || "No se pudo enviar. Probá de nuevo.");
        return;
      }

      setStatus("ok");
      setMessage("Listo. Te vamos a contactar a la brevedad.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Error de red. Revisá tu conexión e intentá otra vez.");
    }
  }

  const fieldClass = "field-input w-full";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="fullName" className="text-sm font-bold text-foreground">
          Nombre completo
        </label>
        <input
          id="fullName"
          name="fullName"
          required
          autoComplete="name"
          className={fieldClass}
          placeholder="Juan Pérez"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-bold text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
          placeholder="juan@email.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="planSlug" className="text-sm font-bold text-foreground">
          Modelo de interés
        </label>
        <select
          id="planSlug"
          name="planSlug"
          required
          defaultValue=""
          className={fieldClass}
        >
          <option value="" disabled>
            Elegí un modelo
          </option>
          {plans.map((plan) => (
            <option key={plan.slug} value={plan.slug}>
              {plan.name}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <p className="text-xs text-muted">
        Al enviar, un asesor se pondrá en contacto por email. Usamos tus datos
        solo para esta consulta.
      </p>

      <button
        type="submit"
        disabled={status === "loading" || plans.length === 0}
        className="btn-primary mt-1 w-full"
      >
        {status === "loading" ? "Enviando…" : "Solicitá tu plan"}
      </button>

      {message ? (
        <p
          role="status"
          className={`text-sm ${status === "ok" ? "text-success" : "text-error"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
