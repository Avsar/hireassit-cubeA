import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { meta } = getPostBySlug(params.slug);
    return {
      title: `${meta.title} — HireAssist by CubeA`,
      description: meta.description,
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
            <Link href="/blog" className="font-medium hover:text-black">
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
