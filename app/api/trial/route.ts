import { NextResponse } from "next/server";
import { mintTrialKey, SigningKeyMissingError, TRIAL_DAYS } from "../../lib/license";

// Ed25519 signing uses node:crypto, which needs the Node.js runtime (not Edge).
export const runtime = "nodejs";
// Never cache a minting endpoint.
export const dynamic = "force-dynamic";

// Simple RFC-5322-ish sanity check. We only need to reject obvious garbage; the
// trial is free, so the email is a label, not an identity we verify.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Best-effort per-IP rate limit. MVP only — serverless instances are ephemeral,
 * so this is NOT durable across cold starts or multiple instances. Good enough
 * to blunt casual abuse; back it with Vercel KV / Upstash for real limiting.
 * TODO(abuse): move to a shared store and consider one-trial-per-email.
 */
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
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

  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const { token, expires } = mintTrialKey(email.trim());
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
