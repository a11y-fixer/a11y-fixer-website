import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { site } from "./lib/site";
import "./globals.css";

const ogTitle = `${site.name} — accessibility, fixed`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: ogTitle,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: site.keywords,
  authors: [{ name: site.name, url: site.repoUrl }],
  creator: site.name,
  publisher: site.name,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: ogTitle,
    description: site.description,
    type: "website",
    url: site.url,
    siteName: site.name,
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: ogTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: site.description,
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to the token from your Google
  // Search Console property to verify ownership and unlock search analytics.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1f6feb" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
};

// Structured data so search engines understand this is an open-source software tool.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: `${site.url}/`,
      name: site.name,
      description: site.description,
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${site.url}/#software`,
      name: site.name,
      description: site.description,
      url: `${site.url}/`,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Cross-platform (Node.js)",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      license: "https://opensource.org/licenses/MIT",
      codeRepository: site.repoUrl,
    },
    {
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Is a11y-fixer free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The a11y-fixer CLI is open source and MIT-licensed, free to use from your terminal or in CI. a11y-fixer-pro, the GitHub Action that proposes AI-assisted fixes on pull requests, offers a free 14-day trial.",
          },
        },
        {
          "@type": "Question",
          name: "Which accessibility standard does a11y-fixer check?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "a11y-fixer scans for WCAG 2.2 violations and can target conformance levels such as WCAG 2.2 AA. It checks the rendered DOM, so it works with any framework.",
          },
        },
        {
          "@type": "Question",
          name: "Does a11y-fixer run in CI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Run it as a CLI or GitHub Action to fail builds when new accessibility regressions appear, with JSON and SARIF output for dashboards and code review.",
          },
        },
        {
          "@type": "Question",
          name: "What accessibility issues can a11y-fixer fix automatically?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It applies safe, reviewable fixes for the most common issues: missing or empty image alt text, form controls without labels, insufficient color contrast, invalid or redundant ARIA attributes, and missing document language and landmark roles.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
