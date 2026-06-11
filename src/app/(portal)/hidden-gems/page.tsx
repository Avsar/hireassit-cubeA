import { Metadata } from "next";
import Link from "next/link";
import { fetchHiddenSummary } from "@/lib/hireassist";

export const metadata: Metadata = {
  title: "Hidden Job Gems — Dutch jobs you won't find on LinkedIn | CubeA",
  description:
    "Thousands of jobs at Dutch companies that never reach LinkedIn or Indeed — scraped daily, directly from company career pages. Less competition, real opportunities.",
};

export const revalidate = 1800;

export default async function HiddenGemsPage() {
  const data = await fetchHiddenSummary();

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="bg-fuchsia-700 text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-4xl font-bold">💎 Hidden job gems</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-fuchsia-100">
            Most Dutch companies never post their vacancies on LinkedIn or
            Indeed — they just put them on their own website. We crawl those
            career pages every day, so you see jobs almost nobody else is
            applying to.
          </p>
          {data && (
            <div className="mx-auto mt-8 flex max-w-lg justify-center gap-8">
              <div>
                <div className="text-3xl font-bold">{data.hidden_gems.toLocaleString("en-US")}</div>
                <div className="text-sm text-fuchsia-200">hidden gems live now</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{data.low_visibility.toLocaleString("en-US")}</div>
                <div className="text-sm text-fuchsia-200">low-visibility jobs</div>
              </div>
            </div>
          )}
          <Link
            href="/jobs?hidden=true"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-fuchsia-700 hover:bg-fuchsia-50"
          >
            Browse all hidden gems →
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 space-y-10">
        <section>
          <h2 className="text-xl font-bold">Why “hidden”?</h2>
          <p className="mt-2 text-neutral-600 leading-relaxed">
            Posting on big job boards costs money, so small and mid-sized
            companies often skip it entirely. Their vacancies live only on
            their own career pages — visited by almost nobody. We label a job
            a <strong>hidden gem</strong> when we scraped it directly from a
            company website, and <strong>low visibility</strong> when it comes
            from a small company that rarely syndicates to job boards. Fewer
            applicants per role means your application actually gets read.
          </p>
        </section>

        {data && data.top_companies.length > 0 && (
          <section>
            <h2 className="text-xl font-bold">Companies full of hidden gems</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.top_companies.map((c) => (
                <Link
                  key={c.slug}
                  href={`/companies/${c.slug}`}
                  className="rounded-xl border border-neutral-200 bg-white px-4 py-3 hover:border-fuchsia-300"
                >
                  <div className="font-semibold truncate">{c.name}</div>
                  <div className="text-xs text-fuchsia-600">💎 {c.hidden_gems} hidden gems</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {data && data.recent_gems.length > 0 && (
          <section>
            <h2 className="text-xl font-bold">Freshly discovered</h2>
            <div className="mt-4 grid gap-2">
              {data.recent_gems.map((j) => (
                <Link
                  key={j.id}
                  href={`/jobs/${j.slug}`}
                  target="_blank"
                  className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 hover:border-fuchsia-300"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{j.title}</div>
                    <div className="text-xs text-neutral-400">
                      {j.company}
                      {j.city ? ` · ${j.city}` : ""}
                    </div>
                  </div>
                  <span className="shrink-0 text-fuchsia-600">💎</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
