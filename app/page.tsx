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

// Keep these in sync with the FAQPage JSON-LD in app/layout.tsx — Google
// requires FAQ rich-result content to be visible on the page.
const faqs = [
  {
    q: "Is a11y-fixer free?",
    a: "Yes. The a11y-fixer CLI is open source and MIT-licensed, free to use from your terminal or in CI. a11y-fixer-pro, the GitHub Action that proposes AI-assisted fixes on pull requests, offers a free 14-day trial.",
  },
  {
    q: "Which accessibility standard does a11y-fixer check?",
    a: "a11y-fixer scans for WCAG 2.2 violations and can target conformance levels such as WCAG 2.2 AA. It checks the rendered DOM, so it works with any framework.",
  },
  {
    q: "Does a11y-fixer run in CI?",
    a: "Yes. Run it as a CLI or GitHub Action to fail builds when new accessibility regressions appear, with JSON and SARIF output for dashboards and code review.",
  },
  {
    q: "What accessibility issues can a11y-fixer fix automatically?",
    a: "It applies safe, reviewable fixes for the most common issues: missing or empty image alt text, form controls without labels, insufficient color contrast, invalid or redundant ARIA attributes, and missing document language and landmark roles.",
  },
];

// {/* TODO: confirm roadmap items against the real a11y-fixer */}
const roadmap = [
  {
    title: "AI-assisted fixes",
    status: "In progress",
    body: "LLM-powered suggestions for issues that need judgment — rewriting unclear link text or alt descriptions. These are non-deterministic by nature, so every change is proposed for review before it lands.",
  },
  {
    title: "GitHub Actions workflow",
    status: "Planned",
    body: "A first-class GitHub Action to gate pull requests on accessibility, with inline annotations on the files you changed.",
  },
];

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>{site.name}</p>
          <h1 className={styles.title}>
            Automated web accessibility testing &amp; WCAG fixes
          </h1>
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

      <section className={styles.whatsNext}>
        <div className="container">
          <h2 className={styles.sectionTitle}>What&apos;s next</h2>
          <ul className={styles.grid}>
            {roadmap.map((r) => (
              <li key={r.title} className={styles.card}>
                <span className={styles.statusTag}>{r.status}</span>
                <h3 className={styles.cardTitle}>{r.title}</h3>
                <p className={styles.cardBody}>{r.body}</p>
              </li>
            ))}
          </ul>
          <p className={styles.getInTouch}>
            Have ideas or want to help shape these?{" "}
            <a href={`mailto:${site.contactEmail}`}>Get in touch</a>.
          </p>
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

      <section id="faq" className={styles.faq}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Frequently asked questions</h2>
          <dl className={styles.faqList}>
            {faqs.map((item) => (
              <div key={item.q} className={styles.faqItem}>
                <dt className={styles.faqQuestion}>{item.q}</dt>
                <dd className={styles.faqAnswer}>{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
