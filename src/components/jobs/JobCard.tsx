import Link from "next/link";
import { Job, logoColor, timeAgo } from "@/lib/hireassist";
import type { JobSummary } from "@/lib/job-summariser";

function formatSalary(sal: NonNullable<JobSummary["salary"]>): string {
  const fmt = (n: number) => n.toLocaleString("nl-NL");
  if (sal.min != null && sal.max != null) return `€${fmt(sal.min)}–€${fmt(sal.max)} /${sal.period === "year" ? "yr" : "mo"}`;
  if (sal.min != null) return `€${fmt(sal.min)}+ /${sal.period === "year" ? "yr" : "mo"}`;
  if (sal.max != null) return `up to €${fmt(sal.max)} /${sal.period === "year" ? "yr" : "mo"}`;
  return "";
}

function freshLabel(ago: string): { text: string; isNew: boolean } {
  if (!ago) return { text: "", isNew: false };
  if (ago === "today") return { text: "new today", isNew: true };
  if (ago === "yesterday") return { text: "1d ago", isNew: false };
  return { text: ago.replace(" days ago", "d ago").replace(" month ago", "mo ago").replace(" months ago", "mo ago"), isNew: false };
}

export default function JobCard({
  job,
  summary,
}: {
  job: Job;
  summary?: JobSummary | null;
}) {
  const ago = timeAgo(job.updated_at || "");
  const fresh = freshLabel(ago);
  const snippet = summary?.summary?.split("\n")[0]?.slice(0, 160) || null;
  const salary = summary?.salary ?? null;
  const category = summary?.role_category && summary.role_category !== "Other" ? summary.role_category : null;

  return (
    <Link
      href={`/jobs/${job.slug}`}
      target="_blank"
      className="group block rounded-2xl border border-neutral-200 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition"
    >
      {/* Top row: logo, title+company, gem badge */}
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={`h-10 w-10 shrink-0 rounded-xl text-white flex items-center justify-center text-sm font-bold ${logoColor(job.company)}`}
          >
            {job.company.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-neutral-900 leading-tight truncate group-hover:text-blue-700 transition-colors">
              {job.title}
            </h3>
            <div className="text-sm text-neutral-500 truncate">
              {job.company}
              {(job.city || job.location_raw) && (
                <span className="text-neutral-400"> · {job.city || job.location_raw.slice(0, 30)}</span>
              )}
            </div>
          </div>
        </div>
        {job.verified_hidden && (
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 whitespace-nowrap">
            💎 Hidden gem
          </span>
        )}
      </div>

      {/* Snippet from AI summary */}
      {snippet && (
        <p className="mt-2.5 text-sm text-neutral-600 leading-relaxed line-clamp-2">
          {snippet}
        </p>
      )}

      {/* Footer: salary, tags, freshness */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {salary && salary.min != null ? (
          <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-0.5">
            {formatSalary(salary)}
          </span>
        ) : (
          <span className="text-neutral-400 border border-dashed border-neutral-300 rounded-md px-2 py-0.5">
            Salary not listed
          </span>
        )}

        {category && (
          <span className="text-neutral-500 bg-neutral-100 border border-neutral-200 rounded-md px-2 py-0.5">
            {category}
          </span>
        )}

        {job.job_type && (
          <span className="text-neutral-500 bg-neutral-100 border border-neutral-200 rounded-md px-2 py-0.5">
            {job.job_type}
          </span>
        )}

        {job.is_new_today && (
          <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 font-medium">
            New today
          </span>
        )}

        {fresh.text && (
          <span className={`ml-auto font-mono text-[11px] ${fresh.isNew ? "text-emerald-600" : "text-neutral-400"}`}>
            {fresh.isNew && "● "}{fresh.text}
          </span>
        )}
      </div>
    </Link>
  );
}
