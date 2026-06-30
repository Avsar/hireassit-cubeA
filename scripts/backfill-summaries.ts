#!/usr/bin/env npx tsx
// scripts/backfill-summaries.ts
// Backfills AI summaries for jobs that don't have one yet (or whose
// description has changed). Resumable, idempotent, concurrency-capped.
//
// Usage:
//   ANTHROPIC_API_KEY=sk-... npx tsx scripts/backfill-summaries.ts [--limit N] [--sample N]

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const API_BASE = process.env.HIREASSIST_API_URL || "https://hireassist-backend-production.up.railway.app";
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const CONCURRENCY = 5;
const CACHE_DIR = join(process.cwd(), "data");
const CACHE_FILE = join(CACHE_DIR, "summaries.json");

// ---------------------------------------------------------------------------
// Types (mirror job-summariser.ts)
// ---------------------------------------------------------------------------
type JobSummary = {
  is_valid_posting: boolean;
  summary: string | null;
  requirements: string[] | null;
  role_category: string;
  seniority: string;
  employment_type: string;
  work_mode: string;
  language_requirement: string;
  salary: null | { min: number | null; max: number | null; currency: string; period: string };
  location: string | null;
  key_tags: string[];
};

interface CachedSummary {
  summary: JobSummary;
  descriptionHash: string;
  updatedAt: string;
}

type CacheData = Record<string, CachedSummary>;

// ---------------------------------------------------------------------------
// Originality check (inline from jobContent.ts to keep script standalone)
// ---------------------------------------------------------------------------
const SCAFFOLD = [
  "what are you going to do", "your responsibilities", "start your application",
  "solliciteer", "wat ga je doen", "wie zijn wij", "apply now", "tech stack:",
];

function trigrams(s: string): Set<string> {
  const w = s.toLowerCase().replace(/[^a-z0-9à-ÿ\s]/gi, " ").split(/\s+/).filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i + 2 < w.length; i++) out.add(`${w[i]} ${w[i + 1]} ${w[i + 2]}`);
  return out;
}

function checkSummary(summary: string | null | undefined, source: string) {
  const s = (summary ?? "").trim();
  if (s.length < 40) return { ok: false, containment: 1, reason: "too-short" };
  if (SCAFFOLD.some((p) => s.toLowerCase().includes(p)))
    return { ok: false, containment: 1, reason: "scaffold" };
  if (source.replace(/\s+/g, " ").includes(s.replace(/\s+/g, " ")))
    return { ok: false, containment: 1, reason: "verbatim" };
  const sg = trigrams(s), src = trigrams(source);
  if (sg.size < 5) return { ok: false, containment: 1, reason: "too-few-trigrams" };
  let shared = 0;
  sg.forEach((g) => { if (src.has(g)) shared++; });
  const containment = shared / sg.size;
  return { ok: containment <= 0.5, containment };
}

// ---------------------------------------------------------------------------
// Cache helpers
// ---------------------------------------------------------------------------
function descHash(text: string): string {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

function readCache(): CacheData {
  if (!existsSync(CACHE_FILE)) return {};
  try { return JSON.parse(readFileSync(CACHE_FILE, "utf-8")); } catch { return {}; }
}

function writeCache(data: CacheData): void {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
}

// ---------------------------------------------------------------------------
// Summariser (standalone — mirrors job-summariser.ts)
// ---------------------------------------------------------------------------
const MODEL = "claude-haiku-4-5-20251001";
const SYSTEM_PROMPT = `You convert raw, scraped job-posting text into a structured summary for CubeA, a Dutch
job-discovery site. Your output is shown to job seekers — many of them internationals — on a
job's detail page.

OUTPUT
- Return ONLY a single valid JSON object. No markdown, no code fences, no commentary before or after.

TRUTHFULNESS (most important)
- Use ONLY information present in the provided text. Never invent salary, requirements, location, seniority, or company facts.
- If a field is not supported by the text, use null (or "Unknown" where the schema lists it).
- Never estimate salary. Only report salary if the text explicitly states figures.

ORIGINALITY
- Write \`summary\` and \`requirements\` in your own words. Paraphrase — do not copy sentences or distinctive phrases verbatim from the source.
- No marketing filler ("exciting opportunity", "dynamic team", "rockstar"). Plain, concrete, useful.

LANGUAGE
- Always write \`summary\` and \`requirements\` in English, even if the source is Dutch.
- Capture the language the job is actually performed in separately, in \`language_requirement\`.

VALIDITY GATE
- If the text is not a real job posting, set \`is_valid_posting\` to false and leave all content fields null.

SCHEMA (every key required; use null / "Unknown" when unsupported)
{
  "is_valid_posting": boolean,
  "summary": string | null,
  "requirements": string[] | null,
  "role_category": "Engineering" | "Developer" | "Data" | "Product" | "Design" | "DevOps & Cloud" | "Security" | "Marketing" | "Sales" | "Finance" | "Other",
  "seniority": "Internship" | "Junior" | "Mid" | "Senior" | "Lead" | "Unknown",
  "employment_type": "Full-time" | "Part-time" | "Internship" | "Contract" | "Unknown",
  "work_mode": "On-site" | "Hybrid" | "Remote" | "Unknown",
  "language_requirement": "English" | "Dutch" | "English or Dutch" | "Other" | "Unknown",
  "salary": null | { "min": number | null, "max": number | null, "currency": string, "period": "hour" | "month" | "year" },
  "location": string | null,
  "key_tags": string[]
}`;

async function summarise(title: string, company: string, rawText: string): Promise<JobSummary | null> {
  const user = `Job title (from listing): ${title}\nCompany: ${company}\nSource language: unknown\n\nRAW POSTING TEXT:\n"""\n${rawText.slice(0, 6000)}\n"""`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ANTHROPIC_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 700,
      temperature: 0.1,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!res.ok) {
    console.warn(`  API error: ${res.status} ${res.statusText}`);
    return null;
  }
  const data = await res.json();
  const text = (data.content ?? [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("").trim();

  try {
    const parsed = JSON.parse(text) as JobSummary;
    if (!parsed.is_valid_posting || !parsed.summary) return null;
    return parsed;
  } catch {
    console.warn(`  JSON parse failed: ${text.slice(0, 100)}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  if (!ANTHROPIC_KEY) {
    console.error("ERROR: ANTHROPIC_API_KEY not set");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const limitIdx = args.indexOf("--limit");
  const sampleIdx = args.indexOf("--sample");
  const maxJobs = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : Infinity;
  const sampleSize = sampleIdx >= 0 ? parseInt(args[sampleIdx + 1], 10) : 0;

  console.log("Fetching job list...");
  const cache = readCache();

  // Fetch all jobs (paginated)
  const allJobs: { id: number; title: string; company: string }[] = [];
  let page = 1;
  while (true) {
    const res = await fetch(`${API_BASE}/jobs?per_page=100&page=${page}&sort=newest`, {
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) { console.error(`Jobs API error: ${res.status}`); break; }
    const data = await res.json();
    allJobs.push(...data.jobs.map((j: { id: number; title: string; company: string }) => ({
      id: j.id, title: j.title, company: j.company,
    })));
    if (page >= data.pages) break;
    page++;
  }
  console.log(`Total jobs: ${allJobs.length}`);

  // Filter to jobs needing summaries
  const needsSummary: typeof allJobs = [];
  let skippedCached = 0;

  for (const job of allJobs) {
    if (needsSummary.length >= maxJobs) break;
    const cached = cache[String(job.id)];
    if (cached) { skippedCached++; continue; }
    needsSummary.push(job);
  }

  if (sampleSize > 0 && needsSummary.length > sampleSize) {
    needsSummary.length = sampleSize;
  }

  console.log(`Need summary: ${needsSummary.length} (${skippedCached} already cached)`);
  if (needsSummary.length === 0) { console.log("Nothing to do."); return; }

  // Process with concurrency cap
  let processed = 0, summarised = 0, skippedInvalid = 0, failed = 0;

  async function processJob(job: { id: number; title: string; company: string }) {
    try {
      // Fetch full description
      const res = await fetch(`${API_BASE}/jobs/${job.id}`, {
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) { failed++; return; }
      const detail = await res.json();
      const desc = detail.description || "";

      if (!desc || desc.length < 50) {
        skippedInvalid++;
        processed++;
        return;
      }

      // Check if already cached with matching hash
      const hash = descHash(desc);
      const existing = cache[String(job.id)];
      if (existing && existing.descriptionHash === hash) {
        processed++;
        return;
      }

      // Call summariser
      const result = await summarise(job.title, job.company, desc);
      if (!result) {
        skippedInvalid++;
        processed++;
        return;
      }

      // Verify originality
      const check = checkSummary(result.summary, desc);
      if (!check.ok) {
        console.warn(`  ${job.id} summary failed originality (containment=${check.containment.toFixed(2)}, ${check.reason})`);
        skippedInvalid++;
        processed++;
        return;
      }

      // Store
      cache[String(job.id)] = {
        summary: result,
        descriptionHash: hash,
        updatedAt: new Date().toISOString(),
      };
      summarised++;
      processed++;

      // Save periodically
      if (summarised % 10 === 0) writeCache(cache);

      console.log(`  [${processed}/${needsSummary.length}] ${job.id} ✓ containment=${check.containment.toFixed(2)} "${job.title}"`);
    } catch (err) {
      failed++;
      processed++;
      console.warn(`  ${job.id} error: ${err instanceof Error ? err.message : err}`);
    }
  }

  // Run with concurrency
  const queue = [...needsSummary];
  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    while (queue.length > 0) {
      const job = queue.shift()!;
      await processJob(job);
    }
  });

  await Promise.all(workers);

  // Final save
  writeCache(cache);

  console.log(`\n=== BACKFILL COMPLETE ===`);
  console.log(`  Processed:       ${processed}`);
  console.log(`  Summarised:      ${summarised}`);
  console.log(`  Skipped invalid: ${skippedInvalid}`);
  console.log(`  Failed:          ${failed}`);
  console.log(`  Total in cache:  ${Object.keys(cache).length}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
