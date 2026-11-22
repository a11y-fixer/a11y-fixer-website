import type { Metadata } from "next";
import TrialForm from "./TrialForm";
import { site } from "../lib/site";
import styles from "./trial.module.css";

export const metadata: Metadata = {
  title: "Start free during early access",
  description:
    "Get a free a11y-fixer license key and run the accessibility GitHub Action on your repositories — free during early access.",
  alternates: { canonical: `${site.url}/trial/` },
};

export default function TrialPage() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h1>Free during early access</h1>
        <p className={styles.lede}>
          Enter your email to get a license key for the{" "}
          <strong>a11y-fixer GitHub Action</strong> — it scans pull requests for
          WCAG violations and proposes AI-assisted fixes. No card required;
          it&rsquo;s free while we&rsquo;re in early access.
        </p>
        <TrialForm />
        <p className={styles.privacyNote}>
          We use your email only to issue your key and send occasional
          early-access updates. See our <a href="/privacy">Privacy Policy</a>.
        </p>
      </div>
    </section>
  );
}
