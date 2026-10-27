import type { MetadataRoute } from "next";
import { site } from "./lib/site";

export const dynamic = "force-static";

// Generates /sitemap.xml at build time (compatible with output: "export").
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${site.url}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/docs/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
