import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Rate limiter allows everything (we only assert auth here); Redis returns an
// empty trials list.
vi.mock("@upstash/redis", () => ({
  Redis: class {
    lrange() {
      return Promise.resolve([]);
    }
    del() {
      return Promise.resolve(1);
    }
    rpush() {
      return Promise.resolve(1);
    }
  },
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: class {
    static slidingWindow() {
      return {};
    }
    async limit() {
      return { success: true };
    }
  },
}));

import { GET } from "../../app/api/trial/logs/route";

function req(auth?: string) {
  return new Request("http://localhost/api/trial/logs", {
    headers: {
      ...(auth ? { authorization: auth } : {}),
      "x-forwarded-for": "10.0.0.1",
    },
  });
}

beforeEach(() => {
  process.env.KV_REST_API_URL = "https://example.upstash.io";
  process.env.KV_REST_API_TOKEN = "test-token";
  process.env.ADMIN_SECRET = "s3cret-admin-token";
});

afterEach(() => {
  delete process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_TOKEN;
  delete process.env.ADMIN_SECRET;
});

describe("GET /api/trial/logs", () => {
  it("401s when ADMIN_SECRET is unset (fails closed)", async () => {
    delete process.env.ADMIN_SECRET;
    expect((await GET(req("Bearer anything"))).status).toBe(401);
  });

  it("401s with no authorization header", async () => {
    expect((await GET(req())).status).toBe(401);
  });

  it("401s with a wrong bearer token", async () => {
    expect((await GET(req("Bearer wrong-token"))).status).toBe(401);
  });

  it("401s when the token is a prefix of the secret (length not leaked)", async () => {
    expect((await GET(req("Bearer s3cret"))).status).toBe(401);
  });

  it("200s with the correct bearer token", async () => {
    const res = await GET(req("Bearer s3cret-admin-token"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("count", 0);
  });
});
