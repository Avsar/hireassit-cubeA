import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireAssist by CubeA — Human + AI Recruiting",
  description: "Human-in-the-loop recruiting powered by AI. Faster shortlists, better hires.",
  metadataBase: new URL("https://cubea.nl"),
  openGraph: { title: "HireAssist by CubeA", type: "website", url: "https://cubea.nl" },
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
