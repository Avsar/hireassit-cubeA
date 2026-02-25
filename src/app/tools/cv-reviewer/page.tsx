"use client";

import Link from "next/link";
import { useState } from "react";
import CubeALogo from "@/components/CubeALogo";
import CVReviewResult, {
  type CVReviewResult as CVReviewResultType,
} from "@/components/tools/CVReviewResult";

type State =
  | { phase: "input" }
  | { phase: "loading" }
  | { phase: "result"; data: CVReviewResultType }
  | { phase: "error"; message: string };

export default function CVReviewerPage() {
  const [cvText, setCvText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [state, setState] = useState<State>({ phase: "input" });

  async function handleSubmit() {
    if (cvText.trim().length < 200) return;
    setState({ phase: "loading" });
    try {
      const res = await fetch("/api/cv-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, targetRole: targetRole.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState({ phase: "error", message: data?.error || "Something went wrong." });
        return;
      }
      setState({ phase: "result", data });
    } catch (e: any) {
      setState({ phase: "error", message: e?.message || "Network error. Please try again." });
    }
  }

  function reset() {
    setState({ phase: "input" });
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <CubeALogo />
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-neutral-600 hover:text-black">
              Home
            </Link>
            <Link href="/blog" className="text-neutral-600 hover:text-black">
              Blog
            </Link>
            <Link href="/tools/cv-reviewer" className="font-medium text-black">
              CV Reviewer
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Input state */}
        {(state.phase === "input" || state.phase === "error") && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight">CV Reviewer</h1>
              <p className="mt-2 text-neutral-600 max-w-xl">
                Get expert feedback tailored to the Dutch tech job market.
              </p>
            </div>

            {state.phase === "error" && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {state.message}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Your CV</label>
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Paste your CV text here…"
                  className="min-h-[320px] w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-y"
                />
                {cvText.trim().length > 0 && cvText.trim().length < 200 && (
                  <p className="text-xs text-red-500">
                    Please paste at least 200 characters ({200 - cvText.trim().length} more needed).
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Target role or job title{" "}
                  <span className="font-normal text-neutral-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Embedded Software Engineer"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <button
                  onClick={handleSubmit}
                  disabled={cvText.trim().length < 200}
                  className="px-5 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Review my CV
                </button>
                <p className="text-xs text-neutral-400">
                  Your CV is not stored. Reviewed instantly and discarded.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Loading state */}
        {state.phase === "loading" && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <svg
              className="h-8 w-8 animate-spin text-neutral-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <p className="text-sm text-neutral-500">Analysing your CV…</p>
          </div>
        )}

        {/* Results state */}
        {state.phase === "result" && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Your CV Review</h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Tailored for the Dutch / Brainport tech market.
                </p>
              </div>
              <button
                onClick={reset}
                className="text-sm text-neutral-500 hover:text-black transition-colors"
              >
                ← Start over
              </button>
            </div>
            <CVReviewResult result={state.data} />
          </>
        )}
      </main>

      <footer className="border-t border-neutral-200 bg-white mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-neutral-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CubeALogo iconSize={24} />
            <div className="mt-1">© {new Date().getFullYear()} CubeA. All rights reserved.</div>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-neutral-900">Privacy</Link>
            <Link href="/terms" className="hover:text-neutral-900">Terms</Link>
            <Link href="/impressum" className="hover:text-neutral-900">Impressum</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
