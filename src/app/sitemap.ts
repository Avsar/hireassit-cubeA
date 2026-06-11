import { MetadataRoute } from "next";
import { fetchSitemapJobs } from "@/lib/hireassist";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cubea.nl";

export const revalidate = 86400; // regenerate daily

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/jobs`, changeFrequency: "hourly", priority: 1.0 },
    { url: `${SITE}/recruiters`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/jobseekers`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/blog`, changeFrequency: "weekly", priority: 0.6 },
  ];

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

  return [...staticPages, ...jobPages];
}
