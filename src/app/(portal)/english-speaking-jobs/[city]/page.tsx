import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CITY_PAGES, fetchJobs } from "@/lib/hireassist";
import JobCard from "@/components/jobs/JobCard";

export const revalidate = 1800;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cubea.nl";

// Pre-render the expat-heavy cities; any other valid CITY_PAGES slug still
// renders on demand. Sitemap promotes only these.
const FEATURED_CITIES = ["amsterdam", "eindhoven", "rotterdam", "utrecht", "den-haag", "groningen"];

export function generateStaticParams() {
  return FEATURED_CITIES.map((city) => ({ city }));
}

interface Props {
  params: { city: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cityName = CITY_PAGES[params.city];
  if (!cityName) return { title: "Not found | CubeA" };
  const title = `English-Speaking Jobs in ${cityName} — no Dutch required | CubeA`;
  const description = `English-speaking jobs in ${cityName}, crawled daily straight from company career pages — including roles that never reach LinkedIn or Indeed. Built for internationals and expats.`;
  return {
    title,
    description,
    alternates: { canonical: `/english-speaking-jobs/${params.city}` },
    openGraph: { title, description, url: `/english-speaking-jobs/${params.city}`, type: "website" },
  };
}

export default async function EnglishSpeakingCityPage({ params }: Props) {
  const cityName = CITY_PAGES[params.city];
  if (!cityName) notFound();

  let data;
  try {
    data = await fetchJobs({ english_only: true, city: cityName, per_page: 50, sort: "newest" });
  } catch {
    data = null;
  }

  const otherCities = FEATURED_CITIES.filter((c) => c !== params.city);

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
          {
            "@type": "ListItem",
            position: 3,
            name: cityName,
            item: `${SITE}/english-speaking-jobs/${params.city}`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: `English-speaking jobs in ${cityName}`,
        url: `${SITE}/english-speaking-jobs/${params.city}`,
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
            English-speaking jobs in {cityName}
          </h1>
          <p className="mt-3 max-w-2xl text-blue-100">
            {data
              ? `${data.count.toLocaleString("en-US")} English-language openings`
              : "English-language openings"}{" "}
            in {cityName} — crawled daily straight from company career pages, including roles
            that never reach LinkedIn or Indeed. No Dutch required.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        <nav className="text-sm text-neutral-500">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/english-speaking-jobs" className="hover:text-blue-700">
            English-speaking jobs
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-700">{cityName}</span>
        </nav>

        <p className="text-sm leading-relaxed text-neutral-600">
          Looking for work in {cityName} without speaking Dutch? These are English-language
          roles at Dutch companies, pulled straight from their own career pages — so you&apos;ll
          find openings here that never make it onto LinkedIn or Indeed. Every apply button
          goes directly to the company, no recruiters in between.
        </p>

        {!data || data.jobs.length === 0 ? (
          <p className="py-16 text-center text-neutral-500">
            No English-speaking jobs listed in {cityName} right now —{" "}
            <Link href="/english-speaking-jobs" className="text-blue-600 underline">
              see all English-speaking jobs
            </Link>.
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
              href={`/jobs?english_only=true&city=${encodeURIComponent(cityName)}`}
              className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              See all {data.count.toLocaleString("en-US")} English-speaking jobs in {cityName} →
            </Link>
          </div>
        )}

        <section className="border-t border-neutral-200 pt-8">
          <h2 className="text-sm font-semibold text-neutral-900">
            English-speaking jobs in other cities
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {otherCities.map((slug) => (
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
      </div>
    </main>
  );
}
