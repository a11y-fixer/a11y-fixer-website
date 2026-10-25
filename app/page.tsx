import Link from "next/link";
import CodeBlock from "./components/CodeBlock";
import { site } from "./lib/site";
import styles from "./page.module.css";

// {/* TODO: confirm feature copy against the real a11y-fixer */}
const features = [
  {
    title: "Automated WCAG scanning",
    body: "Crawl any page or build output and surface WCAG 2.2 violations ranked by severity.",
  },
  {
    title: "Safe auto-fixes",
    body: "Apply conservative, reviewable fixes for common issues — missing alt text, labels, contrast, and ARIA.",
  },
  {
    title: "CI-friendly",
    body: "Run as a CLI or GitHub Action and fail builds when new accessibility regressions appear.",
  },
  {
    title: "Framework agnostic",
    body: "Works with React, Vue, Svelte, or plain HTML — it checks the rendered DOM, not your source.",
  },
  {
    title: "Clear reports",
    body: "Get human-readable reports plus JSON/SARIF output for your dashboards and code review.",
  },
  {
    title: "Open source",
    body: "MIT-licensed and community-driven. Inspect every rule and contribute your own.",
  },
];

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>{site.name}</h1>
          <p className={styles.tagline}>{site.tagline}</p>
          <div className={styles.cta}>
            <Link href="/docs" className={styles.primaryBtn}>
              Get started
            </Link>
            <a
              href={site.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryBtn}
            >
              View on GitHub
            </a>
          </div>
          <div className={styles.install}>
            <CodeBlock label="Install command">
              {site.installCommand}
            </CodeBlock>
          </div>
        </div>
      </section>

      <section id="features" className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Why a11y-fixer</h2>
          <ul className={styles.grid}>
            {features.map((f) => (
              <li key={f.title} className={styles.card}>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                <p className={styles.cardBody}>{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.quickstart}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Quick start</h2>
          <p className={styles.quickstartLede}>
            Scan a running site and write a report in two commands:
          </p>
          <CodeBlock label="Quick start commands">
            {`${site.installCommand}
a11y-fixer scan https://example.com --report report.html`}
          </CodeBlock>
          <p>
            Read the <Link href="/docs">full documentation</Link> for
            configuration, CI setup, and the fix catalog.
          </p>
        </div>
      </section>
    </>
  );
}
