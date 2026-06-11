"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const CITIES = [
  "Amsterdam", "Rotterdam", "Den Haag", "Utrecht", "Eindhoven",
  "Groningen", "Delft", "Haarlem", "Leiden", "Nijmegen",
];

export default function JobFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");

  const city = params.get("city") || "";
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

  return (
    <div className="space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply({ q });
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Job title or keyword…"
          className="flex-1 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={city}
          onChange={(e) => apply({ city: e.target.value || null })}
          className="rounded-xl border border-neutral-300 px-3 py-2.5 text-sm bg-white"
        >
          <option value="">All cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-blue-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2 text-sm">
        <button
          onClick={() => apply({ hidden: hidden ? null : "true" })}
          className={`rounded-full border px-3.5 py-1.5 transition ${
            hidden
              ? "bg-fuchsia-600 border-fuchsia-600 text-white"
              : "border-fuchsia-300 text-fuchsia-700 hover:bg-fuchsia-50"
          }`}
        >
          💎 Hidden gems
        </button>
        <button
          onClick={() => apply({ english_only: englishOnly ? null : "true" })}
          className={`rounded-full border px-3.5 py-1.5 transition ${
            englishOnly
              ? "bg-blue-600 border-blue-600 text-white"
              : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          English only
        </button>
        <button
          onClick={() => apply({ new_today_only: newToday ? null : "true" })}
          className={`rounded-full border px-3.5 py-1.5 transition ${
            newToday
              ? "bg-emerald-600 border-emerald-600 text-white"
              : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          New today
        </button>
      </div>
    </div>
  );
}
