import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { generateKeyPairSync } from "node:crypto";
import { POST } from "../../app/api/trial/route";

const { privateKey } = generateKeyPairSync("ed25519");
const PRIVATE_PEM = privateKey.export({ type: "pkcs8", format: "pem" }).toString();

const ORIGINAL = process.env.LICENSE_SIGNING_KEY;

// The route keeps a best-effort in-memory rate limiter keyed on x-forwarded-for
// (5 per hour). Give every request a unique source IP so cases never collide or
// trip a 429 meant for a different test.
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

beforeEach(() => {
  process.env.LICENSE_SIGNING_KEY = PRIVATE_PEM;
});

afterEach(() => {
  if (ORIGINAL === undefined) delete process.env.LICENSE_SIGNING_KEY;
  else process.env.LICENSE_SIGNING_KEY = ORIGINAL;
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
    expect(data.trialDays).toBe(14);
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
