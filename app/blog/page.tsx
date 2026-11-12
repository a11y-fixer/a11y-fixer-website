import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, TYPE_LABELS } from "../lib/content";
import { site } from "../lib/site";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog & accessibility guides",
  description: `Guides and comparisons from the ${site.name} team: how to fix common WCAG 2.2 violations, automate accessibility in CI, and how ${site.name} compares to other accessibility tools.`,
  alternates: { canonical: "/blog" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="container">
      <h1 className={styles.h1}>Blog &amp; accessibility guides</h1>
      <p className={styles.lede}>
        Practical guides to fixing WCAG violations, automating accessibility in
        CI, and how {site.name} compares to other tools.
      </p>

      {posts.length === 0 ? (
        <p>No posts yet. Check back soon.</p>
      ) : (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.slug} className={styles.item}>
              <Link href={`/blog/${post.slug}/`} className={styles.cardLink}>
                <span className={styles.meta}>
                  <span className={styles.type}>{TYPE_LABELS[post.type]}</span>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </span>
                <h2 className={styles.title}>{post.title}</h2>
                <p className={styles.desc}>{post.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
