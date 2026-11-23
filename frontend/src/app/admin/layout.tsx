
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import {
  LayoutDashboard,
  Building2,
  BriefcaseBusiness,
  FolderKanban,
  Newspaper,
  Settings,
  LogOut,
  UserRound,
  Menu,
  X,
  ChevronRight,
  Users,
} from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import AdminPageLoading from "@/components/admin/AdminPageLoading";

const navigation = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin/dashboard",
      },
    ],
  },
  {
    title: "WEBSITE MANAGEMENT",
    items: [
      {
        label: "Company Profile",
        icon: Building2,
        href: "/admin/company",
      },
      {
        label: "Services",
        icon: BriefcaseBusiness,
        href: "/admin/services",
      },
      {
        label: "Projects",
        icon: FolderKanban,
        href: "/admin/projects",
      },
      {
        label: "Articles",
        icon: Newspaper,
        href: "/admin/articles",
      },
      {
        label: "Customers",
        icon: Users,
        href: "/admin/customers",
      },
    ],
  },
  {
    title: "PREFERENCES",
    items: [
      {
        label: "Settings",
        icon: Settings,
        href: "/admin/settings",
      },
    ],
  },
];

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/company": "Company Profile",
  "/admin/services": "Services",
  "/admin/projects": "Projects",
  "/admin/articles": "Articles",
  "/admin/customers": "Customers",
  "/admin/settings": "Settings",
};

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const currentPage = pageTitles[pathname] || "Administration";

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setSidebarOpen(false));

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-[#080D18]">
        <AdminPageLoading label="Memeriksa sesi admin..." />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080D18] text-white">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/[0.07] bg-[#0D1524] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-white/[0.06] px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
              <Building2 className="h-5 w-5 text-blue-400" />
            </div>

            <div>
              <p className="text-sm font-bold tracking-wide">ATHAYASA</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
                Management Portal
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <motion.nav
          initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="flex-1 space-y-8 overflow-y-auto px-4 py-7"
        >
          {navigation.map((group, groupIndex) => (
            <div key={group.title}>
              <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.16em] text-slate-600">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item, itemIndex) => {
                  const Icon = item.icon;

                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <motion.div
                      key={item.href}
                      initial={shouldReduceMotion ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.28,
                        delay: shouldReduceMotion
                          ? 0
                          : 0.12 + groupIndex * 0.08 + itemIndex * 0.055,
                      }}
                    >
                      <motion.div
                        whileHover={shouldReduceMotion ? undefined : { x: 4 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                        transition={{ duration: 0.16 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                            active
                              ? "border border-blue-500/10 bg-blue-500/10 font-medium text-blue-400"
                              : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                          }`}
                        >
                      <Icon className="h-[18px] w-[18px]" />

                      <span>{item.label}</span>

                          {active && (
                            <motion.span
                              layoutId="active-admin-menu"
                              className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400"
                              transition={{ type: "spring", stiffness: 420, damping: 30 }}
                            />
                          )}
                        </Link>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </motion.nav>

        <div className="border-t border-white/[0.06] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
              <UserRound className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {user.name}
              </p>
              <p className="truncate text-[10px] text-slate-500">
                Administrator
              </p>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Logout"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-white/[0.07] bg-[#080D18]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setSidebarOpen(true)}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.88, rotate: 8 }}
              className="rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:border-blue-400/30 hover:text-blue-400 lg:hidden"
              aria-label="Open navigation"
            >
              <motion.span
                initial={shouldReduceMotion ? false : { rotate: -20, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.22 }}
                className="block"
              >
                <Menu className="h-5 w-5" />
              </motion.span>
            </motion.button>

            <div>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                Administration
                <ChevronRight size={12} />
                {currentPage}
              </p>

              <h1 className="mt-1 text-sm font-semibold text-white">
                {currentPage}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/[0.06] px-3 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-medium text-emerald-400">
                System Online
              </span>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#172338] text-xs font-bold text-blue-400">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">
          {children}
        </div>
      </div>
    </main>
  );
}
