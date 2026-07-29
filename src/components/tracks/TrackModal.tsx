"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { PillBadge } from "@/components/ui/PillBadge";
import { MetaChip } from "@/components/ui/MetaChip";
import { Button } from "@/components/ui/Button";
import { YouTubeEmbed } from "@/components/tracks/YouTubeEmbed";
import { AudioPlayer } from "@/components/tracks/AudioPlayer";
import { categoryColor, formatDuration, r2Url } from "@/lib/utils";
import type { Track } from "@/lib/types";

export function TrackModal({ track, onClose }: { track: Track; onClose: () => void }) {
  const t = useTranslations("WorksPage.modal");

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-cream border-[4px] border-black rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-sticker"
      >
        <div className="sticky top-0 bg-cream border-b-2 border-black p-4 flex justify-end z-10">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-magenta border-[3px] border-black rounded-full flex items-center justify-center hover:rotate-90 transition-transform"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-10">
          {track.youtubeId ? (
            <YouTubeEmbed videoId={track.youtubeId} />
          ) : track.mp3Path ? (
            <AudioPlayer src={r2Url(track.mp3Path)} track={track} />
          ) : (
            <div className="aspect-video bg-teal border-[3px] border-black rounded-2xl flex items-center justify-center">
              <p className="font-anton text-2xl">{t("comingSoon")}</p>
            </div>
          )}

          <div className="mt-8">
            <PillBadge color={categoryColor(track.category)}>{track.category.toUpperCase()}</PillBadge>
            <h2 className="mt-4 font-anton text-4xl md:text-5xl uppercase leading-tight">{track.titleEn}</h2>
            <h3 className="mt-2 font-zen font-black text-2xl">{track.titleJa}</h3>

            <div className="mt-6 flex flex-wrap gap-3">
              <MetaChip label={t("year")} value={track.year.toString()} />
              <MetaChip label={t("duration")} value={formatDuration(track.duration)} />
              {track.client && <MetaChip label={t("client")} value={track.client} />}
              {track.artist && <MetaChip label={t("artist")} value={track.artist} />}
            </div>

            {(track.descriptionEn || track.descriptionJa) && (
              <div className="mt-8">
                {track.descriptionEn && <p className="font-dm text-lg leading-relaxed">{track.descriptionEn}</p>}
                {track.descriptionJa && (
                  <p className="mt-2 font-zen font-bold text-lg leading-relaxed">{track.descriptionJa}</p>
                )}
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={`/contact?track=${track.id}`} color="magenta">
                {t("inquire")}
              </Button>
              {track.youtubeId && (
                <Button href={`https://youtube.com/watch?v=${track.youtubeId}`} variant="outline" external>
                  {t("openYoutube")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
