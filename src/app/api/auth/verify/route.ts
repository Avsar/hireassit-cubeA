import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const API_BASE =
  process.env.HIREASSIST_API_URL ||
  process.env.NEXT_PUBLIC_HIREASSIST_API_URL ||
  "https://hireassist-backend-production.up.railway.app";

// The magic link lands here. We verify the token with the backend (single-use),
// and on success set the first-party session cookie and send the user to /account.
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const token = req.nextUrl.searchParams.get("token") || "";
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=1", origin));
  }

  try {
    const form = new URLSearchParams();
    form.set("token", token);
    const res = await fetch(`${API_BASE}/api/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      cache: "no-store",
    });
    const data = await res.json();
    if (res.ok && data.ok && data.email) {
      const session = await getSession();
      session.email = data.email;
      await session.save();
      return NextResponse.redirect(new URL("/account", origin));
    }
  } catch {
    // fall through to error redirect
  }

  return NextResponse.redirect(new URL("/login?error=1", origin));
}
