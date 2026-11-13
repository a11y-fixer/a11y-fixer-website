import { describe, expect, it } from "vitest";
import { getAllPosts, TYPE_LABELS } from "../../app/lib/content";

// Runs from the repo root, so getAllPosts() reads process.cwd()/content.
describe("getAllPosts", () => {
  const posts = getAllPosts();

  it("reads every .mdx file in content/", () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it("parses frontmatter into complete posts", () => {
    for (const post of posts) {
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.description).toBeTruthy();
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(TYPE_LABELS[post.type]).toBeTruthy();
    }
  });

  it("sorts posts newest first", () => {
    const dates = posts.map((p) => p.date);
    const sorted = [...dates].sort((a, b) => (a < b ? 1 : -1));
    expect(dates).toEqual(sorted);
  });

  it("filters by type", () => {
    const comparisons = getAllPosts("comparison");
    expect(comparisons.every((p) => p.type === "comparison")).toBe(true);
  });
});
