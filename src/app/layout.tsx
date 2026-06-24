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
      <body>
        {children}
        <FeedbackButton />
      </body>
    </html>
  );
}
