import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import type { AnchorHTMLAttributes } from "react";

// Internal links go through next/link for client-side navigation; external
// links open safely in a new tab.
function Anchor({ href = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  if (isInternal) {
    return <Link href={href} {...props} />;
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
}

export const mdxComponents: MDXComponents = {
  a: Anchor,
};
