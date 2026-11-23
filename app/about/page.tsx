import type { Metadata } from "next";
import Link from "next/link";
import { site } from "../lib/site";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About & roadmap",
  description:
    "Our mission for a11y-fixer, what the open-source tool does today, and where we're headed — toward continuous, provable web accessibility.",
  alternates: { canonical: `${site.url}/about/` },
};

const today = [
  {
    title: "Automated WCAG scanning",
    body: "Crawl any page or build output and surface WCAG 2.2 violations ranked by severity.",
  },
  {
    title: "Safe auto-fixes",
    body: "The free CLI applies conservative, deterministic fixes for common issues — document language, color contrast, tabindex, heading order, and more — and reports the rest.",
  },
  {
    title: "AI-assisted fixes on PRs",
    body: "The GitHub Action uses an LLM to repair issues that need judgment — alt text, button and form labels, vague link text — and proposes every change in a pull request for review.",
  },
  {
    title: "GitHub Action built in",
    body: "Run as a CLI or drop in the a11y-fixer GitHub Action to gate pull requests, scan, or open fix PRs automatically.",
  },
  {
    title: "Framework agnostic",
    body: "Scans your React/JSX and HTML source by default; point it at a running URL to check the rendered DOM of any framework.",
  },
  {
    title: "Open source core",
    body: "The MIT-licensed CLI is community-driven and fully deterministic — inspect every rule and contribute your own.",
  },
];

const roadmap = [
  {
    status: "Exploring",
    title: "Runtime monitoring",
    body: "Catch issues that only appear at runtime — focus traps, live-region timing, SPA route announcements, contrast on user-generated content — not just in static source.",
  },
  {
    status: "Planned",
    title: "Smarter AI remediation",
    body: "Extend AI-assisted fixes beyond the deterministic safe set to judgment-heavy issues — meaningful alt text, semantic heading structure, bespoke-widget ARIA — always proposed for human review before anything is applied.",
  },
  {
    status: "Planned",
    title: "Conformance history you can trust",
    body: "A signed, queryable record of how your product's accessibility changes over time, so a conformance claim is backed by evidence, not a single scan.",
  },
  {
    status: "Our north star",
    title: "Continuous conformance",
    body: "Move from one-time audits to keeping a product conformant as it evolves: monitor, remediate, and prove it, continuously.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className={styles.intro}>
        <div className="container">
          <p className={styles.eyebrow}>Our mission</p>
          <h1 className={styles.title}>{site.mission}</h1>
          <p className={styles.lede}>
            Most accessibility tooling takes a one-time snapshot of the roughly
            third of WCAG issues a machine can see. {site.name} starts there — an
            open-source scanner that finds WCAG 2.2 violations and fixes the safe
            ones automatically — but our goal is bigger: continuous, provable
            accessibility. Catch issues as they ship, fix the ones that need
            judgment with AI under human review, and keep a record you can trust
            that your product stays conformant over time.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What a11y-fixer does today</h2>
          <ul className={styles.grid}>
            {today.map((f) => (
              <li key={f.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                <p className={styles.cardBody}>{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Where we&rsquo;re headed</h2>
          <p className={styles.lede}>
            Automated scanning covers the issues a machine can decide on its own.
            The rest of the web&rsquo;s accessibility lives at runtime, in
            content, and in judgment calls. This is what we&apos;re building
            toward.
          </p>
          <ul className={styles.grid}>
            {roadmap.map((item) => (
              <li key={item.title} className={styles.card}>
                <span className={styles.statusTag}>{item.status}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardBody}>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Get started</h2>
          <p className={styles.lede}>
            The CLI is free and open source. Try it on your project today, and
            come build the rest with us.
          </p>
          <div className={styles.cta}>
            <Link href="/docs" className={styles.primaryBtn}>
              Read the docs
            </Link>
            <Link href="/trial" className={styles.secondaryBtn}>
              Get it free
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
