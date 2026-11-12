import { ImageResponse } from "next/og";
import { getAllPosts, getPost, TYPE_LABELS } from "../../lib/content";
import { site } from "../../lib/site";

export const alt = `${site.name} blog`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? site.name;
  const label = post ? TYPE_LABELS[post.type] : "Blog";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0d1117",
          color: "#e6edf3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30 }}>
          <span style={{ color: "#1f6feb", fontWeight: 600 }}>{site.name}</span>
          <span style={{ color: "#8b949e", textTransform: "uppercase", letterSpacing: 2 }}>
            {label}
          </span>
        </div>
        <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
        <div style={{ fontSize: 28, color: "#8b949e" }}>{site.url.replace("https://", "")}</div>
      </div>
    ),
    { ...size },
  );
}
