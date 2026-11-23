import type { MetadataRoute } from "next";

import {
  getAllPublicArticles,
  getPublicSiteUrl,
} from "@/lib/website-articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getPublicSiteUrl();
  const articles = await getAllPublicArticles();

  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...articles.map((article) => ({
      url: `${siteUrl}/artikel/${encodeURIComponent(article.slug)}`,
      lastModified: article.updated_at || article.published_at
        ? new Date(article.updated_at || article.published_at || "")
        : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
