"use client";

import { useEffect, useState } from "react";
import { isSaved, toggleSaved } from "@/lib/savedJobs";

interface Props {
  id: number;
  slug: string;
  title: string;
  company: string;
  city: string;
}

export default function SaveButton(props: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isSaved(props.id));
  }, [props.id]);

  return (
    <button
      onClick={() => setSaved(toggleSaved(props))}
      className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
        saved
          ? "border-blue-600 bg-blue-50 text-blue-700"
          : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
      }`}
    >
      {saved ? "★ Saved" : "☆ Save job"}
    </button>
  );
}
