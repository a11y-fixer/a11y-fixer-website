/** @type {import('next').NextConfig} */

// Deployed on Vercel (served from the apex custom domain a11y-fixer.com).
// Not a static export: the trial-key issuer at app/api/trial needs a Node
// server runtime to sign license keys, so `output: "export"` is intentionally
// absent.
const nextConfig = {
  trailingSlash: true,
};

export default nextConfig;
