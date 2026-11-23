
import api from "@/lib/api/axios";

export interface Project {
  id: number;
  title: string;
  slug: string;
  client_name: string | null;
  location: string | null;
  completed_at: string | null;
  short_description: string | null;
  description: string | null;
  image: string | null;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectPayload {
  title: string;
  client_name: string;
  location: string;
  completed_at: string;
  short_description: string;
  description: string;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  image: File | null;
}

export interface ProjectPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

interface ProjectListResponse {
  data: {
    data: Project[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

function createProjectFormData(payload: ProjectPayload) {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("client_name", payload.client_name);
  formData.append("location", payload.location);
  formData.append("completed_at", payload.completed_at);
  formData.append("short_description", payload.short_description);
  formData.append("description", payload.description);
  formData.append("sort_order", String(payload.sort_order));
  formData.append("is_featured", payload.is_featured ? "1" : "0");
  formData.append("is_active", payload.is_active ? "1" : "0");

  if (payload.image) {
    formData.append("image", payload.image);
  }

  return formData;
}

export async function getProjects(params?: {
  search?: string;
  status?: string;
  page?: number;
}) {
  const response = await api.get<ProjectListResponse>("/admin/projects", {
    params,
  });

  return {
    projects: response.data.data.data,
    pagination: {
      current_page: response.data.data.current_page,
      last_page: response.data.data.last_page,
      per_page: response.data.data.per_page,
      total: response.data.data.total,
      from: response.data.data.from,
      to: response.data.data.to,
    } as ProjectPagination,
  };
}

export async function createProject(payload: ProjectPayload) {
  const formData = createProjectFormData(payload);

  return api.post("/admin/projects", formData);
}

export async function updateProject(
  id: number,
  payload: ProjectPayload
) {
  const formData = createProjectFormData(payload);

  // Laravel menerima upload file melalui POST dengan method spoofing.
  formData.append("_method", "PUT");

  return api.post(`/admin/projects/${id}`, formData);
}

export async function deleteProject(id: number) {
  return api.delete(`/admin/projects/${id}`);
}

export function getProjectImageUrl(image: string | null) {
  if (!image) return null;

  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(
    /\/api(?:\/v1)?\/?$/,
    ""
  );

  return `${backendUrl}/storage/${image}`;
}
