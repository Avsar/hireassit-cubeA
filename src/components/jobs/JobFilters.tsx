"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const CITIES = [
  "Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven",
  "Groningen", "Delft", "Haarlem", "Leiden", "Nijmegen",
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

const JOB_TYPES: [string, string][] = [
  ["fulltime", "Full-time"],
  ["parttime", "Part-time"],
  ["internship", "Internship"],
  ["contract", "Contract / freelance"],
];

export default function JobFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");

  const city = params.get("city") || "";
  const role = params.get("role") || "";
  const jobType = params.get("job_type") || "";
  const remote = params.get("remote") === "true";
  const hidden = params.get("hidden") === "true";
  const englishOnly = params.get("english_only") === "true";
  const newToday = params.get("new_today_only") === "true";

  function apply(overrides: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    next.delete("page");
    for (const [k, v] of Object.entries(overrides)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    router.push(`/jobs?${next.toString()}`);
  }

  const toggle = (active: boolean, activeCls: string, idleCls: string) =>
    `w-full rounded-xl border px-3.5 py-2 text-left text-sm transition ${active ? activeCls : idleCls}`;

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply({ q });
        }}
        className="space-y-2"
      >
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Search
        </label>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Title, skill, keyword…"
          className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          City
        </label>
        <select
          value={city}
          onChange={(e) => apply({ city: e.target.value || null })}
          className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm"
        >
          <option value="">All cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Role
        </label>
        <select
          value={role}
          onChange={(e) => apply({ role: e.target.value || null })}
          className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm"
        >
          <option value="">All roles</option>
          {ROLE_OPTIONS.map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Job type
        </label>
        <select
          value={jobType}
          onChange={(e) => apply({ job_type: e.target.value || null })}
          className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm"
        >
          <option value="">Any type</option>
          {JOB_TYPES.map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Show me
        </label>
        <button
          onClick={() => apply({ remote: remote ? null : "true" })}
          className={toggle(remote,
            "border-teal-600 bg-teal-600 text-white",
            "border-neutral-200 text-neutral-600 hover:bg-neutral-50")}
        >
          🏠 Remote / hybrid
        </button>
        <button
          onClick={() => apply({ hidden: hidden ? null : "true" })}
          className={toggle(hidden,
            "border-fuchsia-600 bg-fuchsia-600 text-white",
            "border-fuchsia-200 text-fuchsia-700 hover:bg-fuchsia-50")}
        >
          💎 Hidden gems only
        </button>
        <button
          onClick={() => apply({ english_only: englishOnly ? null : "true" })}
          className={toggle(englishOnly,
            "border-blue-600 bg-blue-600 text-white",
            "border-neutral-200 text-neutral-600 hover:bg-neutral-50")}
        >
          English-language jobs
        </button>
        <button
          onClick={() => apply({ new_today_only: newToday ? null : "true" })}
          className={toggle(newToday,
            "border-emerald-600 bg-emerald-600 text-white",
            "border-neutral-200 text-neutral-600 hover:bg-neutral-50")}
        >
          New today
        </button>
      </div>

      {(q || city || role || jobType || remote || hidden || englishOnly || newToday) && (
        <button
          onClick={() => router.push("/jobs")}
          className="w-full text-center text-xs text-neutral-400 hover:text-neutral-600"
        >
          Reset all filters
        </button>
      )}
    </div>
  );
}
