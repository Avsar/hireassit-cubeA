import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — CubeA",
  description:
    "Notes on the hidden Dutch job market — job hunting, hidden gems, and finding roles that never reach LinkedIn.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight">Blog</h1>
        <p className="mt-2 text-neutral-600">
          Notes on the hidden Dutch job market — and finding roles that never reach LinkedIn.
        </p>

        <div className="mt-10 flex flex-col gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl border border-neutral-200 bg-white p-6 hover:border-neutral-400 transition-colors"
            >
              <time className="text-xs text-neutral-500">
                {new Date(post.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <h2 className="mt-2 text-lg font-semibold">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:underline underline-offset-2"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-neutral-600">{post.description}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-block text-sm font-medium hover:underline underline-offset-2"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
