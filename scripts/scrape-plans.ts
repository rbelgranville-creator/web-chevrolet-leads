import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import * as cheerio from "cheerio";
import fs from "fs/promises";
import path from "path";
import { upsertPlan } from "../lib/db";

const SOURCE_URL = "https://www.chevrolet.com.ar/plan-chevrolet";
const ORIGIN = "https://www.chevrolet.com.ar";
const OUT_DIR = path.join(process.cwd(), "public", "plans");
const MANIFEST_PATH = path.join(OUT_DIR, "manifest.json");

type ScrapedPlan = {
  slug: string;
  name: string;
  tagline: string;
  priceFrom: string;
  priceNetSuggested: string;
  features: string[];
  imagePath: string;
  sourceUrl: string;
  active: boolean;
  order: number;
};

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function cleanText(value: string): string {
  return value
    .replace(/\u0007/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .replace(/^[•·\-\s]+/, "")
    .trim();
}

function absolutize(src: string): string {
  if (src.startsWith("http")) return src.split("?")[0] + "?imwidth=1200";
  return ORIGIN + src.split("?")[0] + "?imwidth=1200";
}

function extFromUrl(url: string): string {
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".png")) return ".png";
  if (clean.endsWith(".webp")) return ".webp";
  if (clean.endsWith(".jpg") || clean.endsWith(".jpeg")) return ".jpg";
  return ".jpg";
}

async function downloadImage(url: string, dest: string): Promise<void> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      "Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
      Referer: SOURCE_URL,
      Origin: ORIGIN,
      "Sec-Fetch-Dest": "image",
      "Sec-Fetch-Mode": "no-cors",
      "Sec-Fetch-Site": "same-origin",
    },
  });
  if (!res.ok) {
    throw new Error(`No se pudo descargar imagen (${res.status}): ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) {
    throw new Error(`Imagen demasiado pequeña (${buf.length} bytes): ${url}`);
  }
  await fs.writeFile(dest, buf);
}

type CheerioRoot = ReturnType<typeof cheerio.load>;

function collectCarouselImages($: CheerioRoot): Map<string, string> {
  const map = new Map<string, string>();
  $('img[src*="carrusel-vehiculos"], img[src*="pda-refresh"]').each((_, img) => {
    const src = $(img).attr("src");
    if (!src) return;
    const file = src.toLowerCase();
    const keys = [
      "sonic",
      "onix-plus",
      "onix",
      "tracker",
      "montana",
      "s10",
      "spin",
    ];
    for (const key of keys) {
      if (file.includes(key) && !map.has(key)) {
        map.set(key, src);
        break;
      }
    }
  });
  return map;
}

function imageKeyForName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("onix plus")) return "onix-plus";
  if (n.includes("onix")) return "onix";
  if (n.includes("sonic")) return "sonic";
  if (n.includes("tracker")) return "tracker";
  if (n.includes("montana")) return "montana";
  if (n.includes("s10")) return "s10";
  if (n.includes("spin")) return "spin";
  return slugify(name).split("-")[0];
}

function extractPlans(html: string): Omit<ScrapedPlan, "imagePath" | "order">[] {
  const $ = cheerio.load(html);
  const plans: Omit<ScrapedPlan, "imagePath" | "order">[] = [];
  const seen = new Set<string>();
  const carousel = collectCarouselImages($);

  $("h2.gb-headline").each((_, el) => {
    const name = cleanText($(el).text());
    if (!name || name.length > 60) return;
    if (/plan chevrolet|dudas|novedades|todo lo que/i.test(name)) return;
    if (!/(sonic|onix|tracker|montana|s10|spin)/i.test(name)) return;
    // Prefer titles that look like model trims (skip pure mobile duplicates)
    if ($(el).hasClass("hide-for-medium")) return;

    const slug = slugify(name);
    if (seen.has(slug)) return;

    const col = $(el).closest("adv-col");
    const block = col.length ? col.parent() : $(el).parent().parent();
    const blockText = cleanText(block.text());

    const priceFromMatch = blockText.match(/Desde:\s*\$\s*([\d.]+)/i);
    const netMatch = blockText.match(
      /Precio sugerido sin impuestos nacionales:\s*\$\s*([\d.]+)/i
    );

    // Skip headline duplicates without pricing context
    if (!priceFromMatch && !/Suscribite/i.test(blockText)) return;

    const tagline =
      cleanText(
        block
          .find("h2.gb-headline5, h2.gb-headline")
          .filter((_, h) => /Suscribite|financia/i.test($(h).text()))
          .first()
          .text()
      ) || `Plan Chevrolet — ${name}`;

    const features: string[] = [];
    block.find("h3.gb-headline, h3.gb-body1").each((__, feat) => {
      const t = cleanText($(feat).text()).replace(/;+\s*$/, "");
      if (
        t &&
        t.length > 8 &&
        t.length < 180 &&
        !/Desde:|Precio sugerido|Suscribite/i.test(t)
      ) {
        features.push(t);
      }
    });

    const key = imageKeyForName(name);
    let imageSrc = carousel.get(key) || "";

    if (!imageSrc) {
      block.find("img").each((___, img) => {
        const src = $(img).attr("src");
        if (src && /content\/dam\/chevrolet/i.test(src) && !imageSrc) {
          imageSrc = src;
        }
      });
    }

    seen.add(slug);
    plans.push({
      slug,
      name,
      tagline,
      priceFrom: priceFromMatch ? `$ ${priceFromMatch[1]}` : "",
      priceNetSuggested: netMatch ? `$ ${netMatch[1]}` : "",
      features: [...new Set(features)].slice(0, 6),
      sourceUrl: imageSrc ? absolutize(imageSrc) : SOURCE_URL,
      active: true,
    });
  });

  return plans;
}

async function scrape() {
  console.log(`Fetch ${SOURCE_URL}`);
  const res = await fetch(SOURCE_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "es-AR,es;q=0.9",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} al obtener la página`);
  }

  const html = await res.text();
  await fs.mkdir(OUT_DIR, { recursive: true });

  const rawPlans = extractPlans(html);
  if (rawPlans.length === 0) {
    throw new Error("No se encontraron planes en el HTML");
  }

  console.log(`Encontrados ${rawPlans.length} planes`);

  const plans: ScrapedPlan[] = [];

  for (let i = 0; i < rawPlans.length; i++) {
    const plan = rawPlans[i];
    let imagePath = "";

    if (plan.sourceUrl.startsWith("http")) {
      const filename = `${plan.slug}${extFromUrl(plan.sourceUrl)}`;
      const dest = path.join(OUT_DIR, filename);
      try {
        console.log(`  Imagen: ${plan.name}`);
        await downloadImage(plan.sourceUrl, dest);
        imagePath = `/plans/${filename}`;
      } catch (err) {
        console.warn(`  Aviso imagen ${plan.name}:`, err);
      }
    }

    plans.push({
      ...plan,
      imagePath,
      order: i,
      sourceUrl: SOURCE_URL,
    });
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(plans, null, 2), "utf8");
  console.log(`Manifest: ${MANIFEST_PATH}`);

  for (const plan of plans) {
    await upsertPlan({
      slug: plan.slug,
      name: plan.name,
      tagline: plan.tagline,
      priceFrom: plan.priceFrom,
      priceNetSuggested: plan.priceNetSuggested,
      features: plan.features,
      imagePath: plan.imagePath,
      sourceUrl: plan.sourceUrl,
      active: plan.active,
      order: plan.order,
    });
    console.log(`  Upsert: ${plan.slug}`);
  }

  console.log("Listo.");
}

scrape()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
