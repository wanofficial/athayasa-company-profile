
"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import {
  X,
  Upload,
  ImagePlus,
  FolderKanban,
  Loader2,
  Star,
  CheckCircle2,
} from "lucide-react";

import {
  Project,
  ProjectPayload,
  getProjectImageUrl,
} from "../projects.api";

interface ProjectFormModalProps {
  open: boolean;
  project: Project | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: ProjectPayload) => Promise<void>;
}

interface FormData {
  title: string;
  client_name: string;
  location: string;
  completed_at: string;
  short_description: string;
  description: string;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
}

const initialForm: FormData = {
  title: "",
  client_name: "",
  location: "",
  completed_at: "",
  short_description: "",
  description: "",
  sort_order: 0,
  is_featured: false,
  is_active: true,
};

export default function ProjectFormModal({
  open,
  project,
  loading,
  onClose,
  onSubmit,
}: ProjectFormModalProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when opening or changing project.
  useEffect(() => {
    if (!open) return;

    if (project) {
      setForm({
        title: project.title ?? "",
        client_name: project.client_name ?? "",
        location: project.location ?? "",
        completed_at: project.completed_at
          ? project.completed_at.slice(0, 10)
          : "",
        short_description: project.short_description ?? "",
        description: project.description ?? "",
        sort_order: project.sort_order ?? 0,
        is_featured: project.is_featured ?? false,
        is_active: project.is_active ?? true,
      });

      setImagePreview(getProjectImageUrl(project.image));
    } else {
      setForm(initialForm);
      setImagePreview(null);
    }

    setImage(null);
    setErrors({});
  }, [open, project]);

  // Create and clean up temporary image preview.
  useEffect(() => {
    if (!image) return;

    const previewUrl = URL.createObjectURL(image);
    setImagePreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [image]);

  if (!open) return null;

  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors((current) => ({
        ...current,
        image: "Format gambar harus JPG, PNG, atau WEBP.",
      }));
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({
        ...current,
        image: "Ukuran gambar maksimal 5 MB.",
      }));
      event.target.value = "";
      return;
    }

    setErrors((current) => {
      const next = { ...current };
      delete next.image;
      return next;
    });

    setImage(file);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) {
      newErrors.title = "Project title wajib diisi.";
    }

    if (form.short_description.length > 500) {
      newErrors.short_description =
        "Short description maksimal 500 karakter.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: ProjectPayload = {
      ...form,
      title: form.title.trim(),
      image,
    };

    await onSubmit(payload);
  };

  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-300";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-2.5">
              <FolderKanban className="h-5 w-5 text-indigo-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                {project ? "Edit Project" : "Create New Project"}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {project
                  ? "Update project information and details."
                  : "Add a new project to your company portfolio."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto"
        >
          <div className="space-y-6 p-5 sm:p-6">
            {/* Project Image */}
            <div>
              <label className={labelClass}>
                Project Cover Image
              </label>

              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-slate-950 sm:w-48">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Project preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <ImagePlus className="mx-auto h-8 w-8 text-slate-600" />
                      <p className="mt-2 text-xs text-slate-500">
                        No image selected
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-center">
                  <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-white/[0.08] bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700">
                    <Upload size={16} />
                    Choose Image

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Supported formats: JPG, PNG, WEBP.
                    <br />
                    Maximum file size: 5 MB.
                    <br />
                    Recommended landscape image.
                  </p>

                  {image && (
                    <p className="mt-2 truncate text-xs text-emerald-400">
                      Selected: {image.name}
                    </p>
                  )}

                  {errors.image && (
                    <p className="mt-2 text-xs text-red-400">
                      {errors.image}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <div className="border-b border-white/[0.06] pb-2">
                <h3 className="text-sm font-semibold text-white">
                  Basic Information
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Enter the main project information.
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  Project Title <span className="text-red-400">*</span>
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. Industrial Equipment Maintenance"
                  className={inputClass}
                  maxLength={255}
                />

                {errors.title && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Client Name</label>
                  <input
                    type="text"
                    value={form.client_name}
                    onChange={(e) =>
                      updateField("client_name", e.target.value)
                    }
                    placeholder="Client / Company name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Project Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) =>
                      updateField("location", e.target.value)
                    }
                    placeholder="e.g. Batam, Indonesia"
                    className={inputClass}
                  />
                </div>
              </div>

<div>
  <label className={labelClass}>Completion Date</label>

  <div className="relative">
    <CalendarDays
      size={17}
      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
    />

    <input
      type="date"
      value={form.completed_at}
      onChange={(e) =>
        updateField("completed_at", e.target.value)
      }
      onClick={(e) => {
        const input = e.currentTarget;
        if ("showPicker" in HTMLInputElement.prototype) {
          input.showPicker();
        }
      }}
      className={`${inputClass} pl-10 cursor-pointer`}
    />
  </div>
</div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <div className="border-b border-white/[0.06] pb-2">
                <h3 className="text-sm font-semibold text-white">
                  Project Description
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Describe the project and its scope of work.
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-300">
                    Short Description
                  </label>
                  <span className="text-xs text-slate-500">
                    {form.short_description.length}/500
                  </span>
                </div>

                <textarea
                  rows={3}
                  maxLength={500}
                  value={form.short_description}
                  onChange={(e) =>
                    updateField("short_description", e.target.value)
                  }
                  placeholder="Briefly describe this project..."
                  className={inputClass}
                />

                {errors.short_description && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.short_description}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Full Description
                </label>

                <textarea
                  rows={6}
                  value={form.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  placeholder="Write the complete project description, scope of work, and details..."
                  className={inputClass}
                />
              </div>
            </div>

            {/* Visibility Settings */}
            <div className="space-y-4">
              <div className="border-b border-white/[0.06] pb-2">
                <h3 className="text-sm font-semibold text-white">
                  Display Settings
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Configure project visibility on the website.
                </p>
              </div>

              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-white/[0.07] bg-slate-950/50 p-4">
                <div className="flex gap-3">
                  <div className="rounded-lg bg-amber-400/10 p-2">
                    <Star className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Featured Project
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Highlight this project on the website.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) =>
                    updateField("is_featured", e.target.checked)
                  }
                  className="mt-1 h-4 w-4 accent-indigo-500"
                />
              </label>

              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-white/[0.07] bg-slate-950/50 p-4">
                <div className="flex gap-3">
                  <div className="rounded-lg bg-emerald-400/10 p-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Active Status
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Display this project on the public website.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    updateField("is_active", e.target.checked)
                  }
                  className="mt-1 h-4 w-4 accent-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] bg-slate-950/40 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-white/[0.08] px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  {project ? "Save Changes" : "Create Project"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
