"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowUpRight,
  BookOpenText,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  FolderKanban,
  Globe,
  LayoutTemplate,
  RefreshCw,
  Settings,
  ShieldCheck,
  Users,
  UserRound,
} from "lucide-react";
import { isAxiosError } from "axios";

import { useAuth } from "@/features/auth/hooks/useAuth";
import api from "@/lib/api/axios";
import AdminPageLoading from "@/components/admin/AdminPageLoading";

interface DashboardData {
  services: { total: number; active: number };
  projects: { total: number; active: number };
  customers: { total: number; active: number };
  articles: { total: number; published: number; drafts: number };
  company_profile_configured: boolean;
  website_settings_configured: boolean;
}

const managementLinks = [
  {
    label: "Company Profile",
    description: "Informasi dan identitas perusahaan",
    icon: Building2,
    href: "/admin/company",
    color: "text-blue-400",
    background: "bg-blue-500/10",
  },
  {
    label: "Services",
    description: "Layanan yang ditampilkan di website",
    icon: BriefcaseBusiness,
    href: "/admin/services",
    color: "text-violet-400",
    background: "bg-violet-500/10",
  },
  {
    label: "Projects",
    description: "Portofolio dan pengalaman proyek",
    icon: FolderKanban,
    href: "/admin/projects",
    color: "text-emerald-400",
    background: "bg-emerald-500/10",
  },
  {
    label: "Articles",
    description: "Artikel dan publikasi perusahaan",
    icon: BookOpenText,
    href: "/admin/articles",
    color: "text-amber-400",
    background: "bg-amber-500/10",
  },
  {
    label: "Customers",
    description: "Customer dan logo yang ditampilkan",
    icon: Users,
    href: "/admin/customers",
    color: "text-cyan-400",
    background: "bg-cyan-500/10",
  },
  {
    label: "Settings",
    description: "Konten, branding, dan tampilan website",
    icon: Settings,
    href: "/admin/settings",
    color: "text-rose-400",
    background: "bg-rose-500/10",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<{ data: DashboardData }>("/admin/dashboard");
      setData(response.data.data);
    } catch (loadError) {
      console.error("Failed to load dashboard:", loadError);

      if (isAxiosError(loadError)) {
        setError(
          loadError.response?.data?.message ||
            "Data dashboard tidak dapat dimuat. Silakan coba kembali."
        );
      } else {
        setError("Data dashboard tidak dapat dimuat. Silakan coba kembali.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void loadDashboard();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [loadDashboard]);

  const stats = data
    ? [
        {
          label: "Services",
          value: data.services.total,
          description: `${data.services.active} aktif`,
          icon: BriefcaseBusiness,
          color: "text-violet-400",
          background: "bg-violet-500/10",
          href: "/admin/services",
        },
        {
          label: "Projects",
          value: data.projects.total,
          description: `${data.projects.active} aktif`,
          icon: FolderKanban,
          color: "text-emerald-400",
          background: "bg-emerald-500/10",
          href: "/admin/projects",
        },
        {
          label: "Customers",
          value: data.customers.total,
          description: `${data.customers.active} aktif`,
          icon: Users,
          color: "text-cyan-400",
          background: "bg-cyan-500/10",
          href: "/admin/customers",
        },
        {
          label: "Published Articles",
          value: data.articles.published,
          description: `${data.articles.drafts} draft · ${data.articles.total} total`,
          icon: BookOpenText,
          color: "text-amber-400",
          background: "bg-amber-500/10",
          href: "/admin/articles",
        },
      ]
    : [];

  if (loading && !data) {
    return <AdminPageLoading label="Memuat ringkasan dashboard..." />;
  }

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
            Ringkasan Administrasi
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Selamat datang, {user?.name}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Pantau konten dan kelola informasi website perusahaan Anda.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadDashboard()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.07] disabled:opacity-50 sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </motion.section>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-400/20 bg-red-500/[0.06] p-4 sm:flex-row sm:items-center"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
          <p className="flex-1 text-sm text-red-200">{error}</p>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="text-left text-xs font-semibold text-red-300 hover:text-white sm:text-right"
          >
            Coba lagi
          </button>
        </div>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Ringkasan Website
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Data konten yang tersimpan di sistem.
            </p>
          </div>
          {!loading && !error && (
            <span className="text-[11px] text-emerald-400">Data terbaru</span>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-2xl border border-white/[0.07] bg-[#101827]"
                />
              ))
            : stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.button
                    type="button"
                    key={stat.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                    onClick={() => router.push(stat.href)}
                    className="rounded-2xl border border-white/[0.07] bg-[#101827] p-5 text-left transition hover:border-white/[0.15] hover:bg-[#131e30]"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.background}`}
                      >
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-600" />
                    </div>
                    <p className="mt-5 text-2xl font-semibold tracking-tight text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-300">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {stat.description}
                    </p>
                  </motion.button>
                );
              })}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-white/[0.07] bg-[#101827] p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white">
              Menu Pengelolaan
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Akses semua bagian yang tersedia di panel admin.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {managementLinks.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  type="button"
                  key={item.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  onClick={() => router.push(item.href)}
                  className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 text-left transition hover:border-blue-500/20 hover:bg-blue-500/[0.04]"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.background}`}
                  >
                    <Icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-200">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-blue-400" />
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-white/[0.07] bg-[#101827] p-6">
            <h3 className="text-sm font-semibold text-white">
              Status Website
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Kesiapan data utama website.
            </p>
            <div className="mt-5 space-y-3">
              {[
                {
                  label: "Profil Perusahaan",
                  configured: data?.company_profile_configured ?? false,
                  href: "/admin/company",
                  icon: Building2,
                },
                {
                  label: "Pengaturan Website",
                  configured: data?.website_settings_configured ?? false,
                  href: "/admin/settings",
                  icon: LayoutTemplate,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className="flex w-full items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3 text-left transition hover:bg-white/[0.05]"
                  >
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span className="flex-1 text-xs font-medium text-slate-300">
                      {item.label}
                    </span>
                    {loading ? (
                      <span className="h-2 w-14 animate-pulse rounded bg-slate-700" />
                    ) : item.configured ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Tersedia
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400">
                        Belum diisi
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#101827] p-6">
            <h3 className="text-sm font-semibold text-white">
              Informasi Akun
            </h3>
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3">
                <UserRound className="h-4 w-4 text-blue-400" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500">Nama</p>
                  <p className="truncate text-xs font-medium text-slate-200">
                    {user?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-violet-400" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500">Email</p>
                  <p className="truncate text-xs font-medium text-slate-200">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500">Hak Akses</p>
                  <p className="truncate text-xs font-medium text-slate-200">
                    {user?.roles?.join(", ") || "Administrator"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="flex flex-col justify-between gap-2 border-t border-white/[0.06] pt-6 text-xs text-slate-600 sm:flex-row">
        <p>© {new Date().getFullYear()} PT Athayasa Mandiri.</p>
        <p>Management Portal · Version 1.0</p>
      </footer>
    </div>
  );
}
