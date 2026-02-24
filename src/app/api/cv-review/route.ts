import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { cvText, targetRole } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not set" },
        { status: 500 }
      );
    }

    const userMessage = `Review this CV and return feedback as JSON with this structure:
{
  "overall_score": number (1-5),
  "top_priorities": [string, string, string],
  "sections": {
    "summary": { "score": number, "feedback": [string, string] },
    "experience": { "score": number, "feedback": [string, string] },
    "skills": { "score": number, "feedback": [string, string] },
    "education": { "score": number, "feedback": [string, string] },
    "formatting": { "score": number, "feedback": [string, string] },
    "dutch_market_fit": { "score": number, "feedback": [string, string] }
  }
}

CV: ${cvText}
Target role: ${targetRole || "not specified"}`;

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system:
          "You are an expert Dutch tech recruiter reviewing CVs for the Netherlands job market, specifically the Brainport/Eindhoven high-tech sector. Always respond with valid JSON only, no markdown, no explanation.",
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
    const feedback = JSON.parse(raw);

    return NextResponse.json(feedback);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
