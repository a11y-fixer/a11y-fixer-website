import type { Metadata } from "next";
import TrialForm from "./TrialForm";
import { site } from "../lib/site";
import styles from "./trial.module.css";

export const metadata: Metadata = {
  title: "Start free during early access",
  description:
    "Get a free a11y-fixer-pro license key and run the accessibility GitHub Action on your repositories — free during early access.",
  alternates: { canonical: `${site.url}/trial/` },
};

export default function TrialPage() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h1>Free during early access</h1>
        <p className={styles.lede}>
          Enter your email to get a license key for{" "}
          <strong>a11y-fixer-pro</strong> — the GitHub Action that scans pull
          requests for WCAG violations and proposes AI-assisted fixes. No card
          required; it&rsquo;s free while we&rsquo;re in early access.
        </p>
        <TrialForm />
      </div>
    </section>
  );
}
