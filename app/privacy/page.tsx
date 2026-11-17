import type { Metadata } from "next";
import { site } from "../lib/site";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How a11y-fixer handles the data you share — the email and IP collected when you request a free early-access license key, and how to have it deleted.",
  alternates: { canonical: `${site.url}/privacy/` },
};

export default function PrivacyPage() {
  return (
    <section className={styles.section}>
      <div className="container">
        <h1>Privacy Policy</h1>
        <p className={styles.lede}>
          {site.name} is open source and we keep data collection to a minimum.
          This page explains exactly what we collect, why, and how to have it
          removed.
        </p>

        <div className={styles.content}>
          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Your email address</strong> — when you request a free
              early-access license key on the{" "}
              <a href="/trial">Get it free</a> page. It is stored in our
              hosting provider&rsquo;s Redis datastore (Upstash) and is also
              embedded as the subject (<code>sub</code>) of the signed license
              key you receive.
            </li>
            <li>
              <strong>Your IP address</strong> — recorded alongside the key
              request and used only for rate-limiting and abuse prevention.
            </li>
            <li>
              <strong>Aggregate traffic and performance metrics</strong> — via
              Vercel Analytics and Speed Insights. These are anonymous and are
              not tied to your identity.
            </li>
          </ul>

          <h2>How we use it</h2>
          <p>
            We use your email to issue your license key and to send occasional
            updates about early access. We use your IP solely to protect the
            key-issuing endpoint from abuse. We do not sell your data or share
            it with third parties beyond the infrastructure providers (Vercel,
            Upstash) needed to run this service.
          </p>

          <h2>Retention</h2>
          <p>
            Key-request records (email and IP) are kept in a capped list that
            retains only the most recent 5,000 entries; older records are
            dropped automatically. The license key itself is self-contained and
            not stored after issuance.
          </p>

          <h2>Deleting your data</h2>
          <p>
            You can ask us to delete the email and IP we hold for you at any
            time. Email{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> and
            we will remove your records.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy? Reach us at{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
