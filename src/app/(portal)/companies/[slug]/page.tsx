import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchCompanyDetail, logoColor, timeAgo } from "@/lib/hireassist";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const co = await fetchCompanyDetail(params.slug);
  if (!co) return { title: "Company not found | CubeA" };
  const cityPart = co.cities.length ? ` in ${co.cities.slice(0, 3).join(", ")}` : "";
  // Titles target the queries people actually search for a company:
  // "<company> vacatures", "<company> careers", "jobs at <company>".
  const title = `${co.name} vacatures & careers — ${co.active_jobs} open jobs | CubeA`;
  const description = `All ${co.active_jobs} open vacancies and jobs at ${co.name}${cityPart}, crawled daily straight from their career page${
    co.hidden_gems > 0 ? ` — including ${co.hidden_gems} hidden roles not posted on LinkedIn or Indeed` : ""
  }.`;
  return {
    title,
    description,
    alternates: { canonical: `/companies/${params.slug}` },
    openGraph: { title, description, url: `/companies/${params.slug}`, type: "website" },
  };
}

function HistoryBars({ history }: { history: { stat_date: string; active_jobs: number }[] }) {
  if (history.length < 2) return null;
  const max = Math.max(...history.map((h) => h.active_jobs), 1);
  return (
    <div>
      <div className="text-xs text-neutral-400 mb-1">Active jobs, last 30 days</div>
      <div className="flex items-end gap-[2px] h-12">
        {history.map((h) => (
          <div
            key={h.stat_date}
            title={`${h.stat_date}: ${h.active_jobs} jobs`}
            className="flex-1 rounded-t bg-blue-400/70 min-w-[3px]"
            style={{ height: `${Math.max(8, (h.active_jobs / max) * 100)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export default async function CompanyPage({ params }: Props) {
  const co = await fetchCompanyDetail(params.slug);
  if (!co) notFound();

  const companyUrl = `https://cubea.nl/companies/${params.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: co.name,
        url: companyUrl,
        ...(co.cities.length
          ? { address: { "@type": "PostalAddress", addressLocality: co.cities[0], addressCountry: "NL" } }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://cubea.nl" },
          { "@type": "ListItem", position: 2, name: "Companies", item: "https://cubea.nl/companies" },
          { "@type": "ListItem", position: 3, name: co.name, item: companyUrl },
        ],
      },
      {
        "@type": "ItemList",
        name: `Open jobs at ${co.name}`,
        numberOfItems: co.jobs.length,
        itemListElement: co.jobs.slice(0, 25).map((j, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: j.title,
          url: `https://cubea.nl/jobs/${j.slug}`,
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex gap-4 text-sm">
          <Link href="/companies" className="text-blue-600 hover:underline">← All companies</Link>
          <Link href="/jobs" className="text-blue-600 hover:underline">All jobs</Link>
        </div>

        <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className={`h-14 w-14 rounded-full text-white flex items-center justify-center text-lg font-semibold ${logoColor(co.name)}`}>
              {co.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{co.name}</h1>
              {co.cities.length > 0 && (
                <div className="text-sm text-neutral-500">
                  📍 {co.cities.slice(0, 4).join(" · ")}
                </div>
              )}
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="rounded-xl bg-neutral-50 p-3">
              <dd className="text-2xl font-bold text-blue-700">{co.active_jobs}</dd>
              <dt className="text-xs text-neutral-500">Open positions</dt>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3">
              <dd className="text-2xl font-bold text-fuchsia-700">{co.hidden_gems}</dd>
              <dt className="text-xs text-neutral-500">Hidden gems</dt>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3">
              <dd className="text-2xl font-bold text-neutral-700">{co.hidden_share}%</dd>
              <dt className="text-xs text-neutral-500">Not on big boards</dt>
            </div>
          </dl>

          {co.history.length > 1 && (
            <div className="mt-6">
              <HistoryBars history={co.history} />
            </div>
          )}
        </div>

        <p className="mt-6 text-sm leading-relaxed text-neutral-600">
          Browse all {co.active_jobs} open {co.name} vacancies and jobs below — crawled daily
          straight from {co.name}&apos;s own career page
          {co.cities.length ? `, across ${co.cities.slice(0, 3).join(", ")}` : ""}.
          {co.hidden_gems > 0
            ? ` ${co.hidden_gems} of them are hidden gems: roles that never reached LinkedIn or Indeed.`
            : ""}{" "}
          Applying always goes directly to {co.name} — no recruiters in between.
        </p>

        <h2 className="mt-8 text-sm font-semibold text-neutral-500 uppercase tracking-wide">
          Open positions
        </h2>
        <div className="mt-3 grid gap-2">
          {co.jobs.map((j) => (
            <Link
              key={j.id}
              href={`/jobs/${j.slug}`}
              target="_blank"
              className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 hover:border-blue-300"
            >
              <div className="min-w-0">
                <div className="font-medium truncate">{j.title}</div>
                <div className="text-xs text-neutral-400">
                  {[j.city || j.location_raw.slice(0, 30), j.job_type].filter(Boolean).join(" · ")}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-xs">
                {j.hidden_tier >= 2 && <span title="Hidden gem">💎</span>}
                <span className="text-neutral-400">{timeAgo(j.first_seen_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
