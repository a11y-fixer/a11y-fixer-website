import type { Metadata } from "next";
import { site } from "../lib/site";
import styles from "../privacy/privacy.module.css";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing use of a11y-fixer — the open-source CLI, the GitHub Action, and the hosted GitHub App.",
  alternates: { canonical: `${site.url}/terms/` },
};

export default function TermsPage() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h1>Terms of Service</h1>
        <p className={styles.lede}>
          These terms govern your use of {site.name}, including the CLI, the
          GitHub Action, and the hosted GitHub App. By installing or using the
          service you agree to them.
        </p>
        <p className={styles.updated}>Last updated November 21, 2026.</p>

        <div className={styles.content}>
          <h2>The service</h2>
          <p>
            {site.name} detects accessibility violations in your code and
            rendered pages and, in fix mode, proposes automated corrections. It
            is provided to help you improve accessibility; it does not guarantee
            conformance with any legal standard, including the WCAG or the ADA.
            You remain responsible for reviewing and testing every change before
            you ship it.
          </p>

          <h2>Licensing and pricing</h2>
          <p>
            The core engine and CLI are open source under the MIT license. The
            AI-assisted fixers and the GitHub Action are source-available under
            the Business Source License 1.1. {site.name} is currently{" "}
            <strong>free for all public and private repositories</strong>, with
            a valid license key issued to every installation. We may introduce
            paid tiers in the future, with notice, for features beyond the free
            tier.
          </p>

          <h2>Your API keys and tokens</h2>
          <p>
            AI-assisted fixes require your own LLM provider API key (Anthropic,
            OpenAI, or Google). You are responsible for the use, cost, and terms
            of any third-party API keys or GitHub tokens you supply.{" "}
            {site.name} masks these in logs and does not persist them.
          </p>

          <h2>Acceptable use</h2>
          <p>
            Do not use {site.name} to violate the law, infringe others&rsquo;
            rights, or attempt to circumvent its license gating or forge license
            keys. We may suspend access that threatens the security or integrity
            of the service.
          </p>

          <h2>No warranty; limitation of liability</h2>
          <p>
            The service is provided &ldquo;as is,&rdquo; without warranties of
            any kind, to the fullest extent permitted by law. {site.name} and
            its maintainers are not liable for any indirect, incidental, or
            consequential damages, or for any accessibility, legal, or
            compliance outcome arising from your use of the service.
          </p>

          <h2>Changes and contact</h2>
          <p>
            We may update these terms; material changes will be reflected by the
            date above. Questions? Email{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> or
            open an issue on <a href={site.repoUrl}>GitHub</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
