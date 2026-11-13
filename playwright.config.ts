import { defineConfig, devices } from "@playwright/test";
import { generateKeyPairSync } from "node:crypto";

// Generate an ephemeral Ed25519 signing key so the trial-key flow works end to
// end. These tokens are NOT accepted by the real Action (they aren't signed
// with the production key) — irrelevant here: we test the site's UI + API, not
// Action trust. Single source of truth, so CI needs no secret.
const LICENSE_SIGNING_KEY = generateKeyPairSync("ed25519")
  .privateKey.export({ type: "pkcs8", format: "pem" })
  .toString();

const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: { LICENSE_SIGNING_KEY },
  },
});
