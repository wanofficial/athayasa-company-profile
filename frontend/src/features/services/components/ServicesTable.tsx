
"use client";

import {
  Search,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Wrench,
} from "lucide-react";
import type { Service } from "../services.api";
import { getServiceImageUrl } from "../services.api";

interface Props {
  services: Service[];
  loading: boolean;
  search: string;
  status: string;
  currentPage: number;
  lastPage: number;
  total: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
  onAdd: () => void;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onPageChange: (page: number) => void;
}

export default function ServicesTable({
  services,
  loading,
  search,
  status,
  currentPage,
  lastPage,
  total,
  onSearchChange,
  onStatusChange,
  onRefresh,
  onAdd,
  onEdit,
  onDelete,
  onPageChange,
}: Props) {
  const inputClass =
    "rounded-xl border border-white/[0.08] bg-[#0B1220] px-4 py-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/60";

  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111827]">
      <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Services Directory
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Manage the services displayed on your corporate website.
          </p>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-semibold text-white transition hover:bg-indigo-500"
        >
          <Plus size={15} />
          Add New Service
        </button>
      </div>

      <div className="flex flex-col gap-3 border-b border-white/[0.07] p-5 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-4 top-3.5 text-slate-500"
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search services..."
            className={`${inputClass} w-full pl-10`}
          />
        </div>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`${inputClass} sm:w-44`}
        >
          <option value="">All Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>

        <button
          onClick={onRefresh}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#0B1220] px-4 py-3 text-xs text-slate-300 transition hover:bg-white/[0.05]"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.015]">
              <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Service
              </th>
              <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Slug
              </th>
              <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Order
              </th>
              <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.05]">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-xs text-slate-500">
                  Loading services...
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-500">
                    <Wrench size={22} />
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-300">
                    No services found
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Add your first service to get started.
                  </p>
                </td>
              </tr>
            ) : (
              services.map((service) => {
                const imageUrl = getServiceImageUrl(service.image);

                return (
                  <tr
                    key={service.id}
                    className="transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-[#0B1220]">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={service.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={17} className="text-slate-600" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[260px] truncate text-xs font-semibold text-white">
                            {service.title}
                          </p>
                          <p className="mt-1 max-w-[260px] truncate text-[11px] text-slate-500">
                            {service.short_description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs text-slate-400">
                        {service.slug}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs tabular-nums text-slate-400">
                        {service.sort_order}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-medium ${
                          service.is_active
                            ? "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-400"
                            : "border-slate-500/20 bg-slate-500/[0.07] text-slate-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            service.is_active ? "bg-emerald-400" : "bg-slate-500"
                          }`}
                        />
                        {service.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(service)}
                          title="Edit service"
                          className="rounded-lg border border-white/[0.08] p-2 text-slate-400 transition hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-300"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          onClick={() => onDelete(service)}
                          title="Delete service"
                          className="rounded-lg border border-white/[0.08] p-2 text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={14} />
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

      <div className="flex flex-col gap-3 border-t border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-slate-500">
          Total <span className="font-semibold text-slate-300">{total}</span> services
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage <= 1 || loading}
            onClick={() => onPageChange(currentPage - 1)}
            className="rounded-lg border border-white/[0.08] p-2 text-slate-400 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={15} />
          </button>

          <span className="px-2 text-xs text-slate-400">
            Page {currentPage} of {Math.max(lastPage, 1)}
          </span>

          <button
            disabled={currentPage >= lastPage || loading}
            onClick={() => onPageChange(currentPage + 1)}
            className="rounded-lg border border-white/[0.08] p-2 text-slate-400 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
