import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cubea.nl";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { meta } = getPostBySlug(params.slug);
    const path = `/blog/${params.slug}`;
    return {
      title: `${meta.title} — CubeA`,
      description: meta.description,
      alternates: { canonical: path },
      openGraph: {
        title: meta.title,
        description: meta.description,
        type: "article",
        url: `${SITE}${path}`,
        siteName: "CubeA",
        publishedTime: meta.date,
      },
      twitter: {
        card: "summary_large_image",
        title: meta.title,
        description: meta.description,
      },
    };
  } catch {
    return {};
  }
}

export default function BlogPostPage({ params }: Props) {
  let post;
  try {
    post = getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  const { meta, content } = post;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    author: { "@type": "Organization", name: "CubeA" },
    publisher: { "@type": "Organization", name: "CubeA" },
    mainEntityOfPage: `${SITE}/blog/${params.slug}`,
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/blog"
          className="text-sm text-neutral-500 hover:text-black inline-flex items-center gap-1"
        >
          ← Back to blog
        </Link>

        <article className="mt-8">
          <header className="mb-8">
            <time className="text-xs text-neutral-500">
              {new Date(meta.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight leading-snug">
              {meta.title}
            </h1>
            <p className="mt-3 text-neutral-600">{meta.description}</p>
          </header>

          <div className="prose prose-neutral max-w-none text-sm leading-7 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-neutral-700 [&_p]:mb-4 [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-black [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:text-neutral-700">
            <MDXRemote source={content} />
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
