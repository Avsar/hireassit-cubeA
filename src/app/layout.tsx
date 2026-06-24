import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import FeedbackButton from "@/components/FeedbackButton";

export const metadata: Metadata = {
  title: "English-Speaking Jobs in the Netherlands — incl. the hidden ones | CubeA",
  description:
    "Find English-speaking jobs in the Netherlands, crawled daily from 1,000+ company career pages — including roles that never reach LinkedIn or Indeed. No Dutch required, apply directly.",
  metadataBase: new URL("https://cubea.nl"),
  openGraph: {
    title: "English-Speaking Jobs in the Netherlands — incl. the hidden ones | CubeA",
    description:
      "English-speaking jobs in the Netherlands — including roles that never reach LinkedIn or Indeed. No Dutch required.",
    type: "website",
    url: "https://cubea.nl",
    siteName: "CubeA",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "English-Speaking Jobs in the Netherlands — incl. the hidden ones | CubeA",
    description:
      "English-speaking jobs in the Netherlands — including roles that never reach LinkedIn or Indeed. No Dutch required.",
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
