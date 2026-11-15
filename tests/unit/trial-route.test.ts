import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateKeyPairSync } from "node:crypto";

// The route talks to Upstash Redis for rate limiting and logging. CI has no
// Upstash credentials, so stub both clients: Redis is a no-op, and Ratelimit
// counts calls per key in memory so the sliding-window behavior (5 per window,
// then block) is still exercised without a network round-trip.
vi.mock("@upstash/redis", () => ({
  Redis: class {
    lpush() {
      return Promise.resolve(1);
    }
  },
}));

vi.mock("@upstash/ratelimit", () => {
  const counts = new Map<string, number>();
  const MAX = 5;
  return {
    Ratelimit: class {
      static slidingWindow() {
        return {};
      }
      async limit(key: string) {
        const n = (counts.get(key) ?? 0) + 1;
        counts.set(key, n);
        return { success: n <= MAX };
      }
    },
  };
});

import { POST } from "../../app/api/trial/route";

const { privateKey } = generateKeyPairSync("ed25519");
const PRIVATE_PEM = privateKey.export({ type: "pkcs8", format: "pem" }).toString();

const ORIGINAL = process.env.LICENSE_SIGNING_KEY;

// The route rate-limits on x-forwarded-for (5 per window, via the mock above).
// Give every request a unique source IP so cases never collide or trip a 429
// meant for a different test.
let ipCounter = 0;
function makeRequest(body: unknown, { raw }: { raw?: string } = {}) {
  ipCounter += 1;
  return new Request("http://localhost/api/trial", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": `10.0.0.${ipCounter}`,
    },
    body: raw ?? JSON.stringify(body),
  });
}

// The route only rate-limits / logs when Upstash credentials are present. Set
// dummy values so getRatelimit() returns the mocked limiter above (the mock
// never dials the network, so the values themselves don't matter).
beforeEach(() => {
  process.env.LICENSE_SIGNING_KEY = PRIVATE_PEM;
  process.env.KV_REST_API_URL = "https://example.upstash.io";
  process.env.KV_REST_API_TOKEN = "test-token";
});

afterEach(() => {
  if (ORIGINAL === undefined) delete process.env.LICENSE_SIGNING_KEY;
  else process.env.LICENSE_SIGNING_KEY = ORIGINAL;
  delete process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_TOKEN;
});

describe("POST /api/trial", () => {
  it("returns 422 when the honeypot field is filled (silent bot rejection)", async () => {
    const res = await POST(
      makeRequest({ email: "you@company.com", company: "ACME" }),
    );
    expect(res.status).toBe(422);
  });

  it("returns 400 for an invalid email", async () => {
    const res = await POST(makeRequest({ email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/valid email/i);
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns 400 for a malformed JSON body", async () => {
    const res = await POST(makeRequest(null, { raw: "{not json" }));
    expect(res.status).toBe(400);
  });

  it("returns 500 when the signing key is not configured", async () => {
    delete process.env.LICENSE_SIGNING_KEY;
    const res = await POST(makeRequest({ email: "you@company.com" }));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toMatch(/temporarily unavailable/i);
  });

  it("mints a key for a valid email", async () => {
    const res = await POST(makeRequest({ email: "you@company.com" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(typeof data.token).toBe("string");
    expect(data.token.split(".")).toHaveLength(2);
    expect(typeof data.expires).toBe("number");
    expect(data.trialDays).toBe(365);
  });

  it("rate-limits after 5 requests from the same IP within the window", async () => {
    const ip = "198.51.100.7";
    const fire = () =>
      POST(
        new Request("http://localhost/api/trial", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": ip,
          },
          body: JSON.stringify({ email: "you@company.com" }),
        }),
      );

    for (let i = 0; i < 5; i++) {
      expect((await fire()).status).toBe(200);
    }
    expect((await fire()).status).toBe(429);
  });
});
