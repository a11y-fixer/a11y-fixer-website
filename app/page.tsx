import Link from "next/link";
import CodeBlock from "./components/CodeBlock";
import { site } from "./lib/site";
import styles from "./page.module.css";

const features = [
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
    body: "The a11y-fixer GitHub Action uses an LLM (Anthropic, OpenAI, or Google) to repair the issues that need judgment — alt text, button and form labels, vague link text — and proposes every change in a pull request for review.",
  },
  {
    title: "GitHub Action built in",
    body: "Run as a CLI or drop in the a11y-fixer GitHub Action to gate pull requests, scan, or open fix PRs automatically.",
  },
  {
    title: "Framework agnostic",
    body: "Scans your React/JSX and HTML source by default; point it at a running URL to check the rendered DOM of any framework — Vue, Svelte, plain HTML.",
  },
  {
    title: "Open source core",
    body: "The MIT-licensed CLI is community-driven and fully deterministic — inspect every rule and contribute your own.",
  },
];

// Keep these in sync with the FAQPage JSON-LD in app/layout.tsx — Google
// requires FAQ rich-result content to be visible on the page.
const faqs = [
  {
    q: "Is a11y-fixer free?",
    a: "Yes. The a11y-fixer CLI is open source and MIT-licensed, free to use from your terminal or in CI. The a11y-fixer GitHub Action, which proposes AI-assisted fixes on pull requests, is free during early access.",
  },
  {
    q: "Which accessibility standard does a11y-fixer check?",
    a: "a11y-fixer scans for WCAG 2.2 violations and can target conformance levels such as WCAG 2.2 AA. It checks your React/JSX and HTML source by default, and can scan the rendered DOM of a running page (any framework) with --url.",
  },
  {
    q: "Does a11y-fixer run in CI?",
    a: "Yes. Run the CLI to fail builds when new accessibility regressions appear, or drop in the a11y-fixer GitHub Action to gate pull requests, scan, or automatically open fix PRs.",
  },
  {
    q: "What accessibility issues can a11y-fixer fix automatically?",
    a: "The free CLI applies deterministic fixes for issues like document language, color contrast, tabindex, heading order, and list structure. The a11y-fixer GitHub Action adds AI-assisted fixes for image alt text, form labels, and button and link names. Issues such as invalid ARIA and missing landmarks are detected and reported for a human to resolve.",
  },
  {
    q: "How do the AI-assisted fixes work?",
    a: "In fix mode, the a11y-fixer GitHub Action uses an LLM (Anthropic, OpenAI, or Google) to repair issues that need judgment — image alt text, icon-only button labels, form control labels, and vague link text. Every change is proposed in a pull request for a human to review; nothing is pushed to your base branch. The free CLI stays fully deterministic and uses no AI.",
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

      <section className={styles.quickstart}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Quick start</h2>
          <p className={styles.quickstartLede}>
            Scan your source — and optionally a running page — in two commands:
          </p>
          <CodeBlock label="Quick start commands">
            {`${site.installCommand}
a11y-fixer scan ./src --url https://example.com`}
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
