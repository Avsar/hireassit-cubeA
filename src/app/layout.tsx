import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "CubeA — Dutch tech jobs, including the hidden ones",
  description:
    "Search 13,000+ jobs from 1,000+ Dutch companies, crawled daily from their own career pages — including hidden gems that never reach LinkedIn or Indeed.",
  metadataBase: new URL("https://cubea.nl"),
  openGraph: {
    title: "CubeA — Dutch tech jobs, including the hidden ones",
    description:
      "13,000+ jobs from 1,000+ Dutch companies — including hidden gems that never reach LinkedIn.",
    type: "website",
    url: "https://cubea.nl",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PG157F1SSR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PG157F1SSR');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
