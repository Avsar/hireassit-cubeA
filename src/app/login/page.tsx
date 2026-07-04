"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || "");
      setState(res.ok ? "done" : "error");
    } catch {
      setMessage("Something went wrong. Please try again.");
      setState("error");
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8">
          <h1 className="font-display text-2xl font-bold text-neutral-900">Log in to CubeA</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Enter your email and we&apos;ll send you a one-tap login link — no password needed.
          </p>

          {state === "done" ? (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              {message || "Check your email for a login link."} It expires in 15 minutes.
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-gem-wash"
              />
              <button
                type="submit"
                disabled={state === "sending"}
                className="w-full rounded-xl bg-gem px-6 py-2.5 font-semibold text-white hover:bg-gem-deep disabled:opacity-60"
              >
                {state === "sending" ? "Sending…" : "Send me a login link"}
              </button>
              {state === "error" && (
                <p className="text-sm text-red-600">{message || "Please try again."}</p>
              )}
            </form>
          )}

          <p className="mt-6 text-xs text-neutral-400">
            Logging in lets you manage your job alerts and preferences.{" "}
            <Link href="/jobs" className="text-gem hover:underline">
              Browse jobs
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
