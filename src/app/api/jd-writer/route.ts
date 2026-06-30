import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { jobTitle, department, level, skills, companyInfo, language } =
      await req.json();

    if (!jobTitle?.trim()) {
      return NextResponse.json(
        { error: "Job title is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not set" },
        { status: 500 }
      );
    }

    const lang = language === "nl" ? "Dutch" : "English";

    const userMessage = `Generate a professional job description and return it as JSON with this structure:
{
  "title": "string — the final job title",
  "intro": "string — 2-3 sentence company/role introduction",
  "responsibilities": ["string", "string", "..."],
  "requirements": ["string", "string", "..."],
  "nice_to_have": ["string", "string", "..."],
  "benefits": ["string", "string", "..."],
  "closing": "string — a short closing paragraph encouraging candidates to apply"
}

Inputs:
- Job title: ${jobTitle}
- Department: ${department || "not specified"}
- Seniority level: ${level || "not specified"}
- Key skills: ${skills || "not specified"}
- Company info: ${companyInfo || "not specified"}
- Language: ${lang}

Write the entire job description in ${lang}. Make it engaging, inclusive, and specific. Use concrete responsibilities rather than vague statements. Requirements should be realistic — avoid inflated year counts. Include 3-5 nice-to-haves that are genuinely optional. Benefits should sound authentic, not generic.`;

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        system:
          "You are an expert tech recruiter in the Netherlands, specializing in writing compelling, inclusive job descriptions for the Dutch and European tech market. Always respond with valid JSON only, no markdown, no explanation.",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!r.ok) {
      const errBody = await r.text();
      return NextResponse.json(
        { error: "Anthropic API error", detail: errBody },
        { status: 500 }
      );
    }

    const data = await r.json();
    const raw = data?.content?.[0]?.text ?? "";
    const jd = JSON.parse(raw);

    return NextResponse.json(jd);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
