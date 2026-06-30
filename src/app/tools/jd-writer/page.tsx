"use client";

import Link from "next/link";
import { useState } from "react";
import CubeALogo from "@/components/CubeALogo";
import JDResult, { type JDResultData } from "@/components/tools/JDResult";

type State =
  | { phase: "input" }
  | { phase: "loading" }
  | { phase: "result"; data: JDResultData }
  | { phase: "error"; message: string };

const LEVELS = ["Junior", "Medior", "Senior", "Lead", "Principal / Staff"];

export default function JDWriterPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [skills, setSkills] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");
  const [language, setLanguage] = useState<"en" | "nl">("en");
  const [state, setState] = useState<State>({ phase: "input" });

  async function handleSubmit() {
    if (!jobTitle.trim()) return;
    setState({ phase: "loading" });
    try {
      const res = await fetch("/api/jd-writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: jobTitle.trim(),
          department: department.trim() || undefined,
          level: level || undefined,
          skills: skills.trim() || undefined,
          companyInfo: companyInfo.trim() || undefined,
          language,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState({
          phase: "error",
          message: data?.error || "Something went wrong.",
        });
        return;
      }
      setState({ phase: "result", data });
    } catch (e: any) {
      setState({
        phase: "error",
        message: e?.message || "Network error. Please try again.",
      });
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
            <Link
              href="/recruiters"
              className="text-neutral-600 hover:text-black"
            >
              Recruiter Tools
            </Link>
            <Link
              href="/tools/jd-writer"
              className="font-medium text-black"
            >
              JD Writer
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Input state */}
        {(state.phase === "input" || state.phase === "error") && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight">
                JD Writer
              </h1>
              <p className="mt-2 text-neutral-600 max-w-xl">
                Generate a polished, inclusive job description in seconds.
                Just tell us about the role.
              </p>
            </div>

            {state.phase === "error" && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {state.message}
              </div>
            )}

            <div className="space-y-4">
              {/* Job title — required */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Frontend Developer, Data Engineer, DevOps Lead"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              {/* Level + Department row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">
                    Seniority Level{" "}
                    <span className="font-normal text-neutral-400">
                      (optional)
                    </span>
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  >
                    <option value="">Select level…</option>
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">
                    Department{" "}
                    <span className="font-normal text-neutral-400">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Engineering, Data, Platform"
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
              </div>

              {/* Key skills */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Key Skills / Technologies{" "}
                  <span className="font-normal text-neutral-400">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, TypeScript, AWS, Python, Kubernetes"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              {/* Company info */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  About your company{" "}
                  <span className="font-normal text-neutral-400">
                    (optional — helps personalize the JD)
                  </span>
                </label>
                <textarea
                  value={companyInfo}
                  onChange={(e) => setCompanyInfo(e.target.value)}
                  placeholder="A few sentences about the company, culture, mission, or product…"
                  className="min-h-[120px] w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-y"
                />
              </div>

              {/* Language toggle */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Output Language</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      language === "en"
                        ? "bg-black text-white"
                        : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage("nl")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      language === "nl"
                        ? "bg-black text-white"
                        : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    Nederlands
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={!jobTitle.trim()}
                  className="px-5 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Generate JD
                </button>
                <p className="text-xs text-neutral-400">
                  Your input is not stored. Generated instantly and discarded.
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
            <p className="text-sm text-neutral-500">
              Writing your job description…
            </p>
          </div>
        )}

        {/* Results state */}
        {state.phase === "result" && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Your Job Description
                </h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Review, tweak, and copy — ready to post.
                </p>
              </div>
              <button
                onClick={reset}
                className="text-sm text-neutral-500 hover:text-black transition-colors"
              >
                ← Start over
              </button>
            </div>
            <JDResult result={state.data} />
          </>
        )}
      </main>

      <footer className="border-t border-neutral-200 bg-white mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-neutral-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CubeALogo iconSize={24} />
            <div className="mt-1">
              © {new Date().getFullYear()} CubeA. All rights reserved.
            </div>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-neutral-900">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-neutral-900">
              Terms
            </Link>
            <Link href="/impressum" className="hover:text-neutral-900">
              Impressum
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
