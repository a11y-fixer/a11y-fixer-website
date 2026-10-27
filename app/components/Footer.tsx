import Link from "next/link";
import { site } from "../lib/site";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.copy}>
          {site.name} is free and open source, released under the MIT license.
        </p>
        <nav aria-label="Footer">
          <ul className={styles.links}>
            <li>
              <Link href="/docs">Documentation</Link>
            </li>
            <li>
              <a href={site.repoUrl} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a
                href={`${site.repoUrl}/issues`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Report an issue
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contactEmail}`}>Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
