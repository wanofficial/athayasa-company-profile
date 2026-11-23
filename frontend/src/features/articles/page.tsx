
"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { isAxiosError } from "axios";

import ArticlesTable from "./ArticlesTable";
import ArticleFormModal from "./ArticlesFormModal";
import AdminPageLoading from "@/components/admin/AdminPageLoading";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";

import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "./articles.api";

import type {
  Article,
  ArticlePayload,
  ArticlePagination,
} from "./articles.api";

const initialPagination: ArticlePagination = {
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
};

interface Notification {
  type: "success" | "error";
  message: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] =
    useState<ArticlePagination>(initialPagination);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] =
    useState<Article | null>(null);
  const [articleToDelete, setArticleToDelete] =
    useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [notification, setNotification] =
    useState<Notification | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  // Notification
  const showNotification = (
    type: Notification["type"],
    message: string
  ) => {
    setNotification({ type, message });

    window.setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Debounce search
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

  // Load articles
  const loadArticles = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getArticles({
        search: debouncedSearch || undefined,
        status: status || undefined,
        page,
      });

      setArticles(
  Array.isArray(response.articles) ? response.articles : []
);

setPagination(response.pagination || initialPagination);
    } catch (error) {
      console.error("Failed to load articles:", error);

      const message = isAxiosError(error)
        ? error.response?.data?.message
        : null;

      showNotification(
        "error",
        message || "Failed to load articles. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, page]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles, refreshKey]);

  // Open create modal
  const handleCreate = () => {
    setSelectedArticle(null);
    setModalOpen(true);
  };

  // Open edit modal
  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    if (saving) return;

    setModalOpen(false);
    setSelectedArticle(null);
  };

  // Save article
  const handleSubmit = async (payload: ArticlePayload) => {
    setSaving(true);

    try {
      if (selectedArticle) {
        await updateArticle(selectedArticle.id, payload);

        showNotification(
          "success",
          "Article updated successfully."
        );
      } else {
        await createArticle(payload);

        showNotification(
          "success",
          "Article created successfully."
        );
      }

      setModalOpen(false);
      setSelectedArticle(null);
      setPage(1);
      setRefreshKey((previous) => previous + 1);
    } catch (error) {
      console.error("Failed to save article:", error);

      if (isAxiosError(error)) {
        const validationErrors = error.response?.data?.errors;

        if (validationErrors) {
          const firstError = Object.values(
            validationErrors as Record<string, string[]>
          )[0]?.[0];

          showNotification(
            "error",
            firstError || "Please check your article information."
          );
        } else {
          showNotification(
            "error",
            error.response?.data?.message ||
              "Failed to save article. Please try again."
          );
        }
      } else {
        showNotification(
          "error",
          "An unexpected error occurred."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // Delete article
  const handleDelete = (article: Article) => {
    setArticleToDelete(article);
  };

  const confirmDelete = async () => {
    if (!articleToDelete || deleting) return;
    setDeleting(true);
    try {
      await deleteArticle(articleToDelete.id);

      showNotification(
        "success",
        "Article deleted successfully."
      );
      setArticleToDelete(null);

      if (articles.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      } else {
        setRefreshKey((previous) => previous + 1);
      }
    } catch (error) {
      console.error("Failed to delete article:", error);

      const message = isAxiosError(error)
        ? error.response?.data?.message
        : null;

      showNotification(
        "error",
        message || "Failed to delete article."
      );
      setArticleToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  // Change status filter
  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  if (loading && articles.length === 0) {
    return <AdminPageLoading label="Memuat artikel..." />;
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed right-5 top-5 z-[200] flex max-w-md items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl ${
            notification.type === "success"
              ? "border-emerald-500/20 bg-slate-900 text-emerald-400"
              : "border-red-500/20 bg-slate-900 text-red-400"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
          )}

          <p className="flex-1 text-sm text-slate-200">
            {notification.message}
          </p>

          <button
            onClick={() => setNotification(null)}
            className="text-slate-500 transition hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Articles Table */}
      <ArticlesTable
        articles={articles}
        pagination={pagination}
        search={search}
        status={status}
        loading={loading}
        onSearchChange={setSearch}
        onStatusChange={handleStatusChange}
        onRefresh={() => setRefreshKey((previous) => previous + 1)}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPageChange={setPage}
      />

      {/* Article Form Modal */}
      <ArticleFormModal
        open={modalOpen}
        article={selectedArticle}
        saving={saving}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={articleToDelete !== null}
        itemName={articleToDelete?.title ?? ""}
        itemType="artikel"
        pending={deleting}
        onCancel={() => setArticleToDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
