import styles from "./CodeBlock.module.css";

export default function CodeBlock({
  children,
  label,
}: {
  children: string;
  label?: string;
}) {
  return (
    <pre className={styles.pre} aria-label={label}>
      <code>{children}</code>
    </pre>
  );
}
