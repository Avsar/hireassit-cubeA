import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — HireAssist by CubeA",
  description: "Thoughts on hiring, AI recruiting, and the European talent market.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-2xl bg-black text-white font-bold grid place-items-center text-sm">
              AI
            </div>
            <div className="font-semibold tracking-tight">HireAssist by CubeA</div>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/#how" className="text-neutral-600 hover:text-black">
              How it works
            </Link>
            <Link href="/#features" className="text-neutral-600 hover:text-black">
              Features
            </Link>
            <Link href="/blog" className="font-medium text-black">
              Blog
            </Link>
            <Link
              href="/#contact"
              className="px-3 py-2 rounded-xl bg-black text-white hover:bg-neutral-800"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight">Blog</h1>
        <p className="mt-2 text-neutral-600">
          Thoughts on hiring, AI, and the European talent market.
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

      <footer className="border-t border-neutral-200 bg-white mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-neutral-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-neutral-900">HireAssist by CubeA</div>
            <div className="mt-1">© {new Date().getFullYear()} CubeA. All rights reserved.</div>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-neutral-900">Privacy</Link>
            <Link href="/terms" className="hover:text-neutral-900">Terms</Link>
            <Link href="/impressum" className="hover:text-neutral-900">Impressum</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
