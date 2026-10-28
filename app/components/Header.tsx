import Link from "next/link";
import { site } from "../lib/site";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" aria-hidden="true" width="28" height="28" />
          {site.name}
        </Link>
        <nav aria-label="Primary">
          <ul className={styles.nav}>
            <li>
              <Link href="/#features">Features</Link>
            </li>
            <li>
              <Link href="/docs">Docs</Link>
            </li>
            <li>
              <a href={site.repoUrl} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
