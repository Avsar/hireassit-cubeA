import { Metadata } from "next";
import Link from "next/link";
import { fetchJobs } from "@/lib/hireassist";
import JobCard from "@/components/jobs/JobCard";

export const metadata: Metadata = {
  title: "Verified Hidden Job Gems — Dutch jobs not on LinkedIn | CubeA",
  description:
    "Dutch jobs we scraped straight from company career pages, then checked against LinkedIn and Indeed and couldn't find there. Verified hidden — not guessed.",
  alternates: { canonical: "/hidden-gems" },
};

export const revalidate = 1800;

export default async function HiddenGemsPage() {
  let data;
  try {
    data = await fetchJobs({ hidden: true, per_page: 48, sort: "newest" });
  } catch {
    data = null;
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="bg-fuchsia-700 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h1 className="text-4xl font-bold">💎 Verified hidden gems</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-fuchsia-100">
            Jobs we scraped straight from Dutch company career pages — then checked
            against LinkedIn and Indeed and couldn&apos;t find there. Verified hidden,
            not just guessed.
          </p>
          {data && (
            <div className="mt-8">
              <div className="text-3xl font-bold">{data.count.toLocaleString("en-US")}</div>
              <div className="text-sm text-fuchsia-200">verified hidden gems live now</div>
            </div>
          )}
          <Link
            href="/jobs?hidden=true"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-fuchsia-700 hover:bg-fuchsia-50"
          >
            Browse all verified gems →
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
        <section>
          <h2 className="text-xl font-bold">How we verify</h2>
          <p className="mt-2 leading-relaxed text-neutral-600">
            We crawl company career pages directly. For each candidate, we then search
            LinkedIn and Indeed for the exact role — if it doesn&apos;t show up, we mark it
            a <strong>verified hidden gem</strong>. Fewer applicants per role means your
            application actually gets read. (Search engines don&apos;t index every posting on
            every board, so treat this as &ldquo;rarely on the big boards,&rdquo; verified to the
            best of what&apos;s findable — not an absolute guarantee.)
          </p>
        </section>

        {!data || data.jobs.length === 0 ? (
          <p className="py-12 text-center text-neutral-500">
            No verified gems to show right now — check back soon.
          </p>
        ) : (
          <div className="grid gap-3">
            {data.jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {data && data.count > data.jobs.length && (
          <div className="text-center">
            <Link
              href="/jobs?hidden=true"
              className="inline-block rounded-xl bg-fuchsia-700 px-8 py-3 font-semibold text-white hover:bg-fuchsia-800"
            >
              See all {data.count.toLocaleString("en-US")} verified gems →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
