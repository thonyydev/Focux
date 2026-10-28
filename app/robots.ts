import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Rotas privadas ficam fora do disallow de propósito: elas usam noindex via metadata,
// e o crawler só enxerga o noindex se puder acessar a página.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
