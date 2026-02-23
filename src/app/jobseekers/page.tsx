"use client";

import React, { useState } from "react";

export default function JobseekersPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "jobseeker_waitlist" }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-black text-white font-bold grid place-items-center">
              AI
            </div>
            <div className="font-semibold tracking-tight">HireAssist by CubeA</div>
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-200 text-xs font-medium text-neutral-600 mb-6">
            Coming soon
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            Find your next role in Dutch tech
          </h1>

          <p className="mt-4 text-lg text-neutral-600 max-w-md mx-auto leading-relaxed">
            We&apos;re building an AI-powered job matching experience for tech professionals in the Netherlands. Be the first to know when we launch.
          </p>

          <div className="mt-8">
            {submitted ? (
              <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-8">
                <div className="text-3xl mb-3">🎉</div>
                <p className="font-semibold">You&apos;re on the list!</p>
                <p className="mt-1 text-sm text-neutral-600">
                  We&apos;ll reach out as soon as we&apos;re ready. Keep an eye on your inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-neutral-800 whitespace-nowrap"
                >
                  Join the waitlist
                </button>
              </form>
            )}

            {error && (
              <p className="mt-3 text-sm text-red-600">
                Something went wrong. Please try again.
              </p>
            )}

            {!submitted && (
              <p className="mt-3 text-xs text-neutral-500">
                No spam. Unsubscribe any time.
              </p>
            )}
          </div>

          <div className="mt-16 grid sm:grid-cols-3 gap-4 text-left">
            {[
              { title: "AI-matched jobs", desc: "Roles matched to your skills, not just keywords." },
              { title: "Dutch tech focus", desc: "Curated opportunities across the Netherlands." },
              { title: "Human in the loop", desc: "Real recruiters who understand your career goals." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-neutral-200 bg-white p-5">
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="mt-1 text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <a href="/" className="text-sm text-neutral-500 hover:text-neutral-800 hover:underline">
              &larr; Back to home
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-neutral-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>&copy; {new Date().getFullYear()} CubeA. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-neutral-900">Privacy</a>
            <a href="/terms" className="hover:text-neutral-900">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
