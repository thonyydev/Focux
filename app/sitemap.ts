import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/mdx";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getBlogPosts();

  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/landing`, priority: 0.8 },
    { url: `${SITE_URL}/upgrade`, priority: 0.7 },
    {
      url: `${SITE_URL}/blog`,
      lastModified: posts[0]?.date,
      priority: 0.6,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.date,
      priority: 0.5,
    })),
  ];
}
