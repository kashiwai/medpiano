"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FilterPill } from "@/components/tracks/FilterPill";
import { TrackCard } from "@/components/tracks/TrackCard";
import { TrackModal } from "@/components/tracks/TrackModal";
import { Squiggle } from "@/components/doodles/Squiggle";
import tracksData from "@/data/tracks.json";
import type { Track, TrackCategory } from "@/lib/types";

const CATEGORIES: { value: TrackCategory; key: "cm" | "movie" | "artist" | "tourism" | "original" }[] = [
  { value: "cm", key: "cm" },
  { value: "movie", key: "movie" },
  { value: "artist", key: "artist" },
  { value: "tourism", key: "tourism" },
  { value: "original", key: "original" },
];

export function WorksGrid() {
  const t = useTranslations("WorksPage");
  const searchParams = useSearchParams();
  // 実データ（YouTube か MP3）に繋がっていないプレースホルダー楽曲は表示しない
  const tracks = (tracksData as Track[]).filter((track) => track.youtubeId || track.mp3Path);

  const category = searchParams.get("category");
  const media = searchParams.get("media");
  const highlightedTrackId = searchParams.get("track");

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) => {
      if (category && track.category !== category) return false;
      if (media === "youtube" && !track.youtubeId) return false;
      if (media === "mp3" && !track.mp3Path) return false;
      return true;
    });
  }, [tracks, category, media]);

  const highlightedTrack = highlightedTrackId ? tracks.find((t) => t.id === highlightedTrackId) : undefined;

  return (
    <>
      <section className="sticky top-16 md:top-[72px] z-30 bg-cream/95 backdrop-blur-sm border-y-2 border-black py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3 items-center">
          <div className="flex flex-wrap gap-2">
            <FilterPill category="all">{t("filters.all")}</FilterPill>
            {CATEGORIES.map((c) => (
              <FilterPill key={c.value} category={c.value}>
                {t(`filters.${c.key}`)}
              </FilterPill>
            ))}
          </div>

          <div className="w-px h-8 bg-black mx-2 hidden md:block" />

          <div className="flex gap-2">
            <FilterPill type="youtube">{t("filters.youtube")}</FilterPill>
            <FilterPill type="mp3">{t("filters.mp3")}</FilterPill>
          </div>

          <div className="ml-auto font-anton text-2xl">
            <span className="text-magenta">{filteredTracks.length}</span> / {tracks.length}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredTracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>

          {filteredTracks.length === 0 && (
            <div className="py-24 text-center">
              <div className="inline-block bg-cream-light border-[3px] border-black rounded-3xl p-12">
                <Squiggle className="w-24 h-24 mx-auto mb-4" />
                <p className="font-zen font-black text-xl">{t("empty")}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {highlightedTrack && (
        <TrackModal track={highlightedTrack} onClose={() => window.history.replaceState(null, "", window.location.pathname)} />
      )}
    </>
  );
}
