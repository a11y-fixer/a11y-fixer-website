import type { Metadata } from "next";
import { CATEGORY_LABELS, getChangelog } from "../lib/changelog";
import { site } from "../lib/site";
import styles from "./changelog.module.css";

export const metadata: Metadata = {
  title: "Changelog",
  description: `Release notes for ${site.name}: new accessibility checks and fixes, CI improvements, and product updates.`,
  alternates: {
    canonical: "/changelog",
    types: { "application/atom+xml": "/changelog/feed.xml" },
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Changelog() {
  const entries = getChangelog();

  return (
    <div className="container">
      <h1 className={styles.h1}>Changelog</h1>
      <p className={styles.lede}>
        What&rsquo;s new in {site.name} — new accessibility checks and fixes, CI
        improvements, and product updates.
      </p>

      {entries.length === 0 ? (
        <p>No releases yet. Check back soon.</p>
      ) : (
        <ol className={styles.list}>
          {entries.map((entry) => (
            <li key={`${entry.date}-${entry.title}`} className={styles.entry}>
              <div className={styles.meta}>
                {entry.version ? (
                  <span className={styles.version}>{entry.version}</span>
                ) : null}
                <time className={styles.date} dateTime={entry.date}>
                  {formatDate(entry.date)}
                </time>
              </div>
              <h2 className={styles.title}>{entry.title}</h2>
              {entry.changes.map((group) => (
                <div key={group.category} className={styles.group}>
                  <h3 className={styles.category}>
                    {CATEGORY_LABELS[group.category]}
                  </h3>
                  <ul className={styles.items}>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
