
"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  BookOpenText,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Disc3,
  Factory,
  Forklift,
  Gauge,
  HardHat,
  HandCoins,
  Home,
  Info,
  Mail,
  MapPin,
  Menu,
  Newspaper,
  PackageSearch,
  PhoneCall,
  Phone,
  ShieldCheck,
  ThermometerSun,
  Warehouse,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";

import {
  getWebsiteImageUrl,
  type WebsiteHomeData,
  type WebsiteService,
  type WebsiteProject,
  type WebsiteCustomer,
  type WebsiteArticle,
} from "./website.api";

const defaultWebsiteName = "PT Atha Yasa Mandiri";

const smoothEase = [0.22, 1, 0.36, 1] as const;

function CompanyNameText({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const parts = value.split(/(PT Atha Yasa Mandiri)/gi);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === defaultWebsiteName.toLowerCase() ? (
          <strong key={`${index}-${part}`} className="font-bold">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </span>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatYear(date: string | null) {
  if (!date) return null;

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.getFullYear();
}

function getSectionVisibility(
  value: boolean | null | undefined
) {
  return value !== false;
}

function ServiceIcon({
  service,
  size,
  className,
}: {
  service: WebsiteService;
  size: number;
  className?: string;
}) {
  const content = `${service.title} ${service.short_description ?? ""} ${service.description ?? ""}`.toLowerCase();

  if (/rental|sewa/.test(content)) return <Forklift size={size} className={className} />;
  if (/suku cadang|spare.?part|komponen/.test(content)) return <PackageSearch size={size} className={className} />;
  if (/perawatan|servis|maintenance|inspeksi/.test(content)) return <ClipboardCheck size={size} className={className} />;

  return <Wrench size={size} className={className} />;
}

function ArticleTopicIcon({
  article,
  size,
}: {
  article: WebsiteArticle;
  size: number;
}) {
  const content = `${article.title} ${article.category ?? ""}`.toLowerCase();

  if (/baterai|battery/.test(content)) return <BatteryCharging size={size} aria-hidden="true" />;
  if (/\bban\b|\broda\b|\brem\b/.test(content)) return <Disc3 size={size} aria-hidden="true" />;
  if (/hidrolik/.test(content)) return <Gauge size={size} aria-hidden="true" />;
  if (/garpu|mast|rantai|kapasitas|beban/.test(content)) return <Forklift size={size} aria-hidden="true" />;
  if (/suku cadang|spare.?part|komponen/.test(content)) return <PackageSearch size={size} aria-hidden="true" />;
  if (/pendingin|suhu|radiator/.test(content)) return <ThermometerSun size={size} aria-hidden="true" />;
  if (/rental|sewa/.test(content)) return <Forklift size={size} aria-hidden="true" />;
  if (/area kerja|operasional|downtime/.test(content)) return <Warehouse size={size} aria-hidden="true" />;
  if (/pemeriksaan|checklist|inspeksi|perawatan|servis|jam operasi/.test(content)) {
    return <ClipboardCheck size={size} aria-hidden="true" />;
  }
  if (/keselamatan/.test(content)) return <HardHat size={size} aria-hidden="true" />;

  return <BookOpenText size={size} aria-hidden="true" />;
}

const reasonIconMap: Record<string, LucideIcon> = {
  "battery-charging": BatteryCharging,
  "book-open-text": BookOpenText,
  "briefcase-business": BriefcaseBusiness,
  building: Building2,
  "calendar-days": CalendarDays,
  "check-circle": CheckCircle2,
  "check-circle-2": CheckCircle2,
  "clipboard-check": ClipboardCheck,
  clock: Clock3,
  "clock-3": Clock3,
  disc: Disc3,
  disc3: Disc3,
  factory: Factory,
  forklift: Forklift,
  gauge: Gauge,
  "hand-coins": HandCoins,
  "hard-hat": HardHat,
  package: PackageSearch,
  "package-search": PackageSearch,
  shield: ShieldCheck,
  "shield-check": ShieldCheck,
  "thermometer-sun": ThermometerSun,
  warehouse: Warehouse,
  wrench: Wrench,
};

function getReasonIcon(icon: string, title: string): LucideIcon {
  const normalizedIcon = icon
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");

  if (reasonIconMap[normalizedIcon]) return reasonIconMap[normalizedIcon];

  const normalizedTitle = title.toLowerCase();
  if (/teknik|perbaikan|maintenance|perawatan/.test(normalizedTitle)) return Wrench;
  if (/industri|operasional|peralatan/.test(normalizedTitle)) return Factory;

  return ShieldCheck;
}

/* =========================================================
   REUSABLE ANIMATION COMPONENTS
========================================================= */

function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y,
            }
      }
      whileInView={
        shouldReduceMotion
          ? undefined
          : {
              opacity: 1,
              y: 0,
            }
      }
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: smoothEase,
      }}
    >
      {children}
    </motion.div>
  );
}

const cardHover = {
  y: -8,
  transition: {
    duration: 0.25,
    ease: "easeOut" as const,
  },
};

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  light?: boolean;
}) {
  return (
    <Reveal>
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-600">
          {eyebrow}
        </p>

        <h2
          className={`text-3xl font-bold tracking-tight sm:text-4xl ${
            light ? "text-white" : "text-slate-950"
          }`}
        >
          {title}
        </h2>

        {description && (
          <p
            className={`mt-4 text-base leading-7 ${
              light ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}

/* =========================================================
   NAVBAR
========================================================= */

function Navbar({
  data,
}: {
  data: WebsiteHomeData;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!menuOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const settings = data.settings;
  const company = data.company_profile;

  const logo = getWebsiteImageUrl(settings?.logo);

  const links = [
    { label: "Beranda", href: "#home", icon: Home },

    ...(getSectionVisibility(settings?.show_about)
      ? [{ label: "Tentang Kami", href: "#about", icon: Info }]
      : []),

    ...(getSectionVisibility(settings?.show_services)
      ? [{ label: "Layanan", href: "#services", icon: Wrench }]
      : []),

    ...(getSectionVisibility(settings?.show_projects)
      ? [{ label: "Proyek", href: "#projects", icon: BriefcaseBusiness }]
      : []),

    ...(getSectionVisibility(settings?.show_customers)
      ? [{ label: "Pelanggan", href: "#customers", icon: Building2 }]
      : []),

    ...(getSectionVisibility(settings?.show_articles)
      ? [{ label: "Artikel", href: "#articles", icon: Newspaper }]
      : []),

    ...(getSectionVisibility(settings?.show_contact)
      ? [{ label: "Kontak", href: "#contact", icon: PhoneCall }]
      : []),
  ];

  function navigateFromMobileMenu(href: string) {
    setMenuOpen(false);

    if (!href.startsWith("#")) return;

    window.setTimeout(() => {
      const target = document.getElementById(href.slice(1));

      if (!target) return;

      window.history.pushState(null, "", href);
      window.scrollTo({
        top: window.scrollY + target.getBoundingClientRect().top - 80,
        behavior: "instant",
      });
    }, 280);
  }

  return (
    <motion.header
      initial={false}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.7,
        ease: smoothEase,
      }}
      className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <motion.a
          href="#home"
          whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          className="flex min-w-0 items-center gap-3"
        >
          {logo ? (
            <img
              src={logo}
              alt={`Logo ${settings?.website_name || defaultWebsiteName}`}
              className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 bg-white p-1 object-contain"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Factory size={22} />
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-950">
              {settings?.website_name ||
                company?.company_name ||
                defaultWebsiteName}
            </p>

            <p className="truncate text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
              {settings?.tagline ||
                company?.tagline ||
                "Perawatan Forklift & Alat Berat"}
            </p>
          </div>
        </motion.a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link, index) => (
            <motion.a
              key={link.href}
              href={link.href}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: -10,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: shouldReduceMotion ? 0 : 0.25 + index * 0.07,
              }}
              className="text-sm font-medium text-slate-600 transition hover:text-amber-700"
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        {getSectionVisibility(settings?.show_contact) && (
          <motion.a
            href="#contact"
            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            className="hidden items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 lg:inline-flex"
          >
            Hubungi Kami
            <PhoneCall size={16} />
          </motion.a>
        )}

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Tutup navigasi" : "Buka navigasi"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-800 lg:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={menuOpen ? "close" : "menu"}
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      rotate: -45,
                      scale: 0.7,
                    }
              }
              animate={{
                opacity: 1,
                rotate: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                rotate: 45,
                scale: 0.7,
              }}
              transition={{
                duration: 0.18,
              }}
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-navigation"
            aria-label="Navigasi utama"
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    height: 0,
                  }
            }
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
            className="max-h-[calc(100dvh-77px)] overflow-y-auto border-t border-slate-200 bg-white lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
              {links.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => {
                    event.preventDefault();
                    navigateFromMobileMenu(link.href);
                  }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          opacity: 0,
                          x: -12,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.25,
                    delay: shouldReduceMotion ? 0 : index * 0.04,
                  }}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <link.icon
                    size={17}
                    aria-hidden="true"
                    className="mr-3 inline shrink-0 text-amber-700"
                  />
                  {link.label}
                </motion.a>
              ))}
              {getSectionVisibility(settings?.show_contact) && (
                <a
                  href="#contact"
                  onClick={(event) => {
                    event.preventDefault();
                    navigateFromMobileMenu("#contact");
                  }}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
                >
                  <PhoneCall size={17} aria-hidden="true" />
                  Hubungi Kami
                </a>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* =========================================================
   HERO SECTION
========================================================= */

function HeroSection({
  data,
}: {
  data: WebsiteHomeData;
}) {
  const shouldReduceMotion = useReducedMotion();

  const settings = data.settings;
  const company = data.company_profile;

  const name =
    settings?.website_name ||
    company?.company_name ||
    defaultWebsiteName;

  const tagline =
    settings?.tagline ||
    company?.tagline ||
    "Perawatan Forklift & Alat Berat";

  const title =
    settings?.hero_title ||
    "Perawatan forklift yang menjaga";

  const subtitle =
    settings?.hero_subtitle ||
    "operasional tetap lancar.";

  const description =
    settings?.hero_description ||
    settings?.description ||
    company?.description ||
    "Layanan perawatan, perbaikan, penggantian suku cadang, dan rental forklift untuk mendukung operasional bisnis Anda di Batam.";

  const primaryCtaText =
    settings?.hero_primary_cta_text ||
    "Lihat Layanan";

  const primaryCtaUrl =
    settings?.hero_primary_cta_url ||
    "#services";

  const secondaryCtaText =
    settings?.hero_secondary_cta_text ||
    "Hubungi Kami";

  const secondaryCtaUrl =
    settings?.hero_secondary_cta_url ||
    "#contact";

  const heroImage = getWebsiteImageUrl(
    settings?.hero_image || data.projects[0]?.image
  );
  const heroVideoUrl =
    "https://videos.pexels.com/video-files/5100051/5100051-uhd_2560_1440_30fps.mp4";
  const heroVideoPoster =
    "https://images.pexels.com/videos/5100051/pexels-photo-5100051.jpeg";

  return (
    <section
      id="home"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[#081426] pt-28 text-white"
    >
      {shouldReduceMotion ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${heroImage || heroVideoPoster}")`,
          }}
        />
      ) : (
        <video
          aria-hidden="true"
          autoPlay
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-50"
          loop
          muted
          playsInline
          poster={heroImage || heroVideoPoster}
          preload="metadata"
          tabIndex={-1}
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(5,15,29,0.9)_0%,rgba(7,20,37,0.72)_55%,rgba(7,20,37,0.65)_100%)]"
      />

      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                x: [0, 18, 0],
                y: [0, -15, 0],
                rotate: [0, 5, 0],
              }
        }
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-40 top-20 z-[2] h-[480px] w-[480px] rounded-full border border-amber-300/10"
      />

      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                x: [0, -12, 0],
                y: [0, 12, 0],
              }
        }
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-20 top-40 z-[2] h-[320px] w-[320px] rounded-full border border-amber-300/10"
      />

      <div className="relative z-[3] mx-auto grid min-h-[610px] max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
        <div className="max-w-2xl">
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 25,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: smoothEase,
            }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200"
          >
            <motion.span
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      opacity: [1, 0.4, 1],
                      scale: [1, 1.2, 1],
                    }
              }
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="h-2 w-2 rounded-full bg-amber-400"
            />
            {tagline}
          </motion.div>

          <motion.h1
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 35,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.35,
              ease: smoothEase,
            }}
            className="text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {title}

            <span className="mt-2 block text-amber-400">
              {subtitle}
            </span>
          </motion.h1>

          <motion.p
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 25,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: smoothEase,
            }}
            className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg"
          >
            {description}
          </motion.p>

          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 25,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.65,
              ease: smoothEase,
            }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <motion.a
              href={primaryCtaUrl}
              whileHover={shouldReduceMotion ? undefined : { y: -3 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              className="inline-flex items-center justify-center gap-3 rounded-lg bg-amber-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-amber-950/30 transition hover:-translate-y-1 hover:bg-amber-500"
            >
              {primaryCtaText}
              <ArrowRight size={17} />
            </motion.a>

            <motion.a
              href={secondaryCtaUrl}
              whileHover={shouldReduceMotion ? undefined : { y: -3 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              className="inline-flex items-center justify-center gap-3 rounded-lg border border-white/20 px-6 py-4 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/10"
            >
              {secondaryCtaText}
              <ArrowUpRight size={17} />
            </motion.a>
          </motion.div>

          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              ease: smoothEase,
            }}
            className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-7"
          >
            <div>
              <p className="text-2xl font-bold text-white">
                {data.services.length.toString().padStart(2, "0")}+
              </p>
              <p className="mt-1 text-xs text-slate-400">Layanan</p>
            </div>

            <div className="h-10 w-px bg-white/10" />

            <div>
              <p className="text-2xl font-bold text-white">
                {data.projects.length.toString().padStart(2, "0")}+
              </p>
              <p className="mt-1 text-xs text-slate-400">Proyek</p>
            </div>

            <div className="h-10 w-px bg-white/10" />

            <div>
              <p className="text-2xl font-bold text-white">
                {company?.established_year || "—"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {company?.established_year ? "Berdiri sejak" : "Berpengalaman"}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  scale: 0.9,
                  x: 35,
                }
          }
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.45,
            ease: smoothEase,
          }}
          className="relative mx-auto w-full max-w-xl"
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: [0.5, 0.9, 0.5],
                    scale: [0.95, 1.05, 0.95],
                  }
            }
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -inset-5 rounded-[32px] bg-amber-500/10 blur-2xl"
          />

          <motion.div
            whileHover={shouldReduceMotion ? undefined : { y: -6 }}
            transition={{
              duration: 0.35,
            }}
            className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] p-3 shadow-2xl shadow-black/30 backdrop-blur"
          >
            <div
              className="relative flex min-h-[390px] flex-col justify-between overflow-hidden rounded-[20px] bg-[#09172a]/60 p-7 backdrop-blur-sm sm:min-h-[440px] sm:p-9"
            >
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[35px] border-amber-300/10" />
              <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full border-[45px] border-amber-300/[0.07]" />

              <div className="relative">
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          rotate: [0, 5, 0, -5, 0],
                        }
                  }
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-200/20 bg-amber-300/10 text-amber-300"
                >
                  <Forklift size={28} aria-hidden="true" />
                </motion.div>

                <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
                  {name}
                </p>

                <h2 className="mt-4 max-w-sm text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Perawatan forklift andal untuk mendukung kelancaran operasional.
                </h2>
              </div>

              <div className="relative mt-12 grid grid-cols-2 gap-3">
                <motion.div
                  whileHover={shouldReduceMotion ? undefined : cardHover}
                  className="rounded-xl border border-white/10 bg-white/[0.07] p-4"
                >
                  <Wrench className="mb-3 text-amber-300" size={22} />
                  <p className="text-sm font-semibold text-white">
                    Keahlian teknis
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Penanganan profesional
                  </p>
                </motion.div>

                <motion.div
                  whileHover={shouldReduceMotion ? undefined : cardHover}
                  className="rounded-xl border border-white/10 bg-white/[0.07] p-4"
                >
                  <ShieldCheck className="mb-3 text-amber-300" size={22} />
                  <p className="text-sm font-semibold text-white">
                    Andal
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Fokus pada kualitas
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 15,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 1,
            }}
            className="absolute -bottom-5 -left-5 hidden rounded-xl border border-white/10 bg-white px-5 py-4 shadow-xl sm:block"
          >
            <p className="text-xs font-semibold text-slate-500">
              Komitmen Kami
            </p>
            <p className="mt-1 text-sm font-bold text-slate-950">
              Kualitas. Keselamatan. Keandalan.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-[3] h-1 w-full bg-gradient-to-r from-amber-700 via-amber-400 to-amber-300" />
    </section>
  );
}

/* =========================================================
   ABOUT SECTION
========================================================= */

function AboutSection({
  data,
}: {
  data: WebsiteHomeData;
}) {
  const shouldReduceMotion = useReducedMotion();
  const company = data.company_profile;
  const settings = data.settings;

  const description =
    settings?.about_description ||
    company?.description ||
    settings?.description ||
    "PT Atha Yasa Mandiri melayani kebutuhan maintenance, perbaikan, penggantian suku cadang, dan rental forklift di Batam. Kami membantu menjaga peralatan kerja tetap siap mendukung kegiatan operasional.";

  const missions =
    company?.mission
      ?.split(/\r?\n/)
      .map((item) => item.replace(/^[-•\d.)\s]+/, "").trim())
      .filter(Boolean) ?? [];

  return (
    <section id="about" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:px-10">
        <div>
          <SectionHeading
            eyebrow="Tentang Perusahaan"
            title={
              settings?.about_title ||
              "Mitra perawatan forklift dan alat berat di Batam"
            }
            description={<CompanyNameText value={description} />}
          />

          {company?.vision && (
            <Reveal delay={0.15}>
              <div className="mt-9 rounded-2xl border-l-4 border-amber-600 bg-slate-50 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                  Visi Kami
                </p>

                <p className="mt-3 leading-7 text-slate-700">
                  {company.vision}
                </p>
              </div>
            </Reveal>
          )}

          {missions.length > 0 && (
            <Reveal delay={0.25}>
              <div className="mt-7">
                <p className="mb-4 text-sm font-bold text-slate-950">
                  Misi Kami
                </p>

                <div className="space-y-3">
                  {missions.map((mission, index) => (
                    <motion.div
                      key={`${index}-${mission}`}
                      initial={shouldReduceMotion ? false : { opacity: 0, x: -15 }}
                      whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                      }}
                      className="flex gap-3"
                    >
                      <CheckCircle2
                        size={19}
                        className="mt-0.5 shrink-0 text-amber-600"
                      />

                      <p className="text-sm leading-6 text-slate-600">
                        {mission}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          <Reveal delay={0.3}>
            <motion.a
              href="#contact"
              whileHover={shouldReduceMotion ? undefined : { x: 4 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-amber-700 transition hover:gap-3"
            >
              Kenali Kami Lebih Lanjut
              <ArrowRight size={17} />
            </motion.a>
          </Reveal>
        </div>

        <Reveal y={45} delay={0.15}>
          <motion.div
            whileHover={shouldReduceMotion ? undefined : {
              y: -6,
            }}
            transition={{
              duration: 0.35,
            }}
            className="relative"
          >
            <div className="rounded-[28px] bg-slate-100 p-5 sm:p-8">
              <div className="rounded-2xl bg-[#0b1c32] p-8 text-white sm:p-10">
                <Forklift
                  size={38}
                  className="text-amber-400"
                  aria-hidden="true"
                />

                <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                  <CompanyNameText
                    value={company?.company_name || defaultWebsiteName}
                  />
                </p>

                <h3 className="mt-4 text-3xl font-bold leading-tight">
                  Solusi perawatan untuk kebutuhan industri.
                </h3>

                <p className="mt-5 text-sm leading-7 text-slate-300">
                  {company?.tagline ||
                    settings?.tagline ||
                    "Perawatan Forklift & Alat Berat"}
                </p>

                <div className="mt-9 border-t border-white/10 pt-6">
                  <p className="text-xs text-slate-400">Berdiri sejak</p>

                  <p className="mt-1 text-2xl font-bold">
                    {company?.established_year || "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-3 rounded-xl bg-amber-600 px-5 py-4 text-white shadow-xl sm:-right-5">
              <p className="text-xs text-amber-100">Fokus Kami</p>
              <p className="mt-1 text-sm font-bold">
                Kualitas & Keandalan
              </p>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
   SERVICES SECTION
========================================================= */

function ServicesSection({
  services,
}: {
  services: WebsiteService[];
}) {
  const shouldReduceMotion = useReducedMotion();
  const midpoint = Math.ceil(services.length / 2);
  const serviceRows = [
    services.slice(0, midpoint),
    services.slice(midpoint),
  ].filter((row) => row.length > 0);

  const renderServices = (
    items: WebsiteService[],
    duplicate = false,
    indexOffset = 0,
  ) => (
    <div
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 gap-5 pr-5"
    >
      {items.map((service, index) => (
        <div
          key={`${duplicate ? "duplicate-" : ""}${service.id}`}
          className="w-[min(82vw,26rem)] shrink-0"
          inert={duplicate || undefined}
        >
          <ServiceCard service={service} index={index + indexOffset} />
        </div>
      ))}
    </div>
  );

  return (
    <section id="services" className="scroll-mt-20 bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Layanan Kami"
            title="Perawatan dan dukungan forklift untuk bisnis Anda"
            description="Pilih dukungan sesuai kebutuhan operasional: perawatan berkala, pemeriksaan dan perbaikan, penggantian suku cadang, hingga rental forklift. Setiap kebutuhan dapat dikonsultasikan berdasarkan kondisi unit dan pekerjaan Anda."
          />

          <Reveal delay={0.15}>
            <a
              href="#contact"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-amber-700 transition hover:gap-3"
            >
              Konsultasikan Kebutuhan Anda
              <ArrowRight size={17} />
            </a>
          </Reveal>
        </div>

        {services.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Wrench className="mx-auto text-slate-400" size={30} />

            <p className="mt-4 font-semibold text-slate-800">
              Layanan segera hadir
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Informasi layanan akan segera tersedia.
            </p>
          </div>
        ) : (
          <div className="service-marquee mt-12 space-y-5 overflow-hidden">
            {serviceRows.map((row, rowIndex) => {
              const items = row.length === 1 ? [...row, ...row] : row;

              return (
                <div
                  key={rowIndex}
                  role="group"
                  className="service-marquee-row overflow-hidden"
                  aria-label={`Baris layanan ${rowIndex + 1}`}
                >
                  <motion.div
                    animate={{
                      x: shouldReduceMotion
                        ? 0
                        : rowIndex % 2 === 0
                          ? ["-50%", "0%"]
                          : ["0%", "-50%"],
                    }}
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : {
                            duration: 38 + rowIndex * 4,
                            ease: "linear",
                            repeat: Infinity,
                          }
                    }
                    className="service-carousel-track flex w-max"
                  >
                    {renderServices(items, false, rowIndex * midpoint)}
                    {renderServices(items, true, rowIndex * midpoint)}
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}

        {services.length > 0 && (
          <p className="mt-7 text-center text-sm leading-6 text-slate-500">
            Konsultasikan jenis unit, kondisi pekerjaan, dan jadwal yang
            dibutuhkan agar tim kami dapat membantu menentukan layanan yang
            sesuai.
          </p>
        )}
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: WebsiteService;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const image = getWebsiteImageUrl(service.image);

  return (
    <motion.article
      whileHover={shouldReduceMotion ? undefined : cardHover}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors duration-300 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-950/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={`${service.title} - PT Atha Yasa Mandiri`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#102744] to-[#1c4778]">
            <ServiceIcon service={service} size={42} className="text-amber-200" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-slate-950/75 to-transparent px-5 pb-4 pt-12">
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
            Layanan {String(index + 1).padStart(2, "0")}
          </span>
          <ServiceIcon service={service} size={17} className="text-amber-300" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg font-bold leading-snug text-slate-950 sm:text-xl">
          {service.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {service.short_description ||
            service.description ||
            "Hubungi tim kami untuk mengetahui informasi lebih lanjut mengenai layanan ini."}
        </p>

        {service.description && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Cakupan layanan
            </p>
            <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">
              {service.description}
            </p>
          </div>
        )}

        <a
          href="#contact"
          className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-amber-800 transition hover:gap-3 hover:text-amber-900"
        >
          Konsultasikan layanan
          <ArrowUpRight size={16} />
        </a>
      </div>
    </motion.article>
  );
}

/* =========================================================
   PROJECTS SECTION
========================================================= */

function ProjectsSection({
  projects,
}: {
  projects: WebsiteProject[];
}) {
  const shouldReduceMotion = useReducedMotion();
  const midpoint = Math.ceil(projects.length / 2);
  const projectRows = [
    projects.slice(0, midpoint),
    projects.slice(midpoint),
  ].filter((row) => row.length > 0);

  const renderProjects = (items: WebsiteProject[], duplicate = false) => (
    <div
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 gap-5 pr-5"
    >
      {items.map((project) => (
        <div
          key={`${duplicate ? "duplicate-" : ""}${project.id}`}
          className="w-[min(82vw,26rem)] shrink-0"
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );

  return (
    <section id="projects" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Portofolio"
          title="Pekerjaan dan pengalaman kami"
          description="Dokumentasi pekerjaan perawatan dan perbaikan forklift yang telah kami tangani."
        />

        {projects.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <BriefcaseBusiness className="mx-auto text-slate-400" size={30} />

            <p className="mt-4 font-semibold text-slate-800">
              Project portfolio coming soon
            </p>
          </div>
        ) : (
          <div className="project-marquee mt-12 space-y-5 overflow-hidden">
            {projectRows.map((row, rowIndex) => {
              const items = row.length === 1 ? [...row, ...row] : row;

              return (
                <div
                  key={rowIndex}
                  role="group"
                  className="project-marquee-row overflow-hidden"
                  aria-label={`Baris portofolio ${rowIndex + 1}`}
                >
                  <motion.div
                    animate={{
                      x: shouldReduceMotion
                        ? 0
                        : rowIndex % 2 === 0
                          ? ["-50%", "0%"]
                          : ["0%", "-50%"],
                    }}
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : {
                            duration: 38 + rowIndex * 4,
                            ease: "linear",
                            repeat: Infinity,
                          }
                    }
                    className="project-carousel-track flex w-max"
                  >
                    {renderProjects(items)}
                    {renderProjects(items, true)}
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
}: {
  project: WebsiteProject;
}) {
  const shouldReduceMotion = useReducedMotion();
  const image = getWebsiteImageUrl(project.image);
  const year = formatYear(project.completed_at);

  return (
    <motion.article
      whileHover={shouldReduceMotion ? undefined : cardHover}
      className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-amber-200 hover:shadow-xl hover:shadow-slate-200/70"
    >
      <div className="relative h-56 overflow-hidden bg-slate-100">
        {image ? (
          <img
            src={image}
            alt={project.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#102744] to-[#1c4778]">
            <BriefcaseBusiness size={42} className="text-amber-200" />
          </div>
        )}

        {project.is_featured && (
          <span className="absolute left-4 top-4 rounded-full bg-amber-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Pilihan
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
          {project.client_name && <span>{project.client_name}</span>}
          {project.location && <span>{project.location}</span>}
          {year && <span>{year}</span>}
        </div>

        <h3 className="mt-3 text-xl font-bold text-slate-950">
          {project.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
          {project.short_description ||
            project.description ||
            "Learn more about this project."}
        </p>
      </div>
    </motion.article>
  );
}

/* =========================================================
   CUSTOMERS SECTION
========================================================= */

function CustomersSection({ customers }: { customers: WebsiteCustomer[] }) {
  const shouldReduceMotion = useReducedMotion();
  if (customers.length === 0) return null;

  const renderCustomers = (duplicate = false) => (
    <div
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 gap-5 pr-5"
    >
      {customers.map((customer, index) => {
        const logo = getWebsiteImageUrl(customer.logo);
        const card = (
          <div className="flex h-48 w-[min(78vw,18rem)] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:border-amber-200 hover:shadow-lg">
            <div className="flex h-16 w-full items-center justify-center">
              {logo ? (
                <img
                  src={logo}
                  alt={duplicate ? "" : customer.name}
                  aria-hidden={duplicate || undefined}
                  className="max-h-14 max-w-full object-contain grayscale transition duration-300 hover:grayscale-0"
                />
              ) : (
                <Building2 size={30} className="text-slate-400" />
              )}
            </div>
            <p className="mt-3 text-sm font-bold text-slate-800">
              {customer.name}
            </p>
            {customer.short_description && (
              <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">
                {customer.short_description}
              </p>
            )}
          </div>
        );

        return customer.website_url ? (
          <a
            key={`${customer.id}-${index}`}
            href={customer.website_url}
            target="_blank"
            rel="noreferrer"
            tabIndex={duplicate ? -1 : undefined}
            className="block shrink-0"
          >
            {card}
          </a>
        ) : (
          <div key={`${customer.id}-${index}`} className="shrink-0">
            {card}
          </div>
        );
      })}
    </div>
  );

  return (
    <section id="customers" className="scroll-mt-20 border-y border-slate-200 bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Pelanggan Kami"
          title="Bertumbuh bersama pelanggan"
          description="Kami bangga dapat mendukung kebutuhan perawatan forklift dan alat berat berbagai perusahaan."
        />

        <div className="customer-marquee mt-8 overflow-hidden">
          <motion.div
            animate={{
              x: shouldReduceMotion ? 0 : ["-50%", "0%"],
            }}
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: 36,
                    ease: "linear",
                    repeat: Infinity,
                  }
            }
            className="customer-carousel-track flex w-max"
          >
            {renderCustomers()}
            {renderCustomers(true)}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   WHY CHOOSE US
========================================================= */

function WhyChooseUsSection({
  settings,
}: {
  settings: WebsiteHomeData["settings"];
}) {
  const shouldReduceMotion = useReducedMotion();
  const reasons = [
    {
      icon: settings?.reason_1_icon || "wrench",
      title: settings?.reason_1_title || "Teknisi berpengalaman dan tersertifikasi",
      description:
        settings?.reason_1_description ||
        "Didukung teknisi berpengalaman dan tersertifikasi untuk membantu pemeriksaan, perawatan, serta perbaikan forklift sesuai kebutuhan unit.",
    },
    {
      icon: settings?.reason_2_icon || "forklift",
      title: settings?.reason_2_title || "Layanan forklift terintegrasi",
      description:
        settings?.reason_2_description ||
        "Perawatan berkala, perbaikan, penggantian suku cadang, hingga rental dalam satu rangkaian layanan agar kebutuhan unit lebih praktis dikoordinasikan.",
    },
    {
      icon: settings?.reason_3_icon || "clock-3",
      title: settings?.reason_3_title || "Responsif dan mengutamakan ketepatan waktu",
      description:
        settings?.reason_3_description ||
        "Komunikasi yang jelas dan penanganan tepat waktu membantu pelanggan merencanakan layanan serta menjaga kelancaran operasional.",
    },
  ];

  return (
    <section className="bg-[#0b1c32] py-24 text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Mengapa Athayasa"
          title={settings?.why_title || "Dukungan andal untuk operasional forklift"}
          description="Berbasis di Batam, Athayasa mendukung kebutuhan perawatan dan perbaikan forklift dengan fokus pada keahlian teknis, cakupan layanan yang praktis, serta kelancaran operasional pelanggan."
          light
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {reasons.map((reason, index) => {
            const Icon = getReasonIcon(reason.icon, reason.title);

            return (
              <Reveal
                key={index}
                delay={index * 0.15}
              >
                <motion.div
                  whileHover={shouldReduceMotion ? undefined : cardHover}
                  className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-7 transition-colors hover:border-amber-400/40 hover:bg-white/[0.07]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                    <Icon size={24} />
                  </div>

                  <p className="mt-7 text-xs font-bold tracking-[0.16em] text-amber-300">
                    0{index + 1}
                  </p>

                  <h3 className="mt-3 text-xl font-bold">
                    {reason.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {reason.description}
                  </p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   ARTICLES SECTION
========================================================= */

function ArticlesSection({
  articles,
}: {
  articles: WebsiteArticle[];
}) {
  return (
    <section id="articles" className="scroll-mt-20 bg-[#fffaf2] py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Wawasan & Informasi"
          title="Panduan merawat forklift dan alat berat"
          description="Artikel praktis untuk membantu tim memahami perawatan, keselamatan, suku cadang, dan pemilihan forklift."
        />

        {articles.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-semibold text-slate-800">
              Artikel segera hadir
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Artikel dan informasi perusahaan akan ditampilkan di sini.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article, index) => (
              <Reveal
                key={article.id}
                delay={index * 0.12}
              >
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ArticleCard({
  article,
}: {
  article: WebsiteArticle;
}) {
  const shouldReduceMotion = useReducedMotion();
  const image = getWebsiteImageUrl(article.cover_image);

  return (
    <motion.article
      whileHover={shouldReduceMotion ? undefined : cardHover}
      className="group h-full overflow-hidden rounded-2xl border border-amber-100 bg-white transition-colors hover:border-amber-300 hover:shadow-xl hover:shadow-amber-900/10"
    >
      <div className="relative h-52 overflow-hidden bg-slate-200">
        {image ? (
          <img
            src={image}
            alt={article.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#102744] to-[#1c4778]">
            <BookOpenText size={36} className="text-amber-200" />
          </div>
        )}
        {article.image_credit && (
          <div className="absolute inset-x-0 bottom-0 bg-slate-950/75 px-4 py-2 backdrop-blur-sm">
            {article.image_source_url ? (
              <a
                href={article.image_source_url}
                target="_blank"
                rel="noreferrer"
                className="block truncate text-[10px] font-medium text-white/90 transition hover:text-amber-200"
                title={`Kredit foto: ${article.image_credit}`}
              >
                Foto: {article.image_credit}
              </a>
            ) : (
              <p className="truncate text-[10px] font-medium text-white/90">
                Foto: {article.image_credit}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {article.category && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 font-semibold text-amber-800">
              <ArticleTopicIcon article={article} size={13} />
              {article.category}
            </span>
          )}

          {article.published_at && (
            <span>
              {new Date(article.published_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>

        <h3 className="mt-4 line-clamp-2 text-xl font-bold text-slate-950 transition-colors group-hover:text-amber-700">
          {article.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
          {article.summary || "Baca informasi selengkapnya mengenai artikel ini."}
        </p>

        {article.author && (
          <p className="mt-4 text-xs text-slate-400">
            Oleh <CompanyNameText value={article.author} />
          </p>
        )}

        <Link
          href={`/artikel/${encodeURIComponent(article.slug)}`}
          className="mt-5 inline-flex items-center gap-2 border-t border-amber-100 pt-4 text-sm font-bold text-amber-800 transition hover:gap-3 hover:text-amber-950"
        >
          Baca selengkapnya
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </motion.article>
  );
}

/* =========================================================
   CONTACT SECTION
========================================================= */

function ContactSection({
  data,
}: {
  data: WebsiteHomeData;
}) {
  const shouldReduceMotion = useReducedMotion();
  const company = data.company_profile;
  const settings = data.settings;

  const whatsapp = settings?.whatsapp_url;
  const email = company?.email;
  const phone = company?.phone;

  return (
    <section id="contact" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <Reveal y={35}>
          <motion.div
            whileHover={shouldReduceMotion ? undefined : {
              y: -4,
            }}
            transition={{
              duration: 0.35,
            }}
            className="overflow-hidden rounded-[28px] bg-[#0b1c32]"
          >
            <div className="grid lg:grid-cols-[1fr_0.8fr]">
              <div className="p-8 sm:p-12 lg:p-14">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                  Hubungi Kami
                </p>

                <h2 className="mt-5 max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Mari diskusikan kebutuhan forklift Anda.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
                  Sampaikan kebutuhan perawatan, perbaikan, atau rental forklift
                  Anda. Tim kami siap membantu memberikan informasi lebih lanjut.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  {whatsapp && (
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-amber-500"
                    >
                      Hubungi melalui WhatsApp
                      <ArrowUpRight size={16} />
                    </a>
                  )}

                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/10"
                    >
                      Kirim Email
                      <Mail size={16} />
                    </a>
                  )}
                </div>
              </div>

              <div className="border-t border-white/10 bg-white/[0.04] p-8 sm:p-12 lg:border-l lg:border-t-0">
                <p className="text-sm font-bold text-white">
                  Informasi Perusahaan
                </p>

                <div className="mt-7 space-y-6">
                  {company?.address && (
                    <div className="flex gap-4">
                      <MapPin
                        className="mt-1 shrink-0 text-amber-300"
                        size={19}
                      />

                      <div>
                        <p className="text-xs text-slate-400">
                          Alamat Kantor
                        </p>

                        <p className="mt-1 text-sm leading-6 text-white">
                          {company.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {phone && (
                    <div className="flex gap-4">
                      <Phone
                        className="mt-1 shrink-0 text-amber-300"
                        size={19}
                      />

                      <div>
                        <p className="text-xs text-slate-400">Telepon</p>

                        <a
                          href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                          className="mt-1 block text-sm text-white transition hover:text-amber-300"
                        >
                          {phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {email && (
                    <div className="flex gap-4">
                      <Mail
                        className="mt-1 shrink-0 text-amber-300"
                        size={19}
                      />

                      <div>
                        <p className="text-xs text-slate-400">Email</p>

                        <a
                          href={`mailto:${email}`}
                          className="mt-1 block break-all text-sm text-white transition hover:text-amber-300"
                        >
                          {email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-9 border-t border-white/10 pt-6">
                  <p className="text-xs leading-6 text-slate-400">
                    <CompanyNameText
                      value={
                        company?.company_name ||
                        settings?.website_name ||
                        defaultWebsiteName
                      }
                    />
                  </p>

                  <p className="text-xs text-slate-500">
                    {company?.tagline ||
                      settings?.tagline ||
                      "Perawatan Forklift & Alat Berat"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================
   FOOTER
========================================================= */


function Footer({
  data,
}: {
  data: WebsiteHomeData;
}) {
  const shouldReduceMotion = useReducedMotion();
  const settings = data.settings;
  const company = data.company_profile;

  const name =
    settings?.website_name ||
    company?.company_name ||
    defaultWebsiteName;

  const socialLinks = [
    {
      label: "Instagram",
      url: settings?.instagram_url,
    },
    {
      label: "Facebook",
      url: settings?.facebook_url,
    },
    {
      label: "LinkedIn",
      url: settings?.linkedin_url,
    },
  ].filter(
    (item): item is { label: string; url: string } =>
      Boolean(item.url)
  );

  return (
    <motion.footer
      initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.1,
      }}
      transition={{
        duration: 0.7,
        ease: smoothEase,
      }}
      className="scroll-mt-20 bg-[#071426] text-white"
    >
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        {/* Main Footer */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          {/* Company Information */}
          <div>
            <p className="text-base font-bold">
              <CompanyNameText value={name} />
            </p>

            <p className="mt-2 text-xs text-slate-400">
              {settings?.tagline ||
                company?.tagline ||
                "Perawatan Forklift & Alat Berat"}
            </p>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-5">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-slate-400 transition hover:-translate-y-1 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}

          {/* Copyright */}
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} <CompanyNameText value={name} />.
            Hak cipta dilindungi.
          </p>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-white/[0.08] pt-5 sm:flex-row">
          <p className="text-[11px] text-slate-600">
            Layanan perawatan dan perbaikan forklift di Batam.
          </p>

          <a
            href="/login"
            className="text-xs font-medium text-slate-500 transition hover:text-indigo-400"
          >
            Masuk Admin
          </a>
        </div>
      </div>
    </motion.footer>
  );
}


/* =========================================================
   MAIN WEBSITE PAGE
========================================================= */

export default function WebsitePage({
  initialData,
}: {
  initialData: WebsiteHomeData;
}) {
  const data = initialData;
  const settings = data.settings;

  return (
    <main className="landing-page min-h-screen bg-white font-sans">
      <Navbar data={data} />

      <HeroSection data={data} />

      {getSectionVisibility(settings?.show_about) && (
        <AboutSection data={data} />
      )}

      {getSectionVisibility(settings?.show_services) && (
        <ServicesSection services={data.services} />
      )}

      {getSectionVisibility(settings?.show_projects) && (
        <ProjectsSection projects={data.projects} />
      )}

      {getSectionVisibility(settings?.show_customers) && (
        <CustomersSection customers={data.customers || []} />
      )}

      {getSectionVisibility(settings?.show_why_choose_us) && (
        <WhyChooseUsSection settings={settings} />
      )}

      {getSectionVisibility(settings?.show_articles) && (
        <ArticlesSection articles={data.articles} />
      )}

      {getSectionVisibility(settings?.show_contact) && (
        <ContactSection data={data} />
      )}

      <Footer data={data} />
    </main>
  );
}
