import Link from "next/link";

const CITY_LINKS = [
  ["amsterdam", "Amsterdam"],
  ["rotterdam", "Rotterdam"],
  ["den-haag", "Den Haag"],
  ["utrecht", "Utrecht"],
  ["eindhoven", "Eindhoven"],
  ["groningen", "Groningen"],
  ["delft", "Delft"],
  ["nijmegen", "Nijmegen"],
];

const ROLE_LINKS = [
  ["software-engineer", "Software Engineer"],
  ["developer", "Developer"],
  ["data", "Data"],
  ["product-manager", "Product Manager"],
  ["devops", "DevOps & Cloud"],
  ["security", "Security"],
];

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-sm font-semibold text-neutral-900">Find jobs</div>
          <ul className="mt-3 space-y-2 text-sm text-neutral-500">
            <li><Link href="/jobs" className="hover:text-blue-700">All jobs</Link></li>
            <li><Link href="/hidden-gems" className="hover:text-fuchsia-700">💎 Hidden gems</Link></li>
            <li><Link href="/companies" className="hover:text-blue-700">Companies</Link></li>
            <li><Link href="/jobs/saved" className="hover:text-blue-700">Saved jobs</Link></li>
            <li><Link href="/tools/cv-reviewer" className="hover:text-blue-700">CV reviewer</Link></li>
            <li><Link href="/tools/ai-match" className="hover:text-blue-700">AI job match</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-neutral-900">Jobs by city</div>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-neutral-500">
            {CITY_LINKS.map(([slug, name]) => (
              <li key={slug}>
                <Link href={`/jobs/${slug}`} className="hover:text-blue-700">
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-neutral-900">Jobs by role</div>
          <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-neutral-500">
            {ROLE_LINKS.map(([slug, name]) => (
              <li key={slug}>
                <Link href={`/jobs/${slug}`} className="hover:text-blue-700">
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-neutral-900">CubeA</div>
          <ul className="mt-3 space-y-2 text-sm text-neutral-500">
            <li><Link href="/about" className="hover:text-blue-700">About</Link></li>
            <li><Link href="/recruiters" className="hover:text-blue-700">For employers</Link></li>
            <li><Link href="/blog" className="hover:text-blue-700">Blog</Link></li>
            <li><Link href="/privacy" className="hover:text-blue-700">Privacy</Link></li>
            <li><a href="mailto:success@cubea.nl" className="hover:text-blue-700">success@cubea.nl</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-100">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-neutral-400">
          Jobs crawled daily from 1,000+ Dutch company websites — including the
          ones nobody else shows you. Applying always happens directly with the
          company.
        </p>
      </div>
    </footer>
  );
}
