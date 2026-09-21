import { expect, test } from "@playwright/test";

test.describe("landing Plan Chevrolet", () => {
  test("carga hero y modelos", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Financiá hasta el 100%/i,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Elegí tu 0/i })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sonic Premier" })).toBeVisible();
  });

  test("envía el formulario de leads", async ({ page }) => {
    await page.goto("/#contacto");
    await page.getByLabel("Nombre completo").fill("E2E Usuario Prueba");
    await page.getByLabel("Email").fill(`e2e-${Date.now()}@example.com`);
    await page.getByLabel(/interés/i).selectOption({ index: 1 });
    await page.getByRole("button", { name: /Solicitá tu plan/i }).click();
    await expect(
      page.getByText(/Te vamos a contactar|asesor se pondrá en contacto|Listo/i)
    ).toBeVisible({ timeout: 15_000 });
  });
});

test.describe("admin", () => {
  test("muestra login de admin", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: "Admin" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Contraseña")).toBeVisible();
  });
});
