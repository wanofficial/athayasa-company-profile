"use client";

import { useEffect } from "react";
import { AlertTriangle, LoaderCircle, Trash2, X } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  itemName: string;
  itemType: string;
  pending?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({
  open,
  itemName,
  itemType,
  pending = false,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  useEffect(() => {
    if (!open || pending) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, pending, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !pending) onCancel();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-2xl shadow-black/40"
      >
        <div className="flex items-start gap-4 p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 text-red-300">
            <AlertTriangle size={21} aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="delete-dialog-title"
              className="text-base font-semibold text-white"
            >
              Hapus {itemType}?
            </h2>
            <p
              id="delete-dialog-description"
              className="mt-2 text-sm leading-6 text-slate-400"
            >
              Anda akan menghapus{" "}
              <span className="font-medium text-slate-200">{itemName}</span>.
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>

          <button
            type="button"
            aria-label="Tutup dialog"
            onClick={onCancel}
            disabled={pending}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] bg-white/[0.02] px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              <LoaderCircle
                size={16}
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Trash2 size={16} aria-hidden="true" />
            )}
            {pending ? "Menghapus..." : "Ya, hapus"}
          </button>
        </div>
      </section>
    </div>
  );
}
