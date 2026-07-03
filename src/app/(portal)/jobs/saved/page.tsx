"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSavedJobs, SavedJob, toggleSaved } from "@/lib/savedJobs";

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<SavedJob[] | null>(null);

  useEffect(() => {
    setJobs(getSavedJobs());
  }, []);

  function remove(job: SavedJob) {
    toggleSaved(job);
    setJobs(getSavedJobs());
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/jobs" className="text-sm text-gem hover:underline">
          ← All jobs
        </Link>
        <h1 className="mt-3 text-2xl font-bold">Saved jobs</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Stored in your browser — no account needed.
        </p>

        {jobs === null ? null : jobs.length === 0 ? (
          <p className="mt-10 text-neutral-500">
            Nothing saved yet. Browse{" "}
            <Link href="/jobs" className="text-gem underline">
              all jobs
            </Link>{" "}
            and hit “Save job”.
          </p>
        ) : (
          <div className="mt-6 grid gap-3">
            {jobs.map((j) => (
              <div
                key={j.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-4"
              >
                <Link href={`/jobs/${j.slug}`} className="min-w-0">
                  <div className="text-sm text-neutral-500 truncate">{j.company}</div>
                  <div className="font-semibold truncate hover:text-gem">{j.title}</div>
                  {j.city && <div className="text-xs text-neutral-400">{j.city}</div>}
                </Link>
                <button
                  onClick={() => remove(j)}
                  className="shrink-0 text-xs text-neutral-400 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
