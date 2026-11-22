import type { Metadata } from "next";
import CodeBlock from "../components/CodeBlock";
import { site } from "../lib/site";
import styles from "./docs.module.css";

export const metadata: Metadata = {
  title: "Documentation",
  description: `${site.name} documentation: install the CLI, scan source and live pages for WCAG violations, apply automated fixes, set a CI baseline, and gate pull requests.`,
  alternates: {
    canonical: "/docs",
  },
};

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
          Point <code>scan</code> at your source directory (React/JSX by
          default), at HTML with <code>--html</code>, at Markdown with{" "}
          <code>--markdown</code>, or at a live page with <code>--url</code>:
        </p>
        <CodeBlock label="Basic usage">{`# Scan your JSX/TSX source
a11y-fixer scan ./src

# Scan a live page with axe-core
a11y-fixer scan ./src --url https://example.com

# Scan HTML files, or Markdown files
a11y-fixer scan ./public --html
a11y-fixer scan ./docs --markdown

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
          <code>.htm</code> files with axe-core, <code>--markdown</code> to scan{" "}
          <code>.md</code>/<code>.markdown</code> files,{" "}
          <code>--url &lt;url&gt;</code> to scan a live page, and{" "}
          <code>--concurrency &lt;n&gt;</code>. <code>fix</code> can open an
          annotated pull request with <code>--owner</code>, <code>--repo</code>,
          and <code>--base</code>, and stamp a page language with{" "}
          <code>--lang &lt;tag&gt;</code>.
        </p>
      </section>

      <section aria-labelledby="baseline">
        <h2 id="baseline" className={styles.h2}>
          Baseline mode
        </h2>
        <p>
          On an existing codebase you rarely want CI to fail on every
          pre-existing violation. Record a baseline once, then have{" "}
          <code>check</code> fail only on <strong>new</strong> violations:
        </p>
        <CodeBlock label="Baseline">{`# Record the current violations as the accepted baseline
a11y-fixer check ./src --baseline --update-baseline

# In CI: pass unless a NEW violation appears
a11y-fixer check ./src --baseline`}</CodeBlock>
        <p>
          The baseline is written to <code>.a11y-baseline.json</code> (override
          the path with <code>--baseline &lt;file&gt;</code>). Commit it so the
          whole team shares the same accepted set, then burn it down over time.
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
          <a href="#github-action">a11y-fixer GitHub Action</a> below.
        </p>
      </section>

      <section aria-labelledby="github-action">
        <h2 id="github-action" className={styles.h2}>
          GitHub Action
        </h2>
        <p>
          The <strong>a11y-fixer GitHub Action</strong> runs a11y-fixer on every
          pull request. It has three modes:
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
            Add an AI provider key to enable{" "}
            <a href="#ai-fixes">AI-assisted fixes</a>.
          </li>
        </ul>
        <p>
          A <code>fix</code> run commits to a timestamped branch and opens a pull
          request summarizing the fixes — it never pushes to your base branch, so
          every change is reviewed before it lands. Example workflow:
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
      - uses: a11y-fixer/a11y-fixer@v1
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
            <code>license-key</code> — free for every repo, public or private,
            during early access. <a href="/trial">Grab a free key</a> and add it
            as a repository secret.
          </li>
          <li>
            <code>mode</code> — <code>check</code> (default), <code>scan</code>, or{" "}
            <code>fix</code>.
          </li>
          <li>
            <code>dir</code> — directory to scan (default <code>.</code>).
          </li>
          <li>
            <code>ai-provider</code> — <code>anthropic</code> (default),{" "}
            <code>openai</code>, or <code>google</code>; enables AI-assisted
            fixes in <code>fix</code> mode.
          </li>
          <li>
            <code>ai-api-key</code> — the key for the chosen provider.{" "}
            <code>anthropic-api-key</code> is a shortcut that also selects the
            Anthropic provider.
          </li>
          <li>
            <code>ai-model</code> (optional) — override the model; defaults to a
            fast, low-cost model for the provider.
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
            <code>url</code> — scan a live page with axe-core.{" "}
            <code>html</code> — scan static <code>.html</code>/<code>.htm</code>{" "}
            files. <code>markdown</code> — scan <code>.md</code>/
            <code>.markdown</code> files.
          </li>
          <li>
            <code>cookies</code> — JSON array of cookies (each with{" "}
            <code>name</code>, <code>value</code>, <code>domain</code>) for
            scanning authenticated URLs.
          </li>
          <li>
            <code>cache-file</code> — path to a cross-run cache of AI responses,
            to cut repeat cost. <code>learning</code> — <code>on</code> (default)
            records your accepted fixes as examples for future runs;{" "}
            <code>off</code> disables it.
          </li>
        </ul>
        <p>
          Outputs: <code>pr-url</code>, <code>fixes-applied</code>,{" "}
          <code>fixes-reverted</code>, <code>regressions-detected</code>,{" "}
          <code>violations-before</code>, <code>violations-after</code>, and{" "}
          <code>violations</code> (the full JSON report). Before committing, a{" "}
          <code>fix</code> run re-scans to verify each change and reverts any that
          introduces a regression.
        </p>
      </section>

      <section aria-labelledby="ai-fixes">
        <h2 id="ai-fixes" className={styles.h2}>
          AI-assisted fixes
        </h2>
        <p>
          Some accessibility issues can&apos;t be repaired by a deterministic
          rule — they need a judgment call about what the content means. When you
          run the Action in <code>mode: fix</code> with an AI provider key
          (Anthropic, OpenAI, or Google via <code>ai-provider</code>),
          a11y-fixer uses an LLM to propose those fixes:
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
          the GitHub Action.
        </p>
      </section>

      <section aria-labelledby="fixes">
        <h2 id="fixes" className={styles.h2}>
          Fix catalog
        </h2>
        <p>
          The free CLI applies <strong>deterministic, rule-based</strong> fixes —
          no AI, no network:
        </p>
        <ul>
          <li>Missing or invalid document language (<code>lang</code>)</li>
          <li>Insufficient color contrast</li>
          <li>Problematic <code>tabindex</code> values</li>
          <li>
            Meta refresh redirects, heading-order jumps, and broken list
            structure
          </li>
          <li>Auto-fixable <code>jsx-a11y</code> lint rules</li>
          <li>
            Markdown: heading order and empty table headers (with{" "}
            <code>--markdown</code>)
          </li>
        </ul>
        <p>
          The GitHub Action adds <a href="#ai-fixes">AI-assisted fixes</a> for
          issues that need judgment — image alt text, form-control labels, and
          button and link names.
        </p>
        <p>
          Everything else — redundant or invalid ARIA, missing landmark regions,
          keyboard and focus-order issues, and more — is{" "}
          <strong>detected and reported</strong> for a human to resolve rather
          than changed automatically.
        </p>
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
