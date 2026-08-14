"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

// Mux Player（HLS.js同梱で数百KB）は動画を実際に開いたときだけ読み込む。
// 静的importにすると全ページの初期バンドルに乗ってしまうため動的importにする。
const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });
import { PillBadge } from "@/components/ui/PillBadge";
import { MetaChip } from "@/components/ui/MetaChip";
import { Button } from "@/components/ui/Button";
import { YouTubeEmbed } from "@/components/tracks/YouTubeEmbed";
import { AudioPlayer } from "@/components/tracks/AudioPlayer";
import { ShareButton } from "@/components/tracks/ShareButton";
import { categoryColor, categoryLabel, formatDuration, genreLabel, r2Url } from "@/lib/utils";
import type { Track } from "@/lib/types";

// TrackModal（一覧上のオーバーレイ）と /works/[slug]（個別共有ページ）の
// 両方から使う、トラック1件ぶんの中身。チラムのラップ（背景・閉じるボタン等）は呼び出し側の責務。
export function TrackDetail({ track }: { track: Track }) {
  const t = useTranslations("WorksPage.modal");

  return (
    <>
      {track.youtubeId ? (
        <YouTubeEmbed videoId={track.youtubeId} />
      ) : track.mp3Path ? (
        <AudioPlayer src={r2Url(track.mp3Path)} track={track} />
      ) : track.muxPlaybackId ? (
        <div className="aspect-video overflow-hidden rounded-2xl border-[3px] border-black bg-black">
          <MuxPlayer
            playbackId={track.muxPlaybackId}
            streamType="on-demand"
            accentColor="#ff2d87"
            metadata={{ video_title: track.titleEn }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ) : track.mediaUrl && track.mediaKind === "video" ? (
        <video
          controls
          preload="none"
          playsInline
          className="aspect-video w-full rounded-2xl border-[3px] border-black bg-black object-cover"
          src={track.mediaUrl}
        />
      ) : track.mediaUrl ? (
        <AudioPlayer src={track.mediaUrl} track={track} />
      ) : (
        <div className="aspect-video bg-teal border-[3px] border-black rounded-2xl flex items-center justify-center">
          <p className="font-anton text-2xl">{t("comingSoon")}</p>
        </div>
      )}

      <div className="mt-8">
        <div className="flex flex-wrap gap-2">
          <PillBadge color={categoryColor(track.category)}>{categoryLabel(track.category)}</PillBadge>
          {track.genre && <PillBadge color="sun">{genreLabel(track.genre)}</PillBadge>}
        </div>
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
            {(track.category === "movie" || track.category === "drama" || track.category === "trailer") && (
              <p className="font-anton text-xs uppercase text-black/50">STORY</p>
            )}
            {track.descriptionEn && <p className="font-dm text-lg leading-relaxed">{track.descriptionEn}</p>}
            {track.descriptionJa && (
              <p className="mt-2 font-zen font-bold text-lg leading-relaxed">{track.descriptionJa}</p>
            )}
          </div>
        )}

        {track.lyrics && (
          <div className="mt-8">
            <p className="font-anton text-xs uppercase text-black/50">LYRICS</p>
            <p className="mt-2 font-zen font-bold text-lg leading-relaxed whitespace-pre-wrap">{track.lyrics}</p>
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
          <ShareButton track={track} />
        </div>
      </div>
    </>
  );
}
