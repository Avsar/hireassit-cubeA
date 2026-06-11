import { Metadata } from "next";
import { fetchCompanies } from "@/lib/hireassist";
import CompanyDirectory from "@/components/CompanyDirectory";

export const metadata: Metadata = {
  title: "Dutch Tech Companies Hiring Now — 700+ profiles | CubeA",
  description:
    "Browse 700+ Dutch companies with open vacancies, including small companies whose jobs never reach LinkedIn.",
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

  const totalJobs = companies.reduce((s, c) => s + c.active_jobs, 0);

  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="bg-blue-600 text-white">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="font-[Sora] text-3xl font-bold">Companies hiring in the Netherlands</h1>
          <p className="mt-2 text-blue-100">
            {companies.length.toLocaleString("en-US")} companies ·{" "}
            {totalJobs.toLocaleString("en-US")} open positions — crawled daily,
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
