import { NextResponse } from "next/server";
import { summariseJob } from "@/lib/job-summariser";

// Internal-only endpoint.  Nothing on the public site calls this — it exists
// for backfill tooling — so it is locked behind INTERNAL_API_SECRET.  Without
// this check it is an open proxy to Claude on our API key.
const MAX_TEXT_CHARS = 20_000;

export async function POST(req: Request) {
  const secret = process.env.INTERNAL_API_SECRET;
  const provided = req.headers.get("x-internal-secret");
  if (!secret || !provided || provided !== secret) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const { title, company, language, rawText } = await req.json();

    if (typeof title !== "string" || typeof rawText !== "string" || !title || !rawText) {
      return NextResponse.json(
        { error: "title and rawText are required" },
        { status: 400 },
      );
    }
    if (rawText.length > MAX_TEXT_CHARS) {
      return NextResponse.json({ error: "rawText too long" }, { status: 413 });
    }

    const summary = await summariseJob({
      title,
      company: typeof company === "string" ? company : "",
      language: typeof language === "string" ? language : "unknown",
      rawText,
    });

    if (!summary) {
      return NextResponse.json(
        { error: "Could not generate summary" },
        { status: 422 },
      );
    }

    return NextResponse.json(summary);
  } catch {
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 },
    );
  }
}
