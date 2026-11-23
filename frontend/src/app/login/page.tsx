"use client";

import { motion } from "motion/react";
import {
  Building2,
  ShieldCheck,
  Settings2,
  ArrowLeft,
  LockKeyhole,
} from "lucide-react";
import Link from "next/link";

import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080D18] px-4 py-10 sm:px-6">

      {/* Background Lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/[0.10] blur-[130px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-600/[0.10] blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">

        {/* Left Branding - Desktop */}
        <motion.section
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <Building2 className="h-6 w-6 text-white" />
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-wide text-white">
                ATHAYASA
              </h2>

              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500">
                Mandiri · Engineering
              </p>
            </div>
          </div>

          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
            Corporate Management System
          </p>

          <h1 className="max-w-xl text-5xl font-semibold leading-[1.15] tracking-tight text-white xl:text-6xl">
            Engineering
            <span className="block text-blue-400">
              Excellence.
            </span>
            Operational
            <span className="block text-slate-400">
              Intelligence.
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-slate-400">
            Manage your corporate identity, services,
            projects, customer profiles and business
            documentation from one centralized platform.
          </p>


{/* Security Information */}
<div className="mt-10">
  <div className="flex items-center gap-5">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
      <ShieldCheck className="h-5 w-5 text-emerald-400" />
    </div>

    <div>
      <p className="text-sm font-medium text-white">
        Secure Administration
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Protected corporate management portal
      </p>
    </div>
  </div>

  {/* Back to Website Button */}
  <div className="mt-8">
    <Link
      href="/"
      className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-slate-400 transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-500/[0.06] hover:text-blue-400"
    >
      <ArrowLeft
        size={14}
        className="transition-transform duration-300 group-hover:-translate-x-1"
      />
      Back to Website
    </Link>
  </div>
</div>
          
        </motion.section>

        {/* Right Login Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto w-full max-w-md"
        >

          {/* Company Branding - Top */}
          <div className="mb-8 flex flex-col items-center text-center">

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-600/10 shadow-lg shadow-blue-600/10">
              <Building2 className="h-7 w-7 text-blue-400" />
            </div>

            <h2 className="text-xl font-bold tracking-[0.12em] text-white sm:text-2xl">
              PT. ATHAYASA MANDIRI
            </h2>

            <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500">
              Engineering & Maintenance Services
            </p>

            <div className="mt-6 h-px w-16 rounded-full bg-blue-500/60" />
          </div>

          {/* Login Form */}
          <LoginForm />
            

        </motion.div>
      </div>

      {/* Bottom Label */}
      <div className="absolute bottom-5 right-6 hidden items-center gap-2 text-[10px] uppercase tracking-widest text-slate-700 lg:flex">
        <Settings2 className="h-3 w-3" />
        Management Portal
      </div>

    </main>
  );
}
