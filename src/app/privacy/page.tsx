import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | CubeA",
  description: "How CubeA / HireAssist handles your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Link href="/jobs" className="text-sm text-blue-600 hover:underline">
          ← Back to jobs
        </Link>
        <h1 className="mt-3 text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-1 text-sm text-neutral-400">Last updated: June 11, 2026</p>

        <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-neutral-700">
          <section>
            <h2 className="font-semibold text-neutral-900">What we collect</h2>
            <p className="mt-1">
              If you set a job alert, we store your email address and the search
              filters you chose. That is the only personal data this site collects.
              Saved jobs live entirely in your own browser (localStorage) and are
              never sent to us.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-neutral-900">How we use it</h2>
            <p className="mt-1">
              Your email is used for exactly one thing: sending you the job alert
              you asked for. Alerts use double opt-in — nothing is sent until you
              confirm via the email link. We do not sell, share, or use your email
              for marketing.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-neutral-900">Deleting your data</h2>
            <p className="mt-1">
              Every alert email contains a one-click unsubscribe link, which
              deactivates your alert immediately. To have your email removed from
              our records entirely, send a short message to{" "}
              <a href="mailto:success@cubea.nl" className="text-blue-600 underline">
                success@cubea.nl
              </a>{" "}
              and we will delete it within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-neutral-900">Job listings</h2>
            <p className="mt-1">
              Job listings shown on this site are collected from public company
              career pages and public job-board APIs. Applying always happens
              directly on the company&apos;s own website — we never receive your
              application data.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-neutral-900">Contact</h2>
            <p className="mt-1">
              Questions? Email{" "}
              <a href="mailto:success@cubea.nl" className="text-blue-600 underline">
                success@cubea.nl
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
