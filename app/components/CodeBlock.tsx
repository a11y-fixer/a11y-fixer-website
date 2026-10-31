import styles from "./CodeBlock.module.css";

export default function CodeBlock({
  children,
  label,
}: {
  children: string;
  label?: string;
}) {
  return (
    <figure className={styles.figure}>
      {label && <figcaption className="visually-hidden">{label}</figcaption>}
      <pre className={styles.pre}>
        <code>{children}</code>
      </pre>
    </figure>
  );
}
