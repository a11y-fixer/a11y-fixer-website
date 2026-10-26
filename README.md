# a11y-fixer website

Marketing + docs site for [a11y-fixer](https://github.com/a11y-fixer). Built with
[Next.js](https://nextjs.org) (App Router) and deployed as a static site to GitHub Pages.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
```

## Build

```bash
npm run build   # static export written to ./out
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the static
export and publishes it to GitHub Pages at the custom domain **https://a11y-fixer.com**.

**One-time setup:** in the repo on GitHub, go to **Settings → Pages → Build and
deployment → Source** and choose **GitHub Actions**.

## Notes

- The site is served from the apex domain `a11y-fixer.com`, configured via
  `public/CNAME`. Because it lives at the root, `next.config.mjs` sets no
  `basePath`/`assetPrefix`.
- DNS is managed in Cloudflare: apex `A`/`AAAA` records point at GitHub Pages
  (or a CNAME-flattened record to `a11y-fixer.github.io`). Keep the records
  **DNS-only** (not proxied) so GitHub can provision the TLS certificate.

## Editing content

Site copy lives in a few obvious places — search for `TODO: confirm` to find
placeholders that should be replaced with real a11y-fixer details:

- `app/lib/site.ts` — name, tagline, description, repo URL, install command
- `app/page.tsx` — hero and feature cards
- `app/docs/page.tsx` — documentation
