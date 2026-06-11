import { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cubea.nl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Filtered/paginated search results are thin content AND expensive to
      // serve. All job detail pages are in the sitemap, so crawlers lose
      // nothing by skipping query-string variants of the search page.
      disallow: "/jobs?",
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
