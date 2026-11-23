
"use client";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  FolderKanban,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";

import {
  Project,
  ProjectPagination,
  getProjectImageUrl,
} from "../projects.api";

interface ProjectsTableProps {
  projects: Project[];
  pagination: ProjectPagination | null;
  loading: boolean;
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onCreate: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export default function ProjectsTable({
  projects,
  pagination,
  loading,
  search,
  status,
  onSearchChange,
  onStatusChange,
  onPageChange,
  onRefresh,
  onCreate,
  onEdit,
  onDelete,
}: ProjectsTableProps) {
const formatDate = (date: string | null) => {
  if (!date) return "-";

  // Ambil tanggal YYYY-MM-DD dari response Laravel.
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (match) {
    const [, year, month, day] = match;

    // Gunakan local date agar tidak bergeser karena timezone.
    const parsedDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsedDate);
  }

  // Fallback jika format tanggal berbeda.
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-md">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search project, client, location..."
              className="w-full rounded-xl border border-white/[0.08] bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
            />
          </div>

          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-slate-900 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500"
          >
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-slate-900 px-3.5 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={onCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <Plus size={17} />
            Add Project
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/60">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Project Portfolio
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Manage your company's completed projects.
            </p>
          </div>

          <span className="rounded-lg border border-white/[0.08] bg-slate-800 px-3 py-1.5 text-xs text-slate-400">
            {pagination?.total ?? 0} Projects
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Project
                </th>
                <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Client / Location
                </th>
                <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Completed
                </th>
                <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Featured
                </th>
                <th className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.05]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <RefreshCw
                      size={22}
                      className="mx-auto animate-spin text-indigo-400"
                    />
                    <p className="mt-3 text-sm text-slate-400">
                      Loading projects...
                    </p>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <FolderKanban
                      size={30}
                      className="mx-auto text-slate-600"
                    />
                    <p className="mt-3 text-sm font-medium text-slate-300">
                      No projects found
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Add your first project to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                projects.map((project) => {
                  const imageUrl = getProjectImageUrl(project.image);

                  return (
                    <tr
                      key={project.id}
                      className="transition hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-14 shrink-0 overflow-hidden rounded-lg border border-white/[0.08] bg-slate-800">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={project.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <FolderKanban
                                  size={20}
                                  className="text-slate-500"
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[220px] truncate text-sm font-medium text-white">
                              {project.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              ID: #{project.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-300">
                          {project.client_name || "-"}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <MapPin size={12} />
                          {project.location || "-"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <CalendarDays size={14} />
                          {formatDate(project.completed_at)}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {project.is_featured ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs text-amber-400">
                            <Star size={12} fill="currentColor" />
                            Featured
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">
                            Standard
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {project.is_active ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-500/20 bg-slate-500/10 px-2.5 py-1 text-xs text-slate-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onEdit(project)}
                            title="Edit project"
                            className="rounded-lg border border-white/[0.08] bg-slate-800 p-2 text-slate-400 transition hover:border-indigo-400/30 hover:text-indigo-400"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDelete(project)}
                            title="Delete project"
                            className="rounded-lg border border-white/[0.08] bg-slate-800 p-2 text-slate-400 transition hover:border-red-400/30 hover:text-red-400"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-white/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-300">
              {pagination?.from ?? 0}-{pagination?.to ?? 0}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-300">
              {pagination?.total ?? 0}
            </span>{" "}
            projects
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!pagination || pagination.current_page <= 1 || loading}
              onClick={() =>
                pagination && onPageChange(pagination.current_page - 1)
              }
              className="rounded-lg border border-white/[0.08] bg-slate-800 p-2 text-slate-400 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="min-w-[90px] text-center text-xs text-slate-400">
              Page {pagination?.current_page ?? 1} of{" "}
              {pagination?.last_page ?? 1}
            </span>

            <button
              type="button"
              disabled={
                !pagination ||
                pagination.current_page >= pagination.last_page ||
                loading
              }
              onClick={() =>
                pagination && onPageChange(pagination.current_page + 1)
              }
              className="rounded-lg border border-white/[0.08] bg-slate-800 p-2 text-slate-400 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
