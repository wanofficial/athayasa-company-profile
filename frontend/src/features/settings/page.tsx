
"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { isAxiosError } from "axios";
import AdminPageLoading from "@/components/admin/AdminPageLoading";
import {
  Globe,
  Image as ImageIcon,
  Share2,
  MessageCircle,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  LayoutTemplate,
  Eye,
  EyeOff,
  Monitor,
  Info,
  Sparkles,
} from "lucide-react";

import {
  getWebsiteSettings,
  updateWebsiteSettings,
  getWebsiteAssetUrl,
  type WebsiteSetting,
  type WebsiteSettingPayload,
} from "./settings.api";

type MessageType = "success" | "error";

type SettingsForm = Omit<
  WebsiteSetting,
  "id" | "logo" | "favicon" | "hero_image"
>;

const defaultForm: SettingsForm = {
  website_name: "",
  tagline: "",
  description: "",

  instagram_url: "",
  facebook_url: "",
  linkedin_url: "",
  whatsapp_url: "",

  hero_title: "",
  hero_subtitle: "",
  hero_description: "",
  hero_primary_cta_text: "",
  hero_primary_cta_url: "",
  hero_secondary_cta_text: "",
  hero_secondary_cta_url: "",

  about_title: "",
  about_description: "",

  why_title: "",
  reason_1_icon: "",
  reason_1_title: "",
  reason_1_description: "",
  reason_2_icon: "",
  reason_2_title: "",
  reason_2_description: "",
  reason_3_icon: "",
  reason_3_title: "",
  reason_3_description: "",

  show_about: true,
  show_services: true,
  show_projects: true,
  show_why_choose_us: true,
  show_articles: true,
  show_customers: true,
  show_contact: true,
};

function Section({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/60">
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4 sm:px-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
          {icon}
        </div>

        <div>
          <h2 className="font-semibold text-white">{title}</h2>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function ImageUploader({
  label,
  preview,
  accept = "image/png,image/jpeg,image/webp",
  onChange,
  onCancel,
  description,
}: {
  label: string;
  preview: string | null;
  accept?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  description: string;
}) {
  return (
    <Field label={label}>
      <div className="flex min-h-[190px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/50 p-5">
        {preview ? (
          <div className="flex w-full flex-col items-center gap-3">
            <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-lg bg-white p-3">
              <img
                src={preview}
                alt={`${label} preview`}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 text-xs text-red-400 transition hover:text-red-300"
            >
              <X size={14} />
              Cancel selected image
            </button>
          </div>
        ) : (
          <>
            <Upload size={25} className="mb-3 text-slate-500" />
            <p className="text-sm text-slate-400">No image selected</p>
            <p className="mt-1 text-xs text-slate-600">{description}</p>
          </>
        )}

        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-700">
          <Upload size={14} />
          Choose Image
          <input
            type="file"
            accept={accept}
            onChange={onChange}
            className="hidden"
          />
        </label>
      </div>
    </Field>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<WebsiteSetting | null>(null);
  const [form, setForm] = useState<SettingsForm>(defaultForm);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("success");

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

  const textareaClass = `${inputClass} resize-y`;

  async function loadSettings(showLoader = true) {
    try {
      if (showLoader) setLoading(true);

      const data = await getWebsiteSettings();

      setSettings(data);

      setForm({
        website_name: data.website_name ?? "",
        tagline: data.tagline ?? "",
        description: data.description ?? "",

        instagram_url: data.instagram_url ?? "",
        facebook_url: data.facebook_url ?? "",
        linkedin_url: data.linkedin_url ?? "",
        whatsapp_url: data.whatsapp_url ?? "",

        hero_title: data.hero_title ?? "",
        hero_subtitle: data.hero_subtitle ?? "",
        hero_description: data.hero_description ?? "",
        hero_primary_cta_text: data.hero_primary_cta_text ?? "",
        hero_primary_cta_url: data.hero_primary_cta_url ?? "",
        hero_secondary_cta_text: data.hero_secondary_cta_text ?? "",
        hero_secondary_cta_url: data.hero_secondary_cta_url ?? "",

        about_title: data.about_title ?? "",
        about_description: data.about_description ?? "",

        why_title: data.why_title ?? "",
        reason_1_icon: data.reason_1_icon ?? "",
        reason_1_title: data.reason_1_title ?? "",
        reason_1_description: data.reason_1_description ?? "",
        reason_2_icon: data.reason_2_icon ?? "",
        reason_2_title: data.reason_2_title ?? "",
        reason_2_description: data.reason_2_description ?? "",
        reason_3_icon: data.reason_3_icon ?? "",
        reason_3_title: data.reason_3_title ?? "",
        reason_3_description: data.reason_3_description ?? "",

        show_about: data.show_about ?? true,
        show_services: data.show_services ?? true,
        show_projects: data.show_projects ?? true,
        show_why_choose_us: data.show_why_choose_us ?? true,
        show_articles: data.show_articles ?? true,
        show_customers: data.show_customers ?? true,
        show_contact: data.show_contact ?? true,
      });

      setLogoPreview(getWebsiteAssetUrl(data.logo));
      setFaviconPreview(getWebsiteAssetUrl(data.favicon));
      setHeroImagePreview(getWebsiteAssetUrl(data.hero_image));

      setLogoFile(null);
      setFaviconFile(null);
      setHeroImageFile(null);
    } catch (error) {
      console.error("Failed to load website settings:", error);
      setMessage("Gagal mengambil data pengaturan website.");
      setMessageType("error");
    } finally {
      if (showLoader) setLoading(false);
    }
  }

  useEffect(() => {
    void loadSettings();
  }, []);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleToggle(name: keyof SettingsForm) {
    setForm((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  }

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
    type: "logo" | "favicon" | "hero"
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    if (type === "logo") {
      setLogoFile(file);
      setLogoPreview(preview);
    } else if (type === "favicon") {
      setFaviconFile(file);
      setFaviconPreview(preview);
    } else {
      setHeroImageFile(file);
      setHeroImagePreview(preview);
    }

    event.target.value = "";
  }

  function cancelImage(type: "logo" | "favicon" | "hero") {
    if (type === "logo") {
      setLogoFile(null);
      setLogoPreview(getWebsiteAssetUrl(settings?.logo ?? null));
    } else if (type === "favicon") {
      setFaviconFile(null);
      setFaviconPreview(getWebsiteAssetUrl(settings?.favicon ?? null));
    } else {
      setHeroImageFile(null);
      setHeroImagePreview(getWebsiteAssetUrl(settings?.hero_image ?? null));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const payload: WebsiteSettingPayload = {
        ...form,
        logo: logoFile,
        favicon: faviconFile,
        hero_image: heroImageFile,
      };

      await updateWebsiteSettings(payload);

      await loadSettings(false);

      setMessage("Pengaturan website berhasil diperbarui.");
      setMessageType("success");
    } catch (error) {
      console.error("Failed to update website settings:", error);

      let errorMessage = "Gagal menyimpan pengaturan website.";

      if (isAxiosError(error)) {
        const responseMessage = error.response?.data?.message;

        if (responseMessage) errorMessage = responseMessage;

        const validationErrors = error.response?.data?.errors;

        if (validationErrors) {
          const firstError = Object.values(
            validationErrors as Record<string, string[]>
          )[0]?.[0];

          if (firstError) errorMessage = firstError;
        }
      }

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  const visibilityItems = [
    { key: "show_about", label: "About Section", description: "Informasi tentang perusahaan." },
    { key: "show_services", label: "Services Section", description: "Daftar layanan perusahaan." },
    { key: "show_projects", label: "Projects Section", description: "Portofolio proyek perusahaan." },
    { key: "show_why_choose_us", label: "Why Choose Us", description: "Alasan memilih layanan perusahaan." },
    { key: "show_articles", label: "Articles Section", description: "Artikel dan informasi terbaru." },
    { key: "show_customers", label: "Customers Section", description: "Logo dan daftar customer perusahaan." },
    { key: "show_contact", label: "Contact Section", description: "Informasi kontak pada landing page." },
  ] as const;

  if (loading) {
    return <AdminPageLoading label="Memuat pengaturan website..." />;
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Website Settings
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Kelola informasi, branding, dan konten landing page perusahaan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadSettings()}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Notification */}
      {message && (
        <div
          className={`flex items-start gap-3 rounded-xl border p-4 ${
            messageType === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}
        >
          {messageType === "success" ? (
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
          )}

          <p className="text-sm">{message}</p>

          <button
            type="button"
            onClick={() => setMessage("")}
            className="ml-auto shrink-0 opacity-70 hover:opacity-100"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Website Information */}
        <Section
          icon={<Globe size={19} />}
          title="Website Information"
          description="Informasi utama website perusahaan."
        >
          <Field label="Website Name">
            <input
              name="website_name"
              value={form.website_name}
              onChange={handleChange}
              required
              placeholder="PT Athayasa Mandiri"
              className={inputClass}
            />
          </Field>

          <Field label="Tagline">
            <input
              name="tagline"
              value={form.tagline ?? ""}
              onChange={handleChange}
              placeholder="Maintenance & Services"
              className={inputClass}
            />
          </Field>

          <Field label="Website Description">
            <textarea
              name="description"
              value={form.description ?? ""}
              onChange={handleChange}
              rows={4}
              placeholder="Deskripsi singkat perusahaan..."
              className={textareaClass}
            />
          </Field>
        </Section>

        {/* Branding */}
        <Section
          icon={<ImageIcon size={19} />}
          title="Website Branding"
          description="Kelola logo dan favicon website."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <ImageUploader
              label="Company Logo"
              preview={logoPreview}
              onChange={(event) => handleImageChange(event, "logo")}
              onCancel={() => cancelImage("logo")}
              description="PNG, JPG, WEBP. Maksimal 5MB."
            />

            <ImageUploader
              label="Website Favicon"
              preview={faviconPreview}
              accept="image/png,image/jpeg,image/webp,image/x-icon"
              onChange={(event) => handleImageChange(event, "favicon")}
              onCancel={() => cancelImage("favicon")}
              description="PNG, JPG, WEBP, ICO. Maksimal 2MB."
            />
          </div>
        </Section>

        {/* Social Media */}
        <Section
          icon={<Share2 size={19} />}
          title="Social Media"
          description="Tautan media sosial resmi perusahaan."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Instagram URL">
              <input
                type="url"
                name="instagram_url"
                value={form.instagram_url ?? ""}
                onChange={handleChange}
                placeholder="https://instagram.com/youraccount"
                className={inputClass}
              />
            </Field>

            <Field label="Facebook URL">
              <input
                type="url"
                name="facebook_url"
                value={form.facebook_url ?? ""}
                onChange={handleChange}
                placeholder="https://facebook.com/yourpage"
                className={inputClass}
              />
            </Field>

            <Field label="LinkedIn URL">
              <input
                type="url"
                name="linkedin_url"
                value={form.linkedin_url ?? ""}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/yourcompany"
                className={inputClass}
              />
            </Field>

            <Field label="WhatsApp URL">
              <input
                type="url"
                name="whatsapp_url"
                value={form.whatsapp_url ?? ""}
                onChange={handleChange}
                placeholder="https://wa.me/628xxxxxxxxxx"
                className={inputClass}
              />
            </Field>
          </div>
        </Section>

        {/* Hero */}
        <Section
          icon={<Monitor size={19} />}
          title="Homepage – Hero Section"
          description="Konten utama yang pertama kali dilihat pengunjung."
        >
          <Field label="Hero Headline">
            <input
              name="hero_title"
              value={form.hero_title ?? ""}
              onChange={handleChange}
              placeholder="Your Trusted Industrial Maintenance Partner"
              className={inputClass}
            />
          </Field>

          <Field label="Hero Subtitle">
            <input
              name="hero_subtitle"
              value={form.hero_subtitle ?? ""}
              onChange={handleChange}
              placeholder="Engineering Excellence & Reliable Services"
              className={inputClass}
            />
          </Field>

          <Field label="Hero Description">
            <textarea
              name="hero_description"
              value={form.hero_description ?? ""}
              onChange={handleChange}
              rows={4}
              placeholder="Tuliskan penjelasan singkat mengenai layanan dan keunggulan perusahaan..."
              className={textareaClass}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Primary Button Text">
              <input
                name="hero_primary_cta_text"
                value={form.hero_primary_cta_text ?? ""}
                onChange={handleChange}
                placeholder="Explore Our Services"
                className={inputClass}
              />
            </Field>

            <Field label="Primary Button Link">
              <input
                name="hero_primary_cta_url"
                value={form.hero_primary_cta_url ?? ""}
                onChange={handleChange}
                placeholder="#services"
                className={inputClass}
              />
            </Field>

            <Field label="Secondary Button Text">
              <input
                name="hero_secondary_cta_text"
                value={form.hero_secondary_cta_text ?? ""}
                onChange={handleChange}
                placeholder="Learn More"
                className={inputClass}
              />
            </Field>

            <Field label="Secondary Button Link">
              <input
                name="hero_secondary_cta_url"
                value={form.hero_secondary_cta_url ?? ""}
                onChange={handleChange}
                placeholder="#about"
                className={inputClass}
              />
            </Field>
          </div>

          <ImageUploader
            label="Hero Background Image"
            preview={heroImagePreview}
            onChange={(event) => handleImageChange(event, "hero")}
            onCancel={() => cancelImage("hero")}
            description="PNG, JPG, WEBP. Maksimal 5MB."
          />
        </Section>

        {/* About */}
        <Section
          icon={<Info size={19} />}
          title="Homepage – About Section"
          description="Konten pengenalan perusahaan pada landing page."
        >
          <Field label="About Section Title">
            <input
              name="about_title"
              value={form.about_title ?? ""}
              onChange={handleChange}
              placeholder="About Our Company"
              className={inputClass}
            />
          </Field>

          <Field label="About Description">
            <textarea
              name="about_description"
              value={form.about_description ?? ""}
              onChange={handleChange}
              rows={5}
              placeholder="Ceritakan profil dan pengalaman perusahaan..."
              className={textareaClass}
            />
          </Field>
        </Section>

        {/* Why Choose Us */}
        <Section
          icon={<Sparkles size={19} />}
          title="Homepage – Why Choose Us"
          description="Tampilkan tiga alasan utama memilih perusahaan."
        >
          <Field label="Section Title">
            <input
              name="why_title"
              value={form.why_title ?? ""}
              onChange={handleChange}
              placeholder="Why Choose Us"
              className={inputClass}
            />
          </Field>

          {[1, 2, 3].map((number) => {
            const iconKey = `reason_${number}_icon` as keyof SettingsForm;
            const titleKey = `reason_${number}_title` as keyof SettingsForm;
            const descriptionKey =
              `reason_${number}_description` as keyof SettingsForm;

            return (
              <div
                key={number}
                className="space-y-4 rounded-xl border border-white/[0.06] bg-slate-950/40 p-4 sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">
                    Advantage {number}
                  </h3>
                  <span className="rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-400">
                    0{number}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Icon Name">
                    <input
                      name={iconKey}
                      value={String(form[iconKey] ?? "")}
                      onChange={handleChange}
                      placeholder="shield-check"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Title">
                    <input
                      name={titleKey}
                      value={String(form[titleKey] ?? "")}
                      onChange={handleChange}
                      placeholder="Experienced Team"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Description">
                  <textarea
                    name={descriptionKey}
                    value={String(form[descriptionKey] ?? "")}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Jelaskan keunggulan ini..."
                    className={textareaClass}
                  />
                </Field>
              </div>
            );
          })}

          <p className="text-xs text-slate-500">
            Icon Name menggunakan nama icon Lucide, misalnya shield-check,
            wrench, atau clock. Tampilan icon akan disesuaikan pada landing page.
          </p>
        </Section>

        {/* Visibility */}
        <Section
          icon={<LayoutTemplate size={19} />}
          title="Homepage – Section Visibility"
          description="Pilih bagian landing page yang ingin ditampilkan."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {visibilityItems.map((item) => {
              const enabled = Boolean(form[item.key]);

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleToggle(item.key)}
                  className={`flex items-center justify-between gap-4 rounded-xl border p-4 text-left transition ${
                    enabled
                      ? "border-indigo-500/30 bg-indigo-500/[0.07]"
                      : "border-white/[0.06] bg-slate-950/40"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      enabled
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {enabled ? <Eye size={17} /> : <EyeOff size={17} />}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Save */}
        <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => void loadSettings()}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Reset Changes
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
