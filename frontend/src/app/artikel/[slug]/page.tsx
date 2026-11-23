import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import { notFound } from "next/navigation";

import {
  getPublicArticle,
  getPublicArticleImageUrl,
  getPublicSiteUrl,
} from "@/lib/website-articles";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const instant = false;

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublicArticle(slug);

  if (!article) {
    return { title: "Artikel tidak ditemukan" };
  }

  const description =
    article.meta_description ||
    article.summary ||
    `Baca artikel ${article.title} dari PT Atha Yasa Mandiri.`;
  const image = getPublicArticleImageUrl(article.cover_image);
  const canonical = `/artikel/${encodeURIComponent(article.slug)}`;

  return {
    title: article.seo_title || article.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: article.seo_title || article.title,
      description,
      url: canonical,
      siteName: "PT Atha Yasa Mandiri",
      locale: "id_ID",
      publishedTime: article.published_at || undefined,
      authors: article.author ? [article.author] : undefined,
      images: image ? [{ url: image, alt: article.title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: article.seo_title || article.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getPublicArticle(slug);

  if (!article) notFound();

  const image = getPublicArticleImageUrl(article.cover_image);
  const contentBlocks = (article.body || "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const canonicalUrl = `${getPublicSiteUrl()}/artikel/${encodeURIComponent(article.slug)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description:
      article.meta_description ||
      article.summary ||
      `Baca artikel ${article.title} dari PT Atha Yasa Mandiri.`,
    mainEntityOfPage: canonicalUrl,
    image: image ? [image] : undefined,
    datePublished: article.published_at || undefined,
    dateModified: article.updated_at || article.published_at || undefined,
    author: {
      "@type": "Organization",
      name: article.author || "PT Atha Yasa Mandiri",
    },
    publisher: {
      "@type": "Organization",
      name: "PT Atha Yasa Mandiri",
      url: getPublicSiteUrl(),
    },
    articleSection: article.category || undefined,
  };

  return (
    <main className="min-h-screen bg-[#fffaf2] text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-16">
        <Link
          href="/#articles"
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800 transition hover:gap-3 hover:text-amber-950"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Kembali ke artikel
        </Link>

        <article className="mt-8 overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-xl shadow-amber-950/5">
          {image && (
            <figure>
              <Image
                src={image}
                alt={article.title}
                width={1600}
                height={900}
                unoptimized
                className="max-h-[34rem] w-full bg-slate-100 object-cover"
              />
              {article.image_credit && (
                <figcaption className="bg-slate-950 px-5 py-3 text-xs leading-5 text-white/80">
                  Foto:{" "}
                  {article.image_source_url ? (
                    <a
                      href={article.image_source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-white/40 underline-offset-2 hover:text-amber-200"
                    >
                      {article.image_credit}
                    </a>
                  ) : (
                    article.image_credit
                  )}
                </figcaption>
              )}
            </figure>
          )}

          <div className="px-6 py-8 sm:px-10 sm:py-12">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              {article.category && (
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 font-semibold text-amber-900">
                  <Newspaper size={15} aria-hidden="true" />
                  {article.category}
                </span>
              )}
              {article.published_at && (
                <time
                  dateTime={article.published_at}
                  className="inline-flex items-center gap-2"
                >
                  <CalendarDays size={15} aria-hidden="true" />
                  {new Date(article.published_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "Asia/Jakarta",
                  })}
                </time>
              )}
            </div>

            <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl">
              {article.title}
            </h1>

            {article.author && (
              <p className="mt-5 text-sm text-slate-500">
                Oleh <span className="font-semibold">{article.author}</span>
              </p>
            )}

            {article.summary && (
              <p className="mt-8 border-l-4 border-amber-500 pl-5 text-lg leading-8 text-slate-700">
                {article.summary}
              </p>
            )}

            <div className="mt-8 space-y-5 text-base leading-8 text-slate-700 sm:text-lg sm:leading-9">
              {contentBlocks.length > 0 ? (
                contentBlocks.map((block, index) => {
                  if (block.startsWith("## ")) {
                    return (
                      <h2
                        key={`${article.id}-heading-${index}`}
                        className="pt-4 text-2xl font-bold leading-tight text-slate-950"
                      >
                        {block.slice(3)}
                      </h2>
                    );
                  }

                  return (
                    <p key={`${article.id}-paragraph-${index}`}>{block}</p>
                  );
                })
              ) : (
                <p>
                  Informasi lengkap mengenai artikel ini belum tersedia.
                  Silakan hubungi tim PT Atha Yasa Mandiri untuk mendapatkan
                  informasi lebih lanjut.
                </p>
              )}
            </div>

            <div className="mt-12 rounded-2xl bg-[#102744] p-6 text-white sm:p-8">
              <h2 className="text-xl font-bold">
                Butuh bantuan terkait forklift?
              </h2>
              <p className="mt-2 text-sm leading-7 text-white/75">
                Konsultasikan kebutuhan perawatan, perbaikan, suku cadang, atau
                rental forklift dengan tim kami di Batam.
              </p>
              <Link
                href="/#contact"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
              >
                Hubungi Kami
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
