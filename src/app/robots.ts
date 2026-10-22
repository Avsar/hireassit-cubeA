import { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cubea.nl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Filtered/paginated search results are thin content AND expensive to
        // serve. All job detail pages are in the sitemap, so crawlers lose
        // nothing by skipping query-string variants of the search page.
        disallow: ["/jobs?", "/api/", "/login", "/account"],
      },
      // Block known aggressive scrapers / AI training crawlers that hammer
      // the site and provide no traffic value.
      {
        userAgent: [
          "AhrefsBot",
          "SemrushBot",
          "MJ12bot",
          "DotBot",
          "BLEXBot",
          "DataForSeoBot",
          "GPTBot",
          "CCBot",
          "anthropic-ai",
          "ClaudeBot",
          "Bytespider",
          "PetalBot",
        ],
        disallow: "/",
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
