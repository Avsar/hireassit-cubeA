import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { CITY_PAGES, fetchJobs } from "@/lib/hireassist";
import JobCard from "@/components/jobs/JobCard";
import AlertSignup from "@/components/jobs/AlertSignup";

export const revalidate = 1800;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cubea.nl";

// Expat-heavy cities we surface as dedicated English-speaking hubs.
const FEATURED_CITIES = ["amsterdam", "eindhoven", "rotterdam", "utrecht", "den-haag", "groningen"];

export const metadata: Metadata = {
  title: "English-Speaking Jobs in the Netherlands — no Dutch required | CubeA",
  description:
    "English-speaking jobs across the Netherlands, crawled daily straight from company career pages — including roles that never reach LinkedIn or Indeed. Built for internationals and expats.",
  alternates: { canonical: "/english-speaking-jobs" },
  openGraph: {
    title: "English-Speaking Jobs in the Netherlands | CubeA",
    description:
      "English-speaking jobs across the Netherlands, straight from company career pages — including roles not on LinkedIn or Indeed.",
    url: "/english-speaking-jobs",
    type: "website",
  },
};

export default async function EnglishSpeakingHub() {
  let data;
  try {
    data = await fetchJobs({ english_only: true, per_page: 50, sort: "newest" });
  } catch {
    data = null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "English-speaking jobs",
            item: `${SITE}/english-speaking-jobs`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: "English-speaking jobs in the Netherlands",
        url: `${SITE}/english-speaking-jobs`,
        description:
          "English-language job openings across the Netherlands, crawled daily from company career pages.",
      },
    ],
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bg-blue-600 text-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h1 className="font-[Sora] text-3xl font-bold sm:text-4xl">
            English-speaking jobs in the Netherlands
          </h1>
          <p className="mt-3 max-w-2xl text-blue-100">
            {data
              ? `${data.count.toLocaleString("en-US")} English-language openings`
              : "English-language openings"}{" "}
            at Dutch companies — crawled daily straight from their career pages, including
            roles that never reach LinkedIn or Indeed. No Dutch required.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        <nav className="text-sm text-neutral-500">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-700">English-speaking jobs</span>
        </nav>

        <p className="text-sm leading-relaxed text-neutral-600">
          Moving to the Netherlands, or already here and job-hunting in English? Many Dutch
          companies hire in English but only post on their own career pages — so those roles
          never reach the big job boards. We crawl those pages every day and surface the
          English-language openings here. Every apply button goes straight to the company.
        </p>

        <Suspense>
          <AlertSignup
            lockedEnglish
            heading="🔔 Get English-speaking jobs by email"
            subtext="A daily email when new English-language roles appear — no Dutch required."
          />
        </Suspense>

        <section>
          <h2 className="text-sm font-semibold text-neutral-900">
            English-speaking jobs by city
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {FEATURED_CITIES.map((slug) => (
              <Link
                key={slug}
                href={`/english-speaking-jobs/${slug}`}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:border-blue-300 hover:text-blue-700"
              >
                {CITY_PAGES[slug]}
              </Link>
            ))}
          </div>
        </section>

        {!data || data.jobs.length === 0 ? (
          <p className="py-16 text-center text-neutral-500">
            No English-speaking jobs to show right now —{" "}
            <Link href="/jobs" className="text-blue-600 underline">browse all jobs</Link>.
          </p>
        ) : (
          <div className="grid gap-3">
            {data.jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {data && data.count > 50 && (
          <div className="text-center">
            <Link
              href="/jobs?english_only=true"
              className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              See all {data.count.toLocaleString("en-US")} English-speaking jobs →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
