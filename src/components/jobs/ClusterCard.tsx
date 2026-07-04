"use client";

import Link from "next/link";
import { useState } from "react";
import { logoColor } from "@/lib/hireassist";

interface ClusterJob {
  slug: string;
  title: string;
  city: string;
}

export interface Cluster {
  company: string;
  companySlug: string;
  jobCount: number;
  jobs: ClusterJob[];
}

export default function ClusterCard({ cluster }: { cluster: Cluster }) {
  const [open, setOpen] = useState(false);
  const initials = cluster.company.slice(0, 2).toUpperCase();
  const shown = cluster.jobs.slice(0, 5);

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${logoColor(cluster.company)}`}
        >
          {initials}
        </div>
        <span className="flex-1 font-display text-[16px] font-bold text-neutral-900 truncate">
          {cluster.company}
        </span>
        <span className="shrink-0 font-mono text-xs text-neutral-500">
          {cluster.jobCount} open roles
        </span>
        <svg
          className={`shrink-0 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-neutral-200">
          {shown.map((job) => (
            <Link
              key={job.slug}
              href={`/jobs/${job.slug}`}
              target="_blank"
              className="flex items-center justify-between gap-3 border-b border-neutral-100 px-5 py-3 text-sm hover:bg-gem-wash last:border-b-0"
            >
              <span className="truncate text-neutral-800">{job.title}</span>
              {job.city && (
                <span className="shrink-0 font-mono text-[11px] text-neutral-400">
                  {job.city}
                </span>
              )}
            </Link>
          ))}
          <Link
            href={`/companies/${cluster.companySlug}`}
            className="flex items-center px-5 py-3 text-sm font-medium text-gem hover:bg-gem-wash"
          >
            All {cluster.jobCount} roles at {cluster.company} →
          </Link>
        </div>
      )}
    </div>
  );
}
