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
        <p>
          The free CLI makes a simple CI gate: run <code>check</code> in any
          workflow and fail the build when violations appear.
        </p>
        <CodeBlock label="CLI gate">{`- name: Accessibility check
  run: npx @a11y-fixer/cli check ./src`}</CodeBlock>
        <p>
          For a managed setup that also opens pull requests with fixes — and uses
          AI for the issues that need judgment — use the{" "}
          <a href="#github-action">a11y-fixer-pro GitHub Action</a> below.
        </p>
      </section>

      <section aria-labelledby="github-action">
        <h2 id="github-action" className={styles.h2}>
          GitHub Action (a11y-fixer-pro)
        </h2>
        <p>
          <strong>a11y-fixer-pro</strong> is a GitHub Action that runs a11y-fixer
          on every pull request. It has three modes:
        </p>
        <ul>
          <li>
            <code>check</code> (default) — scan and <strong>fail the job</strong>{" "}
            if any violations are found. A drop-in CI gate.
          </li>
          <li>
            <code>scan</code> — scan and report violations as a JSON output,
            without failing the job.
          </li>
          <li>
            <code>fix</code> — apply fixes to your source and open a{" "}
            <strong>pull request</strong> with an annotated before/after summary.
            Add an Anthropic API key to enable{" "}
            <a href="#ai-fixes">AI-assisted fixes</a>.
          </li>
        </ul>
        <p>
          A <code>fix</code> run commits to a new branch
          (<code>a11y-fixer/&lt;timestamp&gt;</code>) and opens a PR titled{" "}
          <code>a11y-fixer: fix N accessibility violation(s)</code> — it never
          pushes to your base branch, so every change is reviewed before it
          lands. Example workflow:
        </p>
        <CodeBlock label="GitHub Action workflow">{`name: Accessibility
on: pull_request

jobs:
  a11y-fix:
    runs-on: ubuntu-latest
    permissions:
      contents: write        # push the fix branch
      pull-requests: write   # open the PR
    steps:
      - uses: actions/checkout@v4
      - uses: a11y-fixer/a11y-fixer-pro@v1
        with:
          mode: fix
          dir: ./src
          license-key: \${{ secrets.A11Y_FIXER_LICENSE_KEY }}
          anthropic-api-key: \${{ secrets.ANTHROPIC_API_KEY }}
          github-token: \${{ secrets.GITHUB_TOKEN }}`}</CodeBlock>
        <p>
          <code>fix</code> mode needs{" "}
          <code>permissions: contents: write</code> and{" "}
          <code>pull-requests: write</code> so the Action can push its branch and
          open the PR.
        </p>
        <h3 className={styles.h3}>Inputs</h3>
        <ul>
          <li>
            <code>license-key</code> (required) — your a11y-fixer-pro key, stored
            as a repository secret. <a href="/trial">Start a free trial</a> to get
            one.
          </li>
          <li>
            <code>mode</code> — <code>check</code> (default), <code>scan</code>, or{" "}
            <code>fix</code>.
          </li>
          <li>
            <code>dir</code> — directory to scan (default <code>.</code>).
          </li>
          <li>
            <code>anthropic-api-key</code> (optional) — enables AI-assisted fixes
            in <code>fix</code> mode.
          </li>
          <li>
            <code>github-token</code> — defaults to{" "}
            <code>{"${{ github.token }}"}</code>; used by <code>fix</code> mode to
            open the PR.
          </li>
          <li>
            <code>base-branch</code> — base branch for the fix PR (default{" "}
            <code>main</code>).
          </li>
          <li>
            <code>url</code> — scan a live page with axe-core (
            <code>check</code>/<code>scan</code> only). <code>html</code> —{" "}
            scan static <code>.html</code>/<code>.htm</code> files.
          </li>
        </ul>
        <p>
          Outputs include <code>pr-url</code>, <code>fixes-applied</code>, and{" "}
          <code>violations-before</code>/<code>violations-after</code>.
        </p>
      </section>

      <section aria-labelledby="ai-fixes">
        <h2 id="ai-fixes" className={styles.h2}>
          AI-assisted fixes
        </h2>
        <p>
          Some accessibility issues can&apos;t be repaired by a deterministic
          rule — they need a judgment call about what the content means. When you
          run the a11y-fixer-pro Action in <code>mode: fix</code> with an{" "}
          <code>anthropic-api-key</code>, a11y-fixer uses Claude (the fast{" "}
          <code>claude-haiku-4-5</code> model) to propose those fixes:
        </p>
        <ul>
          <li>
            <strong>Image alt text</strong> (WCAG 1.1.1) — generates a concise{" "}
            <code>alt</code> description from the surrounding code.
          </li>
          <li>
            <strong>Icon-only button names</strong> (WCAG 4.1.2) — adds an{" "}
            <code>aria-label</code> to buttons with no accessible name.
          </li>
          <li>
            <strong>Form control names</strong> (WCAG 1.3.1) — adds an{" "}
            <code>aria-label</code> to inputs, selects, and textareas missing a
            label.
          </li>
          <li>
            <strong>Generic link text</strong> (WCAG 2.4.4) — rewrites vague links
            like &ldquo;click here&rdquo; or &ldquo;read more&rdquo; into
            descriptive text.
          </li>
        </ul>
        <p>
          Every AI change is proposed in a pull request for a human to review — it
          is never pushed to your base branch. Anything the model isn&apos;t
          confident it can safely change (for example, non-generic link text) is{" "}
          <strong>flagged for manual review</strong> with a note rather than
          edited. If no Anthropic key is provided, those issues are simply
          reported for you to handle.
        </p>
        <p>
          The free, MIT-licensed <code>@a11y-fixer/cli</code> stays fully
          deterministic and uses no AI: it applies only safe, rule-based fixes and
          reports the rest for human review. AI-assisted fixes are a feature of
          a11y-fixer-pro.
        </p>
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
