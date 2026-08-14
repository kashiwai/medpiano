import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { TrackDetail } from "@/components/tracks/TrackDetail";
import { getTrackBySlug } from "@/lib/uploadedTracks";
import type { Locale } from "@/lib/types";

// アップロード楽曲（Blob）はビルド時に存在を把握できないため、常に最新データで動的レンダリングする
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const track = await getTrackBySlug(slug);
  if (!track) return {};

  const description = track.descriptionJa || track.descriptionEn || `${track.titleJa} — MedPiano`;

  return {
    title: `${track.titleEn} — MedPiano`,
    description,
    openGraph: {
      title: `${track.titleEn} — MedPiano`,
      description,
      type: "music.song",
      ...(track.thumbnail ? { images: [track.thumbnail] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${track.titleEn} — MedPiano`,
      description,
    },
  };
}

export default async function TrackPermalinkPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const track = await getTrackBySlug(slug);
  if (!track) notFound();

  return (
    <article className="py-16 md:py-24 px-6 md:px-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/works" className="inline-flex items-center gap-2 font-anton uppercase mb-8">
          ← WORKS
        </Link>

        <div className="rounded-3xl border-[4px] border-black bg-cream-light p-6 shadow-sticker md:p-10">
          <TrackDetail track={track} />
        </div>
      </div>
    </article>
  );
}
