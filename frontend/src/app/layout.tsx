import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";

import { AppProviders } from "@/components/providers/AppProviders";
import { getPublicSiteUrl } from "@/lib/website-articles";


export const metadata: Metadata = {
  metadataBase: new URL(getPublicSiteUrl()),
  title: {
    default: "PT Atha Yasa Mandiri | Perawatan Forklift Batam",
    template: "%s | PT Atha Yasa Mandiri",
  },
  description:
    "Layanan perawatan, perbaikan, penggantian suku cadang, dan rental forklift PT Atha Yasa Mandiri di Batam.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#080D18] font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
