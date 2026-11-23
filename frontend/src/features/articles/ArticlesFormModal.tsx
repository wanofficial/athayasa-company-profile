
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  FileText,
  Save,
  CalendarDays,
} from "lucide-react";

import type { Article, ArticlePayload } from "./articles.api";
import { getArticleImageUrl } from "./articles.api";

interface ArticleFormModalProps {
  open: boolean;
  article: Article | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (payload: ArticlePayload) => Promise<void>;
}

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 16);
}

export default function ArticleFormModal({
  open,
  article,
  saving,
  onClose,
  onSubmit,
}: ArticleFormModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [imageCredit, setImageCredit] = useState("");
  const [imageSourceUrl, setImageSourceUrl] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [publishedAt, setPublishedAt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const publishedAtRef = useRef<HTMLInputElement>(null);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setTitle(article?.title ?? "");
    setCategory(article?.category ?? "");
    setAuthor(article?.author ?? "");
    setSummary(article?.summary ?? "");
    setBody(article?.body ?? "");
    setImageCredit(article?.image_credit ?? "");
    setImageSourceUrl(article?.image_source_url ?? "");
    setStatus(article?.status ?? "draft");
    setPublishedAt(toDateTimeLocal(article?.published_at));
    setSeoTitle(article?.seo_title ?? "");
    setMetaDescription(article?.meta_description ?? "");
    setCoverFile(null);
  }, [open, article]);

  useEffect(() => {
    if (coverFile) {
      const objectUrl = URL.createObjectURL(coverFile);
      setCoverPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    setCoverPreview(
      article?.cover_image
        ? getArticleImageUrl(article.cover_image)
        : null
    );
  }, [coverFile, article]);

  if (!open) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: ArticlePayload = {
      title: title.trim(),
      category: category.trim(),
      author: author.trim(),
      summary: summary.trim(),
      body,
      image_credit: imageCredit.trim(),
      image_source_url: imageSourceUrl.trim(),
      status,
      published_at: publishedAt || undefined,
      seo_title: seoTitle.trim(),
      meta_description: metaDescription.trim(),
      cover_image: coverFile ?? undefined,
    };

    await onSubmit(payload);
  };

  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-300";

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-white">
              {article ? "Edit Article" : "Create Article"}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Manage your company news and publications.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">

            {/* Basic Information */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">
                  Article Information
                </h3>
              </div>

              <div>
                <label className={labelClass}>
                  Article Title <span className="text-red-400">*</span>
                </label>

                <input
                  type="text"
                  required
                  maxLength={255}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter article title"
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Category</label>

                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Company News, Projects, etc."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Author</label>

                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author name"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Short Summary</label>

                <textarea
                  rows={3}
                  maxLength={500}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Write a short article summary..."
                  className={`${inputClass} resize-y`}
                />

                <p className="mt-1 text-right text-xs text-slate-500">
                  {summary.length}/500
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  Article Content
                </label>

                <textarea
                  rows={9}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your article content here..."
                  className={`${inputClass} resize-y leading-7`}
                />
              </div>
            </section>

            <div className="border-t border-white/[0.06]" />

            {/* Cover Image */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} className="text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">
                  Cover Image
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                <div>
                  <label className={labelClass}>
                    Upload Cover Image
                  </label>

                  <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.12] bg-slate-950 p-5 text-center transition hover:border-indigo-500/50 hover:bg-indigo-500/[0.03]">
                    <Upload
                      size={24}
                      className="mb-3 text-slate-400"
                    />

                    <span className="text-sm font-medium text-slate-300">
                      Click to upload image
                    </span>

                    <span className="mt-1 text-xs text-slate-500">
                      JPG, PNG, WEBP · Maximum 5 MB
                    </span>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            window.alert("Image size must not exceed 5 MB.");
                            e.target.value = "";
                            return;
                          }

                          setCoverFile(file);
                        }
                      }}
                    />
                  </label>

                  {coverFile && (
                    <p className="mt-2 truncate text-xs text-emerald-400">
                      Selected: {coverFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Preview</label>

                  <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-slate-950">
                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt="Article cover preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-slate-600">
                        <ImageIcon
                          size={28}
                          className="mx-auto mb-2"
                        />
                        <span className="text-xs">
                          No image selected
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Image Credit</label>
                  <input
                    type="text"
                    maxLength={255}
                    value={imageCredit}
                    onChange={(event) => setImageCredit(event.target.value)}
                    placeholder="Photographer · CC BY 4.0"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Image Source URL</label>
                  <input
                    type="url"
                    maxLength={2048}
                    value={imageSourceUrl}
                    onChange={(event) => setImageSourceUrl(event.target.value)}
                    placeholder="https://commons.wikimedia.org/..."
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            <div className="border-t border-white/[0.06]" />

            {/* Publishing */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">
                  Publishing Settings
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Publication Status</label>

                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "draft" | "published")
                    }
                    className={inputClass}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

<div>
  <label className={labelClass}>Publication Date</label>

  <div className="relative">
    <input
      ref={publishedAtRef}
      type="datetime-local"
      value={publishedAt}
      onChange={(e) => setPublishedAt(e.target.value)}
      className={`${inputClass} cursor-pointer pr-12`}
    />

    <button
      type="button"
      onClick={() => {
        const input = publishedAtRef.current;
        if (!input) return;

        if (typeof input.showPicker === "function") {
          input.showPicker();
        } else {
          input.focus();
        }
      }}
      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
      aria-label="Open date picker"
    >
      <CalendarDays size={18} />
    </button>
  </div>
</div>
              </div>
            </section>

            <div className="border-t border-white/[0.06]" />

            {/* SEO */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-white">
                SEO Settings
              </h3>

              <div>
                <label className={labelClass}>SEO Title</label>

                <input
                  type="text"
                  maxLength={255}
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="SEO page title"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Meta Description
                </label>

                <textarea
                  rows={3}
                  maxLength={500}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Write a search engine description..."
                  className={`${inputClass} resize-y`}
                />
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] bg-slate-900 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-white/[0.08] px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={16} />

              {saving
                ? "Saving..."
                : article
                  ? "Update Article"
                  : "Create Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
