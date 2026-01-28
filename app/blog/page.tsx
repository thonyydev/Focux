import { BorderBeam } from "@/components/ui/border-beam";
import { LightRays } from "@/components/ui/light-rays";
import { getBlogPosts } from "@/lib/mdx";
import Link from "next/link";

// Inline date formatter just in case
function formatDateClean(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const metadata = {
  title: "Blog do Focux — Novidades, atualizações e foco",
  description:
    "Acompanhe as novidades do Focux: atualizações do produto, decisões de design, melhorias de produtividade e bastidores do desenvolvimento.",
  openGraph: {
    title: "Blog do Focux",
    description:
      "Novidades, atualizações e bastidores do Focux — um app de foco e produtividade minimalista.",
    url: "https://focux.app/blog",
    siteName: "Focux",
    type: "website",
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
    title: "Blog do Focux",
    description:
      "Novidades e atualizações do Focux, um app minimalista de foco e produtividade.",
  },
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-200 selection:bg-neutral-700 selection:text-white pb-24">
      <div className="container mx-auto py-24 px-4 max-w-5xl">
        <div className="mb-16 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.5] bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
            Blog do Focux
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Novidades, bastidores e dicas para você manter o foco no que
            realmente importa.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group relative flex flex-col rounded-2xl bg-neutral-900/50 border border-neutral-800 p-6 
                         transition-all duration-300 hover:bg-neutral-900 hover:border-neutral-700 hover:shadow-2xl hover:shadow-black/50"
            >
              <div className="mb-4 flex items-center gap-3 text-xs font-medium text-neutral-500">
                <time dateTime={post.date} className="uppercase tracking-wider">
                  {formatDateClean(post.date)}
                </time>
                <span className="h-0.5 w-0.5 rounded-full bg-neutral-500" />
                <span>Blog</span>
              </div>

              <h2 className="text-2xl font-semibold mb-3 text-neutral-100 group-hover:text-white transition-colors">
                {post.title}
              </h2>

              <p className="text-neutral-400 leading-relaxed mb-6 flex-grow line-clamp-3">
                {post.description}
              </p>

              <BorderBeam duration={10} size={200} />

              <div className="flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors mt-auto">
                Ler artigo
                <svg
                  className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/20">
            <p className="text-neutral-500">
              Nenhum post encontrado por enquanto.
            </p>
          </div>
        )}
      </div>
      <LightRays />
    </div>
  );
}
