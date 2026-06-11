"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CompanySummary, logoColor } from "@/lib/hireassist";

export default function CompanyDirectory({ companies }: { companies: CompanySummary[] }) {
  const [filter, setFilter] = useState("");
  const [gemsOnly, setGemsOnly] = useState(false);

  const visible = useMemo(() => {
    const f = filter.trim().toLowerCase();
    return companies.filter(
      (c) =>
        (!gemsOnly || c.hidden_gems > 0) &&
        (!f || c.name.toLowerCase().includes(f) || c.main_city.toLowerCase().includes(f)),
    );
  }, [companies, filter, gemsOnly]);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name or city…"
          className="w-full max-w-xs rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setGemsOnly(!gemsOnly)}
          className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
            gemsOnly
              ? "border-fuchsia-600 bg-fuchsia-600 text-white"
              : "border-fuchsia-200 text-fuchsia-700 hover:bg-fuchsia-50"
          }`}
        >
          💎 With hidden gems
        </button>
        <span className="text-sm text-neutral-400">
          {visible.length.toLocaleString("en-US")} companies
        </span>
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-neutral-500">
          No companies match “{filter}”.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((c) => (
            <Link
              key={c.slug}
              href={`/companies/${c.slug}`}
              className="rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${logoColor(c.name)}`}>
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold">{c.name}</div>
                  {c.main_city && (
                    <div className="truncate text-xs text-neutral-400">{c.main_city}</div>
                  )}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-blue-700">
                  {c.active_jobs} {c.active_jobs === 1 ? "job" : "jobs"}
                </span>
                {c.hidden_gems > 0 && (
                  <span className="rounded-full border border-fuchsia-200 bg-fuchsia-50 px-2.5 py-0.5 text-fuchsia-700">
                    💎 {c.hidden_gems}
                  </span>
                )}
                {c.new_this_week > 0 && (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-emerald-700">
                    +{c.new_this_week} this week
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
