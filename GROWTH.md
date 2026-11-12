# Growth & SEO playbook

The site now has the technical SEO and a content engine in place. Rankings and
traction also need **external signals** and **distribution**. This is the
off-site checklist — most of it lives outside this repo.

## 1. Measurement (do this first)

- [ ] Verify the domain in **Google Search Console** (https://search.google.com/search-console).
      Add the token to `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel, redeploy,
      then submit `https://a11y-fixer.com/sitemap.xml`.
- [ ] Optionally add **Bing Webmaster Tools** (imports from GSC in one click).
- [ ] Confirm **Vercel Analytics** and **Speed Insights** are enabled in the
      Vercel project dashboard (code is already wired in `app/layout.tsx`).
- [ ] Validate structured data with Google's **Rich Results Test** for `/`,
      `/docs/`, and a `/blog/[slug]/` page.

## 2. On-site content cadence

The engine is seeded with 5 fix guides + 3 comparison pages. Keep publishing —
fresh, specific, developer-intent content is what compounds.

- [ ] One new guide or comparison per week/fortnight (add an MDX file to `content/`).
- Target ideas (each maps to real search demand):
  - "How to fix [specific axe rule]" for the long tail
  - "a11y-fixer vs WAVE", "vs Accessibility Insights", "vs Siteimprove"
  - "Accessibility checklist for [React / Next.js / Vue] apps"
  - "WCAG 2.2 AA: a developer's checklist"
  - "How to add accessibility testing to a GitHub Actions pipeline"
- [ ] Interlink: every new post should link to `/docs/`, `/trial/`, and 1–2 sibling posts.

## 3. Backlinks & external signals

- [ ] **npm README** for the `a11y-fixer` package: link to `https://a11y-fixer.com`
      and the most relevant guides. npm pages rank well and drive qualified traffic.
- [ ] **GitHub repo**: set topics (`accessibility`, `a11y`, `wcag`, `cli`,
      `automated-testing`), put the site link at the top of the README, and pin a
      "Getting started" guide.
- [ ] Submit to directories/lists: `awesome-a11y`, `awesome-accessibility`,
      accessibility tool roundups, AlternativeTo, and relevant Product Hunt collections.
- [ ] Guest posts / mentions on dev.to, CSS-Tricks-style blogs, and accessibility
      newsletters (A11y Weekly, Smashing).

## 4. Launch & distribution

- [ ] **Show HN** ("Show HN: a11y-fixer – scan and auto-fix WCAG issues from the CLI").
- [ ] **Product Hunt** launch with the OG image and a short demo GIF.
- [ ] **dev.to / Hashnode**: cross-post the seed guides with a `canonical_url`
      pointing back to the site (so you get referral traffic without duplicate-content penalty).
- [ ] **Reddit**: r/webdev, r/accessibility, r/javascript (lead with value, not a pitch).
- [ ] **Social**: thread per guide summarizing the fix, linking to the full post.

## 5. Conversion

- [ ] Every guide and comparison already ends with a CTA to `/trial/` or the
      install command — keep that pattern.
- [ ] Watch which posts convert in Vercel Analytics and double down on those topics.

---

**Priority order:** measurement → keep shipping content → backlinks (npm + GitHub) →
one coordinated launch → iterate on what Analytics shows is working.
