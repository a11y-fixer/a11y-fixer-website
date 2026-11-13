/** @type {import('next').NextConfig} */

// Deployed on Vercel (served from the apex custom domain a11y-fixer.com).
// Not a static export: the trial-key issuer at app/api/trial needs a Node
// server runtime to sign license keys, so `output: "export"` is intentionally
// absent.
const nextConfig = {
  trailingSlash: true,
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
