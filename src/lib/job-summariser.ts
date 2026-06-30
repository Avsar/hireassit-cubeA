const MODEL = "claude-haiku-4-5-20251001";

const SYSTEM_PROMPT = `You convert raw, scraped job-posting text into a structured summary for CubeA, a Dutch
job-discovery site. Your output is shown to job seekers — many of them internationals — on a
job's detail page.

OUTPUT
- Return ONLY a single valid JSON object. No markdown, no code fences, no commentary before or
  after.

TRUTHFULNESS (most important)
- Use ONLY information present in the provided text. Never invent salary, requirements,
  location, seniority, or company facts.
- If a field is not supported by the text, use null (or "Unknown" where the schema lists it).
- Never estimate salary. Only report salary if the text explicitly states figures.

ORIGINALITY
- Write \`summary\` and \`requirements\` in your own words. Paraphrase — do not copy sentences or
  distinctive phrases verbatim from the source. The goal is a faithful, original rewrite.
- No marketing filler ("exciting opportunity", "dynamic team", "rockstar"). Plain, concrete,
  useful to someone deciding whether to apply.

LANGUAGE
- Always write \`summary\` and \`requirements\` in English, even if the source is Dutch, so
  international seekers can read it.
- Capture the language the job is actually performed in separately, in \`language_requirement\`.

VALIDITY GATE
- If the text is not a real job posting — e.g. a cookie/consent page, navigation, a 404/error
  page, a login wall, or near-empty — set \`is_valid_posting\` to false and leave all content
  fields null. Do not guess a posting into existence.

SCHEMA (every key required; use null / "Unknown" when unsupported)
{
  "is_valid_posting": boolean,
  "summary": string | null,              // 2–3 short paragraphs, ≤120 words, English
  "requirements": string[] | null,       // 3–6 short paraphrased bullets, or null if none stated
  "role_category": "Engineering" | "Developer" | "Data" | "Product" | "Design" |
                   "DevOps & Cloud" | "Security" | "Marketing" | "Sales" | "Finance" | "Other",
  "seniority": "Internship" | "Junior" | "Mid" | "Senior" | "Lead" | "Unknown",
  "employment_type": "Full-time" | "Part-time" | "Internship" | "Contract" | "Unknown",
  "work_mode": "On-site" | "Hybrid" | "Remote" | "Unknown",
  "language_requirement": "English" | "Dutch" | "English or Dutch" | "Other" | "Unknown",
  "salary": null | {
    "min": number | null,
    "max": number | null,
    "currency": string,
    "period": "hour" | "month" | "year"
  },
  "location": string | null,
  "key_tags": string[]                   // up to 5 factual chips (tech, domain). No hype words.
}`;

export type JobSummary = {
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

export async function summariseJob(input: {
  title: string;
  company: string;
  language: string;
  rawText: string;
}): Promise<JobSummary | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const user = `Job title (from listing): ${input.title}
Company: ${input.company}
Source language: ${input.language || "unknown"}

RAW POSTING TEXT:
"""
${input.rawText.slice(0, 6000)}
"""`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
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

  if (!res.ok) return null;
  const data = await res.json();
  const text = (data.content ?? [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("")
    .trim();

  try {
    const parsed = JSON.parse(text) as JobSummary;
    if (!parsed.is_valid_posting || !parsed.summary) return null;
    return parsed;
  } catch {
    return null;
  }
}
