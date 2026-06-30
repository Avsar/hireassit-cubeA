import { NextResponse } from "next/server";
import { summariseJob } from "@/lib/job-summariser";

export async function POST(req: Request) {
  try {
    const { title, company, language, rawText } = await req.json();

    if (!title || !rawText) {
      return NextResponse.json(
        { error: "title and rawText are required" },
        { status: 400 },
      );
    }

    const summary = await summariseJob({
      title,
      company: company || "",
      language: language || "unknown",
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
