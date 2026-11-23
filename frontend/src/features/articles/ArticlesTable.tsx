
"use client";

import {
  Search,
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  Newspaper,
  CalendarDays,
  UserRound,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import type { Article, ArticlePagination } from "./articles.api";
import { getArticleImageUrl } from "./articles.api";

interface ArticlesTableProps {
  articles: Article[];
  pagination: ArticlePagination;
  search: string;
  status: string;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
  onCreate: () => void;
  onEdit: (article: Article) => void;
  onDelete: (article: Article) => void;
  onPageChange: (page: number) => void;
}

export default function ArticlesTable({
  articles,
  pagination,
  search,
  status,
  loading,
  onSearchChange,
  onStatusChange,
  onRefresh,
  onCreate,
  onEdit,
  onDelete,
  onPageChange,
}: ArticlesTableProps) {
  const formatDate = (date: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Articles
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage company news, insights, and publications.
          </p>
        </div>

        <button
          onClick={onCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          <Plus size={18} />
          Create Article
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-slate-900/70 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search title, category, or author..."
            className="w-full rounded-xl border border-white/[0.08] bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500"
          />
        </div>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-xl border border-white/[0.08] bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.05] disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="border-b border-white/[0.06] bg-white/[0.02]">
              <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4">Article</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Author</th>
                <th className="px-5 py-4">Published Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.05]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-sm text-slate-400">
                    Loading articles...
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Newspaper
                      size={32}
                      className="mx-auto mb-3 text-slate-600"
                    />
                    <p className="text-sm font-medium text-slate-300">
                      No articles found
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Create your first article to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr
                    key={article.id}
                    className="transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-16 shrink-0 overflow-hidden rounded-lg border border-white/[0.08] bg-slate-800">
                          {article.cover_image ? (
                            <img
                              src={
                                getArticleImageUrl(article.cover_image) || ""
                              }
                              alt={article.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Newspaper
                                size={20}
                                className="text-slate-600"
                              />
                            </div>
                          )}
                        </div>

                        <div className="max-w-xs">
                          <p className="line-clamp-1 text-sm font-semibold text-white">
                            {article.title}
                          </p>
                          <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                            {article.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                        {article.category || "Uncategorized"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <UserRound size={15} />
                        {article.author || "-"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <CalendarDays size={15} />
                        {formatDate(article.published_at)}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {article.status === "published" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(article)}
                          title="Edit article"
                          className="rounded-lg border border-white/[0.08] p-2 text-slate-400 transition hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-400"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => onDelete(article)}
                          title="Delete article"
                          className="rounded-lg border border-white/[0.08] p-2 text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col justify-between gap-3 border-t border-white/[0.06] px-5 py-4 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            Showing {articles.length} of {pagination.total} articles
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1 || loading}
              className="rounded-lg border border-white/[0.08] p-2 text-slate-400 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="min-w-20 text-center text-xs text-slate-400">
              Page {pagination.current_page} of {pagination.last_page}
            </span>

            <button
              onClick={() => onPageChange(pagination.current_page + 1)}
              disabled={
                pagination.current_page >= pagination.last_page || loading
              }
              className="rounded-lg border border-white/[0.08] p-2 text-slate-400 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
