import fs from "fs/promises";
import path from "path";
import { listActivePlans } from "@/lib/db";

export type PlanView = {
  slug: string;
  name: string;
  tagline: string;
  priceFrom: string;
  priceNetSuggested: string;
  features: string[];
  imagePath: string;
  order: number;
};

async function fromManifest(): Promise<PlanView[]> {
  try {
    const file = path.join(process.cwd(), "public", "plans", "manifest.json");
    const raw = await fs.readFile(file, "utf8");
    const data = JSON.parse(raw) as PlanView[];
    return data.sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

export async function getActivePlans(): Promise<PlanView[]> {
  try {
    const plans = await listActivePlans();
    if (!plans.length) {
      return fromManifest();
    }

    return plans.map((p) => ({
      slug: p.slug,
      name: p.name,
      tagline: p.tagline || "",
      priceFrom: p.price_from || "",
      priceNetSuggested: p.price_net_suggested || "",
      features: JSON.parse(p.features_json || "[]") as string[],
      imagePath: p.image_path || "",
      order: p.sort_order ?? 0,
    }));
  } catch {
    return fromManifest();
  }
}
