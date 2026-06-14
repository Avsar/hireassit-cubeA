import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CITY_PAGES, fetchJobDetail, fetchJobs, idFromSlug, logoColor, timeAgo } from "@/lib/hireassist";
import SaveButton from "@/components/jobs/SaveButton";
import JobCard from "@/components/jobs/JobCard";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

// Maps Dutch cities to their province (schema.org addressRegion).
// Used to enrich JobPosting structured data; unknown cities are simply omitted.
const NL_CITY_REGIONS: Record<string, string> = {
  amsterdam: "North Holland",
  haarlem: "North Holland",
  hilversum: "North Holland",
  amstelveen: "North Holland",
  alkmaar: "North Holland",
  zaandam: "North Holland",
  rotterdam: "South Holland",
  "the hague": "South Holland",
  "den haag": "South Holland",
  "'s-gravenhage": "South Holland",
  delft: "South Holland",
  leiden: "South Holland",
  "zoetermeer": "South Holland",
  dordrecht: "South Holland",
  gouda: "South Holland",
  utrecht: "Utrecht",
  amersfoort: "Utrecht",
  nieuwegein: "Utrecht",
  eindhoven: "North Brabant",
  tilburg: "North Brabant",
  breda: "North Brabant",
  "'s-hertogenbosch": "North Brabant",
  "den bosch": "North Brabant",
  helmond: "North Brabant",
  nijmegen: "Gelderland",
  arnhem: "Gelderland",
  apeldoorn: "Gelderland",
  ede: "Gelderland",
  groningen: "Groningen",
  maastricht: "Limburg",
  venlo: "Limburg",
  heerlen: "Limburg",
  enschede: "Overijssel",
  zwolle: "Overijssel",
  hengelo: "Overijssel",
  deventer: "Overijssel",
  almere: "Flevoland",
  lelystad: "Flevoland",
  leeuwarden: "Friesland",
  assen: "Drenthe",
  emmen: "Drenthe",
  middelburg: "Zeeland",
};

function regionForCity(city?: string): string | undefined {
  if (!city) return undefined;
  return NL_CITY_REGIONS[city.trim().toLowerCase()];
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

  // Rolling 30-day expiry. The page revalidates hourly, so an active job
  // always advertises a future validThrough and is never dropped by Google
  // for being "expired"; once a job goes inactive we stop emitting JSON-LD.
  const validThrough = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const addressRegion = regionForCity(job.city);

  const jsonLd = isActive
    ? {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        description:
          job.description ||
          `${job.title} position at ${job.company} in ${job.city || "the Netherlands"}.`,
        datePosted: (job.posted_at || job.first_seen_at || "").slice(0, 10),
        validThrough,
        hiringOrganization: {
          "@type": "Organization",
          name: job.company,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            ...(job.city ? { addressLocality: job.city } : {}),
            ...(addressRegion ? { addressRegion } : {}),
            addressCountry: job.country === "Netherlands" ? "NL" : job.country || "NL",
          },
        },
        ...(job.job_type
          ? { employmentType: job.job_type.toUpperCase().replace(/[\s-]/g, "_") }
          : {}),
        directApply: false,
      }
    : null;

  const companySlug = job.company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return (
    <main className="min-h-screen bg-neutral-50">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="mx-auto max-w-5xl px-4 py-8">
        <Link href="/jobs" className="text-sm text-blue-600 hover:underline">
          ← All jobs
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr,320px]">
          {/* MAIN COLUMN */}
          <article className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-semibold text-white ${logoColor(job.company)}`}>
                {job.company.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <Link href={`/companies/${companySlug}`} className="text-sm text-neutral-500 hover:text-blue-700">
                  {job.company}
                </Link>
                <h1 className="font-[Sora] text-2xl font-bold text-neutral-900">{job.title}</h1>
              </div>
            </div>

            {job.hidden_tier >= 2 && (
              <p className="mt-4 rounded-xl border border-fuchsia-200 bg-fuchsia-50 px-4 py-2.5 text-sm text-fuchsia-700">
                💎 <strong>Hidden gem</strong> — scraped directly from the company&apos;s
                website. Jobs like this rarely appear on LinkedIn or Indeed.
              </p>
            )}
            {job.hidden_tier === 1 && (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
                Low visibility — this company rarely posts on big job boards.
              </p>
            )}

            {!isActive ? (
              <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-100 p-4 text-sm text-neutral-600">
                This position is no longer listed by the company.{" "}
                <Link href={`/companies/${companySlug}`} className="text-blue-600 underline">
                  See other jobs at {job.company}
                </Link>
              </div>
            ) : job.description ? (
              <div className="mt-6 whitespace-pre-line border-t border-neutral-100 pt-6 text-[15px] leading-relaxed text-neutral-700">
                {job.description}
              </div>
            ) : (
              <p className="mt-6 border-t border-neutral-100 pt-6 text-sm text-neutral-500">
                The company hosts the full description on their own site — use
                the apply button to read it there.
              </p>
            )}

            {techTags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {techTags.map((t) => (
                  <span key={t} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* STICKY APPLY CARD */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              {isActive ? (
                <>
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener nofollow"
                    className="block w-full rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
                  >
                    Apply on company site →
                  </a>
                  <div className="mt-2">
                    <SaveButton
                      id={job.id}
                      slug={job.slug}
                      title={job.title}
                      company={job.company}
                      city={job.city}
                    />
                  </div>
                  <p className="mt-3 text-center text-xs text-neutral-400">
                    You apply directly with {job.company}. No middlemen.
                  </p>
                </>
              ) : (
                <p className="text-center text-sm text-neutral-500">
                  This position has closed.
                </p>
              )}

              <dl className="mt-5 space-y-3 border-t border-neutral-100 pt-5 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-400">Location</dt>
                  <dd className="text-right font-medium">{job.city || job.location_raw.slice(0, 30) || "Netherlands"}</dd>
                </div>
                {job.job_type && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-neutral-400">Type</dt>
                    <dd className="text-right font-medium">{job.job_type}</dd>
                  </div>
                )}
                {job.department && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-neutral-400">Department</dt>
                    <dd className="text-right font-medium">{job.department}</dd>
                  </div>
                )}
                {posted && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-neutral-400">Posted</dt>
                    <dd className="text-right font-medium">{posted}</dd>
                  </div>
                )}
              </dl>

              <Link
                href={`/companies/${companySlug}`}
                className="mt-5 block rounded-xl border border-neutral-200 px-4 py-2.5 text-center text-sm text-neutral-600 hover:border-blue-300 hover:text-blue-700"
              >
                All jobs at {job.company}
              </Link>
            </div>
          </aside>
        </div>

        {job.related.length > 0 && (
          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              More at {job.company}
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
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
