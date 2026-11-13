import { expect, test } from "@playwright/test";

test.describe("primary navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  for (const { name, path } of [
    { name: "Docs", path: "/docs/" },
    { name: "Blog", path: "/blog/" },
    { name: "Free trial", path: "/trial/" },
  ]) {
    test(`header link "${name}" navigates to ${path}`, async ({ page }) => {
      const nav = page.getByRole("navigation", { name: "Primary" });
      await nav.getByRole("link", { name, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }

  test("brand logo returns home", async ({ page }) => {
    await page.goto("/blog/");
    // The brand link sits in the header, outside the Primary nav.
    await page.getByRole("link", { name: /a11y-fixer/i }).first().click();
    await expect(page).toHaveURL(/\/$/);
  });
});
