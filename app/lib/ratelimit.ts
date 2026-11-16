import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

/**
 * Shared Upstash Redis + rate-limit wiring for the trial endpoints.
 *
 * Upstash is optional in local dev, CI, and previews: without credentials we
 * return `null` so callers can skip rate limiting / logging rather than crash.
 * In PRODUCTION, however, missing credentials are a misconfiguration — callers
 * must fail closed (see `isProduction` / `upstashConfigured`) instead of
 * silently running with no rate limiting.
 */

export function upstashConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/**
 * True in a real production deployment. On Vercel, `VERCEL_ENV` is the
 * authoritative signal (`production` | `preview` | `development`); fall back to
 * NODE_ENV elsewhere. Previews are intentionally NOT production.
 */
export function isProduction(): boolean {
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === "production";
  return process.env.NODE_ENV === "production";
}

export function getRedis(): Redis | null {
  if (!upstashConfigured()) return null;
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

/**
 * Builds a sliding-window rate limiter under `prefix`, or `null` when Upstash
 * is not configured (dev/CI/preview).
 */
export function getRatelimit(
  prefix: string,
  max: number,
  window: Parameters<typeof Ratelimit.slidingWindow>[1] = "1 h",
): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(max, window),
    prefix,
  });
}

/** First client IP from `x-forwarded-for`, or "unknown". */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : "unknown";
}
