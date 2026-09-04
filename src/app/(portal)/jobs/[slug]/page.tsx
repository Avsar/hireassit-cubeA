import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CITY_PAGES, ROLE_PAGES, ROLE_CITY_ROLES, ROLE_CITY_CITIES, type RolePage, fetchJobDetail, fetchJobs, idFromSlug, logoColor, timeAgo } from "@/lib/hireassist";
import { type JobSummary } from "@/lib/job-summariser";
import { getCachedSummary, getSummariesBulk } from "@/lib/summary-cache";
import { planJobPage, type PagePlan, type Salary, type Hours } from "@/lib/jobContent";
import SaveButton from "@/components/jobs/SaveButton";
import JobCard from "@/components/jobs/JobCard";
import ApplyButton from "@/components/ApplyButton";

export const revalidate = 3600;

function formatSalary(s: Salary): string {
  const fmt = (n: number) => n.toLocaleString("nl-NL");
  const range = s.max != null ? `€${fmt(s.min)}–€${fmt(s.max)}` : `€${fmt(s.min)}`;
  return `${range} / ${s.period}`;
}

function formatHours(h: Hours): string {
  return h.max != null ? `${h.min}–${h.max} hrs` : `${h.min} hrs`;
}

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
  try {
    return await fetchJobDetail(id);
  } catch {
    return null; // backend unreachable — treat as not found
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isHub = !idFromSlug(params.slug);

  // City landing pages: /jobs/eindhoven, /jobs/amsterdam, ...
  const cityName = isHub ? CITY_PAGES[params.slug] : undefined;
  if (cityName) {
    const title = `Jobs in ${cityName} — incl. hidden gems | CubeA`;
    const description = `Open positions in ${cityName}, crawled daily from company career pages and job boards — including hidden jobs that never reach LinkedIn.`;
    return {
      title,
      description,
      alternates: { canonical: `/jobs/${params.slug}` },
      openGraph: { title, description, url: `/jobs/${params.slug}`, type: "website" },
    };
  }

  // Role landing pages: /jobs/software-engineer, /jobs/data, ...
  const role = isHub ? ROLE_PAGES[params.slug] : undefined;
  if (role) {
    const title = `${role.label} Jobs in the Netherlands — incl. hidden gems | CubeA`;
    return {
      title,
      description: role.blurb,
      alternates: { canonical: `/jobs/${params.slug}` },
      openGraph: { title, description: role.blurb, url: `/jobs/${params.slug}`, type: "website" },
    };
  }

  const job = await getJob(params.slug);
  if (!job) return { title: "Job not found | CubeA" };
  const loc = job.city || "Netherlands";

  if (!job.is_active) {
    const title = `${job.title} at ${job.company} — ${loc} | CubeA Jobs`;
    const description = `${job.title} at ${job.company} in ${loc}. This position has closed.`;
    return {
      title,
      description,
      alternates: { canonical: `https://cubea.nl/jobs/${job.slug}` },
      robots: { index: false },
      openGraph: { title, description, url: `/jobs/${job.slug}`, type: "website" },
    };
  }

  const cachedSummary = job.description ? getCachedSummary(job.id, job.description) : null;
  const plan = planJobPage({
    title: job.title,
    company: job.company,
    rawDescription: job.description || "",
    summary: cachedSummary?.summary ?? null,
    listingLocation: job.city || null,
  });

  const jobTitle = `${job.title} at ${job.company} — ${loc} | CubeA Jobs`;
  return {
    title: jobTitle,
    description: plan.metaDescription,
    alternates: { canonical: `https://cubea.nl/jobs/${job.slug}` },
    robots: plan.index ? undefined : { index: false, follow: true },
    openGraph: { title: jobTitle, description: plan.metaDescription, url: `/jobs/${job.slug}`, type: "website" },
  };
}

// --- Shared hub-page building blocks -------------------------------------

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cubea.nl";

// Breadcrumb nav + matching BreadcrumbList JSON-LD (Jobs › {label}).
function HubBreadcrumb({ label, slug }: { label: string; slug: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Jobs", item: `${SITE}/jobs` },
      { "@type": "ListItem", position: 2, name: label, item: `${SITE}/jobs/${slug}` },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-sm text-neutral-500">
        <Link href="/jobs" className="hover:text-gem">Jobs</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-700">{label}</span>
      </nav>
    </>
  );
}

// Chip links to every role hub (optionally excluding the current one).
function BrowseByRole({ exclude }: { exclude?: string }) {
  const roles = Object.entries(ROLE_PAGES).filter(([slug]) => slug !== exclude);
  return (
    <div>
      <h2 className="text-sm font-semibold text-neutral-900">Browse by role</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {roles.map(([slug, role]) => (
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
  );
}

// Chip links to every city hub (optionally excluding the current one).
function BrowseByCity({ exclude }: { exclude?: string }) {
  const cities = Object.entries(CITY_PAGES).filter(([, name]) => name !== exclude);
  return (
    <div>
      <h2 className="text-sm font-semibold text-neutral-900">Browse by city</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {cities.map(([slug, name]) => (
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
  );
}

async function RoleLandingPage({ slug, role }: { slug: string; role: RolePage }) {
  let data;
  try {
    data = await fetchJobs({ q: role.query, per_page: 50 });
  } catch {
    data = null;
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="bg-gem text-white">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="text-3xl font-bold">{role.label} jobs in the Netherlands</h1>
          <p className="mt-2 max-w-2xl text-emerald-100">
            {data ? `${data.count.toLocaleString("en-US")} open ${role.label.toLowerCase()} positions` : `Open ${role.label.toLowerCase()} positions`}{" "}
            — {role.blurb}
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        <HubBreadcrumb label={`${role.label} jobs`} slug={slug} />

        {!data || data.jobs.length === 0 ? (
          <p className="py-16 text-center text-neutral-500">
            No {role.label.toLowerCase()} jobs listed right now —{" "}
            <Link href="/jobs" className="text-gem underline">browse all jobs</Link>.
          </p>
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

        {data && data.count > 50 && (
          <div className="text-center">
            <Link
              href={`/jobs?q=${encodeURIComponent(role.query)}`}
              className="inline-block rounded-xl bg-gem px-6 py-3 font-medium text-white hover:bg-gem-deep"
            >
              See all {data.count.toLocaleString("en-US")} {role.label.toLowerCase()} jobs →
            </Link>
          </div>
        )}

        {(ROLE_CITY_ROLES as readonly string[]).includes(slug) && (
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">{role.label} jobs by city</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {ROLE_CITY_CITIES.map((c) => (
                <Link
                  key={c}
                  href={`/jobs/${slug}/${c}`}
                  className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:border-gem hover:text-gem"
                >
                  {role.label} in {CITY_PAGES[c]}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-8 border-t border-neutral-200 pt-8 sm:grid-cols-2">
          <BrowseByCity />
          <BrowseByRole exclude={slug} />
        </div>
      </div>
    </main>
  );
}

async function CityLandingPage({ slug, cityName }: { slug: string; cityName: string }) {
  let data;
  try {
    data = await fetchJobs({ city: cityName, per_page: 50 });
  } catch {
    data = null;
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="bg-gem text-white">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="text-3xl font-bold">Jobs in {cityName}</h1>
          <p className="mt-2 text-emerald-100">
            {data ? `${data.count.toLocaleString("en-US")} open positions` : "Open positions"} in{" "}
            {cityName} — crawled daily from company career pages, including
            hidden jobs that never reach LinkedIn.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        <HubBreadcrumb label={`Jobs in ${cityName}`} slug={slug} />

        <Link
          href={`/jobs?city=${encodeURIComponent(cityName)}&hidden=true`}
          className="inline-block text-sm text-amber-600 hover:underline"
        >
          💎 Hidden gems in {cityName}
        </Link>

        {!data || data.jobs.length === 0 ? (
          <p className="py-16 text-center text-neutral-500">
            No jobs listed in {cityName} right now —{" "}
            <Link href="/jobs" className="text-gem underline">browse all jobs</Link>.
          </p>
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

        {data && data.count > 50 && (
          <div className="text-center">
            <Link
              href={`/jobs?city=${encodeURIComponent(cityName)}`}
              className="inline-block rounded-xl bg-gem px-6 py-3 text-white font-medium hover:bg-gem-deep"
            >
              See all {data.count.toLocaleString("en-US")} jobs in {cityName} →
            </Link>
          </div>
        )}

        <div className="grid gap-8 border-t border-neutral-200 pt-8 sm:grid-cols-2">
          <BrowseByRole />
          <BrowseByCity exclude={cityName} />
        </div>
      </div>
    </main>
  );
}

export default async function JobDetailPage({ params }: Props) {
  const isHub = !idFromSlug(params.slug);

  const cityName = isHub ? CITY_PAGES[params.slug] : undefined;
  if (cityName) {
    return <CityLandingPage slug={params.slug} cityName={cityName} />;
  }

  const role = isHub ? ROLE_PAGES[params.slug] : undefined;
  if (role) {
    return <RoleLandingPage slug={params.slug} role={role} />;
  }

  const job = await getJob(params.slug);
  if (!job) notFound();

  let aiSummary: JobSummary | null = null;
  if (job.is_active && job.description) {
    aiSummary = getCachedSummary(job.id, job.description);
  }

  const plan: PagePlan = planJobPage({
    title: job.title,
    company: job.company,
    rawDescription: job.description || "",
    summary: aiSummary?.summary ?? null,
    listingLocation: job.city || null,
  });

  const techTags = (job.tech_tags || "").split("|").filter(Boolean);
  const posted = timeAgo(job.posted_at);
  const isActive = !!job.is_active;
  const daysOld = (() => {
    const d = job.first_seen_at || job.posted_at || "";
    const t = new Date(d).getTime();
    return isNaN(t) ? 0 : Math.floor((Date.now() - t) / 86400000);
  })();
  const isStale = isActive && daysOld > 30;

  const validThrough = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const addressRegion = regionForCity(job.city);
  const salary = plan.facts.salary ?? aiSummary?.salary ?? null;

  const companySlug = job.company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const sourceDomain = (() => {
    try {
      return new URL(job.apply_url).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  })();
  const checkedAgo = timeAgo(job.last_seen_at || job.first_seen_at || "");

  const meter = job.verified_hidden
    ? { lit: 5, tone: "gem" as const, badge: "Hidden gem", heading: "A verified hidden gem", label: "Rarely on the big boards.", sub: "We checked LinkedIn & Indeed and couldn't find this role." }
    : job.hidden_tier >= 2
      ? { lit: 4, tone: "gem" as const, badge: "Hidden gem", heading: "A likely hidden gem", label: "Likely low visibility.", sub: "Scraped straight from the company — rarely syndicated." }
      : job.hidden_tier === 1
        ? { lit: 3, tone: "low" as const, badge: "Low visibility", heading: "A lower-competition listing", label: "Lower visibility than most.", sub: "This company posts on the big boards less than average." }
        : null;

  const remoteMarkers = ["remote", "hybrid", "thuiswerk", "work from home", "wfh"];
  const isRemote = remoteMarkers.some((m) =>
    `${job.location_raw} ${job.title} ${job.city}`.toLowerCase().includes(m),
  );

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
        ...(isRemote ? { jobLocationType: "TELECOMMUTE" } : {}),
        ...(salary && salary.min != null
          ? {
              baseSalary: {
                "@type": "MonetaryAmount",
                currency: salary.currency || "EUR",
                value: {
                  "@type": "QuantitativeValue",
                  ...(salary.min != null ? { minValue: salary.min } : {}),
                  ...(salary.max != null ? { maxValue: salary.max } : {}),
                  unitText: salary.period === "hour" ? "HOUR" : salary.period === "year" ? "YEAR" : "MONTH",
                },
              },
            }
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

      <div className="mx-auto max-w-5xl px-4 py-8 pb-28 lg:pb-8">
        <Link href="/jobs" className="text-sm text-gem hover:underline">
          ← All jobs
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr,340px]">
          {/* MAIN COLUMN */}
          <article className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-semibold text-white ${logoColor(job.company)}`}>
                {job.company.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <Link href={`/companies/${companySlug}`} className="text-sm font-medium text-neutral-600 hover:text-gem">
                  {job.company}
                </Link>
                {(job.city || job.country) && (
                  <div className="text-xs text-neutral-400">
                    {[job.city, job.country].filter(Boolean).join(" · ")}
                  </div>
                )}
              </div>
            </div>

            <h1 className="mt-4 font-display text-2xl font-bold leading-tight text-neutral-900 sm:text-3xl">
              {job.title}
            </h1>

            {/* tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {job.verified_hidden ? (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  💎 Verified hidden gem
                </span>
              ) : job.hidden_tier === 1 ? (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Low visibility
                </span>
              ) : null}
              {aiSummary && aiSummary.seniority !== "Unknown" && (
                <Link href={`/jobs?q=${encodeURIComponent(aiSummary.seniority)}`} className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600 hover:border-gem hover:text-gem">
                  {aiSummary.seniority}
                </Link>
              )}
              {job.department && (
                <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
                  {job.department}
                </span>
              )}
              {aiSummary && aiSummary.role_category !== "Other" && !job.department && (
                <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
                  {aiSummary.role_category}
                </span>
              )}
              {job.job_type && (
                <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
                  {job.job_type}
                </span>
              )}
              {aiSummary && aiSummary.work_mode !== "Unknown" ? (
                <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
                  {aiSummary.work_mode}
                </span>
              ) : isRemote ? (
                <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
                  Remote-friendly
                </span>
              ) : null}
              {aiSummary && aiSummary.language_requirement !== "Unknown" && (
                <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs text-teal-700">
                  {aiSummary.language_requirement}
                </span>
              )}
            </div>

            {/* provenance */}
            {sourceDomain && (
              <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                Found on {sourceDomain}
                {checkedAgo ? ` · last checked ${checkedAgo}` : ""}
              </div>
            )}

            <hr className="my-6 border-neutral-100" />

            {/* about / description — driven by plan.bodyMode */}
            <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-gem">
              About this role
            </h2>
            {!isActive ? (
              <div className="mt-3 rounded-xl border border-neutral-200 bg-neutral-100 p-4 text-sm text-neutral-600">
                This position is no longer listed by the company.{" "}
                <Link href={`/companies/${companySlug}`} className="text-gem underline">
                  See other jobs at {job.company}
                </Link>
              </div>
            ) : plan.bodyMode === "summary" ? (
              <div className="mt-3 text-[15px] leading-relaxed text-neutral-700">
                {aiSummary!.summary}
              </div>
            ) : plan.bodyMode === "raw_fallback" ? (
              <>
                {plan.attribution && (
                  <p className="mt-3 text-xs text-neutral-400">{plan.attribution}</p>
                )}
                <div className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-neutral-700">
                  {job.description}
                </div>
              </>
            ) : (
              <div className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-600">
                {job.company} keeps the full description on their own site — and
                that&apos;s where you apply, directly, with no middleman. Hit{" "}
                <strong className="text-neutral-800">Apply</strong> to read the
                details and apply in one step.
              </div>
            )}

            {/* requirements */}
            {aiSummary?.requirements && aiSummary.requirements.length > 0 && (
              <div className="mt-6">
                <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-gem">
                  What you&apos;ll likely bring
                </h2>
                <ul className="mt-3 space-y-2">
                  {aiSummary.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-[15px] leading-relaxed text-neutral-700">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* key tags + tech tags */}
            {(techTags.length > 0 || (aiSummary?.key_tags && aiSummary.key_tags.length > 0)) && (
              <div className="mt-6 flex flex-wrap gap-2">
                {(aiSummary?.key_tags ?? []).map((t) => (
                  <span key={t} className="rounded-full border border-gem-100 bg-gem-wash px-3 py-1 text-xs text-gem">
                    {t}
                  </span>
                ))}
                {techTags
                  .filter((t) => !(aiSummary?.key_tags ?? []).some((k) => k.toLowerCase() === t.toLowerCase()))
                  .map((t) => (
                    <span key={t} className="rounded-full border border-gem-100 bg-gem-wash px-3 py-1 text-xs text-gem">
                      {t}
                    </span>
                  ))}
              </div>
            )}

            {/* why we flagged this */}
            {meter && (
              <div className="mt-8">
                <h2 className={`font-display text-xs font-semibold uppercase tracking-wider ${meter.tone === "gem" ? "text-amber-600" : "text-amber-600"}`}>
                  Why we flagged this
                </h2>
                <div className={`mt-3 rounded-2xl border p-5 ${meter.tone === "gem" ? "border-amber-200 bg-amber-50" : "border-amber-200 bg-amber-50"}`}>
                  <div className={`font-display font-semibold ${meter.tone === "gem" ? "text-amber-800" : "text-amber-800"}`}>
                    {meter.tone === "gem" ? "💎 " : ""}{meter.heading}
                  </div>
                  <p className={`mt-1 text-sm leading-relaxed ${meter.tone === "gem" ? "text-amber-900/80" : "text-amber-900/80"}`}>
                    {job.verified_hidden
                      ? `We scraped this straight from ${job.company}'s own career page, then checked LinkedIn and Indeed and couldn't find it there — so you're applying into a much smaller pool than usual.`
                      : `${job.company} rarely posts on the big job boards. We found this on their own career page, so it's likely seen by far fewer applicants than a typical listing.`}
                  </p>
                </div>
              </div>
            )}
          </article>

          {/* STICKY RAIL */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              {/* visibility meter */}
              {meter && (
                <div className={`mb-5 rounded-xl border p-4 ${meter.tone === "gem" ? "border-amber-100 bg-amber-50/60" : "border-amber-100 bg-amber-50/60"}`}>
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${meter.tone === "gem" ? "text-amber-700" : "text-amber-700"}`}>
                    {meter.tone === "gem" ? "💎 " : ""}{meter.badge}
                  </div>
                  <div className="mt-2.5 flex gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${i < meter.lit ? (meter.tone === "gem" ? "bg-amber-500" : "bg-amber-500") : "bg-neutral-200"}`}
                      />
                    ))}
                  </div>
                  <div className="mt-2.5 text-sm font-medium text-neutral-800">{meter.label}</div>
                  <div className="text-xs text-neutral-500">{meter.sub}</div>
                </div>
              )}

              {isActive ? (
                <>
                  <ApplyButton
                    applyUrl={job.apply_url}
                    jobId={job.id}
                    company={job.company}
                    title={job.title}
                    hiddenTier={job.hidden_tier}
                    className="block w-full rounded-xl bg-gem px-6 py-3 text-center font-semibold text-white hover:bg-gem-deep"
                  >
                    Apply on company site →
                  </ApplyButton>
                  <div className="mt-2">
                    <SaveButton
                      id={job.id}
                      slug={job.slug}
                      title={job.title}
                      company={job.company}
                      city={job.city}
                    />
                  </div>
                  <div className="mt-4 flex items-start gap-2 border-t border-neutral-100 pt-4">
                    <span className="shrink-0 text-gem">🛡️</span>
                    <p className="text-xs leading-relaxed text-neutral-500">
                      You apply <strong className="text-neutral-700">directly with {job.company}</strong>.
                      CubeA takes no fee, sees no application, and adds no middleman.
                    </p>
                  </div>
                  {isStale && (
                    <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-700">
                      This listing is over a month old — it may already be filled. Worth confirming it&apos;s still open on the company&apos;s site.
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-neutral-500">This position has closed.</p>
                  <Link
                    href="/jobs"
                    className="mt-3 inline-block rounded-xl bg-gem px-5 py-2.5 text-sm font-semibold text-white hover:bg-gem-deep"
                  >
                    Browse open jobs →
                  </Link>
                </div>
              )}

              <dl className="mt-5 space-y-3 border-t border-neutral-100 pt-5 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-400">Location</dt>
                  <dd className="text-right font-medium">{plan.facts.location || job.location_raw.slice(0, 30) || "Netherlands"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-400">Salary</dt>
                  <dd className={`text-right ${plan.facts.salary ? "font-medium" : "text-neutral-400"}`}>
                    {plan.facts.salary ? formatSalary(plan.facts.salary) : "Not listed"}
                  </dd>
                </div>
                {plan.facts.hours && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-neutral-400">Hours</dt>
                    <dd className="text-right font-medium">{formatHours(plan.facts.hours)}</dd>
                  </div>
                )}
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
                {aiSummary && aiSummary.language_requirement !== "Unknown" && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-neutral-400">Language</dt>
                    <dd className="text-right font-medium">{aiSummary.language_requirement}</dd>
                  </div>
                )}
                {posted && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-neutral-400">Posted</dt>
                    <dd className="text-right font-medium">{posted}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-400">Apply via</dt>
                  <dd className="text-right font-medium">Company site</dd>
                </div>
              </dl>

              <Link
                href={`/companies/${companySlug}`}
                className="mt-5 block rounded-xl border border-neutral-200 px-4 py-2.5 text-center text-sm text-neutral-600 hover:border-gem hover:text-gem"
              >
                All jobs at {job.company}
              </Link>
            </div>
          </aside>
        </div>

        {job.related.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-neutral-500">
              More at {job.company}
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {job.related.map((r) => (
                <Link
                  key={r.id}
                  href={`/jobs/${r.slug}`}
                  target="_blank"
                  className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm hover:border-gem"
                >
                  <span className="font-medium">{r.title}</span>
                  {r.city && <span className="text-neutral-400"> — {r.city}</span>}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* mobile sticky apply */}
      {isActive && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <ApplyButton
            applyUrl={job.apply_url}
            jobId={job.id}
            company={job.company}
            title={job.title}
            hiddenTier={job.hidden_tier}
            className="block w-full rounded-xl bg-gem px-6 py-3 text-center font-semibold text-white hover:bg-gem-deep"
          >
            Apply on company site →
          </ApplyButton>
        </div>
      )}
    </main>
  );
}
