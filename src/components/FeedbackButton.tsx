"use client";

import { useState } from "react";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [note, setNote] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const page =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "";
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, email, page }),
      });
      const data = await res.json();
      setNote(data.message || "");
      setState(res.ok ? "done" : "error");
      if (res.ok) setMessage("");
    } catch {
      setNote("Something went wrong. Please try again.");
      setState("error");
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setOpen((o) => !o);
          setState("idle");
        }}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-gem px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-gem-deep"
        aria-label="Send feedback"
      >
        💬 Feedback
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-80 max-w-[calc(100vw-2.5rem)] rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl">
          {state === "done" ? (
            <div className="py-4 text-center text-sm text-emerald-700">
              {note || "Thanks for the feedback!"}
              <div className="mt-3">
                <button
                  onClick={() => setOpen(false)}
                  className="text-gem hover:underline"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-neutral-900">Send us feedback</div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-neutral-500">
                Found a bug, a dead link, or have an idea? Tell us — it goes straight to the team.
              </p>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="What's on your mind?"
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gem-wash focus:border-gem"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional, if you'd like a reply)"
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gem-wash focus:border-gem"
              />
              <button
                type="submit"
                disabled={state === "sending"}
                className="w-full rounded-xl bg-gem px-4 py-2 text-sm font-semibold text-white hover:bg-gem-deep disabled:opacity-60"
              >
                {state === "sending" ? "Sending…" : "Send feedback"}
              </button>
              {state === "error" && (
                <p className="text-xs text-red-600">{note || "Please try again."}</p>
              )}
            </form>
          )}
        </div>
      )}
    </>
  );
}
