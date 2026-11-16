import { NextResponse } from "next/server";
import { mintTrialKey, SigningKeyMissingError, TRIAL_DAYS } from "../../lib/license";
import {
  clientIp,
  getRatelimit,
  getRedis,
  isProduction,
  upstashConfigured,
} from "../../lib/ratelimit";

// Ed25519 signing uses node:crypto, which needs the Node.js runtime (not Edge).
export const runtime = "nodejs";
// Never cache a minting endpoint.
export const dynamic = "force-dynamic";

// Simple RFC-5322-ish sanity check. We only need to reject obvious garbage; the
// trial is free, so the email is a label, not an identity we verify.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_PER_WINDOW = 5;

// Retention cap for the PII log (email + ip). The `trials` list is trimmed to
// this many most-recent records on every write so it cannot grow without bound.
// See SECURITY.md for the data-retention policy and deletion path.
const TRIALS_MAX_RECORDS = 5000;

export async function POST(req: Request) {
  // Fail closed: in production, a missing Upstash config means the rate limiter
  // is unavailable. Refuse to mint rather than run the public endpoint wide
  // open. In dev/CI/preview we intentionally run without rate limiting.
  if (isProduction() && !upstashConfigured()) {
    console.error("[trial] Upstash is not configured in production; refusing to mint");
    return NextResponse.json(
      { error: "Trial issuing is temporarily unavailable." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email, company } = (body ?? {}) as { email?: unknown; company?: unknown };

  // Honeypot: real users leave the hidden `company` field blank. Pretend success
  // so bots get no signal.
  if (typeof company === "string" && company.trim() !== "") {
    return NextResponse.json({ error: "Could not issue a trial key." }, { status: 422 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const ip = clientIp(req);
  const ratelimit = getRatelimit("rl:trial", MAX_PER_WINDOW);
  if (ratelimit) {
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }
  }

  try {
    const { token, expires } = mintTrialKey(email.trim());

    // Fire-and-forget: log the trial request and trim to the retention cap.
    // Never blocks the response.
    const redis = getRedis();
    if (redis) {
      redis
        .lpush("trials", JSON.stringify({ email: email.trim(), at: Date.now(), ip }))
        .then(() => redis.ltrim("trials", 0, TRIALS_MAX_RECORDS - 1))
        .catch((err) => console.error("[trial] failed to log to Redis:", err));
    }

    return NextResponse.json({ token, expires, trialDays: TRIAL_DAYS });
  } catch (err) {
    if (err instanceof SigningKeyMissingError) {
      // Log server-side; never expose key configuration details to the client.
      console.error("[trial] LICENSE_SIGNING_KEY is not configured");
      return NextResponse.json(
        { error: "Trial issuing is temporarily unavailable." },
        { status: 500 },
      );
    }
    console.error("[trial] failed to mint key:", err);
    return NextResponse.json(
      { error: "Could not issue a trial key." },
      { status: 500 },
    );
  }
}
