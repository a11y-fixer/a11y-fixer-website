import type { Metadata } from "next";
import TrialForm from "./TrialForm";
import { site } from "../lib/site";
import styles from "./trial.module.css";

export const metadata: Metadata = {
  title: "Start a free 14-day trial",
  description:
    "Get a free 14-day a11y-fixer-pro license key and run the accessibility GitHub Action on your repositories.",
  alternates: { canonical: `${site.url}/trial/` },
};

export default function TrialPage() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h1>Start a free 14-day trial</h1>
        <p className={styles.lede}>
          Enter your email to get a license key for{" "}
          <strong>a11y-fixer-pro</strong> — the GitHub Action that scans pull
          requests for WCAG violations and proposes AI-assisted fixes. No card
          required; the key works for 14 days.
        </p>
        <TrialForm />
      </div>
    </section>
  );
}
