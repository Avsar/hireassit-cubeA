import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CITY_PAGES, ROLE_PAGES, fetchJobs } from "@/lib/hireassist";
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
  page?: string;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
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
      sort: "newest",
      page,
      per_page: 25,
    });
  } catch {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-[Sora] text-2xl font-bold">Job search is briefly unavailable</h1>
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
    searchParams.q && `“${searchParams.q}”`,
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
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[260px,1fr]">
          {/* FILTER RAIL */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <Suspense>
                <JobFilters />
              </Suspense>
            </div>
          </aside>

          {/* RESULTS */}
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h1 className="font-[Sora] text-xl font-bold">
                {data.count.toLocaleString("en-US")}{" "}
                {activeFilters.length > 0 ? "matching jobs" : "jobs in the Netherlands"}
              </h1>
              {activeFilters.length > 0 && (
                <span className="text-sm text-neutral-400">
                  {activeFilters.join(" · ")}
                </span>
              )}
            </div>

            <Suspense>
              <AlertSignup />
            </Suspense>

            {data.jobs.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200 bg-white py-16 text-center">
                <p className="font-[Sora] font-semibold text-neutral-700">
                  No jobs match these filters
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  Try a broader search, or{" "}
                  <Link href="/jobs" className="text-blue-600 underline">
                    reset the filters
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {data.jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
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
        </div>

        {/* Browse hubs — sitewide internal links that funnel crawlers and
            users into the clean, indexable city and role landing pages. */}
        <section className="mt-12 border-t border-neutral-200 pt-8">
          <h2 className="font-[Sora] text-lg font-bold text-neutral-900">
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
                    className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:border-blue-300 hover:text-blue-700"
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
                    className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:border-blue-300 hover:text-blue-700"
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
