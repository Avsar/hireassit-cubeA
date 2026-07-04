import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your account — CubeA",
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

const API_BASE =
  process.env.HIREASSIST_API_URL ||
  process.env.NEXT_PUBLIC_HIREASSIST_API_URL ||
  "https://hireassist-backend-production.up.railway.app";

interface AlertRow {
  id: number;
  token: string;
  filters: Record<string, unknown>;
  is_confirmed: boolean;
  created_at: string;
}

async function getAlerts(email: string): Promise<AlertRow[]> {
  const secret = process.env.INTERNAL_API_SECRET || "";
  try {
    const res = await fetch(
      `${API_BASE}/api/me/alerts?email=${encodeURIComponent(email)}`,
      { headers: { "X-Internal-Token": secret }, cache: "no-store" },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.alerts as AlertRow[]) || [];
  } catch {
    return [];
  }
}

function summarize(filters: Record<string, unknown>): string {
  const bits: string[] = [];
  if (filters.q) bits.push(`"${String(filters.q)}"`);
  if (filters.city) bits.push(String(filters.city));
  if (filters.hidden) bits.push("hidden gems");
  if (filters.english_only) bits.push("English only");
  return bits.length ? bits.join(" · ") : "All jobs in the Netherlands";
}

export default async function AccountPage() {
  const session = await getSession();
  if (!session.email) {
    redirect("/login");
  }
  const email = session.email;
  const alerts = await getAlerts(email);

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-display text-2xl font-bold text-neutral-900">Your account</h1>
          <a href="/api/auth/logout" className="text-sm text-neutral-500 hover:text-neutral-800">
            Log out
          </a>
        </div>
        <p className="mt-1 text-sm text-neutral-600">
          Signed in as <strong>{email}</strong>
        </p>

        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-neutral-900">Your job alerts</h2>

          {alerts.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
              You don&apos;t have any active alerts yet.{" "}
              <Link href="/jobs" className="text-gem hover:underline">
                Browse jobs
              </Link>{" "}
              and set one up — you&apos;ll get an email when new matches (including hidden gems) appear.
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {alerts.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white p-4"
                >
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{summarize(a.filters)}</div>
                    <div className="mt-0.5 text-xs text-neutral-500">
                      {a.is_confirmed ? "Active" : "Unconfirmed — check your email to activate"}
                    </div>
                  </div>
                  <a
                    href={`${API_BASE}/api/alerts/unsubscribe?token=${a.token}`}
                    className="text-sm text-neutral-500 hover:text-red-600"
                  >
                    Remove
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            <Link
              href="/jobs"
              className="inline-block rounded-xl bg-gem px-5 py-2.5 text-sm font-semibold text-white hover:bg-gem-deep"
            >
              Browse jobs &amp; add an alert →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
