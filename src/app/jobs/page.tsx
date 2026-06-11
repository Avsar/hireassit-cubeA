import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { fetchJobs } from "@/lib/hireassist";
import JobCard from "@/components/jobs/JobCard";
import JobFilters from "@/components/jobs/JobFilters";
import AlertSignup from "@/components/jobs/AlertSignup";

export const metadata: Metadata = {
  title: "Tech Jobs in the Netherlands — incl. hidden jobs not on LinkedIn | CubeA",
  description:
    "Search 13,000+ jobs from 1,000+ Dutch companies — including hidden gems scraped directly from company career pages that never reach LinkedIn or Indeed.",
};

export const revalidate = 600;

interface SearchParams {
  q?: string;
  city?: string;
  hidden?: string;
  english_only?: string;
  new_today_only?: string;
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
      page,
      per_page: 25,
    });
  } catch {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Job search is briefly unavailable</h1>
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

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="text-3xl font-bold">
            Find jobs nobody else shows you
          </h1>
          <p className="mt-2 text-blue-100">
            {data.count.toLocaleString("en-US")} jobs from Dutch companies —
            including hidden gems scraped straight from career pages, never
            posted on LinkedIn.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Suspense>
            <JobFilters />
          </Suspense>
        </div>

        <div className="flex justify-between -mt-3 text-sm">
          <div className="flex gap-4">
            <Link href="/hidden-gems" className="text-fuchsia-600 hover:underline">
              💎 Hidden gems
            </Link>
            <Link href="/companies" className="text-blue-600 hover:underline">
              Companies
            </Link>
          </div>
          <Link href="/jobs/saved" className="text-blue-600 hover:underline">
            ★ Saved jobs
          </Link>
        </div>

        <Suspense>
          <AlertSignup />
        </Suspense>

        {data.jobs.length === 0 ? (
          <p className="py-16 text-center text-neutral-500">
            No jobs match these filters.{" "}
            <Link href="/jobs" className="text-blue-600 underline">
              Reset filters
            </Link>
          </p>
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
    </main>
  );
}
