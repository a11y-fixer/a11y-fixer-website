import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { site } from "./lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — accessibility, fixed`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — accessibility, fixed`,
    description: site.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
