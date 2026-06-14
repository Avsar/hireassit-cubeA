"use client";

import { track } from "@/lib/analytics";

interface Props {
  applyUrl: string;
  jobId: number;
  company: string;
  title: string;
  hiddenTier?: number;
  className?: string;
  children: React.ReactNode;
}

// The primary conversion: a click through to the company's own apply page.
// Fires a GA4 `apply_click` event, then lets the normal link navigation proceed.
export default function ApplyButton({
  applyUrl,
  jobId,
  company,
  title,
  hiddenTier,
  className,
  children,
}: Props) {
  return (
    <a
      href={applyUrl}
      target="_blank"
      rel="noopener nofollow"
      className={className}
      onClick={() =>
        track("apply_click", {
          job_id: jobId,
          company,
          job_title: title,
          hidden_gem: (hiddenTier ?? 0) >= 2,
        })
      }
    >
      {children}
    </a>
  );
}
