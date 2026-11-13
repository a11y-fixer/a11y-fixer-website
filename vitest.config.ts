import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Pure server/Node logic — no DOM. UI behavior is covered by Playwright.
    environment: "node",
    include: ["tests/unit/**/*.test.ts", "app/**/*.test.ts"],
    // Playwright specs have their own runner; keep them out of Vitest.
    exclude: ["tests/e2e/**", "node_modules/**"],
  },
});
