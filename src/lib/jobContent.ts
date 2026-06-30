// cubea/lib/jobContent.ts
// ---------------------------------------------------------------------------
// Two jobs in one module:
//   1. Pull salary / hours / location from raw posting text with plain regex,
//      so the rail is always correct EVEN when the AI summariser misbehaves.
//   2. Decide what a job page renders + whether Google may index it (Option B):
//        - real original summary  -> show summary, INDEX, self-canonical
//        - no/derivative summary   -> show raw text (attributed), NOINDEX,follow
// No LLM call lives here. This is the safety net that runs regardless.
// ---------------------------------------------------------------------------

export type Salary = { min: number; max: number | null; currency: "EUR"; period: "hour" | "month" | "year" };
export type Hours = { min: number; max: number | null };

// ---------------------------------------------------------------------------
// Number parsing — Dutch uses "." for thousands ("€ 4.000" = 4000), "," for
// decimals. English uses the reverse. Normalise both to an integer-ish number.
// ---------------------------------------------------------------------------
function parseAmount(tokenRaw: string): number | null {
  const token = tokenRaw.trim();
  // pure thousands grouping: 4.000  /  4,000  /  1.234.567
  if (/^\d{1,3}([.,]\d{3})+$/.test(token)) return parseInt(token.replace(/[.,]/g, ""), 10);
  // decimal: last separator is the decimal point
  const lastSep = Math.max(token.lastIndexOf("."), token.lastIndexOf(","));
  if (lastSep === -1) return parseInt(token, 10) || null;
  const intPart = token.slice(0, lastSep).replace(/[.,]/g, "");
  const decPart = token.slice(lastSep + 1);
  const n = parseFloat(`${intPart}.${decPart}`);
  return Number.isFinite(n) ? n : null;
}

function detectPeriod(ctx: string, amount: number): Salary["period"] {
  const t = ctx.toLowerCase();
  if (/per\s*uur|p\/?u\b|\bhour|hourly|\/\s*hr/.test(t)) return "hour";
  if (/per\s*maand|\bmonth|\/\s*mo\b|p\/?m\b|bruto per maand/.test(t)) return "month";
  if (/per\s*jaar|\byear|annual|\/\s*yr\b|p\/?j\b/.test(t)) return "year";
  // no explicit unit -> infer from magnitude (documented heuristic, not a guess at numbers)
  if (amount < 150) return "hour";
  if (amount < 15000) return "month";
  return "year";
}

export function extractSalary(textRaw: string): Salary | null {
  const text = textRaw.replace(/ /g, " "); // &nbsp; -> space
  // Prefer a window near salary language; fall back to the whole text.
  const cue = text.match(/(salaris|salary|bruto|gross|verdien|compensation)[\s\S]{0,120}/i);
  const scope = cue ? cue[0] : text;

  // up to two euro amounts forming a range:  € 4.000 - € 5.500   /   €4000–€5500
  const amounts: number[] = [];
  const re = /€\s*([\d][\d.,]*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(scope)) && amounts.length < 4) {
    const v = parseAmount(m[1]);
    if (v !== null && v >= 8 && v <= 500000) amounts.push(v); // ignore "€ 5,-" fees / junk
  }
  if (!amounts.length) return null;

  const min = Math.min(...amounts);
  const max = amounts.length > 1 ? Math.max(...amounts) : null;
  return { min, max, currency: "EUR", period: detectPeriod(scope, min) };
}

// ---------------------------------------------------------------------------
// Hours — "38 - 38 hrs", "32 - 40 uur", "36 uur per week", "40 hours"
// ---------------------------------------------------------------------------
export function extractHours(textRaw: string): Hours | null {
  const text = textRaw.replace(/ /g, " ");
  const range = text.match(/(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*(?:hrs?|hours?|uur|u)\b/i);
  if (range) {
    const a = +range[1], b = +range[2];
    return { min: Math.min(a, b), max: a === b ? null : Math.max(a, b) };
  }
  const single = text.match(/(\d{1,2})\s*(?:hrs?|hours?|uur|u)\b(?:\s*(?:per week|p\/?w|\/\s*week))?/i);
  if (single) { const v = +single[1]; if (v >= 1 && v <= 60) return { min: v, max: null }; }
  return null;
}

// ---------------------------------------------------------------------------
// Location — weakest of the three. PREFER the location you already captured at
// crawl time; use this only as a fallback. Looks for "City, Netherlands" or
// Dutch labels (Standplaats / Locatie).
// ---------------------------------------------------------------------------
export function extractLocation(textRaw: string): string | null {
  const text = textRaw.replace(/ /g, " ");
  const labelled = text.match(/(?:standplaats|locatie|location)\s*[:\-]\s*([A-Z][\w''\- ]{1,40})/i);
  if (labelled) return labelled[1].trim();
  const cityNL = text.match(/\b([A-Z][a-zà-ÿ''\-]{2,}(?:\s[A-Z][a-zà-ÿ''\-]+)?),\s*(?:Netherlands|Nederland)\b/);
  return cityNL ? cityNL[1].trim() : null;
}

// ---------------------------------------------------------------------------
// Originality guard — is `summary` a real paraphrase, or the raw scrape?
// Method: trigram CONTAINMENT = share of the summary's word-trigrams that also
// appear verbatim in the source. A genuine rewrite shares vocabulary but few
// exact trigrams; a raw dump shares almost all of them.
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

export function checkSummary(
  summary: string | null | undefined,
  source: string,
  threshold = 0.5,
): { ok: boolean; containment: number; reason?: string } {
  const s = (summary ?? "").trim();
  if (s.length < 40) return { ok: false, containment: 1, reason: "too-short/empty" };
  if (SCAFFOLD.some((p) => s.toLowerCase().includes(p)))
    return { ok: false, containment: 1, reason: "contains-page-scaffolding" };
  if (source.replace(/\s+/g, " ").includes(s.replace(/\s+/g, " ")))
    return { ok: false, containment: 1, reason: "verbatim-substring-of-source" };

  const sg = trigrams(s), src = trigrams(source);
  if (sg.size < 5) return { ok: false, containment: 1, reason: "too-few-trigrams" };
  let shared = 0;
  sg.forEach((g) => { if (src.has(g)) shared++; });
  const containment = shared / sg.size;
  return { ok: containment <= threshold, containment };
}

// ---------------------------------------------------------------------------
// Page plan (Option B). Drives both the component and generateMetadata.
// ---------------------------------------------------------------------------
export type JobInput = {
  title: string;
  company: string;
  rawDescription: string;      // scraped text
  summary?: string | null;     // model output (may be missing/derivative)
  listingLocation?: string | null;
};

export type PagePlan = {
  bodyMode: "summary" | "raw_fallback" | "facts_only";
  index: boolean;              // false -> <meta robots="noindex,follow">
  metaDescription: string;     // clean; never the raw dump
  attribution?: string;        // shown above raw fallback text
  facts: { salary: Salary | null; hours: Hours | null; location: string | null };
  debug: { containment: number; reason?: string };
};

export function planJobPage(job: JobInput): PagePlan {
  const facts = {
    salary: extractSalary(job.rawDescription),
    hours: extractHours(job.rawDescription),
    location: job.listingLocation ?? extractLocation(job.rawDescription),
  };
  const check = checkSummary(job.summary, job.rawDescription);
  const where = facts.location ? ` in ${facts.location}` : "";

  if (check.ok) {
    return {
      bodyMode: "summary",
      index: true,
      metaDescription: (job.summary as string).replace(/\s+/g, " ").trim().slice(0, 155),
      facts,
      debug: { containment: check.containment },
    };
  }
  if (job.rawDescription.trim().length > 0) {
    return {
      bodyMode: "raw_fallback",       // Option B: humans read it, Google doesn't index it
      index: false,
      metaDescription: `${job.title} at ${job.company}${where}. Apply directly on the company's site.`,
      attribution: `Description from ${job.company}'s career page`,
      facts,
      debug: { containment: check.containment, reason: check.reason },
    };
  }
  return {
    bodyMode: "facts_only",
    index: false,
    metaDescription: `${job.title} at ${job.company}${where}. Apply directly on the company's site.`,
    facts,
    debug: { containment: check.containment, reason: "no-raw-text" },
  };
}
