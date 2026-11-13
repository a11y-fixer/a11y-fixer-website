import type { Metadata } from "next";
import CodeBlock from "../components/CodeBlock";
import { site } from "../lib/site";
import styles from "./docs.module.css";

export const metadata: Metadata = {
  title: "Documentation",
  description: `${site.name} documentation: install the CLI, scan pages for WCAG violations, apply automated fixes, configure rules, and gate pull requests in CI.`,
  alternates: {
    canonical: "/docs",
  },
};

// {/* TODO: replace example commands/flags with the real a11y-fixer CLI */}
export default function Docs() {
  return (
    <>
      <h1 className={styles.h1}>Documentation</h1>
      <p className={styles.lede}>
        Everything you need to scan and fix accessibility issues with{" "}
        {site.name}. This page covers installation through CI integration.
      </p>

      <section aria-labelledby="installation">
        <h2 id="installation" className={styles.h2}>
          Installation
        </h2>
        <p>Install globally with npm:</p>
        <CodeBlock label="npm install">{site.installCommand}</CodeBlock>
        <p>Or run it without installing:</p>
        <CodeBlock label="npx">{`npx @a11y-fixer/cli scan ./src --url https://example.com`}</CodeBlock>
      </section>

      <section aria-labelledby="usage">
        <h2 id="usage" className={styles.h2}>
          Usage
        </h2>
        <p>
          Point <code>scan</code> at your source directory (React/JSX and HTML),
          or at a live page with <code>--url</code>:
        </p>
        <CodeBlock label="Basic usage">{`# Scan your source
a11y-fixer scan ./src

# Scan a live page with axe-core
a11y-fixer scan ./src --url https://example.com

# Preview fixes without writing
a11y-fixer fix ./src --dry-run

# Apply fixes in place
a11y-fixer fix ./src`}</CodeBlock>
      </section>

      <section aria-labelledby="configuration">
        <h2 id="configuration" className={styles.h2}>
          Commands &amp; options
        </h2>
        <p>
          Three commands, each taking a source directory:
        </p>
        <CodeBlock label="Commands">{`# Report violations
a11y-fixer scan ./src

# CI gate — exits 1 if any violations are found
a11y-fixer check ./src

# Preview fixes, then apply them
a11y-fixer fix ./src --dry-run
a11y-fixer fix ./src`}</CodeBlock>
        <p>
          Common options: <code>--html</code> to scan <code>.html</code>/
          <code>.htm</code> files with axe-core, <code>--url &lt;url&gt;</code>{" "}
          to scan a live page, and <code>--concurrency &lt;n&gt;</code>.{" "}
          <code>fix</code> can open an annotated pull request with{" "}
          <code>--owner</code>, <code>--repo</code>, and <code>--base</code>.
        </p>
      </section>

      <section aria-labelledby="ci">
        <h2 id="ci" className={styles.h2}>
          Continuous integration
        </h2>
        <p>Fail the build when new violations appear. Example GitHub Action:</p>
        <CodeBlock label="GitHub Action">{`- name: Accessibility check
  run: npx @a11y-fixer/cli check ./src`}</CodeBlock>
      </section>

      <section aria-labelledby="fixes">
        <h2 id="fixes" className={styles.h2}>
          Fix catalog
        </h2>
        <p>
          a11y-fixer can automatically repair the most common issues, including:
        </p>
        <ul>
          <li>Missing or empty image alternative text</li>
          <li>Form controls without associated labels</li>
          <li>Insufficient color contrast</li>
          <li>Invalid or redundant ARIA attributes</li>
          <li>Missing document language and landmark roles</li>
        </ul>
      </section>

      <section aria-labelledby="contributing">
        <h2 id="contributing" className={styles.h2}>
          Contributing
        </h2>
        <p>
          a11y-fixer is open source and welcomes contributions. See the{" "}
          <a href={site.repoUrl} target="_blank" rel="noopener noreferrer">
            repository
          </a>{" "}
          for the contributor guide and open issues.
        </p>
      </section>
    </>
  );
}
