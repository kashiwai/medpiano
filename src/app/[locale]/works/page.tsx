import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PillBadge } from "@/components/ui/PillBadge";
import { Button } from "@/components/ui/Button";
import { WorksGrid } from "@/components/tracks/WorksGrid";
import { UploadedGallery } from "@/components/UploadedGallery";
import tracksData from "@/data/tracks.json";
import type { Locale, Track } from "@/lib/types";

// アップロード済みメディアを常に最新の状態で表示するため動的レンダリングにする
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const hasCuratedTracks = (tracksData as Track[]).some((track) => track.youtubeId || track.mp3Path);

  if (!hasCuratedTracks) {
    return locale === "ja"
      ? { title: "WORKS — MedPianoの楽曲・動画", description: "アップロードされた楽曲・動画をその場で試聴できます。" }
      : { title: "WORKS — Tracks & Videos by MedPiano", description: "Listen to uploaded tracks and videos instantly." };
  }

  return locale === "ja"
    ? {
        title: "WORKS — MedPianoの厳選20曲",
        description:
          "CM・映画・アーティスト楽曲、劇伴、観光PV曲、様々なジャンルで制作された楽曲を厳選20曲。YouTubeとMP3プレイヤーで試聴可能。",
      }
    : {
        title: "WORKS — 20 Selected Tracks by MedPiano",
        description:
          "CM jingles, film scores, artist commissions, tourism themes and more — 20 hand-picked tracks. Listen via YouTube or MP3 player.",
      };
}

export default async function WorksPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("WorksPage");
  // 実データ（YouTube か MP3）に繋がっていないプレースホルダー楽曲は、
  // 「厳選20曲」セクションごと表示しない。実データが入り次第自動的に復活する。
  const hasCuratedTracks = (tracksData as Track[]).some((track) => track.youtubeId || track.mp3Path);

  return (
    <>
      {hasCuratedTracks ? (
        <section className="py-24 md:py-32 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <PillBadge color="teal">{t("hero.badge")}</PillBadge>
            <h1 className="mt-6 font-anton text-hero uppercase leading-[0.9]">
              {t("hero.title1")}
              <br />
              {t("hero.title2")}
              <br />
              {t("hero.title3")}
            </h1>
            <p className="mt-8 font-zen font-black text-2xl">{t("hero.subtitle")}</p>
            <p className="mt-2 font-dm text-lg text-black/70">{t("hero.subtitleEn")}</p>

            <div className="mt-12 flex flex-wrap gap-3 justify-center">
              <PillBadge color="magenta" size="sm">
                {t("hero.badge1")}
              </PillBadge>
              <PillBadge color="teal" size="sm">
                {t("hero.badge2")}
              </PillBadge>
              <PillBadge color="sun" size="sm">
                {t("hero.badge3")}
              </PillBadge>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-24 md:py-32 px-6 md:px-12 text-center">
          <PillBadge color="teal">WORKS</PillBadge>
          <h1 className="mt-6 font-anton text-hero uppercase leading-[0.9]">HEAR THE MUSIC</h1>
          <p className="mt-4 font-zen font-black text-xl">実際にアップロードされた楽曲・動画</p>
        </section>
      )}

      <UploadedGallery />

      {hasCuratedTracks && (
        <Suspense>
          <WorksGrid />
        </Suspense>
      )}

      <section className="py-24 md:py-32 px-6 md:px-12 bg-black text-cream">
        <div className="max-w-4xl mx-auto text-center">
          <PillBadge color="magenta">{t("cta.badge")}</PillBadge>
          <h2 className="mt-6 font-anton text-hero uppercase leading-[0.9]">
            {t("cta.title1")}
            <br />
            {t("cta.title2")}
            <br />
            {t("cta.title3")}
          </h2>
          <p className="mt-8 font-zen font-black text-2xl">{t("cta.subtitle")}</p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact" variant="filled" color="magenta" size="lg">
              {t("cta.primary")}
            </Button>
            <Button href="/clients" variant="outline" size="lg" className="text-cream border-cream">
              {t("cta.secondary")}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
