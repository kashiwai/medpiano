import type { Metadata } from "next";
import type { Locale } from "@/lib/types";

type PageMetaInput = {
  locale: Locale;
  path: string; // "" for home, "/profile", "/works" ...
  title: string;
  description: string;
};

// 各ページの generateMetadata から呼び出す共通ヘルパー。
// hreflang alternates と OG/Twitter カードを一括生成する。
export function buildPageMetadata({ locale, path, title, description }: PageMetaInput): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://medpiano.com";

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        ja: `/ja${path}`,
        en: `/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}${path}`,
      siteName: "MedPiano",
      images: ["/images/og-image.png"],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-image.png"],
    },
  };
}
