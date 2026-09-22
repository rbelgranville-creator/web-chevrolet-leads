import { createClient, type Client } from "@libsql/client";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

declare global {
  var libsqlClient: Client | undefined;
  var libsqlMigrated: boolean | undefined;
}

function resolveClientConfig(): { url: string; authToken?: string } {
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  if (tursoUrl) {
    return {
      url: tursoUrl,
      authToken: process.env.TURSO_AUTH_TOKEN?.trim() || undefined,
    };
  }

  const configured = process.env.DATABASE_PATH?.trim();
  const dbPath = configured
    ? path.resolve(/* turbopackIgnore: true */ configured)
    : path.join(process.cwd(), "data", "app.db");
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  return { url: pathToFileURL(dbPath).href };
}

export function getDb(): Client {
  if (!global.libsqlClient) {
    global.libsqlClient = createClient(resolveClientConfig());
  }
  return global.libsqlClient;
}

async function migrate(db: Client) {
  await db.batch(
    [
      `CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL DEFAULT 'Admin',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
      `CREATE TABLE IF NOT EXISTS plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        tagline TEXT NOT NULL DEFAULT '',
        price_from TEXT NOT NULL DEFAULT '',
        price_net_suggested TEXT NOT NULL DEFAULT '',
        features_json TEXT NOT NULL DEFAULT '[]',
        image_path TEXT NOT NULL DEFAULT '',
        source_url TEXT NOT NULL DEFAULT '',
        active INTEGER NOT NULL DEFAULT 1,
        sort_order INTEGER NOT NULL DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        plan_slug TEXT NOT NULL,
        plan_name TEXT NOT NULL DEFAULT '',
        source TEXT NOT NULL DEFAULT 'web',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
      `CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC)`,
      `CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email)`,
    ],
    "write"
  );
}

async function ensureMigrated() {
  if (global.libsqlMigrated) return;
  await migrate(getDb());
  global.libsqlMigrated = true;
}

/** Cierra y limpia la conexión en memoria (solo tests). */
export function resetDbConnection() {
  if (global.libsqlClient) {
    global.libsqlClient.close();
    global.libsqlClient = undefined;
  }
  global.libsqlMigrated = undefined;
}

export type AdminRow = {
  id: number;
  email: string;
  password_hash: string;
  name: string;
};

export type PlanRow = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  price_from: string;
  price_net_suggested: string;
  features_json: string;
  image_path: string;
  source_url: string;
  active: number;
  sort_order: number;
};

export type LeadRow = {
  id: number;
  full_name: string;
  email: string;
  plan_slug: string;
  plan_name: string;
  source: string;
  created_at: string;
};

export async function findAdminByEmail(
  email: string
): Promise<AdminRow | undefined> {
  await ensureMigrated();
  const result = await getDb().execute({
    sql: "SELECT * FROM admins WHERE email = ?",
    args: [email],
  });
  return result.rows[0] as unknown as AdminRow | undefined;
}

export async function upsertAdmin(input: {
  email: string;
  passwordHash: string;
  name: string;
}) {
  await ensureMigrated();
  await getDb().execute({
    sql: `INSERT INTO admins (email, password_hash, name)
       VALUES (?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         password_hash = excluded.password_hash,
         name = excluded.name`,
    args: [input.email, input.passwordHash, input.name],
  });
}

export async function upsertPlan(input: {
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
}) {
  await ensureMigrated();
  await getDb().execute({
    sql: `INSERT INTO plans (
         slug, name, tagline, price_from, price_net_suggested,
         features_json, image_path, source_url, active, sort_order
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(slug) DO UPDATE SET
         name = excluded.name,
         tagline = excluded.tagline,
         price_from = excluded.price_from,
         price_net_suggested = excluded.price_net_suggested,
         features_json = excluded.features_json,
         image_path = excluded.image_path,
         source_url = excluded.source_url,
         active = excluded.active,
         sort_order = excluded.sort_order`,
    args: [
      input.slug,
      input.name,
      input.tagline,
      input.priceFrom,
      input.priceNetSuggested,
      JSON.stringify(input.features),
      input.imagePath,
      input.sourceUrl,
      input.active ? 1 : 0,
      input.order,
    ],
  });
}

export async function listActivePlans(): Promise<PlanRow[]> {
  await ensureMigrated();
  const result = await getDb().execute(
    "SELECT * FROM plans WHERE active = 1 ORDER BY sort_order ASC, id ASC"
  );
  return result.rows as unknown as PlanRow[];
}

export async function findActivePlanBySlug(
  slug: string
): Promise<PlanRow | undefined> {
  await ensureMigrated();
  const result = await getDb().execute({
    sql: "SELECT * FROM plans WHERE slug = ? AND active = 1",
    args: [slug],
  });
  return result.rows[0] as unknown as PlanRow | undefined;
}

export async function createLead(input: {
  fullName: string;
  email: string;
  planSlug: string;
  planName: string;
  source?: string;
}) {
  await ensureMigrated();
  await getDb().execute({
    sql: `INSERT INTO leads (full_name, email, plan_slug, plan_name, source)
       VALUES (?, ?, ?, ?, ?)`,
    args: [
      input.fullName,
      input.email,
      input.planSlug,
      input.planName,
      input.source || "web",
    ],
  });
}

export async function listLeads(query?: string): Promise<LeadRow[]> {
  await ensureMigrated();
  const q = query?.trim();
  if (!q) {
    const result = await getDb().execute(
      "SELECT * FROM leads ORDER BY created_at DESC LIMIT 200"
    );
    return result.rows as unknown as LeadRow[];
  }

  const like = `%${q}%`;
  const result = await getDb().execute({
    sql: `SELECT * FROM leads
       WHERE full_name LIKE ? OR email LIKE ? OR plan_name LIKE ? OR plan_slug LIKE ?
       ORDER BY created_at DESC
       LIMIT 200`,
    args: [like, like, like, like],
  });
  return result.rows as unknown as LeadRow[];
}
