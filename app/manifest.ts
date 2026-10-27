import type { MetadataRoute } from "next";
import { site } from "./lib/site";

export const dynamic = "force-static";

// Generates /manifest.webmanifest at build time.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0d1117",
    theme_color: "#1f6feb",
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
      {
        src: "/apple-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  };
}
