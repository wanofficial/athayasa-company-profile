
import api from "@/lib/api/axios";

export interface WebsiteSettings {
  // Website Information
  website_name: string;
  tagline: string | null;
  description: string | null;

  // Branding
  logo: string | null;
  favicon: string | null;

  // Social Media
  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  whatsapp_url: string | null;

  // Hero Section
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_description: string | null;
  hero_primary_cta_text: string | null;
  hero_primary_cta_url: string | null;
  hero_secondary_cta_text: string | null;
  hero_secondary_cta_url: string | null;
  hero_image: string | null;

  // About Section
  about_title: string | null;
  about_description: string | null;

  // Why Choose Us
  why_title: string | null;

  reason_1_icon: string | null;
  reason_1_title: string | null;
  reason_1_description: string | null;

  reason_2_icon: string | null;
  reason_2_title: string | null;
  reason_2_description: string | null;

  reason_3_icon: string | null;
  reason_3_title: string | null;
  reason_3_description: string | null;

  // Section Visibility
  show_about: boolean;
  show_services: boolean;
  show_projects: boolean;
  show_why_choose_us: boolean;
  show_articles: boolean;
  show_customers: boolean;
  show_contact: boolean;
}

export interface CompanyProfile {
  company_name: string;
  tagline: string | null;
  description: string | null;
  established_year: number | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  vision: string | null;
  mission: string | null;
}

export interface WebsiteService {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface WebsiteProject {
  id: number;
  title: string;
  slug: string;
  client_name: string | null;
  location: string | null;
  completed_at: string | null;
  short_description: string | null;
  description: string | null;
  image: string | null;
  is_featured: boolean;
  is_active: boolean;
}

export interface WebsiteCustomer {
  id: number;
  name: string;
  slug: string;
  website_url: string | null;
  logo: string | null;
  short_description: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
}

export interface WebsiteArticle {
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
  status: string;
  published_at: string | null;
  updated_at?: string | null;
  seo_title?: string | null;
  meta_description?: string | null;
}

export interface WebsiteHomeData {
  settings: WebsiteSettings | null;
  company_profile: CompanyProfile | null;
  services: WebsiteService[];
  projects: WebsiteProject[];
  customers: WebsiteCustomer[];
  articles: WebsiteArticle[];
}

export async function getWebsiteHome(): Promise<WebsiteHomeData> {
  const response = await api.get("/website/home");
  return response.data.data;
}

export function getWebsiteImageUrl(
  path: string | null | undefined
): string | null {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const backendUrl = apiUrl.replace(/\/api(?:\/v1)?\/?$/, "");

  return `${backendUrl}/storage/${path.replace(/^\/+/, "")}`;
}

export interface WebsiteArticlePagination {
  current_page: number;
  data: WebsiteArticle[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface WebsiteArticleParams {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
}

/**
 * Get public articles with pagination and filters.
 */
export async function getWebsiteArticles(
  params: WebsiteArticleParams = {}
): Promise<WebsiteArticlePagination> {
  const response = await api.get("/website/articles", {
    params,
  });

  return response.data.data;
}

/**
 * Get public article detail by slug.
 */
export async function getWebsiteArticle(
  slug: string
): Promise<WebsiteArticle> {
  const response = await api.get(
    `/website/articles/${encodeURIComponent(slug)}`
  );

  return response.data.data;
}
