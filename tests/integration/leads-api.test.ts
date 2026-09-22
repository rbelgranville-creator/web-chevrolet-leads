import fs from "fs";
import os from "os";
import path from "path";
import { beforeEach, describe, expect, it } from "vitest";
import { POST } from "@/app/api/leads/route";
import {
  listLeads,
  resetDbConnection,
  upsertPlan,
} from "@/lib/db";

describe("POST /api/leads", () => {
  beforeEach(async () => {
    resetDbConnection();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "chevy-api-"));
    process.env.DATABASE_PATH = path.join(dir, "test.db");
    delete process.env.TURSO_DATABASE_URL;
    delete process.env.TURSO_AUTH_TOKEN;

    await upsertPlan({
      slug: "sonic-premier",
      name: "Sonic Premier",
      tagline: "Plan",
      priceFrom: "$ 1",
      priceNetSuggested: "$ 1",
      features: [],
      imagePath: "/plans/sonic-premier.jpg",
      sourceUrl: "https://example.com",
      active: true,
      order: 0,
    });
  });

  it("guarda un lead válido", async () => {
    const req = new Request("http://localhost/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "María Test",
        email: "maria@example.com",
        planSlug: "sonic-premier",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);

    const leads = await listLeads("maria");
    expect(leads).toHaveLength(1);
    expect(leads[0].plan_name).toBe("Sonic Premier");
  });

  it("devuelve 400 si faltan datos", async () => {
    const req = new Request("http://localhost/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "X",
        email: "malo",
        planSlug: "",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("ignora bots del honeypot sin guardar", async () => {
    const req = new Request("http://localhost/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Bot Spam",
        email: "bot@spam.com",
        planSlug: "sonic-premier",
        website: "http://evil.test",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect((await listLeads()).length).toBe(0);
  });
});
