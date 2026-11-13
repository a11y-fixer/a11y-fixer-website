import { expect, test } from "@playwright/test";

test.describe("trial-key form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/trial/");
  });

  test("issues a key for a valid email and renders copyable snippets", async ({ page }) => {
    await page.locator("#trial-email").fill("you@company.com");
    await page.getByRole("button", { name: /get trial key/i }).click();

    await expect(page.getByRole("heading", { name: /trial key/i })).toBeVisible();

    // Two copyable snippets: the minted token and the workflow usage.
    await expect(page.getByRole("button", { name: /copy/i })).toHaveCount(2);

    // The first <code> block holds the actual key: <payloadB64url>.<sigB64url>.
    const token = await page.locator("pre code").first().innerText();
    expect(token.trim()).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
  });

  test("shows an inline error for an invalid email", async ({ page }) => {
    await page.locator("#trial-email").fill("not-an-email");
    await page.getByRole("button", { name: /get trial key/i }).click();

    const alert = page.locator("#trial-error");
    await expect(alert).toBeVisible();
    await expect(alert).toHaveAttribute("role", "alert");
    await expect(alert).toHaveText(/valid email/i);
  });
});
