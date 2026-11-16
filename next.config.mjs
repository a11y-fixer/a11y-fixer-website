/** @type {import('next').NextConfig} */

// Deployed on Vercel (served from the apex custom domain a11y-fixer.com).
// Not a static export: the trial-key issuer at app/api/trial needs a Node
// server runtime to sign license keys, so `output: "export"` is intentionally
// absent.
// Baseline security response headers applied to every route. HSTS, nosniff,
// frame-deny, a conservative referrer policy, and a locked-down permissions
// policy are all safe to enforce. CSP is shipped in REPORT-ONLY mode: the app
// relies on Next.js inline hydration scripts and Vercel Analytics/Speed
// Insights, so a strict enforced policy risks breakage — report-only gives us
// the header + violation visibility without blocking. Tighten to enforced
// (ideally nonce-based) once reports confirm the allowlist is complete.
const cspReportOnly = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
];

const nextConfig = {
  trailingSlash: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Canonicalize to the apex domain: 301-redirect any www.* request to the
  // bare a11y-fixer.com so search engines index a single host (matches the
  // canonical origin in app/lib/site.ts).
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.a11y-fixer.com" }],
        destination: "https://a11y-fixer.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
