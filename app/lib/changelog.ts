// Release notes for a11y-fixer. Entries are maintained here as structured data
// (not freeform prose) so the /changelog page and any JSON-LD render
// consistently. Keep newest entries at the top of `entries`; getChangelog()
// sorts defensively by date regardless.
//
// Each entry describes a real, shipped milestone. Avoid fabricated version
// numbers — `version` is optional and should only be set when there is a real
// published version to point at.

export type ChangeCategory = "added" | "changed" | "fixed";

export interface ChangelogEntry {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** Short headline for the release. */
  title: string;
  /** Optional published version label (e.g. a CLI semver), when one exists. */
  version?: string;
  changes: { category: ChangeCategory; items: string[] }[];
}

export const CATEGORY_LABELS: Record<ChangeCategory, string> = {
  added: "Added",
  changed: "Changed",
  fixed: "Fixed",
};

// Newest first. Derived from documented, shipped capabilities.
const entries: ChangelogEntry[] = [
  {
    date: "2026-11-15",
    title: "Free during early access",
    changes: [
      {
        category: "changed",
        items: [
          "The AI-assisted GitHub Action is now free for every repository during early access — a trial license key is all you need.",
        ],
      },
      {
        category: "added",
        items: [
          "Self-serve trial license keys: request a key by email and start running the Action in minutes.",
        ],
      },
    ],
  },
  {
    date: "2026-11-13",
    title: "AI-assisted fixes in CI",
    changes: [
      {
        category: "added",
        items: [
          "GitHub Action that reviews pull requests and proposes accessibility fixes for judgment calls — alt text, button and form labels, and vague link text — using your choice of Anthropic, OpenAI, or Google models.",
          "Every AI-assisted change is proposed as a pull request, so nothing lands without human review.",
        ],
      },
    ],
  },
  {
    date: "2026-10-25",
    title: "a11y-fixer early access launch",
    changes: [
      {
        category: "added",
        items: [
          "Open-source (MIT) CLI that scans web pages and source for WCAG 2.2 violations and applies safe, deterministic auto-fixes — no AI required.",
          "Scans React/JSX and HTML source by default, or the rendered DOM of any running URL.",
          "Conservative automatic fixes for document language, color contrast, tabindex, heading order, and list structure.",
          "Runs locally or in CI, with a baseline file to track and ratchet down existing violations.",
        ],
      },
    ],
  },
];

export function getChangelog(): ChangelogEntry[] {
  return [...entries].sort((a, b) => (a.date < b.date ? 1 : -1));
}
