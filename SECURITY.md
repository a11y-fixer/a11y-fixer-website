# Security Policy

This document describes how we handle security for the a11y-fixer.com website and
the data it processes. It is also the human-readable half of our SOC 2-aligned
control set — see [`docs/compliance/soc2-controls.md`](docs/compliance/soc2-controls.md)
for the control-to-evidence mapping.

> **Note on SOC 2.** a11y-fixer does not currently hold a SOC 2 attestation. The
> controls described here are real and in effect, but a formal SOC 2 report also
> requires organization-level policies, access reviews, and an audit period. See
> the org checklist in the compliance doc.

## Reporting a vulnerability

Please report security issues privately — **do not open a public issue.**

1. **Preferred:** GitHub private vulnerability reporting — the **"Report a
   vulnerability"** button under this repository's **Security** tab.
2. **Email:** `security@a11y-fixer.com`.

Please include steps to reproduce, affected URL/endpoint, and impact. We aim to
acknowledge within 3 business days and to provide a remediation timeline after
triage. We do not currently run a paid bug-bounty program.

## Supported versions

Only the currently deployed production site (the `main` branch, served from
`a11y-fixer.com`) is supported. There are no maintained older releases.

## Data we handle

| Data | Where | Purpose | Retention |
|------|-------|---------|-----------|
| Email address (trial signup) | Upstash Redis (`trials` list) + embedded as `sub` in the signed trial token | Issue a free early-access license key | Capped list (most-recent 5,000 records); deletable on request — see below |
| Client IP (trial signup) | Upstash Redis (`trials` list) | Rate-limiting / abuse signal | Same as above |
| Visitor telemetry | Vercel Analytics + Speed Insights | Aggregate traffic/perf metrics | Per Vercel's retention |

No passwords, no accounts, no cookies, no third-party trackers beyond Vercel
Analytics/Speed Insights.

### Data-subject deletion

To delete trial PII for a given email, an operator calls the authenticated admin
endpoint:

```
DELETE /api/trial/logs?email=<address>     # removes matching records
DELETE /api/trial/logs                      # clears all trial records
```

Both require the `ADMIN_SECRET` bearer token and every call is audit-logged.

## Secret & key management

- **No secrets in source.** `.env*` and `*.pem` are gitignored; CI enforces this
  with gitleaks secret scanning (`.github/workflows/security.yml`).
- Secrets are provided as environment variables (Vercel project settings):
  - `LICENSE_SIGNING_KEY` — Ed25519 PKCS8 private key that signs trial tokens.
  - `KV_REST_API_URL` / `KV_REST_API_TOKEN` — Upstash Redis.
  - `ADMIN_SECRET` — bearer token for the admin logs/delete endpoint. Compared in
    constant time (`crypto.timingSafeEqual`).
- **Signing-key rotation.** Trial tokens are valid for 365 days and are verified
  by the a11y-fixer-pro GitHub Action against the embedded public key. Rotating
  `LICENSE_SIGNING_KEY` today would invalidate all live tokens, because the token
  format carries no key id. **Before rotating in anger**, add a `kid` to the
  token payload and teach the verifier to accept multiple public keys, then
  rotate. Store only the current private key in the Vercel env; never commit it.

## Application controls in effect

- **Security response headers** on all routes (HSTS, `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`; CSP in report-only
  mode) — `next.config.mjs`.
- **Rate limiting** on the public trial endpoint; **fails closed** in production
  if the limiter backend is unconfigured — `app/api/trial/route.ts`.
- **Constant-time admin auth**, admin-endpoint rate limiting, and **audit
  logging** of every admin access — `app/api/trial/logs/route.ts`.
- **Dependency, secret, and SAST scanning** in CI (Dependabot, `audit-ci`,
  gitleaks, CodeQL). Dependency updates land weekly via Dependabot.
