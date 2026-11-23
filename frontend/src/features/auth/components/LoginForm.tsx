
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  ShieldCheck,
  LoaderCircle,
  Building2,
} from "lucide-react";

import toast from "react-hot-toast";
import axios from "@/lib/api/axios";
import { isAxiosError } from "axios";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function LoginForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [currentYear, setCurrentYear] = useState("2026");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCurrentYear(String(new Date().getFullYear()));
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("API URL belum dikonfigurasi.");
      }

      // Remove API prefix to get Laravel backend URL
      const backendUrl = apiUrl.replace(
        /\/api(?:\/v1)?\/?$/,
        ""
      );

      // Initialize CSRF protection
      await axios.get(
        `${backendUrl}/sanctum/csrf-cookie`
      );

      // Login
      await axios.post("/auth/login", {
        email: email.trim(),
        password,
        remember,
      });

      // Get authenticated user
      const user = await refreshUser();

      if (!user) {
        throw new Error(
          "Login berhasil, tetapi data pengguna tidak ditemukan."
        );
      }

      toast.success("Login berhasil. Selamat datang!");

      router.replace("/admin/dashboard");
    } catch (err: unknown) {
      let message = "Terjadi kesalahan. Silakan coba kembali.";

      if (isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 422) {
          message =
            err.response?.data?.errors?.email?.[0] ||
            err.response?.data?.errors?.password?.[0] ||
            err.response?.data?.message ||
            "Email atau password tidak valid.";
        } else if (status === 401) {
          message = "Email atau password salah.";
        } else if (status === 403) {
          message =
            err.response?.data?.message ||
            "Akun tidak memiliki akses administrator.";
        } else if (status === 419) {
          message =
            "Sesi keamanan kedaluwarsa. Silakan coba login kembali.";
        } else if (!err.response) {
          message =
            "Tidak dapat terhubung ke server. Periksa koneksi Laravel API.";
        } else {
          message = err.response.data?.message || message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[460px]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="rounded-2xl border border-white/[0.09] bg-[#101827]/90 p-7 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-9"
      >
        {/* Header */}
        <div className="mb-9">
          <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
            <Building2 className="h-6 w-6 text-blue-400" />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Management Portal
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Welcome back
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Sign in to manage PT Athayasa Mandiri
            corporate platform.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="admin@athayasa.co.id"
                className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#0A1120] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Password
            </label>

            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#0A1120] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-[#0A1120] accent-blue-500"
            />

            <span className="text-sm text-slate-400">
              Remember me
            </span>
          </label>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Security */}
        <div className="mt-8 flex items-center justify-center gap-2 border-t border-white/[0.06] pt-6">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />

          <span className="text-xs text-slate-500">
            Secure administrator authentication
          </span>
        </div>
      </motion.div>

      {/* Footer */}
      <p className="mt-6 text-center text-xs text-slate-600">
        © {currentYear} PT Athayasa Mandiri. All rights reserved.
      </p>
    </div>
  );
}
