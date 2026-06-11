import { MetadataRoute } from "next";
import { CITY_PAGES, fetchCompanies, fetchSitemapJobs } from "@/lib/hireassist";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cubea.nl";

// Render on request (cached 24h via the fetch below) instead of at build time --
// a slow/unreachable backend during a Vercel build must never fail the deploy.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/jobs`, changeFrequency: "hourly", priority: 1.0 },
    { url: `${SITE}/hidden-gems`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/companies`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE}/recruiters`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/jobseekers`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const cityPages: MetadataRoute.Sitemap = Object.keys(CITY_PAGES).map((slug) => ({
    url: `${SITE}/jobs/${slug}`,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  let jobPages: MetadataRoute.Sitemap = [];
  try {
    const jobs = await fetchSitemapJobs();
    jobPages = jobs.map((j) => ({
      url: `${SITE}/jobs/${j.slug}`,
      lastModified: j.lastmod || undefined,
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
  } catch {
    // API briefly unavailable: ship the static pages, jobs return next revalidation
  }

  let companyPages: MetadataRoute.Sitemap = [];
  try {
    const companies = await fetchCompanies();
    companyPages = companies.map((c) => ({
      url: `${SITE}/companies/${c.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.6,
    }));
  } catch {
    // same resilience as jobs
  }

  return [...staticPages, ...cityPages, ...companyPages, ...jobPages];
}
