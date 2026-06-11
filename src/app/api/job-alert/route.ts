import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.HIREASSIST_API_URL ||
  process.env.NEXT_PUBLIC_HIREASSIST_API_URL ||
  "https://hireassist-backend-production.up.railway.app";

// Server-side proxy to the HireAssist backend, so the browser never needs
// CORS access to the Railway API.
export async function POST(req: NextRequest) {
  let body: { email?: string; filters?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const email = (body.email || "").trim();
  if (!email) {
    return NextResponse.json({ ok: false, message: "Email is required." }, { status: 400 });
  }

  const form = new URLSearchParams();
  form.set("email", email);
  form.set("filters_json", JSON.stringify(body.filters || {}));

  try {
    const res = await fetch(`${API_BASE}/api/alerts`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Alert service is briefly unavailable. Please try again." },
      { status: 502 },
    );
  }
}
