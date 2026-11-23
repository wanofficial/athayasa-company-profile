
"use client";

import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { AlertCircle, CheckCircle2, FolderKanban, X } from "lucide-react";

import ProjectsTable from "./components/ProjectsTable";
import ProjectFormModal from "./components/ProjectFormModal";
import AdminPageLoading from "@/components/admin/AdminPageLoading";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";

import {
  Project,
  ProjectPayload,
  ProjectPagination,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "./projects.api";

type Notice = {
  type: "success" | "error";
  message: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] =
    useState<ProjectPagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] =
    useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [notice, setNotice] = useState<Notice | null>(null);

  // Convert Laravel validation errors into a readable message.
  const getErrorMessage = (error: unknown) => {
    if (isAxiosError(error)) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        const firstError = Object.values(
          responseData.errors as Record<string, string[]>
        )[0]?.[0];

        if (firstError) return firstError;
      }

      if (responseData?.message) {
        return responseData.message;
      }

      if (!error.response) {
        return "Tidak dapat terhubung ke server. Periksa koneksi backend.";
      }
    }

    return "Terjadi kesalahan. Silakan coba kembali.";
  };

  // Load projects from Laravel API.
  const loadProjects = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getProjects({
        search: debouncedSearch || undefined,
        status: status || undefined,
        page: currentPage,
      });

      setProjects(result.projects);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Failed to load projects:", error);

      setNotice({
        type: "error",
        message: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, currentPage]);

  // Debounce search input.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  // Reload when filters or page change.
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Automatically hide notification.
  useEffect(() => {
    if (!notice) return;

    const timeout = setTimeout(() => {
      setNotice(null);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [notice]);

  // Open create modal.
  const handleCreate = () => {
    setSelectedProject(null);
    setModalOpen(true);
  };

  // Open edit modal.
  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  // Close modal.
  const handleCloseModal = () => {
    if (saving) return;

    setModalOpen(false);
    setSelectedProject(null);
  };

  // Create or update project.
  const handleSubmit = async (payload: ProjectPayload) => {
    setSaving(true);

    try {
      if (selectedProject) {
        await updateProject(selectedProject.id, payload);

        setNotice({
          type: "success",
          message: "Project berhasil diperbarui.",
        });
      } else {
        await createProject(payload);

        setNotice({
          type: "success",
          message: "Project berhasil ditambahkan.",
        });
      }

      setModalOpen(false);
      setSelectedProject(null);

      await loadProjects();
    } catch (error) {
      console.error("Failed to save project:", error);

      setNotice({
        type: "error",
        message: getErrorMessage(error),
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete project.
  const handleDelete = (project: Project) => {
    setProjectToDelete(project);
  };

  const confirmDelete = async () => {
    if (!projectToDelete || deleting) return;
    setDeleting(true);
    try {
      await deleteProject(projectToDelete.id);

      setNotice({
        type: "success",
        message: "Project berhasil dihapus.",
      });
      setProjectToDelete(null);

      // Go to previous page if current page becomes empty.
      if (projects.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        await loadProjects();
      }
    } catch (error) {
      console.error("Failed to delete project:", error);

      setNotice({
        type: "error",
        message: getErrorMessage(error),
      });
      setProjectToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  if (loading && projects.length === 0) {
    return <AdminPageLoading label="Memuat proyek..." />;
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notice && (
        <div
          className={`fixed right-5 top-5 z-[150] flex w-[calc(100%-40px)] max-w-md items-start gap-3 rounded-xl border p-4 shadow-2xl ${
            notice.type === "success"
              ? "border-emerald-400/20 bg-slate-900"
              : "border-red-400/20 bg-slate-900"
          }`}
        >
          {notice.type === "success" ? (
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-emerald-400"
            />
          ) : (
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-red-400"
            />
          )}

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">
              {notice.type === "success" ? "Success" : "Error"}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              {notice.message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-slate-500 transition hover:text-white"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-3">
            <FolderKanban className="h-6 w-6 text-indigo-400" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-white">
              Projects Management
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage and organize your company projects.
            </p>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <ProjectsTable
        projects={projects}
        pagination={pagination}
        loading={loading}
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={(value) => {
          setStatus(value);
          setCurrentPage(1);
        }}
        onPageChange={setCurrentPage}
        onRefresh={loadProjects}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create / Edit Modal */}
      <ProjectFormModal
        open={modalOpen}
        project={selectedProject}
        loading={saving}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={projectToDelete !== null}
        itemName={projectToDelete?.title ?? ""}
        itemType="proyek"
        pending={deleting}
        onCancel={() => setProjectToDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
