import { getBlogPosts, getPost } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { LightRays } from "@/components/ui/light-rays";
import type { Metadata } from "next";

// Helper to format date
function formatDateClean(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPost(resolvedParams.slug);

  if (!post) {
    return {
      title: "Post não encontrado | Blog do Focux",
    };
  }

  const date = new Date(post.date);
  const formattedDate = date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    title: `${post.title} | Blog do Focux`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://focux.app/blog/${post.slug}`,
      siteName: "Focux",
      type: "article",
      publishedTime: post.date,
      authors: ["Focux"],
      images: [
        {
          url: "https://focux.app/images/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
      images: ["https://focux.app/images/og-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  // Await params since it's a Promise in Next.js 15+ (which user seems to be using based on package.json v16)
  const resolvedParams = await params;
  const post = getPost(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-200 pb-24 selection:bg-neutral-700 selection:text-white">
      <article className="container mx-auto py-24 px-4 max-w-3xl">
        <div className="mb-12">
          <Link
            href="/blog"
            className="group inline-flex items-center text-sm font-medium text-neutral-500 hover:text-white mb-8 transition-colors"
          >
            <div className="mr-2 rounded-full border border-neutral-800 p-1 transition-colors group-hover:border-neutral-600 group-hover:bg-neutral-800">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
            Voltar para o blog
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm font-medium text-neutral-500">
              <time dateTime={post.date} className="uppercase tracking-wider">
                {formatDateClean(post.date)}
              </time>
              <span className="h-0.5 w-0.5 rounded-full bg-neutral-500" />
              <span>Blog do Focux</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {post.title}
            </h1>
          </div>
        </div>

        <div
          className={`
          prose prose-lg dark:prose-invert max-w-none
          prose-headings:text-neutral-100 prose-headings:font-bold prose-headings:tracking-tight
          prose-p:text-neutral-400 prose-p:leading-relaxed
          prose-strong:text-white prose-strong:font-semibold
          prose-a:text-white prose-a:underline prose-a:decoration-neutral-700 prose-a:underline-offset-4 hover:prose-a:decoration-white hover:prose-a:text-white
          prose-li:text-neutral-400
          prose-blockquote:border-l-neutral-700 prose-blockquote:bg-neutral-900/50 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:text-neutral-300 prose-blockquote:not-italic
          prose-img:rounded-2xl prose-img:border prose-img:border-neutral-800
          prose-hr:border-neutral-800 prose prose-lg dark:prose-invert max-w-none
        `}
        >
          <MDXRemote source={post.content} />
        </div>
      </article>
      <LightRays />
    </div>
  );
}