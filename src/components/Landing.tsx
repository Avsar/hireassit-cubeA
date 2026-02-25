"use client";

import React, { useMemo, useState } from "react";
import CubeALogo from "./CubeALogo";

export default function Landing() {
  const [lang, setLang] = useState<"en" | "nl">("en");
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useMemo(() => tx[lang], [lang]);

  const navLinks = [
    { href: "/recruiters#how", label: t.nav.how },
    { href: "/recruiters#features", label: t.nav.features },
    { href: "/recruiters#contact", label: t.nav.contact },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <CubeALogo />
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-black">
                {l.label}
              </a>
            ))}
            <a href="/blog" className="hover:text-black">
              Blog
            </a>
            <a href="/tools/ai-match" className="text-blue-600 hover:text-blue-800 font-medium">
              AI Match
            </a>
            <a href="/tools/hireassist-alpha" className="text-blue-600 hover:text-blue-800 font-medium">
              HireAssist Alpha
            </a>
            <a href="/tools/cv-reviewer" className="text-blue-600 hover:text-blue-800 font-medium">
              CV Reviewer
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "nl" : "en")}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 text-xs hover:bg-neutral-100"
            >
              {lang === "en" ? "NL" : "EN"}
            </button>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-3 flex flex-col gap-1 text-sm">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-2 hover:text-black"
              >
                {l.label}
              </a>
            ))}
            <a href="/blog" onClick={() => setMobileOpen(false)} className="py-2 hover:text-black">
              Blog
            </a>
            <a href="/tools/ai-match" onClick={() => setMobileOpen(false)} className="py-2 text-blue-600 hover:text-blue-800 font-medium">
              AI Match
            </a>
            <a href="/tools/hireassist-alpha" onClick={() => setMobileOpen(false)} className="py-2 text-blue-600 hover:text-blue-800 font-medium">
              HireAssist Alpha
            </a>
            <a href="/tools/cv-reviewer" onClick={() => setMobileOpen(false)} className="py-2 text-blue-600 hover:text-blue-800 font-medium">
              CV Reviewer
            </a>
          </div>
        )}
      </header>

      <main className="flex-1 flex items-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              {t.hero.title}
            </h1>
            <p className="mt-4 text-lg text-neutral-600 max-w-xl mx-auto">
              {t.hero.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Hiring card */}
            <a
              href="/recruiters"
              className="group flex flex-col gap-5 rounded-3xl border-2 border-neutral-200 bg-white p-8 hover:border-black hover:shadow-lg transition-all"
            >
              <div className="h-14 w-14 rounded-2xl bg-black text-white grid place-items-center text-2xl select-none">
                🏢
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{t.paths.hiring.title}</h2>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  {t.paths.hiring.desc}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-black group-hover:underline">
                {t.paths.hiring.cta} &rarr;
              </span>
            </a>

            {/* Job seeker card */}
            <a
              href="/jobseekers"
              className="group flex flex-col gap-5 rounded-3xl border-2 border-neutral-200 bg-white p-8 hover:border-black hover:shadow-lg transition-all"
            >
              <div className="h-14 w-14 rounded-2xl bg-black text-white grid place-items-center text-2xl select-none">
                🔍
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{t.paths.seeker.title}</h2>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  {t.paths.seeker.desc}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-black group-hover:underline">
                {t.paths.seeker.cta} &rarr;
              </span>
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-neutral-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CubeALogo iconSize={24} />
            <div className="mt-1">
              &copy; {new Date().getFullYear()} CubeA. {t.footer.rights}
            </div>
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-neutral-900">{t.footer.privacy}</a>
            <a href="/terms" className="hover:text-neutral-900">{t.footer.terms}</a>
            <a href="/impressum" className="hover:text-neutral-900">{t.footer.impressum}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const tx = {
  en: {
    nav: { how: "How it works", features: "Features", contact: "Contact" },
    hero: {
      title: "Human + AI recruiting",
      subtitle: "Tell us who you are to get started.",
    },
    paths: {
      hiring: {
        title: "I'm hiring",
        desc: "Find top tech talent fast with AI-powered screening and expert recruiters. No big-agency fees.",
        cta: "Get started",
      },
      seeker: {
        title: "I'm looking for a job",
        desc: "Find your next role in Dutch tech with personalised AI-powered matches.",
        cta: "Get started",
      },
    },
    footer: { rights: "All rights reserved.", privacy: "Privacy", terms: "Terms", impressum: "Impressum" },
  },
  nl: {
    nav: { how: "Werkwijze", features: "Functies", contact: "Contact" },
    hero: {
      title: "Human + AI-werving",
      subtitle: "Vertel ons wie je bent om te beginnen.",
    },
    paths: {
      hiring: {
        title: "Ik wil iemand aannemen",
        desc: "Vind snel toptalent met AI-screening en ervaren recruiters. Geen bureau-tarieven.",
        cta: "Begin nu",
      },
      seeker: {
        title: "Ik zoek een baan",
        desc: "Vind je volgende rol in de Nederlandse tech met gepersonaliseerde AI-matches.",
        cta: "Aan de slag",
      },
    },
    footer: { rights: "Alle rechten voorbehouden.", privacy: "Privacy", terms: "Voorwaarden", impressum: "Impressum" },
  },
} as const;
