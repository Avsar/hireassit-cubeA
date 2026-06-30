import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";
import type { JobSummary } from "./job-summariser";

const CACHE_DIR = join(process.cwd(), "data");
const CACHE_FILE = join(CACHE_DIR, "summaries.json");

export interface CachedSummary {
  summary: JobSummary;
  descriptionHash: string;
  updatedAt: string;
}

type CacheData = Record<string, CachedSummary>;

export function descriptionHash(text: string): string {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

function readCache(): CacheData {
  if (!existsSync(CACHE_FILE)) return {};
  try {
    return JSON.parse(readFileSync(CACHE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

export function getCachedSummary(jobId: number, rawDescription: string): JobSummary | null {
  const cache = readCache();
  const entry = cache[String(jobId)];
  if (!entry) return null;
  if (entry.descriptionHash !== descriptionHash(rawDescription)) return null;
  return entry.summary;
}

export function setCachedSummary(jobId: number, rawDescription: string, summary: JobSummary): void {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
  const cache = readCache();
  cache[String(jobId)] = {
    summary,
    descriptionHash: descriptionHash(rawDescription),
    updatedAt: new Date().toISOString(),
  };
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

export function getAllCachedIds(): Set<string> {
  const cache = readCache();
  return new Set(Object.keys(cache));
}

export function getCacheStats(): { total: number; entries: CacheData } {
  const cache = readCache();
  return { total: Object.keys(cache).length, entries: cache };
}
