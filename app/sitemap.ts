import type { MetadataRoute } from "next";
import { site } from "./lib/site";
import { getAllPosts } from "./lib/content";

export const dynamic = "force-static";

// Generates /sitemap.xml at build time. Static pages are listed explicitly;
// blog posts are derived from the MDX files in /content so new posts appear
// automatically.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/docs/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/blog/`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/trial/`, lastModified, changeFrequency: "monthly", priority: 0.6 },
  ];

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${site.url}/blog/${post.slug}/`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...posts];
}
