import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import FeedbackButton from "@/components/FeedbackButton";

export const metadata: Metadata = {
  title: "CubeA — Dutch jobs that aren't on LinkedIn, incl. English-speaking roles",
  description:
    "We crawl 1,000+ Dutch company career pages every day to surface jobs that never reach LinkedIn or Indeed — including English-speaking roles for internationals. Apply directly, no recruiters.",
  metadataBase: new URL("https://cubea.nl"),
  openGraph: {
    title: "CubeA — Dutch jobs that aren't on LinkedIn, incl. English-speaking roles",
    description:
      "Dutch jobs that never reach LinkedIn or Indeed — crawled daily from company career pages, including English-speaking roles for internationals.",
    type: "website",
    url: "https://cubea.nl",
    siteName: "CubeA",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "CubeA — Dutch jobs that aren't on LinkedIn, incl. English-speaking roles",
    description:
      "Dutch jobs that never reach LinkedIn or Indeed — crawled daily from company career pages, including English-speaking roles for internationals.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;450;500;600&family=Space+Mono:wght@400;700&display=swap"
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
      <body className="font-sans antialiased">
        {children}
        <FeedbackButton />
      </body>
    </html>
  );
}
