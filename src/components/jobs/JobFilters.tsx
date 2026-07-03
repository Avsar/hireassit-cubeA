"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const CITIES = [
  "Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven",
  "Groningen", "Delft", "Haarlem", "Leiden", "Nijmegen",
  "Breda", "Tilburg", "Arnhem", "Maastricht", "Almere",
];

const ROLE_OPTIONS: [string, string][] = [
  ["engineering", "Engineering"],
  ["developer", "Developer"],
  ["data", "Data"],
  ["product", "Product"],
  ["design", "Design"],
  ["devops", "DevOps & Cloud"],
  ["security", "Security"],
  ["marketing", "Marketing"],
  ["sales", "Sales"],
  ["finance", "Finance"],
];

export default function JobFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [cityQuery, setCityQuery] = useState(params.get("city") || "");
  const [cityOpen, setCityOpen] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  const city = params.get("city") || "";
  const role = params.get("role") || "";
  const remote = params.get("remote") === "true";
  const hidden = params.get("hidden") === "true";
  const englishOnly = params.get("english_only") === "true";
  const newToday = params.get("new_today_only") === "true";
  const sort = params.get("sort") || "newest";

  const hasFilters = !!(q || city || role || remote || hidden || englishOnly || newToday);

  function apply(overrides: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    next.delete("page");
    for (const [k, v] of Object.entries(overrides)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    const qs = next.toString();
    router.push(qs ? `/jobs?${qs}` : "/jobs");
  }

  const filteredCities = CITIES.filter((c) =>
    c.toLowerCase().includes(cityQuery.toLowerCase())
  );

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
      setCityOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [handleClickOutside]);

  const chip = (active: boolean) =>
    `inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition cursor-pointer ${
      active
        ? "border-gem bg-gem text-white"
        : "border-neutral-300 bg-white text-neutral-600 hover:border-gem hover:text-gem"
    }`;

  const gemChip = (active: boolean) =>
    `inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition cursor-pointer ${
      active
        ? "border-amber-500 bg-amber-500 text-white"
        : "border-amber-200 bg-white text-amber-700 hover:border-amber-400"
    }`;

  return (
    <div className="space-y-3">
      {/* Row 1: Search + City + Role */}
      <div className="flex flex-wrap items-center gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            apply({ q: q || null });
          }}
          className="relative flex-1 min-w-[200px]"
        >
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='Try "python", "Adyen", or "UX designer"…'
            className="w-full rounded-full border border-neutral-300 bg-white py-2 pl-9 pr-3.5 text-sm focus:border-gem focus:outline-none focus:ring-2 focus:ring-gem-wash"
          />
        </form>

        {/* City typeahead */}
        <div ref={cityRef} className="relative">
          <input
            type="text"
            value={cityQuery}
            onChange={(e) => {
              setCityQuery(e.target.value);
              setCityOpen(true);
              if (!e.target.value) apply({ city: null });
            }}
            onFocus={() => setCityOpen(true)}
            placeholder="City…"
            className="w-[140px] rounded-full border border-neutral-300 bg-white px-3.5 py-2 text-sm focus:border-gem focus:outline-none focus:ring-2 focus:ring-gem-wash"
          />
          {cityOpen && filteredCities.length > 0 && (
            <div className="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
              {filteredCities.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCityQuery(c);
                    setCityOpen(false);
                    apply({ city: c });
                  }}
                  className={`block w-full px-3.5 py-2 text-left text-sm hover:bg-gem-wash ${
                    c === city ? "font-medium text-gem" : "text-neutral-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Role dropdown */}
        <div className="relative">
          <select
            value={role}
            onChange={(e) => apply({ role: e.target.value || null })}
            className="appearance-none rounded-full border border-neutral-300 bg-white py-2 pl-3.5 pr-8 text-sm font-medium text-neutral-600 focus:border-gem focus:outline-none focus:ring-2 focus:ring-gem-wash"
          >
            <option value="">All roles</option>
            {ROLE_OPTIONS.map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
            ▾
          </span>
        </div>
      </div>

      {/* Row 2: Toggle chips + Sort */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => apply({ remote: remote ? null : "true" })}
          className={chip(remote)}
        >
          Remote / Hybrid
        </button>
        <button
          type="button"
          onClick={() => apply({ hidden: hidden ? null : "true" })}
          className={gemChip(hidden)}
        >
          💎 Hidden gems
        </button>
        <button
          type="button"
          onClick={() => apply({ english_only: englishOnly ? null : "true" })}
          className={chip(englishOnly)}
        >
          English OK
        </button>
        <button
          type="button"
          onClick={() => apply({ new_today_only: newToday ? null : "true" })}
          className={chip(newToday)}
        >
          New today
        </button>

        {/* Sort toggle */}
        <div className="ml-auto flex rounded-full border border-neutral-300 bg-white p-0.5">
          <button
            type="button"
            onClick={() => apply({ sort: "newest" })}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              sort === "newest"
                ? "bg-neutral-800 text-white"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Newest
          </button>
          <button
            type="button"
            onClick={() => apply({ sort: "salary" })}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              sort === "salary"
                ? "bg-neutral-800 text-white"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Salary
          </button>
        </div>
      </div>

      {/* Active filter summary + clear */}
      {hasFilters && (
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span>
            Filtered: {[
              q && `"${q}"`,
              city,
              role,
              remote && "remote",
              hidden && "gems",
              englishOnly && "English",
              newToday && "new today",
            ].filter(Boolean).join(" · ")}
          </span>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setCityQuery("");
              router.push("/jobs");
            }}
            className="text-gem underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
