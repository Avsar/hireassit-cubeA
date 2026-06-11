"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CubeALogo from "./CubeALogo";

const LINKS = [
  { href: "/jobs", label: "Jobs" },
  { href: "/hidden-gems", label: "💎 Hidden gems" },
  { href: "/companies", label: "Companies" },
  { href: "/blog", label: "Blog" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/jobs"
      ? pathname === "/jobs" || /^\/jobs\/(?!saved)/.test(pathname)
      : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <CubeALogo />
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                isActive(l.href)
                  ? "font-semibold text-blue-700"
                  : "text-neutral-600 hover:text-neutral-900"
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 text-sm md:flex">
          <Link href="/jobs/saved" className="text-neutral-600 hover:text-neutral-900">
            ★ Saved
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
          className="md:hidden rounded-lg border border-neutral-300 px-3 py-1.5 text-sm"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <nav className="border-t border-neutral-200 bg-white px-4 py-3 md:hidden">
          {[...LINKS, { href: "/jobs/saved", label: "★ Saved jobs" }, { href: "/recruiters", label: "For employers" }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-neutral-700 hover:text-blue-700"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
