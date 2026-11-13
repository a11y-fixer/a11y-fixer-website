import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** Blog slugs, derived from content/*.mdx so tests track new posts. */
export function blogSlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

// trailingSlash: true — every route ends in "/".
export function allRoutes(): string[] {
  return [
    "/",
    "/docs/",
    "/blog/",
    "/trial/",
    ...blogSlugs().map((slug) => `/blog/${slug}/`),
  ];
}
