import api from "@/lib/api/axios";

export interface Customer {
  id: number;
  name: string;
  slug: string;
  website_url: string | null;
  logo: string | null;
  short_description: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerPayload {
  name: string;
  website_url: string;
  short_description: string;
  logo: File | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
}

export async function getCustomers(params?: { search?: string; status?: string; page?: number }) {
  const response = await api.get("/admin/customers", { params });
  return { customers: response.data.data.data as Customer[], pagination: response.data.data };
}

function buildFormData(payload: CustomerPayload) {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("website_url", payload.website_url);
  formData.append("short_description", payload.short_description);
  formData.append("sort_order", String(payload.sort_order));
  formData.append("is_featured", payload.is_featured ? "1" : "0");
  formData.append("is_active", payload.is_active ? "1" : "0");
  if (payload.logo) formData.append("logo", payload.logo);
  return formData;
}

export async function createCustomer(payload: CustomerPayload) {
  return api.post("/admin/customers", buildFormData(payload));
}

export async function updateCustomer(id: number, payload: CustomerPayload) {
  const formData = buildFormData(payload);
  formData.append("_method", "PUT");
  return api.post(`/admin/customers/${id}`, formData);
}

export async function deleteCustomer(id: number) {
  return api.delete(`/admin/customers/${id}`);
}

export function getCustomerLogoUrl(logo: string | null) {
  if (!logo) return null;
  if (/^https?:\/\//.test(logo)) return logo;
  const baseUrl = api.defaults.baseURL || "";
  const backendUrl = baseUrl.replace(/\/api(?:\/v1)?\/.*$/, "");
  return `${backendUrl}/storage/${logo}`;
}
