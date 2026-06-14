import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cubea.nl";

export const metadata: Metadata = {
  title: "About CubeA — why we exist",
  description:
    "CubeA started with a five-month job hunt and one company that wasn't on LinkedIn. Here's the story behind why we surface the Netherlands' hidden jobs.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About CubeA — why we exist",
    description:
      "CubeA started with a five-month job hunt and one company that wasn't on LinkedIn. Here's the story behind it.",
    type: "website",
    url: `${SITE}/about`,
    siteName: "CubeA",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About CubeA",
  url: `${SITE}/about`,
  publisher: { "@type": "Organization", name: "CubeA", url: SITE },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight leading-snug">About CubeA</h1>
        <p className="mt-3 text-neutral-600">
          CubeA started with a five-month job hunt and one company we almost never found.
        </p>

        <div className="prose prose-neutral mt-10 max-w-none text-sm leading-7 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:text-neutral-700 [&_p]:mb-4 [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-black">
          <h2>It started with a job hunt, not a business plan</h2>
          <p>
            CubeA didn&apos;t begin in a brainstorm or a pitch deck. It began with my wife being out
            of work.
          </p>
          <p>
            If you&apos;ve been there, you know it&apos;s not just the lost income &mdash; it&apos;s
            the slow grind of it. The endless scrolling. The applications that vanish into a void.
            The same handful of roles from the same big companies on every site. For her, that grind
            lasted <strong>five months</strong>.
          </p>

          <h2>The part nobody tells you about job hunting</h2>
          <p>
            She did everything you&apos;re supposed to do. LinkedIn every day. Indeed. The other
            platforms. And when those ran dry, she did the harder thing: continuous outreach &mdash;
            messaging people directly, asking around, knocking on doors that don&apos;t have a public
            &ldquo;Apply&rdquo; button.
          </p>
          <p>
            And somewhere in those five months, she noticed something strange. The most interesting
            roles often weren&apos;t on the job boards at all.
          </p>

          <h2>The company we almost never found</h2>
          <p>
            The turning point was a company in Eindhoven &mdash; Wolfpack. A place she&apos;d have
            loved to work, doing exactly the kind of work she wanted. And she only found it because
            her outreach happened to lead her there. It wasn&apos;t sitting on LinkedIn waiting to be
            discovered. If she&apos;d relied on the boards alone, she&apos;d have walked right past
            it.
          </p>
          <p>
            That stuck with both of us. How many other companies were out there, quietly hiring on
            their own career pages, completely invisible to the people who&apos;d be perfect for
            them? And how many job seekers were grinding through five-month searches, never knowing
            those roles existed?
          </p>

          <h2>From a frustration to CubeA</h2>
          <p>
            That&apos;s the question that wouldn&apos;t go away: if the best opportunities are hidden
            on company websites, why is no one surfacing them?
          </p>
          <p>
            So we started building the answer. CubeA crawls company career pages directly &mdash;
            over a thousand of them across the Netherlands, every day &mdash; and pulls the roles
            into one place, including the &ldquo;hidden gems&rdquo; that never reach LinkedIn or
            Indeed. The jobs like the one at Wolfpack. The ones you&apos;d only find if you happened
            to knock on the right door.
          </p>
          <p>
            She eventually landed a great role. But the five months it took, and the company she
            nearly missed, are the reason CubeA exists.
          </p>

          <h2>Our hope</h2>
          <p>
            We&apos;re building CubeA so the next person&apos;s job hunt is a little less lonely, and
            a lot more complete &mdash; so the right opportunity isn&apos;t hidden behind a door you
            didn&apos;t know to knock on.
          </p>
          <p>
            If you&apos;re searching right now, <Link href="/jobs">have a look</Link>. And if
            there&apos;s a company we&apos;re missing, tell us &mdash; that&apos;s exactly what
            we&apos;re here to fix.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
