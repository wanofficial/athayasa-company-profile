"use client";

import { LoaderCircle } from "lucide-react";

export default function AdminPageLoading({
  label = "Memuat halaman...",
}: {
  label?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[65vh] items-center justify-center"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-[#111827] px-6 py-4 shadow-xl shadow-black/10">
        <LoaderCircle
          aria-hidden="true"
          className="h-5 w-5 animate-spin text-indigo-400"
        />
        <span className="text-sm text-slate-300">{label}</span>
      </div>
    </div>
  );
}
