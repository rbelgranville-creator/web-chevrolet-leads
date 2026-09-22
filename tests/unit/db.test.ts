import fs from "fs";
import os from "os";
import path from "path";
import { beforeEach, describe, expect, it } from "vitest";
import {
  createLead,
  findActivePlanBySlug,
  findAdminByEmail,
  listLeads,
  resetDbConnection,
  upsertAdmin,
  upsertPlan,
} from "@/lib/db";

describe("libsql db", () => {
  beforeEach(() => {
    resetDbConnection();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "chevy-db-"));
    process.env.DATABASE_PATH = path.join(dir, "test.db");
    delete process.env.TURSO_DATABASE_URL;
    delete process.env.TURSO_AUTH_TOKEN;
  });

  it("upsert plan y lo encuentra activo", async () => {
    await upsertPlan({
      slug: "tracker-lt",
      name: "Tracker LT",
      tagline: "Plan Chevrolet",
      priceFrom: "$ 1",
      priceNetSuggested: "$ 1",
      features: ["ABS"],
      imagePath: "/plans/tracker.jpg",
      sourceUrl: "https://example.com",
      active: true,
      order: 1,
    });

    const plan = await findActivePlanBySlug("tracker-lt");
    expect(plan?.name).toBe("Tracker LT");
    expect(JSON.parse(plan!.features_json)).toEqual(["ABS"]);
  });

  it("crea leads y lista con filtro", async () => {
    await createLead({
      fullName: "Ana Gómez",
      email: "ana@example.com",
      planSlug: "onix",
      planName: "Onix",
    });
    await createLead({
      fullName: "Pedro López",
      email: "pedro@example.com",
      planSlug: "s10",
      planName: "S10 WT",
    });

    expect((await listLeads()).length).toBe(2);
    expect((await listLeads("ana"))[0]?.email).toBe("ana@example.com");
    expect((await listLeads("S10"))[0]?.plan_name).toBe("S10 WT");
  });

  it("upsert admin por email", async () => {
    await upsertAdmin({
      email: "admin@test.com",
      passwordHash: "hash1",
      name: "Admin",
    });
    await upsertAdmin({
      email: "admin@test.com",
      passwordHash: "hash2",
      name: "Admin 2",
    });

    const admin = await findAdminByEmail("admin@test.com");
    expect(admin?.password_hash).toBe("hash2");
    expect(admin?.name).toBe("Admin 2");
  });
});
