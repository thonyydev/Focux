import { getBlogPosts } from "@/lib/mdx";
import Link from "next/link";

// Inline date formatter just in case
function formatDateClean(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
        Blog do Focux
      </h1>
      <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
        Acompanhe as novidades, dicas e atualizações sobre o Focux.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group border border-border rounded-xl p-6 transition-all hover:shadow-md hover:border-primary/50 bg-card"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  {formatDateClean(post.date)}
                </span>
              </div>
              <h2 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground line-clamp-3 mb-4 flex-grow">
                {post.description}
              </p>
              <div className="text-primary font-medium text-sm flex items-center mt-auto">
                Ler mais
                <svg
                  className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum post encontrado.</p>
        </div>
      )}
    </div>
  );
}
