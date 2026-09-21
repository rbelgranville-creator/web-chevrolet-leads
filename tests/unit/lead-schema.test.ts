import { describe, expect, it } from "vitest";
import { leadSchema } from "@/lib/validation";

describe("leadSchema", () => {
  it("acepta un lead válido", () => {
    const result = leadSchema.safeParse({
      fullName: "Juan Pérez",
      email: "juan@example.com",
      planSlug: "sonic-premier",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza email inválido", () => {
    const result = leadSchema.safeParse({
      fullName: "Juan Pérez",
      email: "no-es-email",
      planSlug: "sonic-premier",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza nombre demasiado corto", () => {
    const result = leadSchema.safeParse({
      fullName: "A",
      email: "juan@example.com",
      planSlug: "sonic-premier",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza plan vacío", () => {
    const result = leadSchema.safeParse({
      fullName: "Juan Pérez",
      email: "juan@example.com",
      planSlug: "",
    });
    expect(result.success).toBe(false);
  });

  it("permite honeypot website opcional", () => {
    const result = leadSchema.safeParse({
      fullName: "Juan Pérez",
      email: "juan@example.com",
      planSlug: "sonic-premier",
      website: "http://spam.test",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.website).toBe("http://spam.test");
    }
  });
});
