import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { clientIp, getRatelimit, getRedis } from "../../../lib/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin reads/deletes are low-volume; cap to blunt brute-forcing of the secret.
const MAX_PER_WINDOW = 20;

/**
 * Constant-time bearer check against ADMIN_SECRET. Both sides are SHA-256'd to a
 * fixed 32-byte length first, so `timingSafeEqual` never throws on length
 * mismatch and the comparison leaks neither the secret's length nor a byte
 * prefix. Returns false (fail closed) when ADMIN_SECRET is unset.
 */
function isAuthorized(req: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  const a = createHash("sha256").update(header).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/**
 * Structured audit line for every access to the admin PII store. This is the
 * CC7 evidence that privileged reads/deletes are monitored; ship Vercel logs to
 * a retained drain to complete the trail.
 */
function audit(action: string, outcome: "allow" | "deny", ip: string): void {
  console.log(
    JSON.stringify({
      event: "trial_logs_access",
      action,
      outcome,
      ip,
      at: new Date().toISOString(),
    }),
  );
}

async function guard(
  req: Request,
  action: string,
): Promise<NextResponse | null> {
  const ip = clientIp(req);

  const ratelimit = getRatelimit("rl:trial-logs", MAX_PER_WINDOW);
  if (ratelimit) {
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      audit(action, "deny", ip);
      return NextResponse.json(
        { error: "Too many requests." },
        { status: 429 },
      );
    }
  }

  if (!isAuthorized(req)) {
    audit(action, "deny", ip);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  audit(action, "allow", ip);
  return null;
}

export async function GET(req: Request) {
  const blocked = await guard(req, "read");
  if (blocked) return blocked;

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: "Store unavailable." }, { status: 503 });
  }
  const raw = await redis.lrange("trials", 0, -1);
  const records = raw.map((r) => (typeof r === "string" ? JSON.parse(r) : r));
  return NextResponse.json({ count: records.length, trials: records });
}

/**
 * Deletes trial PII to honor a data-subject deletion request or a retention
 * purge. With `?email=` it removes matching records; with no query it clears the
 * whole `trials` list.
 */
export async function DELETE(req: Request) {
  const blocked = await guard(req, "delete");
  if (blocked) return blocked;

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ error: "Store unavailable." }, { status: 503 });
  }

  const email = new URL(req.url).searchParams.get("email");
  if (!email) {
    await redis.del("trials");
    return NextResponse.json({ deleted: "all" });
  }

  const raw = await redis.lrange("trials", 0, -1);
  const keep = raw.filter((r) => {
    try {
      const rec = typeof r === "string" ? JSON.parse(r) : r;
      return rec?.email !== email;
    } catch {
      return true;
    }
  });
  const removed = raw.length - keep.length;
  // Rewrite the list atomically-ish: clear then repush the survivors.
  await redis.del("trials");
  if (keep.length > 0) {
    await redis.rpush(
      "trials",
      ...keep.map((r) => (typeof r === "string" ? r : JSON.stringify(r))),
    );
  }
  return NextResponse.json({ deleted: removed, email });
}
