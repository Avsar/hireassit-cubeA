import { Metadata } from "next";
import Link from "next/link";
import { fetchCompanies } from "@/lib/hireassist";

export const metadata: Metadata = {
  title: "Dutch Tech Companies Hiring Now — 700+ profiles | CubeA",
  description:
    "Browse 700+ Dutch companies with open vacancies, including small companies whose jobs never reach LinkedIn.",
};

export const revalidate = 3600;

export default async function CompaniesPage() {
  let companies;
  try {
    companies = await fetchCompanies();
  } catch {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Company directory is briefly unavailable</h1>
        <p className="mt-2 text-neutral-500">Please refresh in a few seconds.</p>
      </main>
    );
  }

  const totalJobs = companies.reduce((s, c) => s + c.active_jobs, 0);

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="bg-blue-600 text-white">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="text-3xl font-bold">Companies hiring in the Netherlands</h1>
          <p className="mt-2 text-blue-100">
            {companies.length.toLocaleString("en-US")} companies ·{" "}
            {totalJobs.toLocaleString("en-US")} open positions — crawled daily,
            straight from the source.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-4 flex gap-4 text-sm">
          <Link href="/jobs" className="text-blue-600 hover:underline">← All jobs</Link>
          <Link href="/hidden-gems" className="text-fuchsia-600 hover:underline">💎 Hidden gems</Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((c) => (
            <Link
              key={c.slug}
              href={`/companies/${c.slug}`}
              className="rounded-2xl border border-neutral-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm transition"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{c.name}</div>
                  {c.main_city && (
                    <div className="text-xs text-neutral-400 truncate">{c.main_city}</div>
                  )}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-0.5">
                  {c.active_jobs} {c.active_jobs === 1 ? "job" : "jobs"}
                </span>
                {c.hidden_gems > 0 && (
                  <span className="rounded-full bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-700 px-2.5 py-0.5">
                    💎 {c.hidden_gems}
                  </span>
                )}
                {c.new_this_week > 0 && (
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5">
                    +{c.new_this_week} this week
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
