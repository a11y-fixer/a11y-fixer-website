/** @type {import('next').NextConfig} */

// Served from the apex custom domain a11y-fixer.com (see public/CNAME),
// so assets live at the root — no basePath/assetPrefix needed.
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
