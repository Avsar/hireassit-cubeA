import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.HIREASSIST_API_URL ||
  process.env.NEXT_PUBLIC_HIREASSIST_API_URL ||
  "https://hireassist-backend-production.up.railway.app";

export async function POST(req: NextRequest) {
  let body: { message?: string; email?: string; page?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const message = (body.message || "").trim();
  if (!message) {
    return NextResponse.json({ ok: false, message: "Message is required." }, { status: 400 });
  }

  const form = new URLSearchParams();
  form.set("message", message);
  if (body.email) form.set("email", body.email);
  if (body.page) form.set("page", body.page);

  try {
    const res = await fetch(`${API_BASE}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Couldn't send feedback right now. Please try again." },
      { status: 502 },
    );
  }
}
