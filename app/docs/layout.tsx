import styles from "./docs.module.css";

const sections = [
  { href: "#installation", label: "Installation" },
  { href: "#usage", label: "Usage" },
  { href: "#configuration", label: "Configuration" },
  { href: "#ci", label: "Continuous integration" },
  { href: "#fixes", label: "Fix catalog" },
  { href: "#contributing", label: "Contributing" },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`container ${styles.wrap}`}>
      <aside className={styles.sidebar}>
        <nav aria-label="Documentation sections">
          <p className={styles.sidebarTitle}>On this page</p>
          <ul className={styles.sidebarList}>
            {sections.map((s) => (
              <li key={s.href}>
                <a href={s.href}>{s.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <article className={styles.content}>{children}</article>
    </div>
  );
}
