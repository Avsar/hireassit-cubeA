import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CITY_PAGES,
  ROLE_PAGES,
  ROLE_CITY_COMBOS,
  ROLE_CITY_ROLES,
  ROLE_CITY_CITIES,
  fetchJobs,
} from "@/lib/hireassist";
import JobCard from "@/components/jobs/JobCard";

export const revalidate = 1800;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cubea.nl";

// Pre-render the curated combos; any other valid role∈ROLE_PAGES × city∈CITY_PAGES
// still renders on demand. Sitemap promotes only the curated set.
export function generateStaticParams() {
  return ROLE_CITY_COMBOS.map(({ role, city }) => ({ slug: role, city }));
}

interface Props {
  params: { slug: string; city: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const role = ROLE_PAGES[params.slug];
  const cityName = CITY_PAGES[params.city];
  if (!role || !cityName) return { title: "Not found | CubeA" };
  const title = `${role.label} Jobs in ${cityName} — incl. hidden gems | CubeA`;
  const description = `${role.label} jobs in ${cityName}, crawled daily straight from company career pages — including roles that never reach LinkedIn or Indeed. Apply directly, no recruiters.`;
  return {
    title,
    description,
    alternates: { canonical: `/jobs/${params.slug}/${params.city}` },
    openGraph: { title, description, url: `/jobs/${params.slug}/${params.city}`, type: "website" },
  };
}

export default async function RoleCityPage({ params }: Props) {
  const role = ROLE_PAGES[params.slug];
  const cityName = CITY_PAGES[params.city];
  if (!role || !cityName) notFound();

  let data;
  try {
    data = await fetchJobs({ q: role.query, city: cityName, per_page: 50, sort: "newest" });
  } catch {
    data = null;
  }

  const roleLower = role.label.toLowerCase();
  // Cross-links stay within the curated set to avoid thin-page sprawl.
  const otherCities = ROLE_CITY_CITIES.filter((c) => c !== params.city);
  const otherRoles = ROLE_CITY_ROLES.filter((r) => r !== params.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Jobs", item: `${SITE}/jobs` },
          {
            "@type": "ListItem",
            position: 2,
            name: `${role.label} jobs`,
            item: `${SITE}/jobs/${params.slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: cityName,
            item: `${SITE}/jobs/${params.slug}/${params.city}`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: `${role.label} jobs in ${cityName}`,
        url: `${SITE}/jobs/${params.slug}/${params.city}`,
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
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="text-3xl font-bold">
            {role.label} jobs in {cityName}
          </h1>
          <p className="mt-2 max-w-2xl text-blue-100">
            {data
              ? `${data.count.toLocaleString("en-US")} open ${roleLower} positions`
              : `Open ${roleLower} positions`}{" "}
            in {cityName} — crawled daily straight from company career pages, including roles
            that never reach LinkedIn or Indeed.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        <nav className="text-sm text-neutral-500">
          <Link href="/jobs" className="hover:text-blue-700">Jobs</Link>
          <span className="mx-2">/</span>
          <Link href={`/jobs/${params.slug}`} className="hover:text-blue-700">
            {role.label} jobs
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-700">{cityName}</span>
        </nav>

        <Link
          href={`/jobs?q=${encodeURIComponent(role.query)}&city=${encodeURIComponent(cityName)}&hidden=true`}
          className="inline-block text-sm text-fuchsia-600 hover:underline"
        >
          💎 Hidden {roleLower} gems in {cityName}
        </Link>

        {!data || data.jobs.length === 0 ? (
          <p className="py-16 text-center text-neutral-500">
            No {roleLower} jobs in {cityName} right now —{" "}
            <Link href={`/jobs/${params.slug}`} className="text-blue-600 underline">
              see all {roleLower} jobs
            </Link>{" "}
            or{" "}
            <Link href={`/jobs/${params.city}`} className="text-blue-600 underline">
              all jobs in {cityName}
            </Link>
            .
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
              href={`/jobs?q=${encodeURIComponent(role.query)}&city=${encodeURIComponent(cityName)}`}
              className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              See all {data.count.toLocaleString("en-US")} {roleLower} jobs in {cityName} →
            </Link>
          </div>
        )}

        <div className="grid gap-8 border-t border-neutral-200 pt-8 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              {role.label} jobs in other cities
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {otherCities.map((slug) => (
                <Link
                  key={slug}
                  href={`/jobs/${params.slug}/${slug}`}
                  className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:border-blue-300 hover:text-blue-700"
                >
                  {CITY_PAGES[slug]}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Other roles in {cityName}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {otherRoles.map((slug) => (
                <Link
                  key={slug}
                  href={`/jobs/${slug}/${params.city}`}
                  className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:border-blue-300 hover:text-blue-700"
                >
                  {ROLE_PAGES[slug].label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
