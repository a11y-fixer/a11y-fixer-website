import { expect, test } from "@playwright/test";
import { allRoutes } from "./routes";

for (const route of allRoutes()) {
  test(`${route} loads, has a heading, and logs no errors`, async ({ page }) => {
    const errors: string[] = [];
    // Vercel Analytics / Speed Insights inject scripts served only on a Vercel
    // deployment; they 404 locally and in CI. That's expected, not a page bug.
    const benign = /_vercel\/(insights|speed-insights)/;

    // JS runtime errors.
    page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
    // Uncaught console errors, but not the generic "Failed to load resource"
    // network noise (its text carries no URL) — real 404s are caught below.
    page.on("console", (msg) => {
      if (msg.type() === "error" && !/Failed to load resource/.test(msg.text())) {
        errors.push(`console: ${msg.text()}`);
      }
    });
    // Any non-benign HTTP error for a resource this page requested.
    page.on("response", (res) => {
      if (res.status() >= 400 && !benign.test(res.url())) {
        errors.push(`${res.status()}: ${res.url()}`);
      }
    });

    const res = await page.goto(route);
    expect(res?.ok(), `${route} should return 2xx`).toBeTruthy();

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForLoadState("networkidle");

    expect(errors, `errors on ${route}`).toEqual([]);
  });
}
