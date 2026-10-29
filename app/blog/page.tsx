import { BorderBeam } from "@/components/ui/border-beam";
import { LightRays } from "@/components/ui/light-rays";
import { getBlogPosts } from "@/lib/mdx";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";

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

export const metadata = pageMetadata({
  title: "Blog do Focux — Novidades, atualizações e foco",
  description:
    "Acompanhe as novidades do Focux: atualizações do produto, decisões de design, melhorias de produtividade e bastidores do desenvolvimento.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="min-h-screen w-full bg-background text-foreground/90 selection:bg-accent selection:text-foreground pb-24">
      <div className="container mx-auto py-24 px-4 max-w-5xl">
        <div className="mb-16 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.5] bg-clip-text text-transparent bg-gradient-to-b from-white to-subtle">
            Blog do Focux
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Novidades, bastidores e dicas para você manter o foco no que
            realmente importa.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group relative flex flex-col rounded-2xl bg-card/50 border border-border p-6 
                         transition-all duration-300 hover:bg-card hover:border-input hover:shadow-2xl hover:shadow-black/50"
            >
              <div className="mb-4 flex items-center gap-3 text-xs font-medium text-subtle">
                <time dateTime={post.date} className="uppercase tracking-wider">
                  {formatDateClean(post.date)}
                </time>
                <span className="h-0.5 w-0.5 rounded-full bg-subtle" />
                <span>Blog</span>
              </div>

              <h2 className="text-2xl font-semibold mb-3 text-foreground group-hover:text-foreground transition-colors">
                {post.title}
              </h2>

              <p className="text-muted-foreground leading-relaxed mb-6 flex-grow line-clamp-3">
                {post.description}
              </p>

              <BorderBeam duration={10} size={200} />

              <div className="flex items-center text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors mt-auto">
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
          <div className="text-center py-20 border border-dashed border-border rounded-3xl bg-card/20">
            <p className="text-subtle">
              Nenhum post encontrado por enquanto.
            </p>
          </div>
        )}
      </div>
      <LightRays />
    </div>
  );
}
