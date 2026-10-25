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
export and publishes it to GitHub Pages at **https://a11y-fixer.github.io/website/**.

**One-time setup:** in the repo on GitHub, go to **Settings → Pages → Build and
deployment → Source** and choose **GitHub Actions**.

## Notes

- Because the site is served from the `/website/` subpath, `next.config.mjs` sets
  `basePath`/`assetPrefix` to `/website` in production builds only (local dev stays at `/`).
- To use a **custom domain** instead: set `basePath`/`assetPrefix` back to empty in
  `next.config.mjs` and add a `public/CNAME` file containing the domain.

## Editing content

Site copy lives in a few obvious places — search for `TODO: confirm` to find
placeholders that should be replaced with real a11y-fixer details:

- `app/lib/site.ts` — name, tagline, description, repo URL, install command
- `app/page.tsx` — hero and feature cards
- `app/docs/page.tsx` — documentation
