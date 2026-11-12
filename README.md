# a11y-fixer website

Marketing + docs site for [a11y-fixer](https://github.com/a11y-fixer). Built with
[Next.js](https://nextjs.org) (App Router) and deployed on **Vercel** at the apex
domain **https://a11y-fixer.com**.

> This is **not** a static export: the trial license-key issuer at
> `app/api/trial` needs a Node server runtime to sign keys, so `output: "export"`
> is intentionally absent from `next.config.mjs`.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
```

## Build

```bash
npm run build
```

## Deploy

The site is hosted on Vercel and deploys automatically on push (preview
deployments for branches, production on `main`).

**Required environment variable:** `LICENSE_SIGNING_KEY` (Ed25519 PKCS8 PEM),
used by `app/lib/license.ts` to sign trial keys. Set it in the Vercel project
settings (see `.env.example`).

**Optional:** `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — the token from your Google
Search Console property, emitted as a verification `<meta>` tag by `app/layout.tsx`.

## SEO & analytics

- Metadata, Open Graph, Twitter cards, canonical URLs, and JSON-LD
  (WebSite + SoftwareApplication + FAQPage) are defined in `app/layout.tsx`,
  with per-page overrides and dynamic OG images.
- `app/sitemap.ts` and `app/robots.ts` generate `/sitemap.xml` and `/robots.txt`;
  the sitemap includes every blog post automatically.
- Traffic is measured with `@vercel/analytics` and `@vercel/speed-insights`
  (mounted in `app/layout.tsx`). See `GROWTH.md` for the content/distribution plan.

## Editing content

- **Marketing/docs copy** lives in `app/` — search for `TODO: confirm` to find
  remaining placeholders:
  - `app/lib/site.ts` — name, tagline, description, repo URL, install command
  - `app/page.tsx` — hero, feature cards, FAQ
  - `app/docs/page.tsx` — documentation
- **Blog & guides** are MDX files in `content/*.mdx`. Each file's frontmatter
  (`title`, `description`, `date`, `type`, `keywords`) drives the `/blog` index,
  per-post metadata, and the sitemap. Add a file to publish a post.
