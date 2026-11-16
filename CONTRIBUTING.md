# Contributing

## Development

```bash
npm ci
npm run dev           # local dev server
npm run lint
npm run test:unit     # Vitest
npm run test:e2e      # Playwright + axe
```

Node 20 is the supported version (`engines` in `package.json`); use npm (the
lockfile is `package-lock.json`).

## Change-management workflow (SOC 2 CC8)

All changes reach production the same way, so every change is reviewed and
traceable:

1. **Branch** off `main` — never commit to `main` directly.
2. **Open a PR.** Fill in the PR template, including the security/PII checklist.
3. **CI must pass.** The `Tests`, `Security`, and `CodeQL` workflows run on every
   PR (lint, unit, e2e/a11y, dependency audit, secret scan, SAST).
4. **Review.** PRs touching security-sensitive paths require review from the code
   owner (`.github/CODEOWNERS`).
5. **Merge to `main`** triggers the Vercel production deploy.

## Security

Never commit secrets — `.env*` and `*.pem` are gitignored and CI scans for leaks.
To report a vulnerability, see [`SECURITY.md`](SECURITY.md). For how our controls
map to SOC 2, see [`docs/compliance/soc2-controls.md`](docs/compliance/soc2-controls.md).
