import Link from "next/link";
import { Job, logoColor, timeAgo } from "@/lib/hireassist";

export default function JobCard({ job }: { job: Job }) {
  const techTags = (job.tech_tags || "").split("|").filter(Boolean).slice(0, 4);
  const ago = timeAgo(job.updated_at || "");

  return (
    <Link
      href={`/jobs/${job.slug}`}
      target="_blank"
      className="block rounded-2xl border border-neutral-200 bg-white p-5 hover:border-blue-300 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`h-10 w-10 shrink-0 rounded-full text-white flex items-center justify-center text-sm font-semibold ${logoColor(job.company)}`}>
            {job.company.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm text-neutral-500 truncate">{job.company}</div>
            <h3 className="font-semibold text-neutral-900 truncate">{job.title}</h3>
          </div>
        </div>
        {ago && <span className="text-xs text-neutral-400 shrink-0">{ago}</span>}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {job.hidden_tier >= 2 && (
          <span className="rounded-full bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-700 px-2.5 py-0.5 font-medium">
            💎 Hidden gem
          </span>
        )}
        {job.hidden_tier === 1 && (
          <span className="rounded-full bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-0.5">
            Low visibility
          </span>
        )}
        {(job.city || job.location_raw) && (
          <span className="text-neutral-500">
            📍 {job.city || job.location_raw.slice(0, 40)}
          </span>
        )}
        {job.job_type && <span className="text-neutral-500">{job.job_type}</span>}
        {job.is_new_today && (
          <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5">
            New today
          </span>
        )}
        {techTags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-0.5"
          >
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
