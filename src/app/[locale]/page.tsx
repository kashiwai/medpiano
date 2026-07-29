import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProfileTeaser } from "@/components/sections/ProfileTeaser";
import { BigNumbersSection } from "@/components/sections/BigNumbersSection";
import { FeaturedTracks } from "@/components/sections/FeaturedTracks";
import { ClientsMarquee } from "@/components/sections/ClientsMarquee";
import { ContactCTA } from "@/components/sections/ContactCTA";
import type { Locale } from "@/lib/types";

// FeaturedTracks がアップロード済みの実楽曲を都度取得するため動的レンダリングにする
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return locale === "ja"
    ? {
        title: "MedPiano — 謎の作詞作曲家",
        description:
          "年齢不詳・性別不明のミステリアスな作詞作曲家。10年、3,000曲以上。CM・映画・アーティスト楽曲提供、SONY Music コラボ実績。",
      }
    : {
        title: "MedPiano — The Faceless Composer",
        description:
          "A mysterious composer of unknown age and gender. 10 years, 3,000+ songs. CM, film and artist commissions, SONY Music collaboration.",
      };
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <ProfileTeaser />
      <BigNumbersSection />
      <FeaturedTracks />
      <ClientsMarquee />
      <ContactCTA />
    </>
  );
}
