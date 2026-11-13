import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { allRoutes } from "./routes";

for (const route of allRoutes()) {
  test(`${route} has no WCAG 2 A/AA axe violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    // Surface a readable summary if anything fails.
    const summary = results.violations.map((v) => `${v.id}: ${v.help}`);
    expect(summary, `axe violations on ${route}`).toEqual([]);
  });
}
