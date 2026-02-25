import React from "react";
import CubeALogo from "@/components/CubeALogo";

export const metadata = {
  title: "Job Seeker Toolkit — HireAssist by CubeA",
  description: "AI-powered tools to find your next role faster.",
};

const tools = [
  {
    icon: "🔎",
    title: "Browse Jobs",
    desc: "Find hidden jobs from company career pages",
    href: "https://hireassist-backend-production.up.railway.app/ui#",
    cta: "Browse jobs",
    available: true,
    external: true,
  },
  {
    icon: "📄",
    title: "CV Reviewer",
    desc: "Get AI feedback on your CV",
    href: "/tools/cv-reviewer",
    cta: "Try it",
    available: true,
    external: false,
  },
  {
    icon: "✉️",
    title: "Cover Letter Generator",
    desc: "Write tailored cover letters",
    href: "/tools/cover-letter",
    cta: "Try it",
    available: false,
    external: false,
  },
  {
    icon: "🎯",
    title: "Job Match Score",
    desc: "See how well you fit a role",
    href: "/tools/job-match",
    cta: "Try it",
    available: false,
    external: false,
  },
];

export default function JobseekersPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <CubeALogo />
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="/blog" className="text-neutral-600 hover:text-black">Blog</a>
            <a href="/recruiters" className="text-neutral-600 hover:text-black">For recruiters</a>
            <a href="#" className="text-neutral-600 hover:text-black">For job seekers</a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
          {/* Page header */}
          <div className="mb-10">
            <a
              href="/"
              className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800 mb-6"
            >
              &larr; Home
            </a>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Job Seeker Toolkit
            </h1>
            <p className="mt-2 text-neutral-600 max-w-xl">
              AI-powered tools to find your next role faster — from browsing openings to landing the interview.
            </p>
          </div>

          {/* Tool grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {tools.map((tool) =>
              tool.available ? (
                <a
                  key={tool.title}
                  href={tool.href}
                  {...(tool.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex flex-col gap-4 rounded-2xl border-2 border-neutral-200 bg-white p-6 hover:border-black hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-xl bg-black text-white grid place-items-center text-xl select-none">
                      {tool.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">{tool.title}</h2>
                    <p className="mt-1 text-sm text-neutral-600">{tool.desc}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-black group-hover:underline">
                    {tool.cta} {tool.external ? "↗" : "→"}
                  </span>
                </a>
              ) : (
                <div
                  key={tool.title}
                  className="relative flex flex-col gap-4 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-6"
                >
                  <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-neutral-200 text-xs font-medium text-neutral-500">
                    Coming soon
                  </span>
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-xl bg-neutral-200 text-neutral-400 grid place-items-center text-xl select-none">
                      {tool.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg text-neutral-500">{tool.title}</h2>
                    <p className="mt-1 text-sm text-neutral-400">{tool.desc}</p>
                  </div>
                  <span className="text-sm text-neutral-400 cursor-default select-none">
                    {tool.cta} &rarr;
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-200 bg-white mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-neutral-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>&copy; {new Date().getFullYear()} CubeA. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-neutral-900">Privacy</a>
            <a href="/terms" className="hover:text-neutral-900">Terms</a>
            <a href="/impressum" className="hover:text-neutral-900">Impressum</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
