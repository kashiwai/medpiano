import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { anton, archivoBlack, zenKaku, dmSans } from "@/fonts";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Meta" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://medpiano.com";

  return {
    title: {
      default: t("siteName"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("description"),
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: "/",
      languages: {
        ja: "/ja",
        en: "/en",
      },
    },
    openGraph: {
      title: t("siteName"),
      description: t("description"),
      url: "/",
      siteName: t("siteName"),
      images: ["/images/og-image.png"],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("siteName"),
      description: t("description"),
      images: ["/images/og-image.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "ja" | "en")) notFound();
  setRequestLocale(locale);
  // next-intl の getMessages() によるアンビエントなロケール解決が
  // 静的レンダリング環境で不安定だったため、確定済みの locale から直接読み込む
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html
      lang={locale}
      className={`${anton.variable} ${archivoBlack.variable} ${zenKaku.variable} ${dmSans.variable}`}
    >
      <body className="bg-cream text-black font-zen antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
