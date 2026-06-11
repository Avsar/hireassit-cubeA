// Saved jobs in localStorage — no account needed.

export interface SavedJob {
  id: number;
  slug: string;
  title: string;
  company: string;
  city: string;
  savedAt: string;
}

const KEY = "cubea:savedJobs";

export function getSavedJobs(): SavedJob[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function isSaved(id: number): boolean {
  return getSavedJobs().some((j) => j.id === id);
}

export function toggleSaved(job: Omit<SavedJob, "savedAt">): boolean {
  const all = getSavedJobs();
  const idx = all.findIndex((j) => j.id === job.id);
  if (idx >= 0) {
    all.splice(idx, 1);
    localStorage.setItem(KEY, JSON.stringify(all));
    return false;
  }
  all.unshift({ ...job, savedAt: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 200)));
  return true;
}
