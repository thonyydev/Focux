import { getBlogPosts, getPost } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { LightRays } from "@/components/ui/light-rays";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";

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
    title: { absolute: `${post.title} | Blog do Focux` },
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: "Focux",
      type: "article",
      publishedTime: post.date,
      authors: ["Focux"],
      images: [
        {
          url: `${SITE_URL}/images/og-image.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`${SITE_URL}/images/og-image.png`],
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
    <div className="min-h-screen w-full bg-background text-foreground/90 pb-24 selection:bg-accent selection:text-foreground">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          inLanguage: "pt-BR",
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
          image: `${SITE_URL}/images/og-image.png`,
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        }}
      />
      <article className="container mx-auto py-24 px-4 max-w-3xl">
        <div className="mb-12">
          <Link
            href="/blog"
            className="group inline-flex items-center text-sm font-medium text-subtle hover:text-foreground mb-8 transition-colors"
          >
            <div className="mr-2 rounded-full border border-border p-1 transition-colors group-hover:border-muted-foreground/40 group-hover:bg-secondary">
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
            <div className="flex items-center gap-3 text-sm font-medium text-subtle">
              <time dateTime={post.date} className="uppercase tracking-wider">
                {formatDateClean(post.date)}
              </time>
              <span className="h-0.5 w-0.5 rounded-full bg-subtle" />
              <span>Blog do Focux</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              {post.title}
            </h1>
          </div>
        </div>

        <div
          className={`
          prose prose-lg dark:prose-invert max-w-none
          prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-strong:text-foreground prose-strong:font-semibold
          prose-a:text-foreground prose-a:underline prose-a:decoration-neutral-700 prose-a:underline-offset-4 hover:prose-a:decoration-white hover:prose-a:text-foreground
          prose-li:text-muted-foreground
          prose-blockquote:border-l-neutral-700 prose-blockquote:bg-card/50 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:text-foreground/80 prose-blockquote:not-italic
          prose-img:rounded-2xl prose-img:border prose-img:border-border
          prose-hr:border-border prose prose-lg dark:prose-invert max-w-none
        `}
        >
          <MDXRemote source={post.content} />
        </div>
      </article>
      <LightRays />
    </div>
  );
}