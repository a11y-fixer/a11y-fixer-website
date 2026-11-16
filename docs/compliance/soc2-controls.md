# SOC 2 control mapping — a11y-fixer website

This maps the SOC 2 Trust Services **Common Criteria** to the concrete controls
that live in *this repository*, plus where the evidence is. It is the single
document that makes the repo legible to an auditor.

> **Status: not yet attested.** a11y-fixer does not hold a SOC 2 report. The
> repo-level controls below are implemented and in effect. A real SOC 2 (Type I
> or Type II) additionally needs the organization-level items in the checklist at
> the bottom — those cannot be satisfied by code and must be owned by whoever
> runs compliance.

## Repo-level controls (implemented)

| Criterion | Control | Where / evidence |
|-----------|---------|------------------|
| **CC6.1** Logical access — least privilege | Admin PII endpoint requires a bearer secret, compared in constant time; fails closed when unset | `app/api/trial/logs/route.ts` |
| **CC6.1** | Baseline security response headers (HSTS, nosniff, frame-deny, referrer, permissions; CSP report-only) | `next.config.mjs` |
| **CC6.1 / CC6.6** Boundary protection | Rate limiting on public + admin endpoints; public mint endpoint **fails closed** in production without the limiter | `app/api/trial/route.ts`, `app/lib/ratelimit.ts` |
| **CC6.5 / P4** Data retention & disposal | Trial PII list is length-capped; authenticated `DELETE` purges by email or wholesale | `app/api/trial/logs/route.ts`, `SECURITY.md` |
| **CC6.1** Key management | Signing key held only in env; rotation procedure documented | `SECURITY.md` → Secret & key management |
| **CC7.2** Monitoring of privileged actions | Structured audit log on every admin read/delete (allow + deny) | `app/api/trial/logs/route.ts` (`trial_logs_access` events) |
| **CC7.1** Vulnerability detection | Dependency audit (`audit-ci`, blocks new high/critical), CodeQL SAST, gitleaks secret scanning | `.github/workflows/security.yml`, `.github/workflows/codeql.yml`, `audit-ci.jsonc` |
| **CC7.1 / CC8.1** Patch management | Dependabot weekly updates (npm + actions) | `.github/dependabot.yml` |
| **CC8.1** Change management | PR-only workflow, required CI gates, code-owner review, PR template with security/PII checklist | `CONTRIBUTING.md`, `.github/CODEOWNERS`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/workflows/test.yml` |
| **CC8.1** Reproducible builds | Pinned `packageManager` + `engines`, committed lockfile | `package.json`, `package-lock.json` |
| **CC2.3** Vulnerability disclosure | Security policy + private reporting channel | `SECURITY.md` |

## Risk acceptance

Known transitive dependency advisories that cannot currently be fixed without a
breaking upgrade (chiefly Next.js 16) are triaged and explicitly accepted, each
with a reason, in [`../../audit-ci.jsonc`](../../audit-ci.jsonc). The audit gate
blocks any *new* high/critical advisory.

## Organization-level checklist (NOT satisfiable in this repo)

These are required for an actual SOC 2 and must be tracked by whoever owns
compliance:

1. **Decide Type I vs Type II.** Type I = controls suitably designed at a point in
   time. Type II = controls operating effectively over an observation period
   (typically 3–12 months of collected evidence).
2. **Written policies:** information security, access control, change management,
   incident response, data retention/deletion, vendor management, business
   continuity / disaster recovery, acceptable use.
3. **Access reviews:** periodic least-privilege review of who can reach Vercel,
   Upstash, GitHub, and the Anthropic API key; MFA enforced; documented
   onboarding/offboarding.
4. **Branch protection (GitHub settings, not in-repo):** require PR review from
   code owners, require the `Tests` / `Security` / `CodeQL` status checks, block
   direct pushes to `main`, optionally require signed commits. Also enable
   **Dependabot alerts** and **secret-scanning push protection** in repo settings
   (the in-repo configs here are the scanning half; the alerts are a toggle).
5. **Vendor / sub-processor management:** obtain and review SOC 2 reports + DPAs
   from Vercel, Upstash, and Anthropic (email + IP transit these); maintain a
   sub-processor list.
6. **Risk assessment & asset inventory**, security-awareness training, and an
   evidence-collection platform (Vanta / Drata / Secureframe) if pursuing a
   formal audit.
7. **Logging retention & alerting at the org level:** ship Vercel logs to a
   retained drain and alert on the `trial_logs_access` audit events emitted by
   the admin endpoint.
