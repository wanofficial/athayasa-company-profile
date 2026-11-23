
"use client";

import { useEffect, useState } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  Save,
} from "lucide-react";
import type { Service, ServicePayload } from "../services.api";
import { getServiceImageUrl } from "../services.api";

interface Props {
  open: boolean;
  service: Service | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (payload: ServicePayload) => void;
}

const emptyForm = {
  title: "",
  short_description: "",
  description: "",
  sort_order: 0,
  is_active: true,
};

const inputClass =
  "w-full rounded-xl border border-white/[0.09] bg-[#0B1220] px-4 py-3 text-[13px] text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/10";

const labelClass =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400";

export default function ServiceFormModal({
  open,
  service,
  saving,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setForm(
      service
        ? {
            title: service.title,
            short_description: service.short_description || "",
            description: service.description || "",
            sort_order: service.sort_order,
            is_active: service.is_active,
          }
        : emptyForm
    );

    setImage(null);
    setPreview(getServiceImageUrl(service?.image || null));
  }, [open, service]);

  useEffect(() => {
    if (!image) return;

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit({
      ...form,
      image,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.10] bg-[#111827] shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-white">
              {service ? "Edit Service" : "Create New Service"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Enter the service information below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
            <div>
              <label className={labelClass}>Service Name *</label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className={inputClass}
                placeholder="Example: Equipment Maintenance"
                required
                maxLength={255}
              />
            </div>

            <div>
              <label className={labelClass}>Short Description</label>
              <textarea
                value={form.short_description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    short_description: e.target.value,
                  })
                }
                className={`${inputClass} resize-y leading-6`}
                rows={2}
                maxLength={500}
                placeholder="A short summary of this service..."
              />
              <p className="mt-1 text-right text-[10px] text-slate-600">
                {form.short_description.length}/500
              </p>
            </div>

            <div>
              <label className={labelClass}>Full Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className={`${inputClass} resize-y leading-6`}
                rows={6}
                placeholder="Describe the service in detail..."
              />
            </div>

            <div>
              <label className={labelClass}>Service Image</label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.14] bg-[#0B1220] p-5 transition hover:border-indigo-500/40">
                {preview ? (
                  <img
                    src={preview}
                    alt="Service preview"
                    className="mb-4 h-40 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    <ImageIcon size={22} />
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs font-medium text-indigo-300">
                  <Upload size={14} />
                  Choose image
                </div>

                <p className="mt-1 text-[10px] text-slate-500">
                  JPG, PNG or WEBP. Maximum 5 MB.
                </p>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  
onChange={(e) => {
  const file = e.target.files?.[0] ?? null;

  if (!file) {
    setImage(null);
    return;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    alert("Please select a JPG, PNG, or WEBP image.");
    e.target.value = "";
    setImage(null);
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Image size must not exceed 5 MB.");
    e.target.value = "";
    setImage(null);
    return;
  }

  setImage(file);
}}

                />
              </label>

              {image && (
                <p className="mt-2 text-[11px] text-slate-400">
                  Selected: {image.name}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sort_order: Math.max(0, Number(e.target.value)),
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Visibility Status</label>
                <select
                  value={form.is_active ? "1" : "0"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      is_active: e.target.value === "1",
                    })
                  }
                  className={inputClass}
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] bg-[#0D1524] px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-white/[0.09] px-5 py-3 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.05] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  {service ? "Save Changes" : "Create Service"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
