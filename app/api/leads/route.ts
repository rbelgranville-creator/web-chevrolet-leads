import { NextResponse } from "next/server";
import {
  createLead,
  findActivePlanBySlug,
} from "@/lib/db";
import { getActivePlans } from "@/lib/plans";
import { leadSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
        { status: 400 }
      );
    }

    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    let planName = "";
    const plan = findActivePlanBySlug(parsed.data.planSlug);

    if (plan) {
      planName = plan.name;
    } else {
      const local = (await getActivePlans()).find(
        (p) => p.slug === parsed.data.planSlug
      );
      if (!local) {
        return NextResponse.json(
          { error: "El plan seleccionado no está disponible" },
          { status: 400 }
        );
      }
      planName = local.name;
    }

    createLead({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      planSlug: parsed.data.planSlug,
      planName,
      source: "web",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/leads", error);
    return NextResponse.json(
      { error: "No pudimos guardar tu consulta. Intentá de nuevo." },
      { status: 500 }
    );
  }
}
