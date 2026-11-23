
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import WebsitePage from "@/features/website/page";
import {
  getPublicSiteUrl,
  getPublicWebsiteHome,
  getPublicArticleImageUrl,
} from "@/lib/website-articles";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPublicWebsiteHome();
  const name =
    data.settings?.website_name ||
    data.company_profile?.company_name ||
    "PT Atha Yasa Mandiri";
  const title = `Perawatan Forklift Batam | ${name}`;
  const description =
    data.settings?.description ||
    data.settings?.hero_description ||
    data.company_profile?.description ||
    "Layanan perawatan, perbaikan, penggantian suku cadang, dan rental forklift PT Atha Yasa Mandiri di Batam.";
  const image = getPublicArticleImageUrl(
    data.settings?.hero_image || data.settings?.logo
  );
  const siteUrl = getPublicSiteUrl();

  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      title,
      description,
      url: siteUrl,
      siteName: name,
      locale: "id_ID",
      images: image ? [{ url: image, alt: name }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Page() {
  const data = await getPublicWebsiteHome();
  const company = data.company_profile;
  const settings = data.settings;
  const siteUrl = getPublicSiteUrl();
  const logo = getPublicArticleImageUrl(settings?.logo);
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name: company?.company_name || settings?.website_name || "PT Atha Yasa Mandiri",
    description:
      company?.description ||
      settings?.description ||
      "Layanan perawatan, perbaikan, penggantian suku cadang, dan rental forklift di Batam.",
    url: siteUrl,
    telephone: company?.phone || undefined,
    email: company?.email || undefined,
    image: logo || undefined,
    logo: logo || undefined,
    address: company?.address
      ? {
          "@type": "PostalAddress",
          streetAddress: company.address,
          addressLocality: "Batam",
          addressRegion: "Kepulauan Riau",
          addressCountry: "ID",
        }
      : undefined,
    areaServed: {
      "@type": "City",
      name: "Batam",
    },
    sameAs: [
      settings?.instagram_url,
      settings?.facebook_url,
      settings?.linkedin_url,
    ].filter((url): url is string => Boolean(url)),
    knowsAbout: data.services.map((service) => service.title),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessSchema).replace(/</g, "\\u003c"),
        }}
      />
      <Suspense fallback={<HomepageSeoFallback data={data} />}>
        <WebsitePage initialData={data} />
      </Suspense>
    </>
  );
}

function HomepageSeoFallback({
  data,
}: {
  data: Awaited<ReturnType<typeof getPublicWebsiteHome>>;
}) {
  const company = data.company_profile;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 px-5 py-5 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-bold">{company?.company_name || "PT Atha Yasa Mandiri"}</p>
          <p className="mt-1 text-sm text-slate-600">
            Perawatan Forklift &amp; Alat Berat di Batam
          </p>
        </div>
      </header>
      <section className="bg-[#102744] px-5 py-16 text-white sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
            Perawatan Forklift &amp; Alat Berat di Batam
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
            {company?.description ||
              "Layanan perawatan, perbaikan, penggantian suku cadang, dan rental forklift untuk mendukung kelancaran operasional bisnis di Batam."}
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <h2 className="text-3xl font-bold">Layanan Forklift Kami</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.services.map((service) => (
            <li
              key={service.id}
              className="rounded-xl border border-slate-200 p-5"
            >
              <h3 className="font-bold">{service.title}</h3>
              {service.short_description && (
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {service.short_description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
      <section className="bg-[#fffaf2] px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold">
            Panduan Perawatan Forklift dan Alat Berat
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.articles.map((article) => (
              <li
                key={article.id}
                className="rounded-xl border border-amber-100 bg-white p-5"
              >
                <h3 className="font-bold">
                  <Link
                    href={`/artikel/${encodeURIComponent(article.slug)}`}
                    className="text-slate-900 underline decoration-amber-500 underline-offset-4"
                  >
                    {article.title}
                  </Link>
                </h3>
                {article.summary && (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {article.summary}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <footer className="mx-auto max-w-7xl px-5 py-8 text-sm text-slate-600 sm:px-8">
        <p>{company?.address || "Batam, Kepulauan Riau, Indonesia"}</p>
        {company?.phone && <p className="mt-1">{company.phone}</p>}
        {company?.email && <p className="mt-1">{company.email}</p>}
      </footer>
    </main>
  );
}
