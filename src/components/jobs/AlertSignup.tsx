"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

export default function AlertSignup() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const q = params.get("q") || "";
  const city = params.get("city") || "";
  const hidden = params.get("hidden") === "true";
  const englishOnly = params.get("english_only") === "true";

  const filterBits = [
    q && `"${q}"`,
    city,
    hidden && "hidden gems",
    englishOnly && "English only",
  ].filter(Boolean);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const filters: Record<string, unknown> = { country: "Netherlands" };
      if (q) filters.q = q;
      if (city) filters.city = city;
      if (hidden) filters.hidden = true;
      if (englishOnly) filters.english_only = true;

      const res = await fetch("/api/job-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, filters }),
      });
      const data = await res.json();
      setMessage(data.message || "");
      setState(data.ok ? "done" : "error");
      if (data.ok) {
        track("sign_up", {
          method: "job_alert",
          city: city || undefined,
          query: q || undefined,
          hidden_gems: hidden,
        });
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
        <strong>Almost there!</strong> {message || "Check your email to confirm your alert."}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm">
          <div className="font-semibold text-neutral-900">
            🔔 Get new {filterBits.length > 0 ? "matching " : ""}jobs by email
          </div>
          <div className="text-neutral-600">
            {filterBits.length > 0
              ? `Daily alert for: ${filterBits.join(", ")}`
              : "A daily email when new jobs appear — including hidden gems."}
          </div>
        </div>
        <form onSubmit={subscribe} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className="rounded-xl bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {state === "sending" ? "…" : "Set alert"}
          </button>
        </form>
      </div>
      {state === "error" && message && (
        <p className="mt-2 text-xs text-red-600">{message}</p>
      )}
      <p className="mt-2 text-[11px] text-neutral-400">
        Double opt-in, unsubscribe with one click.{" "}
        <Link href="/privacy" className="underline">
          Privacy policy
        </Link>
      </p>
    </div>
  );
}
