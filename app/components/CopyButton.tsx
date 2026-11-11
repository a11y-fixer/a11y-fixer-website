"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CodeBlock.module.css";

export default function CopyButton({
  value,
  label,
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [supported, setSupported] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSupported(
      typeof navigator !== "undefined" && !!navigator.clipboard,
    );
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (!supported) return null;

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write failed (permissions) — leave the button unchanged.
    }
  }

  return (
    <button
      type="button"
      className={`${styles.copyBtn} ${copied ? styles.copied : ""}`}
      onClick={onCopy}
      aria-label={copied ? "Copied" : `Copy ${label ?? "to clipboard"}`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
