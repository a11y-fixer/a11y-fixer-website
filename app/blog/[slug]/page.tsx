import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost, TYPE_LABELS } from "../../lib/content";
import { site } from "../../lib/site";
import { mdxComponents } from "./mdx-components";
import styles from "./post.module.css";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const canonical = `/blog/${post.slug}/`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${site.url}${canonical}`,
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${site.url}/blog/${post.slug}/`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        mainEntityOfPage: url,
        author: { "@type": "Organization", name: site.name, url: site.url },
        publisher: { "@type": "Organization", name: site.name, url: site.url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog/` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className={styles.article}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/blog/">Blog</Link>
          <span aria-hidden="true"> / </span>
          <span>{TYPE_LABELS[post.type]}</span>
        </nav>
        <header className={styles.header}>
          <h1 className={styles.h1}>{post.title}</h1>
          <p className={styles.meta}>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </p>
        </header>
        <div className={styles.prose}>
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
        <aside className={styles.cta}>
          <p>
            Catch these issues automatically. Install {site.name}:{" "}
            <code>{site.installCommand}</code>, or{" "}
            <Link href="/trial/">start a free 14-day trial</Link> of the
            a11y-fixer-pro GitHub Action.
          </p>
        </aside>
      </article>
    </div>
  );
}
