import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CITY_PAGES, fetchJobDetail, fetchJobs, idFromSlug, timeAgo } from "@/lib/hireassist";
import SaveButton from "@/components/jobs/SaveButton";
import JobCard from "@/components/jobs/JobCard";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

async function getJob(slug: string) {
  const id = idFromSlug(slug);
  if (!id) return null;
  return fetchJobDetail(id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // City landing pages: /jobs/eindhoven, /jobs/amsterdam, ...
  const cityName = !idFromSlug(params.slug) ? CITY_PAGES[params.slug] : undefined;
  if (cityName) {
    return {
      title: `Tech Jobs in ${cityName} — incl. hidden gems | CubeA`,
      description: `Open positions in ${cityName}, crawled daily from company career pages and job boards — including hidden jobs that never reach LinkedIn.`,
      alternates: { canonical: `/jobs/${params.slug}` },
    };
  }
  const job = await getJob(params.slug);
  if (!job) return { title: "Job not found | CubeA" };
  const loc = job.city || "Netherlands";
  const desc =
    job.description?.slice(0, 155) ||
    `${job.title} at ${job.company} in ${loc}. Apply directly on the company's website — no recruiters, no middlemen.`;
  return {
    title: `${job.title} at ${job.company} — ${loc} | CubeA Jobs`,
    description: desc,
    alternates: { canonical: `/jobs/${job.slug}` },
    robots: job.is_active ? undefined : { index: false },
  };
}

async function CityLandingPage({ cityName }: { cityName: string }) {
  let data;
  try {
    data = await fetchJobs({ city: cityName, per_page: 50 });
  } catch {
    data = null;
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="bg-blue-600 text-white">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="text-3xl font-bold">Tech jobs in {cityName}</h1>
          <p className="mt-2 text-blue-100">
            {data ? `${data.count.toLocaleString("en-US")} open positions` : "Open positions"} in{" "}
            {cityName} — crawled daily from company career pages, including
            hidden jobs that never reach LinkedIn.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <div className="flex gap-4 text-sm">
          <Link href="/jobs" className="text-blue-600 hover:underline">← All jobs</Link>
          <Link href={`/jobs?city=${encodeURIComponent(cityName)}&hidden=true`} className="text-fuchsia-600 hover:underline">
            💎 Hidden gems in {cityName}
          </Link>
        </div>
        {!data || data.jobs.length === 0 ? (
          <p className="py-16 text-center text-neutral-500">
            No jobs listed in {cityName} right now —{" "}
            <Link href="/jobs" className="text-blue-600 underline">browse all jobs</Link>.
          </p>
        ) : (
          <div className="grid gap-3">
            {data.jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
        {data && data.count > 50 && (
          <div className="text-center">
            <Link
              href={`/jobs?city=${encodeURIComponent(cityName)}`}
              className="inline-block rounded-xl bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700"
            >
              See all {data.count.toLocaleString("en-US")} jobs in {cityName} →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default async function JobDetailPage({ params }: Props) {
  const cityName = !idFromSlug(params.slug) ? CITY_PAGES[params.slug] : undefined;
  if (cityName) {
    return <CityLandingPage cityName={cityName} />;
  }

  const job = await getJob(params.slug);
  if (!job) notFound();

  const techTags = (job.tech_tags || "").split("|").filter(Boolean);
  const posted = timeAgo(job.posted_at);
  const isActive = !!job.is_active;

  const jsonLd = isActive
    ? {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        description:
          job.description ||
          `${job.title} position at ${job.company} in ${job.city || "the Netherlands"}.`,
        datePosted: (job.posted_at || job.first_seen_at || "").slice(0, 10),
        hiringOrganization: {
          "@type": "Organization",
          name: job.company,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            ...(job.city ? { addressLocality: job.city } : {}),
            addressCountry: job.country === "Netherlands" ? "NL" : job.country || "NL",
          },
        },
        ...(job.job_type
          ? { employmentType: job.job_type.toUpperCase().replace(/[\s-]/g, "_") }
          : {}),
        directApply: false,
      }
    : null;

  return (
    <main className="min-h-screen bg-neutral-50">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/jobs" className="text-sm text-blue-600 hover:underline">
          ← All jobs
        </Link>

        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {job.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-neutral-500 text-sm">{job.company}</div>
              <h1 className="text-2xl font-bold text-neutral-900">{job.title}</h1>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {job.hidden_tier >= 2 && (
              <span className="rounded-full bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-700 px-3 py-1 font-medium">
                💎 Hidden gem — scraped directly from the company, rarely on job boards
              </span>
            )}
            {job.hidden_tier === 1 && (
              <span className="rounded-full bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1">
                Low visibility — small company, rarely posts on big boards
              </span>
            )}
          </div>

          <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <dt className="text-neutral-400">Location</dt>
              <dd className="font-medium">{job.city || job.location_raw || "Netherlands"}</dd>
            </div>
            {job.job_type && (
              <div>
                <dt className="text-neutral-400">Type</dt>
                <dd className="font-medium">{job.job_type}</dd>
              </div>
            )}
            {job.department && (
              <div>
                <dt className="text-neutral-400">Department</dt>
                <dd className="font-medium">{job.department}</dd>
              </div>
            )}
            {posted && (
              <div>
                <dt className="text-neutral-400">Posted</dt>
                <dd className="font-medium">{posted}</dd>
              </div>
            )}
          </dl>

          {techTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {techTags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 text-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {!isActive ? (
            <div className="mt-6 rounded-xl bg-neutral-100 border border-neutral-200 p-4 text-sm text-neutral-600">
              This position is no longer listed by the company.{" "}
              <Link href={`/jobs?company=${encodeURIComponent(job.company)}`} className="text-blue-600 underline">
                See other jobs at {job.company}
              </Link>
            </div>
          ) : (
            <>
              {job.description && (
                <div className="mt-6 border-t border-neutral-100 pt-6 text-[15px] leading-relaxed text-neutral-700 whitespace-pre-line">
                  {job.description}
                </div>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener nofollow"
                  className="rounded-xl bg-blue-600 text-white px-6 py-3 font-medium hover:bg-blue-700"
                >
                  Apply on company site →
                </a>
                <SaveButton
                  id={job.id}
                  slug={job.slug}
                  title={job.title}
                  company={job.company}
                  city={job.city}
                />
                <span className="text-xs text-neutral-400">
                  You apply directly with {job.company}. No middlemen.
                </span>
              </div>
            </>
          )}
        </div>

        {job.related.length > 0 && (
          <section className="mt-8">
            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
              More at {job.company}
            </h2>
            <div className="mt-3 grid gap-2">
              {job.related.map((r) => (
                <Link
                  key={r.id}
                  href={`/jobs/${r.slug}`}
                  target="_blank"
                  className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm hover:border-blue-300"
                >
                  <span className="font-medium">{r.title}</span>
                  {r.city && <span className="text-neutral-400"> — {r.city}</span>}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
