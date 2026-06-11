// API client for the HireAssist backend (FastAPI on Railway).

const API_BASE =
  process.env.HIREASSIST_API_URL ||
  process.env.NEXT_PUBLIC_HIREASSIST_API_URL ||
  "https://hireassist-backend-production.up.railway.app";

export interface Job {
  id: number;
  slug: string;
  company: string;
  source: string;
  title: string;
  department: string;
  job_type: string;
  location_raw: string;
  city: string;
  country: string;
  apply_url: string;
  updated_at?: string;
  is_new_today?: boolean;
  is_stale?: boolean;
  tech_tags: string;
  hidden_tier: number;
  snippet?: string;
}

export interface JobDetail extends Job {
  description: string;
  posted_at: string;
  first_seen_at: string;
  last_seen_at: string;
  is_active: number;
  related: { id: number; title: string; slug: string; city: string }[];
}

export interface JobsResponse {
  count: number;
  page: number;
  per_page: number;
  pages: number;
  jobs: Job[];
}

export interface JobsQuery {
  q?: string;
  city?: string;
  company?: string;
  hidden?: boolean;
  english_only?: boolean;
  new_today_only?: boolean;
  sort?: string;
  page?: number;
  per_page?: number;
}

// Deterministic pastel for company "logo" initials — same company always
// gets the same color, so the brand feels intentional rather than random.
const LOGO_COLORS = [
  "bg-blue-600", "bg-indigo-600", "bg-violet-600", "bg-cyan-700",
  "bg-teal-600", "bg-emerald-600", "bg-rose-600", "bg-amber-600",
];

export function logoColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return LOGO_COLORS[h % LOGO_COLORS.length];
}

export async function fetchJobs(query: JobsQuery = {}): Promise<JobsResponse> {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.city) params.set("city", query.city);
  if (query.company) params.set("company", query.company);
  if (query.hidden) params.set("hidden", "true");
  if (query.english_only) params.set("english_only", "true");
  if (query.new_today_only) params.set("new_today_only", "true");
  if (query.sort) params.set("sort", query.sort);
  params.set("page", String(query.page || 1));
  params.set("per_page", String(query.per_page || 25));

  const res = await fetch(`${API_BASE}/jobs?${params}`, {
    next: { revalidate: 600 },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Jobs API error: ${res.status}`);
  return res.json();
}

export async function fetchJobDetail(id: number): Promise<JobDetail | null> {
  const res = await fetch(`${API_BASE}/jobs/${id}`, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(20000),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Job detail API error: ${res.status}`);
  return res.json();
}

export async function fetchSitemapJobs(): Promise<
  { id: number; slug: string; lastmod: string }[]
> {
  const res = await fetch(`${API_BASE}/meta/sitemap-jobs`, {
    next: { revalidate: 86400 },
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.jobs || [];
}

/** Extract the numeric job id from a slug like "senior-engineer-at-adyen-12345". */
export function idFromSlug(slug: string): number | null {
  const m = slug.match(/-(\d+)$/);
  return m ? parseInt(m[1], 10) : null;
}

// ---------------------------------------------------------------------------
// Companies + hidden gems
// ---------------------------------------------------------------------------

export interface CompanySummary {
  name: string;
  slug: string;
  active_jobs: number;
  hidden_gems: number;
  new_this_week: number;
  main_city: string;
}

export interface CompanyDetail {
  name: string;
  slug: string;
  active_jobs: number;
  hidden_gems: number;
  hidden_share: number;
  cities: string[];
  history: { stat_date: string; active_jobs: number; new_jobs: number }[];
  jobs: {
    id: number;
    slug: string;
    title: string;
    city: string;
    country: string;
    location_raw: string;
    job_type: string;
    tech_tags: string;
    hidden_tier: number;
    first_seen_at: string;
  }[];
}

export interface HiddenSummary {
  hidden_gems: number;
  low_visibility: number;
  total_active: number;
  top_companies: { name: string; slug: string; hidden_gems: number }[];
  recent_gems: { id: number; title: string; company: string; city: string; slug: string }[];
}

export async function fetchCompanies(): Promise<CompanySummary[]> {
  const res = await fetch(`${API_BASE}/companies`, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Companies API error: ${res.status}`);
  const data = await res.json();
  return data.companies || [];
}

export async function fetchCompanyDetail(slug: string): Promise<CompanyDetail | null> {
  const res = await fetch(`${API_BASE}/companies/${slug}`, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(20000),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Company API error: ${res.status}`);
  return res.json();
}

export async function fetchHiddenSummary(): Promise<HiddenSummary | null> {
  try {
    const res = await fetch(`${API_BASE}/stats/hidden-summary`, {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null; // backend unreachable must never fail a build/render
  }
}

// City landing pages served under /jobs/[slug] for slugs without a job id.
export const CITY_PAGES: Record<string, string> = {
  amsterdam: "Amsterdam",
  rotterdam: "Rotterdam",
  "den-haag": "Den Haag",
  utrecht: "Utrecht",
  eindhoven: "Eindhoven",
  groningen: "Groningen",
  delft: "Delft",
  haarlem: "Haarlem",
  leiden: "Leiden",
  nijmegen: "Nijmegen",
  tilburg: "Tilburg",
  breda: "Breda",
  arnhem: "Arnhem",
  maastricht: "Maastricht",
  amersfoort: "Amersfoort",
  hilversum: "Hilversum",
};

export function timeAgo(iso: string): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}
