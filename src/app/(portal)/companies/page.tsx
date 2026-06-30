import { Metadata } from "next";
import { fetchCompanies, fetchJobs } from "@/lib/hireassist";
import CompanyDirectory from "@/components/CompanyDirectory";

export const metadata: Metadata = {
  title: "Dutch Companies Hiring Now | CubeA",
  description:
    "Browse Dutch companies with open vacancies, including small companies whose jobs never reach LinkedIn.",
};

export const revalidate = 3600;

export default async function CompaniesPage() {
  let companies;
  try {
    companies = await fetchCompanies();
  } catch {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-[Sora] text-2xl font-bold">Company directory is briefly unavailable</h1>
        <p className="mt-2 text-neutral-500">Please refresh in a few seconds.</p>
      </main>
    );
  }

  let liveJobCount: number | null = null;
  try {
    const jobs = await fetchJobs({ per_page: 1 });
    liveJobCount = jobs.count;
  } catch {}

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="bg-blue-600 text-white">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="font-[Sora] text-3xl font-bold">Companies hiring in the Netherlands</h1>
          <p className="mt-2 text-blue-100">
            {companies.length.toLocaleString("en-US")} companies ·{" "}
            {liveJobCount !== null ? liveJobCount.toLocaleString("en-US") : "thousands of"} open positions — crawled daily,
            straight from the source.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <CompanyDirectory companies={companies} />
      </div>
    </main>
  );
}
