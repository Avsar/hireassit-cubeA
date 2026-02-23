"use client";

import Link from "next/link";
import { useState } from "react";

export default function AiMatchPage() {
  const [jd, setJd] = useState("");
  const [cv, setCv] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleMatch() {
    if (!jd.trim() || !cv.trim()) return;
    setLoading(true);
    setScore(null);
    setHighlights([]);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd, cv }),
      });
      const data = await res.json();
      if (typeof data?.score === "number") {
        setScore(Math.max(0, Math.min(100, data.score)));
        setHighlights(Array.isArray(data.highlights) ? data.highlights.slice(0, 10) : []);
      } else {
        setScore(0);
        setHighlights([]);
      }
    } catch {
      setScore(0);
      setHighlights([]);
    } finally {
      setLoading(false);
    }
  }

  const scoreColor =
    score === null ? ""
    : score >= 70 ? "text-green-700"
    : score >= 40 ? "text-yellow-700"
    : "text-red-600";

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-black text-white font-bold grid place-items-center text-sm">
              AI
            </div>
            <div className="font-semibold tracking-tight">HireAssist by CubeA</div>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-neutral-600 hover:text-black">
              Home
            </Link>
            <Link href="/blog" className="text-neutral-600 hover:text-black">
              Blog
            </Link>
            <Link href="/tools/ai-match" className="font-medium text-black">
              AI Match
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <span className="inline-block rounded-full bg-neutral-100 border border-neutral-200 px-3 py-1 text-xs text-neutral-500 mb-3">
            Keyword demo — not the production engine
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">AI Match</h1>
          <p className="mt-2 text-neutral-600 max-w-xl">
            Paste a job description and a CV to get an instant keyword-overlap score.
            The production system uses embeddings and semantic matching — this is a
            lightweight preview.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Job Description</label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the job description here…"
              className="flex-1 min-h-[300px] w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-y"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Candidate CV</label>
            <textarea
              value={cv}
              onChange={(e) => setCv(e.target.value)}
              placeholder="Paste the candidate CV here…"
              className="flex-1 min-h-[300px] w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-y"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={handleMatch}
            disabled={loading || !jd.trim() || !cv.trim()}
            className="px-5 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Scoring…" : "Score match"}
          </button>
          {(jd || cv) && (
            <button
              onClick={() => { setJd(""); setCv(""); setScore(null); setHighlights([]); }}
              className="text-sm text-neutral-500 hover:text-black"
            >
              Clear
            </button>
          )}
        </div>

        {score !== null && (
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-baseline gap-3">
              <span className={`text-4xl font-extrabold tabular-nums ${scoreColor}`}>
                {score}%
              </span>
              <span className="text-sm text-neutral-500">match score</span>
            </div>

            <div className="mt-4 h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-2.5 bg-black rounded-full transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>

            {highlights.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                  Keyword overlap
                </p>
                <div className="flex flex-wrap gap-2">
                  {highlights.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 rounded-lg bg-neutral-100 text-xs text-neutral-700"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-4 text-xs text-neutral-400">
              Demo only — results are based on keyword overlap, not semantic
              understanding. The production engine uses embeddings and human review.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-200 bg-white mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-neutral-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-neutral-900">HireAssist by CubeA</div>
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
