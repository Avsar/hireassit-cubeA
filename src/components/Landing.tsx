"use client";

import React, { useMemo, useState } from "react";

export default function Landing() {
  const [lang, setLang] = useState<"en" | "nl">("en");
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useMemo(() => tx[lang], [lang]);

  const navLinks = [
    { href: "#how", label: t.nav.how },
    { href: "#features", label: t.nav.features },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-black text-white font-bold grid place-items-center">
              AI
            </div>
            <div className="font-semibold tracking-tight">HireAssist by CubeA</div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-black">
                {l.label}
              </a>
            ))}
            <a
              href="/tools/hireassist-alpha"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {t.nav.hireassist}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "en" ? "nl" : "en")}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 text-xs hover:bg-neutral-100"
            >
              {lang === "en" ? "NL" : "EN"}
            </button>

            <a
              href="#contact"
              className="hidden sm:inline-flex px-3 py-2 rounded-xl bg-black text-white text-sm hover:bg-neutral-800"
            >
              {t.cta.hireNow}
            </a>

            {/* Hamburger — mobile only */}
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

        {/* Mobile nav drawer */}
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
            <a
              href="/tools/hireassist-alpha"
              onClick={() => setMobileOpen(false)}
              className="py-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              {t.nav.hireassist}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex justify-center px-4 py-2 rounded-xl bg-black text-white hover:bg-neutral-800"
            >
              {t.cta.hireNow}
            </a>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              {t.hero.title}
            </h1>
            <p className="mt-4 text-lg text-neutral-700">{t.hero.subtitle}</p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="#demo"
                className="px-4 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-neutral-800"
              >
                {t.cta.tryDemo}
              </a>
              <a
                href="#contact"
                className="px-4 py-3 rounded-xl border border-neutral-300 text-sm font-medium hover:bg-neutral-100"
              >
                {t.cta.talk}
              </a>
            </div>

            <ul className="mt-6 text-sm text-neutral-600 space-y-2 list-disc pl-5">
              <li>{t.hero.points[0]}</li>
              <li>{t.hero.points[1]}</li>
              <li>{t.hero.points[2]}</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6">
            <MiniMatchDemo lang={lang} />
          </div>
        </div>
      </section>

      <section id="how" className="bg-white border-y border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold tracking-tight">{t.how.title}</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {t.how.steps.map((s, i) => (
              <div
                key={i}
                className="rounded-2xl border border-neutral-200 p-6 bg-neutral-50"
              >
                <div className="h-10 w-10 rounded-xl bg-black text-white grid place-items-center text-sm font-semibold">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-neutral-700">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold tracking-tight">{t.features.title}</h2>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.features.items.map((f, i) => (
              <div key={i} className="rounded-2xl border border-neutral-200 p-6 bg-white">
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-neutral-700">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t.contact.title}</h2>
            <p className="mt-2 text-neutral-700">{t.contact.desc}</p>
            <ul className="mt-6 text-sm text-neutral-700 space-y-2 list-disc pl-5">
              {t.contact.points.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>

          <LeadForm lang={lang} />
        </div>
      </section>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-neutral-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-neutral-900">HireAssist by CubeA</div>
            <div className="mt-1">
              © {new Date().getFullYear()} CubeA. {t.footer.rights}
            </div>
          </div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-neutral-900">
              {t.footer.privacy}
            </a>
            <a href="/terms" className="hover:text-neutral-900">
              {t.footer.terms}
            </a>
            <a href="/impressum" className="hover:text-neutral-900">
              {t.footer.impressum}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LeadForm({ lang }: { lang: "en" | "nl" }) {
  const t = tx[lang];

  return (
    <div
      className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
      data-form="hireassist"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">{t.form.first}</label>
          <input
            name="firstName"
            required
            className="mt-1 w-full border border-neutral-300 rounded-xl px-3 py-2"
            placeholder="Amit"
          />
        </div>
        <div>
          <label className="text-sm">{t.form.last}</label>
          <input
            name="lastName"
            required
            className="mt-1 w-full border border-neutral-300 rounded-xl px-3 py-2"
            placeholder="Mohan"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm">{t.form.email}</label>
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full border border-neutral-300 rounded-xl px-3 py-2"
            placeholder="you@company.com"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm">{t.form.company}</label>
          <input
            name="company"
            className="mt-1 w-full border border-neutral-300 rounded-xl px-3 py-2"
            placeholder="Company BV"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm">{t.form.need}</label>
          <textarea
            name="need"
            className="mt-1 w-full border border-neutral-300 rounded-xl px-3 py-2 min-h-[100px]"
            placeholder={t.form.needPh}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={async (e) => {
          const root = e.currentTarget.closest(
            '[data-form="hireassist"]'
          ) as HTMLElement;
          const inputs = root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
            "input[name], textarea[name]"
          );

          const payload: Record<string, string> = {};
          inputs.forEach((el) => (payload[el.name] = el.value));

          try {
            const res = await fetch("/api/lead", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            if (res.ok) {
              inputs.forEach((el) => (el.value = ""));
              alert("✅ Thank you! Your request has been sent successfully.");
            } else {
              alert("❌ Something went wrong. Please try again later.");
            }
          } catch {
            alert("⚠️ Network error. Please try again.");
          }
        }}
        className="mt-4 w-full px-4 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-neutral-800"
      >
        {t.cta.requestDemo}
      </button>

      <p className="mt-3 text-xs text-neutral-500">{t.form.gdpr}</p>
    </div>
  );
}

function MiniMatchDemo({ lang }: { lang: "en" | "nl" }) {
  const t = tx[lang];
  const [jd, setJd] = useState("");
  const [cv, setCv] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [highlights, setHighlights] = useState<string[]>([]);

  async function simpleMatch() {
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd, cv }),
      });

      const data = await res.json();
      if (typeof data?.score === "number") {
        setScore(Math.max(0, Math.min(100, data.score)));
        setHighlights(Array.isArray(data.highlights) ? data.highlights.slice(0, 10) : []);
      } else {
        setScore(0);
        setHighlights([]);
      }
    } catch {
      setScore(0);
      setHighlights([]);
    }
  }

  return (
    <div id="demo">
      <h3 className="text-lg font-semibold">{t.demo.title}</h3>
      <p className="mt-1 text-sm text-neutral-600">{t.demo.desc}</p>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder={t.demo.jdPh}
          className="min-h-[160px] w-full rounded-xl border border-neutral-300 px-3 py-2"
        />
        <textarea
          value={cv}
          onChange={(e) => setCv(e.target.value)}
          placeholder={t.demo.cvPh}
          className="min-h-[160px] w-full rounded-xl border border-neutral-300 px-3 py-2"
        />
      </div>

      <button
        onClick={simpleMatch}
        className="mt-3 px-3 py-2 rounded-xl bg-black text-white text-sm hover:bg-neutral-800"
      >
        {t.demo.matchBtn}
      </button>

      {score !== null && (
        <div className="mt-4 rounded-2xl border border-neutral-200 p-4 bg-neutral-50">
          <div className="text-sm text-neutral-700">
            {t.demo.score}: <span className="font-semibold">{score}%</span>
          </div>

          {highlights.length > 0 && (
            <div className="mt-2 text-xs text-neutral-600">
              {t.demo.overlap}: {highlights.join(", ")}
            </div>
          )}

          <div className="mt-3 h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-black"
              style={{ width: `${Math.min(100, Math.max(0, score || 0))}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-neutral-500">{t.demo.note}</p>
        </div>
      )}
    </div>
  );
}

const tx = {
  en: {
    nav: {
      how: "How it works",
      features: "Features",
      contact: "Contact",
      hireassist: "HireAssist Alpha",
    },
    cta: {
      hireNow: "Hire now",
      tryDemo: "Try AI demo",
      talk: "Talk to us",
      requestDemo: "Request a Demo",
    },
    hero: {
      title: "Human + AI recruiting for niche roles in Europe",
      subtitle:
        "We combine smart automation with expert screening to fill roles faster — without big-agency fees.",
      points: [
        "AI-ranked shortlists within days",
        "Personal screening and culture fit checks",
        "No big-agency fees — pay only for results",
      ],
    },
    how: {
      title: "How HireAssist works",
      steps: [
        { title: "Describe your role", desc: "Paste your JD or tell us the must-have skills and location." },
        { title: "AI shortlist + human review", desc: "Our engine ranks candidates; our recruiters verify quality and fit." },
        { title: "Interview in 5 days", desc: "We schedule interviews and support offers, relocation, and onboarding." },
      ],
    },
    features: {
      title: "What you get",
      items: [
        { title: "AI Matching (Beta)", desc: "Automated parsing and ranking of CVs vs. job specs with human approval." },
        { title: "Outbound outreach", desc: "Personalized messaging at scale via email/LinkedIn." },
        { title: "Talent CRM", desc: "Lightweight pipeline view for roles and candidates (integrates with Airtable/ATS)." },
        { title: "Calendars & chat", desc: "Calendly embeds and website chat for quick scheduling." },
        { title: "GDPR-ready", desc: "Consent capture and data-retention controls." },
        { title: "Multilingual", desc: "English + Dutch UI and candidate comms." },
      ],
    },
    contact: {
      title: "Tell us what you need",
      desc: "Share your role and we’ll reply with a shortlist and a plan.",
      points: [
        "Typical response within one business day",
        "No commitment — just a conversation",
        "English and Dutch speaking team",
      ],
    },
    form: {
      first: "First name",
      last: "Last name",
      email: "Work email",
      company: "Company",
      need: "What role(s) are you hiring?",
      needPh: "E.g., 2x Senior Data Engineer in Eindhoven, English-only, onsite 3 days.",
      gdpr: "By submitting, you agree to our privacy policy and consent to being contacted about your request.",
    },
    demo: {
      title: "AI Match (Keyword Demo)",
      desc: "Paste a job spec and a CV to see a quick, on-device overlap score. The production system uses a much smarter model.",
      jdPh: "Paste Job Description here…",
      cvPh: "Paste Candidate CV here…",
      matchBtn: "Score match",
      score: "Match score",
      overlap: "Keyword overlap",
      note: "Demo only. Real engine uses embeddings and semantic matching.",
    },
    footer: { rights: "All rights reserved.", privacy: "Privacy", terms: "Terms", impressum: "Impressum" },
  },
  nl: {
    nav: { how: "Werkwijze", features: "Functies", contact: "Contact", hireassist: "HireAssist Alpha" },
    cta: { hireNow: "Start met werven", tryDemo: "Probeer AI-demo", talk: "Plan een gesprek", requestDemo: "Vraag een demo aan" },
    hero: {
      title: "Human + AI-werving voor niche rollen in Europa",
      subtitle: "Slimme automatisering met persoonlijke screening. Sneller invullen – zonder big-agency tarieven.",
      points: ["AI-shortlist binnen dagen", "Persoonlijke screening & cultuur-fit", "Geen bureau-tarieven — betaal voor resultaat"],
    },
    how: {
      title: "Zo werkt HireAssist",
      steps: [
        { title: "Rol beschrijven", desc: "Plak je vacature of noem de must-haves en locatie." },
        { title: "AI-shortlist + menselijke review", desc: "Onze engine rangschikt kandidaten; recruiters checken kwaliteit en fit." },
        { title: "Interview in 5 dagen", desc: "Wij plannen gesprekken en helpen met aanbod en onboarding." },
      ],
    },
    features: {
      title: "Wat je krijgt",
      items: [
        { title: "AI-matching (Beta)", desc: "Automatisch vergelijken van CV's met vacatures; altijd met menselijke goedkeuring." },
        { title: "Outbound-outreach", desc: "Gepersonaliseerde berichten op schaal via e-mail/LinkedIn." },
        { title: "Talent-CRM", desc: "Lichte pipeline-weergave (koppelt met Airtable/ATS)." },
        { title: "Agenda & chat", desc: "Calendly-embeds en websitechat voor snel plannen." },
        { title: "AVG-proof", desc: "Toestemming vastleggen en bewaartermijnen." },
        { title: "Meertalig", desc: "Engels + Nederlands UI en candidate comms." },
      ],
    },
    contact: {
      title: "Vertel ons wat je nodig hebt",
      desc: "Deel je rol en we sturen een shortlist en plan terug.",
      points: [
        "Reactie binnen één werkdag",
        "Geen verplichtingen — gewoon een gesprek",
        "Nederlandstalig en Engelstalig team",
      ],
    },
    form: {
      first: "Voornaam",
      last: "Achternaam",
      email: "Zakelijk e-mailadres",
      company: "Bedrijf",
      need: "Welke rol(len) wil je invullen?",
      needPh: "Bijv. 2× Senior Data Engineer in Eindhoven, Engels-only, 3 dagen onsite.",
      gdpr: "Door te verzenden ga je akkoord met ons privacybeleid en geef je toestemming om contact op te nemen.",
    },
    demo: {
      title: "AI-match (Keyword-demo)",
      desc: "Plak een vacature en een CV voor een snelle overlap-score. De productieversie gebruikt een slimmer model.",
      jdPh: "Plak hier de vacature…",
      cvPh: "Plak hier het CV…",
      matchBtn: "Score match",
      score: "Match-score",
      overlap: "Keyword-overlap",
      note: "Demo. In productie gebruiken we embeddings en semantische matching.",
    },
    footer: { rights: "Alle rechten voorbehouden.", privacy: "Privacy", terms: "Voorwaarden", impressum: "Impressum" },
  },
} as const;
