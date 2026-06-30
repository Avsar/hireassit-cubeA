import { Suspense } from "react";
import Link from "next/link";
import { fetchHiddenSummary, fetchJobs, logoColor, CITY_PAGES } from "@/lib/hireassist";
import AlertSignup from "@/components/jobs/AlertSignup";

export const revalidate = 1800;

const HOME_CITIES = [
  "amsterdam", "rotterdam", "den-haag", "utrecht",
  "eindhoven", "groningen", "delft", "nijmegen",
];

export default async function HomePage() {
  const data = await fetchHiddenSummary();
  let verified;
  try {
    verified = await fetchJobs({ hidden: true, per_page: 6, sort: "newest" });
  } catch {
    verified = null;
  }

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "CubeA",
        url: "https://cubea.nl",
        description:
          "CubeA crawls 1,000+ Dutch company career pages daily to surface jobs that never reach LinkedIn or Indeed — including English-speaking roles for internationals.",
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
      {/* HERO — search first */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="font-[Sora] text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
            The Dutch jobs that aren&apos;t
            <br className="hidden sm:block" /> on LinkedIn or Indeed
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-500">
            We crawl 1,000+ company career pages every day to surface roles the
            big job boards miss — including English-speaking jobs for
            internationals. You apply straight to the company.
          </p>

          <form action="/jobs" method="get" className="mx-auto mt-8 flex max-w-xl gap-2">
            <input
              type="text"
              name="q"
              placeholder="Job title, skill, or keyword…"
              className="min-w-0 flex-1 rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          {data && (
            <div className="mt-10 flex justify-center gap-10 text-center">
              <div>
                <div className="font-[Sora] text-2xl font-bold text-neutral-900">
                  {data.total_active.toLocaleString("en-US")}
                </div>
                <div className="text-xs text-neutral-400">jobs live now</div>
              </div>
              <Link href="/hidden-gems" className="group">
                <div className="font-[Sora] text-2xl font-bold text-fuchsia-600 group-hover:text-fuchsia-700">
                  {(verified?.count ?? 0).toLocaleString("en-US")}
                </div>
                <div className="text-xs text-neutral-400">💎 verified hidden gems</div>
              </Link>
              <Link href="/companies" className="group">
                <div className="font-[Sora] text-2xl font-bold text-neutral-900 group-hover:text-blue-700">
                  1,000+
                </div>
                <div className="text-xs text-neutral-400">companies crawled</div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            ["🕷️", "We crawl career pages", "Every day, directly from 1,000+ Dutch company websites — not just the big job boards."],
            ["💎", "We spot hidden gems", "Jobs that were never syndicated to LinkedIn or Indeed get flagged — less competition for you."],
            ["🎯", "You apply directly", "Every apply button goes straight to the company. No recruiters, no middlemen, no account needed."],
          ].map(([icon, title, body]) => (
            <div key={title as string} className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="text-2xl">{icon}</div>
              <h2 className="mt-3 font-[Sora] font-semibold text-neutral-900">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-neutral-500">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FRESH GEMS */}
      {verified && verified.jobs.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-14">
          <div className="flex items-baseline justify-between">
            <h2 className="font-[Sora] text-xl font-bold">Freshly discovered gems</h2>
            <Link href="/hidden-gems" className="text-sm text-fuchsia-600 hover:underline">
              See all →
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {verified.jobs.slice(0, 6).map((j) => (
              <Link
                key={j.id}
                href={`/jobs/${j.slug}`}
                target="_blank"
                className="rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-fuchsia-300 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${logoColor(j.company)}`}>
                    {j.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{j.title}</div>
                    <div className="truncate text-xs text-neutral-400">
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
        <h2 className="font-[Sora] text-xl font-bold">Jobs by city</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {HOME_CITIES.map((slug) => (
            <Link
              key={slug}
              href={`/jobs/${slug}`}
              className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-center font-medium text-neutral-700 transition hover:border-blue-300 hover:text-blue-700"
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
