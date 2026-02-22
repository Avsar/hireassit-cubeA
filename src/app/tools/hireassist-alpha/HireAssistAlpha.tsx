"use client";
import { useEffect, useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_HIREASSIST_UI_URL ?? "";

export default function HireAssistAlpha() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    if (!BACKEND_URL) { setStatus("offline"); return; }
    const base = new URL(BACKEND_URL).origin;
    fetch(`${base}/ping`, { mode: "cors" })
      .then((r) => setStatus(r.ok ? "online" : "offline"))
      .catch(() => setStatus("offline"));
  }, []);

  const statusColor =
    status === "online" ? "bg-green-500" : status === "offline" ? "bg-red-400" : "bg-neutral-300";
  const statusLabel =
    status === "online" ? "Online" : status === "offline" ? "Offline" : "Checking...";

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-black text-white font-bold grid place-items-center text-sm">AI</div>
            <div className="font-semibold tracking-tight">HireAssist by CubeA</div>
          </a>
          <nav className="flex items-center gap-4 sm:gap-6 text-sm">
            <a href="/" className="hover:text-black">Home</a>
            <a href="#" className="font-medium text-black">HireAssist Alpha</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">HireAssist NL (Alpha)</h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Alpha — coverage may be incomplete. Data refreshes daily.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {BACKEND_URL && (
              <a
                href={BACKEND_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 text-sm hover:bg-neutral-100 whitespace-nowrap"
              >
                Open in new tab <span className="text-xs">&#8599;</span>
              </a>
            )}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-500">
              <span className={`inline-block h-2 w-2 rounded-full ${statusColor}`} />
              {statusLabel}
            </div>
          </div>
        </div>

        {BACKEND_URL ? (
          <iframe
            src={BACKEND_URL}
            className="w-full rounded-xl border border-neutral-200"
            style={{ height: "90vh" }}
            allow="clipboard-read; clipboard-write"
          />
        ) : (
          <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center text-neutral-400">
            NEXT_PUBLIC_HIREASSIST_UI_URL is not configured.
          </div>
        )}
      </main>
    </div>
  );
}
