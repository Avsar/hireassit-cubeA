import { NextResponse } from "next/server";

// Recruiter lead form → webhook.  Rate-limited + same-origin-only via
// src/middleware.ts.  Only forward known fields, bounded in size, so the
// webhook can't be used as a dumping ground for arbitrary payloads.
// Field names match the recruiter form in src/components/RecruiterLanding.tsx.
const ALLOWED_FIELDS = ["email", "company", "need", "name", "phone", "source"];
const MAX_FIELD_CHARS = 2_000;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  try {
    const raw = await req.json().catch(() => null);
    if (!raw || typeof raw !== "object") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const payload: Record<string, string> = {};
    for (const key of ALLOWED_FIELDS) {
      const v = (raw as Record<string, unknown>)[key];
      if (typeof v === "string" && v.trim()) payload[key] = v.trim().slice(0, MAX_FIELD_CHARS);
    }

    if (!payload.email || !EMAIL_RE.test(payload.email)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    const url = process.env.LEAD_WEBHOOK_URL;
    if (!url) {
      console.error("lead: LEAD_WEBHOOK_URL not set");
      return NextResponse.json({ error: "Lead form is not configured" }, { status: 503 });
    }

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, received_at: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!r.ok) {
      console.error("lead: webhook failed", r.status);
      return NextResponse.json({ error: "Couldn't submit right now" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("lead: failed", e);
    return NextResponse.json({ error: "Couldn't submit right now" }, { status: 500 });
  }
}
