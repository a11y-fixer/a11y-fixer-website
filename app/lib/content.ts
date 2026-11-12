import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// All MDX content lives in /content as flat *.mdx files. Each file's frontmatter
// declares its `type`, which the blog index uses to group posts (e.g. "Guides"
// vs "Comparisons") and which pages can use to show a label.
export type PostType = "guide" | "comparison" | "post";

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string; // ISO (YYYY-MM-DD)
  type: PostType;
  keywords?: string[];
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

function readSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPost(slug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { ...(data as PostFrontmatter), slug, content };
}

// Newest first. Optionally filter by type.
export function getAllPosts(type?: PostType): Post[] {
  return readSlugs()
    .map((slug) => getPost(slug))
    .filter((p): p is Post => p !== null)
    .filter((p) => (type ? p.type === type : true))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const TYPE_LABELS: Record<PostType, string> = {
  guide: "Guide",
  comparison: "Comparison",
  post: "Article",
};
