import type {
  WebsiteArticle,
  WebsiteArticlePagination,
  WebsiteHomeData,
} from "@/features/website/website.api";

type WebsiteHomeResponse = {
  data: WebsiteHomeData;
};

type ArticleResponse = {
  data: WebsiteArticle;
};

type ArticleListResponse = {
  data: WebsiteArticlePagination;
};

function getPublicApiBaseUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is required to load public articles.");
  }

  return apiUrl;
}

export async function getPublicWebsiteHome(): Promise<WebsiteHomeData> {
  const response = await fetch(`${getPublicApiBaseUrl()}/website/home`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(
      `Unable to load public website data: API returned ${response.status}.`
    );
  }

  const result = (await response.json()) as WebsiteHomeResponse;
  return result.data;
}

export async function getPublicArticle(
  slug: string
): Promise<WebsiteArticle | null> {
  const response = await fetch(
    `${getPublicApiBaseUrl()}/website/articles/${encodeURIComponent(slug)}`,
    {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    }
  );

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error(
      `Unable to load article "${slug}": API returned ${response.status}.`
    );
  }

  const result = (await response.json()) as ArticleResponse;
  return result.data;
}

export async function getAllPublicArticles(): Promise<WebsiteArticle[]> {
  const apiBaseUrl = getPublicApiBaseUrl();
  const articles: WebsiteArticle[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const url = new URL(`${apiBaseUrl}/website/articles`);
    url.searchParams.set("per_page", "24");
    url.searchParams.set("page", String(page));

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(
        `Unable to load article sitemap: API returned ${response.status}.`
      );
    }

    const result = (await response.json()) as ArticleListResponse;
    articles.push(...result.data.data);
    lastPage = result.data.last_page;
    page += 1;
  } while (page <= lastPage);

  return articles;
}

export function getPublicArticleImageUrl(
  imagePath: string | null | undefined
): string | null {
  if (!imagePath) return null;

  if (/^https?:\/\//i.test(imagePath)) return imagePath;

  const apiBaseUrl = getPublicApiBaseUrl();
  const backendUrl = apiBaseUrl.replace(/\/api(?:\/v1)?\/?$/, "");

  return `${backendUrl}/storage/${imagePath.replace(/^\/+/, "")}`;
}

export function getPublicSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!configuredUrl) return "https://www.athayasamandiri.com";

  const parsedUrl = new URL(configuredUrl);
  if (
    parsedUrl.hostname === "localhost" ||
    parsedUrl.hostname === "127.0.0.1" ||
    parsedUrl.hostname === "0.0.0.0"
  ) {
    return "https://www.athayasamandiri.com";
  }

  return configuredUrl.replace(/\/+$/, "");
}
