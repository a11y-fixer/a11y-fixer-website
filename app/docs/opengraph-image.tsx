import { ImageResponse } from "next/og";
import { site } from "../lib/site";

export const alt = `${site.name} documentation`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0d1117",
          color: "#e6edf3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 32, color: "#1f6feb", fontWeight: 600 }}>
          {site.name}
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 24 }}>
          Documentation
        </div>
        <div style={{ fontSize: 32, color: "#8b949e", marginTop: 24 }}>
          Install, scan, fix, and gate accessibility in CI.
        </div>
      </div>
    ),
    { ...size },
  );
}
