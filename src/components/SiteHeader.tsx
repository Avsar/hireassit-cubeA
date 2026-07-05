"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import CubeALogo from "./CubeALogo";

const LINKS = [
  { href: "/jobs", label: "Jobs" },
  { href: "/hidden-gems", label: "💎 Hidden gems" },
  { href: "/companies", label: "Companies" },
  { href: "/blog", label: "Blog" },
];

function HeaderSearchInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isJobsPage = pathname === "/jobs" || /^\/jobs\/(?!saved)/.test(pathname);
  const [q, setQ] = useState(isJobsPage ? searchParams.get("q") || "" : "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) {
          router.push(`/jobs?q=${encodeURIComponent(q.trim())}`);
        } else {
          router.push("/jobs");
        }
      }}
      className="relative"
    >
      <svg
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder='Try "ux designer", "Adyen", or "python"…'
        className="w-[220px] rounded-full border border-neutral-300 bg-neutral-50 py-1.5 pl-8 pr-3 text-sm focus:border-gem focus:bg-white focus:outline-none focus:ring-2 focus:ring-gem-wash"
      />
    </form>
  );
}

function SearchFallback() {
  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <input
        type="search"
        disabled
        placeholder='Try "ux designer", "Adyen", or "python"…'
        className="w-[220px] rounded-full border border-neutral-300 bg-neutral-50 py-1.5 pl-8 pr-3 text-sm"
      />
    </div>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [mobileQ, setMobileQ] = useState("");

  const isActive = (href: string) =>
    href === "/jobs"
      ? pathname === "/jobs" || /^\/jobs\/(?!saved)/.test(pathname)
      : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <CubeALogo />
        </Link>

        <nav className="hidden items-center gap-5 text-sm lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                isActive(l.href)
                  ? "font-semibold text-gem"
                  : "text-neutral-600 hover:text-neutral-900"
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 text-sm lg:flex">
          <Suspense fallback={<SearchFallback />}>
            <HeaderSearchInner />
          </Suspense>
          <Link href="/jobs/saved" className="text-neutral-600 hover:text-neutral-900">
            ★ Saved
          </Link>
          <Link href="/account" className="text-neutral-600 hover:text-neutral-900">
            Account
          </Link>
          <Link
            href="/recruiters"
            className="rounded-xl border border-neutral-300 px-3.5 py-1.5 text-neutral-700 hover:bg-neutral-50"
          >
            For employers
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          className="lg:hidden rounded-lg border border-neutral-300 px-3 py-1.5 text-sm"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <nav className="border-t border-neutral-200 bg-white px-4 py-3 lg:hidden">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (mobileQ.trim()) {
                router.push(`/jobs?q=${encodeURIComponent(mobileQ.trim())}`);
                setOpen(false);
              }
            }}
            className="relative mb-3"
          >
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={mobileQ}
              onChange={(e) => setMobileQ(e.target.value)}
              placeholder="Search jobs…"
              className="w-full rounded-full border border-neutral-300 py-2 pl-9 pr-3.5 text-sm focus:border-gem focus:outline-none focus:ring-2 focus:ring-gem-wash"
            />
          </form>
          {[...LINKS, { href: "/jobs/saved", label: "★ Saved jobs" }, { href: "/account", label: "Account" }, { href: "/recruiters", label: "For employers" }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-neutral-700 hover:text-gem"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
