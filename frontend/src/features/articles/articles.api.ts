
import api from "@/lib/api/axios";

export interface Article {
  id: number;
  title: string;
  slug: string;
  category: string | null;
  summary: string | null;
  body: string | null;
  cover_image: string | null;
  image_credit: string | null;
  image_source_url: string | null;
  author: string | null;
  status: "draft" | "published";
  published_at: string | null;
  seo_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticlePayload {
  title: string;
  category?: string;
  summary?: string;
  body?: string;
  cover_image?: File | null;
  image_credit?: string;
  image_source_url?: string;
  author?: string;
  status: "draft" | "published";
  published_at?: string;
  seo_title?: string;
  meta_description?: string;
}

export interface ArticlePagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface ArticleListResponse {
  data: {
    data: Article[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const createArticleFormData = (payload: ArticlePayload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    formData.append(key, value);
  });

  return formData;
};

export const getArticles = async (params?: {
  search?: string;
  status?: string;
  page?: number;
}) => {
  const response = await api.get("/admin/articles", {
    params,
  });

  const raw = response.data;

  // Mendukung response Laravel paginator langsung
  // maupun paginator yang dibungkus dalam property data.
  const paginator = raw.data?.data ? raw.data : raw;

  return {
    articles: Array.isArray(paginator.data)
      ? paginator.data
      : [],
    pagination: {
      current_page: paginator.current_page ?? 1,
      last_page: paginator.last_page ?? 1,
      per_page: paginator.per_page ?? 10,
      total: paginator.total ?? 0,
    } as ArticlePagination,
  };
};

export const createArticle = async (payload: ArticlePayload) => {
  const formData = createArticleFormData(payload);

  const response = await api.post("/admin/articles", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateArticle = async (
  id: number,
  payload: ArticlePayload
) => {
  const formData = createArticleFormData(payload);

  formData.append("_method", "PUT");

  const response = await api.post(`/admin/articles/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteArticle = async (id: number) => {
  const response = await api.delete(`/admin/articles/${id}`);

  return response.data;
};

export const getArticleImageUrl = (path: string | null) => {
  if (!path) return null;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const backendUrl = apiUrl.replace(/\/api(?:\/v1)?\/?$/, "");

  return `${backendUrl}/storage/${path}`;
};
