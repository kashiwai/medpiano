import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PillBadge } from "@/components/ui/PillBadge";
import { Button } from "@/components/ui/Button";
import { TrackCard } from "@/components/tracks/TrackCard";
import { YouTubeEmbed } from "@/components/tracks/YouTubeEmbed";
import { categoryColor, formatDate } from "@/lib/utils";
import newsData from "@/data/news.json";
import tracksData from "@/data/tracks.json";
import type { Locale, NewsItem, Track } from "@/lib/types";

const news = newsData as NewsItem[];
const tracks = tracksData as Track[];

export function generateStaticParams() {
  return news.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = news.find((n) => n.slug === slug);
  if (!item) return {};
  return {
    title: `${item.titleEn} — MedPiano News`,
    description: item.excerpt,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("NewsPage");
  const item = news.find((n) => n.slug === slug);
  if (!item) notFound();

  const relatedTracks = (item.relatedTracks ?? [])
    .map((id) => tracks.find((track) => track.id === id))
    .filter((track): track is Track => Boolean(track));

  return (
    <article className="py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/news" className="inline-flex items-center gap-2 font-anton uppercase mb-8">
          {t("backToNews")}
        </Link>

        <div className="flex gap-2 mb-4">
          <PillBadge color={categoryColor(item.category)} size="sm">
            {item.category.toUpperCase()}
          </PillBadge>
        </div>
        <time className="font-dm text-sm text-black/70">{formatDate(item.publishedAt, locale)}</time>

        <h1 className="mt-4 font-anton text-h1 uppercase leading-tight">{item.titleEn}</h1>
        <h2 className="mt-2 font-zen font-black text-2xl">{item.titleJa}</h2>

        {item.heroImage && (
          <div className="mt-8 aspect-video relative bg-teal border-[3px] border-black rounded-3xl overflow-hidden">
            <Image src={item.heroImage} alt={item.titleEn} fill className="object-cover" />
          </div>
        )}

        <div
          className="mt-12 prose prose-lg max-w-none font-dm"
          dangerouslySetInnerHTML={{ __html: item.body }}
        />

        {item.youtubeId && (
          <div className="mt-12">
            <YouTubeEmbed videoId={item.youtubeId} />
          </div>
        )}

        {relatedTracks.length > 0 && (
          <div className="mt-16">
            <h3 className="font-anton text-h3 uppercase mb-6">{t("relatedWorks")}</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedTracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 pt-8 border-t-2 border-black text-center">
          <Button href="/contact" variant="filled" color="magenta">
            {t("cta")}
          </Button>
        </div>
      </div>
    </article>
  );
}
