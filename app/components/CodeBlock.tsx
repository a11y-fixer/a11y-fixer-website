import styles from "./CodeBlock.module.css";
import CopyButton from "./CopyButton";

export default function CodeBlock({
  children,
  label,
  copyable,
}: {
  children: string;
  label?: string;
  copyable?: boolean;
}) {
  return (
    <figure className={styles.figure}>
      {label && <figcaption className="visually-hidden">{label}</figcaption>}
      {copyable && <CopyButton value={children} label={label} />}
      <pre className={styles.pre}>
        <code>{children}</code>
      </pre>
    </figure>
  );
}
