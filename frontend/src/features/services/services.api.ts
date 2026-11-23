
import api from "@/lib/api/axios";

export interface Service {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServicePayload {
  title: string;
  short_description: string;
  description: string;
  image: File | null;
  sort_order: number;
  is_active: boolean;
}

export interface ServicePagination {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export async function getServices(params?: {
  search?: string;
  status?: string;
  page?: number;
}) {
  const response = await api.get("/admin/services", { params });

  return {
    services: response.data.data.data as Service[],
    pagination: response.data.data as ServicePagination,
  };
}


export async function createService(payload: ServicePayload) {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("short_description", payload.short_description);
  formData.append("description", payload.description);
  formData.append("sort_order", String(payload.sort_order));
  formData.append("is_active", payload.is_active ? "1" : "0");

  if (payload.image instanceof File) {
    formData.append("image", payload.image);
  }

  const response = await api.post("/admin/services", formData);

  return response.data;
}

export async function updateService(
  id: number,
  payload: ServicePayload
) {
  const formData = new FormData();

  formData.append("_method", "PUT");
  formData.append("title", payload.title);
  formData.append("short_description", payload.short_description);
  formData.append("description", payload.description);
  formData.append("sort_order", String(payload.sort_order));
  formData.append("is_active", payload.is_active ? "1" : "0");

  if (payload.image instanceof File) {
    formData.append("image", payload.image);
  }

  const response = await api.post(`/admin/services/${id}`, formData);

  return response.data;
}


export async function deleteService(id: number) {
  const response = await api.delete(`/admin/services/${id}`);

  return response.data;
}

export function getServiceImageUrl(image: string | null) {
  if (!image) return null;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const baseURL = api.defaults.baseURL || "";
  const backendURL = baseURL.replace(/\/api(?:\/v1)?\/?$/, "");

  return `${backendURL}/storage/${image}`;
}
