<!--
Change-management record (SOC 2 CC8). Keep the checklist; delete these comments.
-->

## What & why

<!-- What does this change do, and why? Link any issue. -->

## How it was tested

<!-- Commands run, manual steps, screenshots. -->

## Checklist

- [ ] `npm run lint`, `npm run test:unit`, and `npm run test:e2e` pass locally (or CI is green)
- [ ] No secrets, keys, tokens, or credentials added to the repo or logs
- [ ] Security-sensitive surfaces reviewed (auth, `app/lib/license.ts`, `app/api/**`, `next.config.mjs`, CI) — N/A if untouched
- [ ] **PII:** if this touches user data (email/IP), retention & deletion still hold (see `SECURITY.md`)
- [ ] New dependencies are necessary and reviewed; `audit-ci` is green (allowlist updated with a reason only if unavoidable)
- [ ] Docs updated if behavior or controls changed (`README.md`, `SECURITY.md`, `docs/compliance/`)
