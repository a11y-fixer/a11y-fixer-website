/** @type {import('next').NextConfig} */

// Served from https://a11y-fixer.github.io/website/ , so assets live under /website.
// If you move to a custom domain (add public/CNAME), set basePath/assetPrefix to '' / undefined.
const basePath = process.env.NODE_ENV === "production" ? "/website" : "";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  // Expose basePath to the client so links/images can prefix it.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
