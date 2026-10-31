import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="container" style={{ padding: "4rem 1.25rem" }}>
      <p style={{ color: "var(--fg-muted)", margin: 0, fontWeight: 700 }}>404</p>
      <h1 style={{ marginTop: "0.5rem" }}>Page not found</h1>
      <p style={{ color: "var(--fg-muted)", maxWidth: "52ch" }}>
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
      </p>
      <p>
        <Link href="/">Back to home</Link>
      </p>
    </section>
  );
}
