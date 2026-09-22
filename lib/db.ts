import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const defaultPath = path.join(process.cwd(), "data", "app.db");

function resolveDbPath() {
  return process.env.DATABASE_PATH?.trim() || defaultPath;
}

declare global {
  var sqliteDb: Database.Database | undefined;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT 'Admin',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS plans (
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
    );

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      plan_slug TEXT NOT NULL,
      plan_name TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT 'web',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
  `);
}

export function getDb(): Database.Database {
  if (global.sqliteDb) {
    return global.sqliteDb;
  }

  const dbPath = resolveDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  migrate(db);
  global.sqliteDb = db;
  return db;
}

/** Cierra y limpia la conexión en memoria (solo tests). */
export function resetDbConnection() {
  if (global.sqliteDb) {
    global.sqliteDb.close();
    global.sqliteDb = undefined;
  }
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

export function findAdminByEmail(email: string): AdminRow | undefined {
  return getDb()
    .prepare("SELECT * FROM admins WHERE email = ?")
    .get(email) as AdminRow | undefined;
}

export function upsertAdmin(input: {
  email: string;
  passwordHash: string;
  name: string;
}) {
  getDb()
    .prepare(
      `INSERT INTO admins (email, password_hash, name)
       VALUES (@email, @passwordHash, @name)
       ON CONFLICT(email) DO UPDATE SET
         password_hash = excluded.password_hash,
         name = excluded.name`
    )
    .run({
      email: input.email,
      passwordHash: input.passwordHash,
      name: input.name,
    });
}

export function upsertPlan(input: {
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
  getDb()
    .prepare(
      `INSERT INTO plans (
         slug, name, tagline, price_from, price_net_suggested,
         features_json, image_path, source_url, active, sort_order
       ) VALUES (
         @slug, @name, @tagline, @priceFrom, @priceNetSuggested,
         @featuresJson, @imagePath, @sourceUrl, @active, @order
       )
       ON CONFLICT(slug) DO UPDATE SET
         name = excluded.name,
         tagline = excluded.tagline,
         price_from = excluded.price_from,
         price_net_suggested = excluded.price_net_suggested,
         features_json = excluded.features_json,
         image_path = excluded.image_path,
         source_url = excluded.source_url,
         active = excluded.active,
         sort_order = excluded.sort_order`
    )
    .run({
      slug: input.slug,
      name: input.name,
      tagline: input.tagline,
      priceFrom: input.priceFrom,
      priceNetSuggested: input.priceNetSuggested,
      featuresJson: JSON.stringify(input.features),
      imagePath: input.imagePath,
      sourceUrl: input.sourceUrl,
      active: input.active ? 1 : 0,
      order: input.order,
    });
}

export function listActivePlans(): PlanRow[] {
  return getDb()
    .prepare(
      "SELECT * FROM plans WHERE active = 1 ORDER BY sort_order ASC, id ASC"
    )
    .all() as PlanRow[];
}

export function findActivePlanBySlug(slug: string): PlanRow | undefined {
  return getDb()
    .prepare("SELECT * FROM plans WHERE slug = ? AND active = 1")
    .get(slug) as PlanRow | undefined;
}

export function createLead(input: {
  fullName: string;
  email: string;
  planSlug: string;
  planName: string;
  source?: string;
}) {
  getDb()
    .prepare(
      `INSERT INTO leads (full_name, email, plan_slug, plan_name, source)
       VALUES (@fullName, @email, @planSlug, @planName, @source)`
    )
    .run({
      fullName: input.fullName,
      email: input.email,
      planSlug: input.planSlug,
      planName: input.planName,
      source: input.source || "web",
    });
}

export function listLeads(query?: string): LeadRow[] {
  const q = query?.trim();
  if (!q) {
    return getDb()
      .prepare("SELECT * FROM leads ORDER BY created_at DESC LIMIT 200")
      .all() as LeadRow[];
  }

  const like = `%${q}%`;
  return getDb()
    .prepare(
      `SELECT * FROM leads
       WHERE full_name LIKE ? OR email LIKE ? OR plan_name LIKE ? OR plan_slug LIKE ?
       ORDER BY created_at DESC
       LIMIT 200`
    )
    .all(like, like, like, like) as LeadRow[];
}
