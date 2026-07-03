import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CITY_PAGES, ROLE_PAGES, fetchJobs } from "@/lib/hireassist";
import { getSummariesBulk } from "@/lib/summary-cache";
import JobCard from "@/components/jobs/JobCard";
import JobFilters from "@/components/jobs/JobFilters";
import AlertSignup from "@/components/jobs/AlertSignup";

export const metadata: Metadata = {
  title: "Jobs in the Netherlands — incl. hidden jobs not on LinkedIn | CubeA",
  description:
    "Search jobs from 1,000+ Dutch companies — including hidden gems scraped directly from company career pages that never reach LinkedIn or Indeed.",
};

export const revalidate = 600;

interface SearchParams {
  q?: string;
  city?: string;
  hidden?: string;
  english_only?: string;
  new_today_only?: string;
  role?: string;
  job_type?: string;
  remote?: string;
  sort?: string;
  page?: string;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const sort = searchParams.sort || "newest";
  let data;
  try {
    data = await fetchJobs({
      q: searchParams.q,
      city: searchParams.city,
      hidden: searchParams.hidden === "true",
      english_only: searchParams.english_only === "true",
      new_today_only: searchParams.new_today_only === "true",
      role: searchParams.role,
      job_type: searchParams.job_type,
      remote: searchParams.remote === "true",
      sort,
      page,
      per_page: 25,
    });
  } catch {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Job search is briefly unavailable</h1>
        <p className="mt-2 text-neutral-500">
          Our job index is waking up — please refresh in a few seconds.
        </p>
      </main>
    );
  }

  const baseParams = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (v && k !== "page") baseParams.set(k, v);
  }
  const pageUrl = (p: number) => {
    const sp = new URLSearchParams(baseParams);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `/jobs?${qs}` : "/jobs";
  };

  const activeFilters = [
    searchParams.q && `"${searchParams.q}"`,
    searchParams.role,
    searchParams.city,
    searchParams.job_type,
    searchParams.remote === "true" && "remote / hybrid",
    searchParams.hidden === "true" && "💎 hidden gems",
    searchParams.english_only === "true" && "English only",
    searchParams.new_today_only === "true" && "new today",
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-4xl px-4">
        {/* Page heading */}
        <div className="pb-2 pt-8">
          <h1 className="font-display text-2xl font-bold">
            <span className="text-gem">{data.count.toLocaleString("en-US")}</span>{" "}
            {activeFilters.length > 0 ? "matching jobs" : "jobs in the Netherlands"}
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            incl. hidden gems from company career pages · updated daily
          </p>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-0 z-30 -mx-4 border-b border-neutral-200 bg-neutral-50/95 px-4 pb-3 pt-3 backdrop-blur">
          <Suspense>
            <JobFilters />
          </Suspense>
        </div>

        {/* Results */}
        <div className="space-y-4 pb-8 pt-4">
          <Suspense>
            <AlertSignup />
          </Suspense>

          {data.jobs.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white py-16 text-center">
              <p className="font-display font-semibold text-neutral-700">
                No jobs match these filters
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Try a broader search, or{" "}
                <Link href="/jobs" className="text-gem underline">
                  reset the filters
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {(() => {
                const summaries = getSummariesBulk(data.jobs.map((j) => j.id));
                return data.jobs.map((job) => (
                  <JobCard key={job.id} job={job} summary={summaries.get(job.id) ?? null} />
                ));
              })()}
            </div>
          )}

          {data.pages > 1 && (
            <nav className="flex items-center justify-center gap-2 pt-4 text-sm">
              {page > 1 && (
                <Link
                  href={pageUrl(page - 1)}
                  className="rounded-lg border border-neutral-300 px-3 py-1.5 hover:bg-white"
                >
                  ← Previous
                </Link>
              )}
              <span className="px-3 text-neutral-500">
                Page {page} of {data.pages}
              </span>
              {page < data.pages && (
                <Link
                  href={pageUrl(page + 1)}
                  className="rounded-lg border border-neutral-300 px-3 py-1.5 hover:bg-white"
                >
                  Next →
                </Link>
              )}
            </nav>
          )}
        </div>

        {/* Browse hubs for SEO */}
        <section className="border-t border-neutral-200 pb-12 pt-8">
          <h2 className="font-display text-lg font-bold text-neutral-900">
            Browse jobs by city and role
          </h2>
          <div className="mt-4 grid gap-8 sm:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-neutral-700">By city</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(CITY_PAGES).map(([slug, name]) => (
                  <Link
                    key={slug}
                    href={`/jobs/${slug}`}
                    className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:border-gem hover:text-gem"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-neutral-700">By role</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(ROLE_PAGES).map(([slug, role]) => (
                  <Link
                    key={slug}
                    href={`/jobs/${slug}`}
                    className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:border-gem hover:text-gem"
                  >
                    {role.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
