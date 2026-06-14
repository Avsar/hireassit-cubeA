import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.HIREASSIST_API_URL ||
  process.env.NEXT_PUBLIC_HIREASSIST_API_URL ||
  "https://hireassist-backend-production.up.railway.app";

// Proxy: ask the backend to email a magic login link. Always returns the
// backend's generic message (no email enumeration).
export async function POST(req: NextRequest) {
  let body: { email?: string };
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

  try {
    const res = await fetch(`${API_BASE}/api/auth/request-link`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Login service is briefly unavailable. Please try again." },
      { status: 502 },
    );
  }
}
