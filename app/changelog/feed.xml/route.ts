import { CATEGORY_LABELS, getChangelog } from "../../lib/changelog";
import { site } from "../../lib/site";

export const dynamic = "force-static";

// Atom 1.0 feed for the changelog, generated at build time from the same
// structured data that powers /changelog. Served at /changelog/feed.xml.

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Stable, location-independent entry id (RFC 4151 tag URI).
function entryId(date: string, title: string): string {
  const host = new URL(site.url).host;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `tag:${host},${date}:changelog/${slug}`;
}

export function GET(): Response {
  const entries = getChangelog();
  const changelogUrl = `${site.url}/changelog/`;
  const feedUrl = `${site.url}/changelog/feed.xml`;
  const updated = entries.length
    ? new Date(entries[0].date).toISOString()
    : new Date().toISOString();

  const entryXml = entries
    .map((entry) => {
      const summary = entry.changes
        .map((group) => {
          const items = group.items
            .map((item) => `<li>${escapeXml(item)}</li>`)
            .join("");
          return `<h3>${escapeXml(CATEGORY_LABELS[group.category])}</h3><ul>${items}</ul>`;
        })
        .join("");

      return `  <entry>
    <title>${escapeXml(entry.title)}</title>
    <id>${escapeXml(entryId(entry.date, entry.title))}</id>
    <link href="${escapeXml(changelogUrl)}"/>
    <updated>${new Date(entry.date).toISOString()}</updated>
    <content type="html">${escapeXml(summary)}</content>
  </entry>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(`${site.name} changelog`)}</title>
  <subtitle>${escapeXml(`Release notes for ${site.name}.`)}</subtitle>
  <id>${escapeXml(changelogUrl)}</id>
  <link href="${escapeXml(changelogUrl)}"/>
  <link rel="self" type="application/atom+xml" href="${escapeXml(feedUrl)}"/>
  <updated>${updated}</updated>
  <author>
    <name>${escapeXml(site.name)}</name>
  </author>
${entryXml}
</feed>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
