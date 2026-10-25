import type { Metadata } from "next";
import CodeBlock from "../components/CodeBlock";
import { site } from "../lib/site";
import styles from "./docs.module.css";

export const metadata: Metadata = {
  title: "Documentation",
  description: `Getting started with ${site.name}: install, usage, configuration, and CI.`,
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
        <CodeBlock label="npx">{`npx a11y-fixer scan https://example.com`}</CodeBlock>
      </section>

      <section aria-labelledby="usage">
        <h2 id="usage" className={styles.h2}>
          Usage
        </h2>
        <p>
          Point <code>scan</code> at a URL or a local directory of built HTML:
        </p>
        <CodeBlock label="Basic usage">{`# Scan a live site
a11y-fixer scan https://example.com

# Scan a build output directory
a11y-fixer scan ./dist

# Apply safe automated fixes in place
a11y-fixer fix ./dist --write`}</CodeBlock>
      </section>

      <section aria-labelledby="configuration">
        <h2 id="configuration" className={styles.h2}>
          Configuration
        </h2>
        <p>
          Drop an <code>a11y-fixer.config.json</code> in your project root to
          set defaults:
        </p>
        <CodeBlock label="Config example">{`{
  "standard": "WCAG2AA",
  "ignore": ["color-contrast"],
  "report": { "format": "html", "out": "a11y-report.html" }
}`}</CodeBlock>
      </section>

      <section aria-labelledby="ci">
        <h2 id="ci" className={styles.h2}>
          Continuous integration
        </h2>
        <p>Fail the build when new violations appear. Example GitHub Action:</p>
        <CodeBlock label="GitHub Action">{`- name: Accessibility check
  run: npx a11y-fixer scan ./dist --fail-on error`}</CodeBlock>
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
