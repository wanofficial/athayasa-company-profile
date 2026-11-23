
"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Building2,
  Save,
  Loader2,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Globe,
  CalendarDays,
  Target,
  Eye,
  BriefcaseBusiness,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  FileText,
} from "lucide-react";
import { isAxiosError } from "axios";
import AdminPageLoading from "@/components/admin/AdminPageLoading";
import api from "@/lib/api/axios";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface CompanyProfile {
  company_name: string;
  tagline: string;
  description: string;
  established_year: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  vision: string;
  mission: string;
}

interface CompanyProfileApi {
  company_name?: string | null;
  tagline?: string | null;
  description?: string | null;
  established_year?: number | string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
  vision?: string | null;
  mission?: string | null;
}

const initialForm: CompanyProfile = {
  company_name: "",
  tagline: "",
  description: "",
  established_year: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  vision: "",
  mission: "",
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const normalizeProfile = (
  data?: CompanyProfileApi | null
): CompanyProfile => ({
  company_name: data?.company_name ?? "",
  tagline: data?.tagline ?? "",
  description: data?.description ?? "",
  established_year:
    data?.established_year !== null &&
    data?.established_year !== undefined
      ? String(data.established_year)
      : "",
  email: data?.email ?? "",
  phone: data?.phone ?? "",
  address: data?.address ?? "",
  website: data?.website ?? "",
  vision: data?.vision ?? "",
  mission: data?.mission ?? "",
});

const inputClass =
  "w-full rounded-xl border border-white/[0.09] bg-[#0B1220] px-4 py-3 text-[13px] text-white outline-none transition-all duration-200 placeholder:text-slate-600 hover:border-white/[0.16] focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400";

const sectionClass =
  "overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111827]";

const sectionHeaderClass =
  "flex items-center justify-between border-b border-white/[0.07] px-6 py-5";

const sectionIconClass =
  "flex h-10 w-10 items-center justify-center rounded-xl";

const iconInputClass =
  "absolute left-4 top-3.5 text-slate-500";

const getErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) {
    return "Something went wrong. Please try again.";
  }

  if (error.response?.status === 401) {
    return "Your session has expired. Please login again.";
  }

  if (error.response?.status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (error.response?.status === 422) {
    const errors = error.response.data?.errors as
      | Record<string, string | string[]>
      | undefined;

    if (errors) {
      return Object.values(errors).flat().join(" ");
    }

    return "Please check the information you entered.";
  }

  return (
    error.response?.data?.message ||
    "Unable to process your request. Please try again."
  );
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function CompanyProfilePage() {
  const [form, setForm] = useState<CompanyProfile>(initialForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error"
  >("success");

  /* ------------------------------------------------------------------------ */
  /* Load Company Profile                                                     */
  /* ------------------------------------------------------------------------ */

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await api.get("/admin/company-profile");

      const data = response.data?.data as
        | CompanyProfileApi
        | null
        | undefined;

      setForm(normalizeProfile(data));
    } catch (error) {
      setMessage(getErrorMessage(error));
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  /* ------------------------------------------------------------------------ */
  /* Form Handler                                                             */
  /* ------------------------------------------------------------------------ */

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ------------------------------------------------------------------------ */
  /* Save Company Profile                                                     */
  /* ------------------------------------------------------------------------ */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setMessage("");

    try {
      const payload = {
        ...form,
        established_year: form.established_year
          ? Number(form.established_year)
          : null,
      };

      const response = await api.put(
        "/admin/company-profile",
        payload
      );

      const data = response.data?.data as
        | CompanyProfileApi
        | null
        | undefined;

      // Update form using the latest data returned by Laravel.
      setForm(normalizeProfile(data ?? payload));

      setMessage(
        "Company profile has been saved successfully."
      );
      setMessageType("success");
    } catch (error) {
      setMessage(getErrorMessage(error));
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  const hasProfile = Boolean(form.company_name.trim());

  /* ------------------------------------------------------------------------ */
  /* Loading State                                                            */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return <AdminPageLoading label="Memuat profil perusahaan..." />;
  }

  /* ------------------------------------------------------------------------ */
  /* Main UI                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="mx-auto max-w-[1450px] space-y-7 pb-12 text-white">

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
              <Building2 size={17} />
            </span>

            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Website Configuration
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[34px]">
            Company Profile
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Manage your company identity, contact information, and
            corporate information displayed across your website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-white/[0.07] bg-[#111827] px-4 py-3 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />

            <span className="text-xs text-slate-400">
              Profile Management
            </span>
          </div>

          <button
            type="button"
            onClick={() => void loadProfile()}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl border border-white/[0.09] bg-[#111827] px-4 py-3 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:bg-[#182235] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111827]">
        <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-indigo-600/[0.12] blur-[90px]" />

        <div className="absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-blue-500/[0.08] blur-[90px]" />

        <div className="relative flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex min-w-0 items-center gap-5">
            <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 shadow-lg shadow-indigo-950/30">
              <Building2 size={31} className="text-indigo-300" />
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-indigo-400/20 bg-indigo-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-indigo-300">
                  Corporate Identity
                </span>

                {hasProfile && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <CheckCircle2 size={12} />
                    Configured
                  </span>
                )}
              </div>

              <h2 className="truncate text-xl font-bold tracking-tight sm:text-2xl">
                {form.company_name || "Your Company Name"}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {form.tagline || "Your company tagline will appear here"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-white/[0.07] pt-5 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Established
              </p>

              <p className="mt-1 text-lg font-semibold text-white">
                {form.established_year || "—"}
              </p>
            </div>

            <div className="mx-3 h-9 w-px bg-white/10" />

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Website Status
              </p>

              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Management Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {message && (
        <div
          role="alert"
          aria-live="polite"
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
            messageType === "success"
              ? "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-400"
              : "border-red-500/20 bg-red-500/[0.07] text-red-400"
          }`}
        >
          {messageType === "success" ? (
            <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
          ) : (
            <Sparkles size={17} className="mt-0.5 shrink-0" />
          )}

          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">

          {/* Main Form */}
          <div className="min-w-0 space-y-6">

            {/* General Information */}
            <section className={sectionClass}>
              <div className={sectionHeaderClass}>
                <div className="flex items-center gap-3">
                  <div className={`${sectionIconClass} bg-indigo-500/10 text-indigo-400`}>
                    <BriefcaseBusiness size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      General Information
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Basic details about your organization
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Section 01
                </span>
              </div>

              <div className="grid gap-5 p-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="company_name" className={labelClass}>
                    Company Name *
                  </label>

                  <input
                    id="company_name"
                    name="company_name"
                    value={form.company_name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="PT Athayasa Mandiri"
                    autoComplete="organization"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="tagline" className={labelClass}>
                    Company Tagline
                  </label>

                  <input
                    id="tagline"
                    name="tagline"
                    value={form.tagline}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Maintenance & Services"
                  />
                </div>

                <div>
                  <label htmlFor="established_year" className={labelClass}>
                    Established Year
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={15}
                      className={iconInputClass}
                    />

                    <input
                      id="established_year"
                      type="number"
                      name="established_year"
                      value={form.established_year}
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      placeholder="2020"
                      min="1800"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className={labelClass}>
                    Website URL
                  </label>

                  <div className="relative">
                    <Globe
                      size={15}
                      className={iconInputClass}
                    />

                    <input
                      id="website"
                      type="url"
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="description" className={labelClass}>
                    Company Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    className={`${inputClass} resize-y leading-6`}
                    placeholder="Write a professional overview of your company, experience, and business activities..."
                  />

                  <p className="mt-2 text-right text-[10px] text-slate-600">
                    {form.description.length} characters
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className={sectionClass}>
              <div className={sectionHeaderClass}>
                <div className="flex items-center gap-3">
                  <div className={`${sectionIconClass} bg-sky-500/10 text-sky-400`}>
                    <Globe size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Contact Information
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Official company communication details
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Section 02
                </span>
              </div>

              <div className="grid gap-5 p-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Official Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={15}
                      className={iconInputClass}
                    />

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      placeholder="athayasa.pt@gmail.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={15}
                      className={iconInputClass}
                    />

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      placeholder="+62..."
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className={labelClass}>
                    Office Address
                  </label>

                  <div className="relative">
                    <MapPin
                      size={15}
                      className="absolute left-4 top-4 text-slate-500"
                    />

                    <textarea
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      className={`${inputClass} resize-y pl-10 leading-6`}
                      placeholder="Enter your official company address..."
                      autoComplete="street-address"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Vision and Mission */}
            <section className={sectionClass}>
              <div className={sectionHeaderClass}>
                <div className="flex items-center gap-3">
                  <div className={`${sectionIconClass} bg-violet-500/10 text-violet-400`}>
                    <Target size={18} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Vision & Mission
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Your company's values and strategic direction
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Section 03
                </span>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <label htmlFor="vision" className={labelClass}>
                    Company Vision
                  </label>

                  <textarea
                    id="vision"
                    name="vision"
                    value={form.vision}
                    onChange={handleChange}
                    rows={4}
                    className={`${inputClass} resize-y leading-6`}
                    placeholder="Describe the long-term vision of your company..."
                  />
                </div>

                <div>
                  <label htmlFor="mission" className={labelClass}>
                    Company Mission
                  </label>

                  <textarea
                    id="mission"
                    name="mission"
                    value={form.mission}
                    onChange={handleChange}
                    rows={5}
                    className={`${inputClass} resize-y leading-6`}
                    placeholder="Describe the company's mission and commitments..."
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-5 xl:sticky xl:top-6">

            {/* Profile Preview */}
            <div className={sectionClass}>
              <div className="border-b border-white/[0.07] px-5 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-white">
                    Company Preview
                  </h3>

                  <Eye size={15} className="text-slate-500" />
                </div>
              </div>

              <div className="p-5">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10">
                  <Building2 size={29} className="text-indigo-300" />
                </div>

                <h3 className="break-words text-lg font-bold leading-snug text-white">
                  {form.company_name || "PT Athayasa Mandiri"}
                </h3>

                <p className="mt-2 text-xs leading-5 text-indigo-300">
                  {form.tagline || "Maintenance & Services"}
                </p>

                <div className="my-5 h-px bg-white/[0.07]" />

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail size={15} className="mt-0.5 shrink-0 text-slate-500" />

                    <span className="break-all text-xs text-slate-400">
                      {form.email || "Company email"}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={15} className="mt-0.5 shrink-0 text-slate-500" />

                    <span className="break-all text-xs text-slate-400">
                      {form.phone || "Phone number"}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-slate-500" />

                    <span className="break-words text-xs leading-5 text-slate-400">
                      {form.address || "Company address"}
                    </span>
                  </div>

                  {form.website && (
                    <div className="flex items-start gap-3">
                      <Globe size={15} className="mt-0.5 shrink-0 text-slate-500" />

                      <span className="break-all text-xs text-slate-400">
                        {form.website}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 rounded-xl border border-indigo-500/15 bg-indigo-500/[0.06] p-4">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-300">
                    <Sparkles size={13} />
                    Company Identity
                  </div>

                  <p className="mt-2 text-[11px] leading-5 text-slate-400">
                    This information represents your company's identity
                    across your corporate website.
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className={sectionClass + " p-5"}>
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-indigo-400" />

                <h3 className="text-xs font-semibold text-white">
                  Profile Information
                </h3>
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                Keep your company details accurate and up to date.
                This information will be used by the public website.
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-4">
                <span className="text-[11px] text-slate-500">
                  Profile status
                </span>

                <span
                  className={`flex items-center gap-1.5 text-[11px] font-medium ${
                    hasProfile
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      hasProfile
                        ? "bg-emerald-400"
                        : "bg-amber-400"
                    }`}
                  />

                  {hasProfile ? "Configured" : "Not configured"}
                </span>
              </div>
            </div>
          </aside>
        </div>

        {/* Sticky Save Bar */}
        <div className=" bottom-4 z-20 mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-white/[0.10] bg-[#101827]/95 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:flex-row sm:items-center sm:px-6">
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-white">
              Company Profile Settings
            </p>

            <p className="mt-1 text-[10px] text-slate-500">
              Save your changes to update company information.
            </p>
          </div>

          <div className="flex w-full gap-3 sm:w-auto">
            <button
              type="button"
              onClick={() => void loadProfile()}
              disabled={saving}
              className="flex-1 rounded-xl border border-white/[0.09] px-5 py-3 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              Discard
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={15} />
                  Save Changes
                  <ArrowUpRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
