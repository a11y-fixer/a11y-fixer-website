"use client";

import { useState } from "react";
import CodeBlock from "../components/CodeBlock";
import styles from "./trial.module.css";

interface TrialSuccess {
  token: string;
  expires: number;
  trialDays: number;
}

const SECRET_NAME = "A11Y_FIXER_LICENSE_KEY";

function workflowSnippet(secretName: string): string {
  return `- uses: a11y-fixer/a11y-fixer-pro@v1
  with:
    license-key: \${{ secrets.${secretName} }}`;
}

export default function TrialForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrialSuccess | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setResult(data as TrialSuccess);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const when = new Date(result.expires * 1000).toISOString().slice(0, 10);
    return (
      <div className={styles.result}>
        <h2 className={styles.resultTitle}>Your {result.trialDays}-day trial key</h2>
        <p className={styles.expiry}>Valid until {when}. Keep it secret.</p>

        <p className={styles.step}>
          <strong>1.</strong> Add it as a repository secret named{" "}
          <code>{SECRET_NAME}</code> (Settings → Secrets and variables → Actions):
        </p>
        <CodeBlock label="Your license key" copyable>{result.token}</CodeBlock>

        <p className={styles.step}>
          <strong>2.</strong> Reference it in your workflow:
        </p>
        <CodeBlock label="Workflow usage" copyable>{workflowSnippet(SECRET_NAME)}</CodeBlock>

        <p className={styles.note}>
          Need a fresh key after it expires? Just come back and request another.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="trial-email">
          Work email
        </label>
        <input
          id="trial-email"
          className={styles.input}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-describedby={error ? "trial-error" : undefined}
        />
      </div>

      {/* Honeypot — hidden from humans and assistive tech; bots fill it in. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="trial-company">Company</label>
        <input
          id="trial-company"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <button className={styles.submit} type="submit" disabled={loading}>
        {loading ? "Issuing…" : "Get trial key"}
      </button>

      {error && (
        <p id="trial-error" className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
