import { Suspense } from "react";
import Link from "next/link";
import { fetchCompanies, fetchHiddenSummary, fetchJobs, logoColor, CITY_PAGES, type Job } from "@/lib/hireassist";
import { getSummariesBulk } from "@/lib/summary-cache";
import AlertSignup from "@/components/jobs/AlertSignup";

const SHOWCASE_EXCLUDE_PATTERN = /verkoopmedewerker|vakkenvuller|bezorger|schoonmaker|kassamedewerk|winkelmedewerk|orderpicker|inpak|magazijn|horeca|barista|ober|serveerst|afwas|keukenhulp|koerier|postbezorg|krantenbezorg/i;

export const revalidate = 1800;

const HOME_CITIES = [
  "amsterdam", "rotterdam", "den-haag", "utrecht",
  "eindhoven", "groningen", "delft", "nijmegen",
];

export default async function HomePage() {
  const data = await fetchHiddenSummary();
  let verified;
  let allJobs;
  try {
    [verified, allJobs] = await Promise.all([
      fetchJobs({ hidden: true, per_page: 30, sort: "newest" }),
      fetchJobs({ per_page: 1 }),
    ]);
  } catch {
    verified = null;
    allJobs = null;
  }

  let showcaseGems: Job[] = [];
  if (verified && verified.jobs.length > 0) {
    const summaries = getSummariesBulk(verified.jobs.map((j) => j.id));
    showcaseGems = verified.jobs.filter((j) => {
      if (!j.city) return false;
      if (SHOWCASE_EXCLUDE_PATTERN.test(j.title)) return false;
      const s = summaries.get(j.id);
      if (s && (s.role_category === "Other" || !s.summary)) return false;
      return true;
    }).slice(0, 6);
  }
  let companyCount: number | null = null;
  try {
    const companies = await fetchCompanies();
    companyCount = companies.length;
  } catch {}

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "CubeA",
        url: "https://cubea.nl",
        description:
          `CubeA crawls ${companyCount ? companyCount.toLocaleString("en-US") : "1,000+"} Dutch company career pages daily to surface jobs that never reach LinkedIn or Indeed — including English-speaking roles for internationals.`,
      },
      {
        "@type": "WebSite",
        name: "CubeA",
        url: "https://cubea.nl",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://cubea.nl/jobs?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      {/* HERO */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
            The Dutch jobs that aren&apos;t
            <br className="hidden sm:block" /> on LinkedIn or Indeed
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-500">
            We crawl {companyCount ? companyCount.toLocaleString("en-US") : "1,000+"} company career pages every day to surface roles the
            big job boards miss — including English-speaking jobs for
            internationals. You apply straight to the company.
          </p>

          <form action="/jobs" method="get" className="mx-auto mt-8 flex max-w-xl gap-2">
            <input
              type="text"
              name="q"
              placeholder="Job title, skill, or keyword…"
              className="min-w-0 flex-1 rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gem-wash focus:border-gem"
            />
            <button
              type="submit"
              className="rounded-xl bg-gem px-6 py-3 text-sm font-semibold text-white hover:bg-gem-deep"
            >
              Search
            </button>
          </form>

          {(allJobs || data) && (
            <div className="mt-10 flex justify-center gap-10 text-center">
              <Link href="/jobs" className="group">
                <div className="font-display text-2xl font-bold text-neutral-900 group-hover:text-gem">
                  {(allJobs?.count ?? data?.total_active ?? 0).toLocaleString("en-US")}
                </div>
                <div className="text-xs text-neutral-400 font-mono">jobs live now</div>
              </Link>
              <Link href="/hidden-gems" className="group">
                <div className="font-display text-2xl font-bold text-amber-600 group-hover:text-amber-700">
                  {(verified?.count ?? 0).toLocaleString("en-US")}
                </div>
                <div className="text-xs text-neutral-400 font-mono">💎 verified hidden gems</div>
              </Link>
              <Link href="/companies" className="group">
                <div className="font-display text-2xl font-bold text-neutral-900 group-hover:text-gem">
                  {companyCount ? companyCount.toLocaleString("en-US") : "1,000+"}
                </div>
                <div className="text-xs text-neutral-400 font-mono">companies crawled</div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            ["🕷️", "We crawl career pages", `Every day, directly from ${companyCount ? companyCount.toLocaleString("en-US") : "1,000+"} Dutch company websites — not just the big job boards.`],
            ["💎", "We spot hidden gems", "Jobs that were never syndicated to LinkedIn or Indeed get flagged — less competition for you."],
            ["🎯", "You apply directly", "Every apply button goes straight to the company. No recruiters, no middlemen, no account needed."],
          ].map(([icon, title, body]) => (
            <div key={title as string} className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="text-2xl">{icon}</div>
              <h2 className="mt-3 font-display font-bold text-neutral-900">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-neutral-500">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FRESH GEMS */}
      {showcaseGems.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-14">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-bold">Freshly discovered gems</h2>
            <Link href="/hidden-gems" className="text-sm text-amber-600 hover:underline">
              See all →
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {showcaseGems.map((j) => (
              <Link
                key={j.id}
                href={`/jobs/${j.slug}`}
                target="_blank"
                className="rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-amber-300 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${logoColor(j.company)}`}>
                    {j.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{j.title}</div>
                    <div className="truncate text-xs text-neutral-400 font-mono">
                      {j.company}
                      {j.city ? ` · ${j.city}` : ""}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* EMAIL ALERT */}
      <section className="mx-auto max-w-5xl px-4 pb-14">
        <Suspense>
          <AlertSignup
            heading="🔔 Get new jobs by email — including hidden gems"
            subtext="One daily email with fresh roles straight from company career pages. Double opt-in, unsubscribe anytime."
          />
        </Suspense>
      </section>

      {/* CITIES */}
      <section className="mx-auto max-w-5xl px-4 pb-14">
        <h2 className="font-display text-xl font-bold">Jobs by city</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {HOME_CITIES.map((slug) => (
            <Link
              key={slug}
              href={`/jobs/${slug}`}
              className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-center font-medium text-neutral-700 transition hover:border-gem hover:text-gem"
            >
              {CITY_PAGES[slug]}
            </Link>
          ))}
        </div>
      </section>

      {/* EMPLOYER STRIP */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-8">
          <p className="text-sm text-neutral-500">
            <span className="font-semibold text-neutral-900">Hiring?</span>{" "}
            Reach candidates who found you here — or let us help you shortlist.
          </p>
          <Link
            href="/recruiters"
            className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            For employers →
          </Link>
        </div>
      </section>
    </main>
  );
}
