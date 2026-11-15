import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { mintTrialKey, SigningKeyMissingError, TRIAL_DAYS } from "../../lib/license";

// Ed25519 signing uses node:crypto, which needs the Node.js runtime (not Edge).
export const runtime = "nodejs";
// Never cache a minting endpoint.
export const dynamic = "force-dynamic";

// Simple RFC-5322-ish sanity check. We only need to reject obvious garbage; the
// trial is free, so the email is a label, not an identity we verify.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_PER_WINDOW = 5;

function getRedis() {
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

function getRatelimit() {
  return new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(MAX_PER_WINDOW, "1 h"),
    prefix: "rl:trial",
  });
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : "unknown";
}

export async function POST(req: Request) {
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
  const { success } = await getRatelimit().limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const { token, expires } = mintTrialKey(email.trim());

    // Fire-and-forget: log the trial request. Never blocks the response.
    getRedis()
      .lpush("trials", JSON.stringify({ email: email.trim(), at: Date.now(), ip }))
      .catch((err) => console.error("[trial] failed to log to Redis:", err));

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
