"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Clapperboard } from "lucide-react";
import { PillBadge } from "@/components/ui/PillBadge";
import { MusicIcon } from "@/components/doodles/MusicIcon";
import { TrackModal } from "@/components/tracks/TrackModal";
import { usePlayer } from "@/lib/player-context";
import { categoryColor, categoryLabel, formatDuration, genreLabel, getAudioUrl, onColorTextMap } from "@/lib/utils";
import type { Track } from "@/lib/types";

export function TrackCard({ track }: { track: Track }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const { playTrack } = usePlayer();
  const accent = categoryColor(track.category);
  const audioUrl = getAudioUrl(track);

  return (
    <>
      <motion.article
        whileHover={{ rotate: -1, y: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-cream-light border-[3px] border-black rounded-3xl overflow-hidden shadow-sticker cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        <div className="aspect-video relative bg-black overflow-hidden">
          {track.mediaKind === "video" ? (
            <div className="relative w-full h-full bg-black flex items-center justify-center border-y-[3px] border-magenta">
              {/* フィルムストリップ風の縁取り（動画専用デザイン） */}
              <div className="absolute inset-x-0 top-0 flex justify-between px-2 py-1.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className="w-2 h-2 rounded-[1px] bg-cream/50" />
                ))}
              </div>
              <Clapperboard className="w-14 h-14 text-sun" />
              <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 py-1.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className="w-2 h-2 rounded-[1px] bg-cream/50" />
                ))}
              </div>
            </div>
          ) : track.thumbnail ? (
            <Image src={track.thumbnail} alt={track.titleEn} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-teal flex items-center justify-center">
              <MusicIcon className="w-16 h-16 text-black" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            {audioUrl ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playTrack(track);
                }}
                aria-label="Play"
                className="w-16 h-16 bg-magenta border-[3px] border-black rounded-full flex items-center justify-center"
              >
                <Play className="w-8 h-8 text-black" fill="black" />
              </button>
            ) : (
              <div className="w-16 h-16 bg-magenta border-[3px] border-black rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-black" fill="black" />
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            <PillBadge color={accent} size="sm">
              {categoryLabel(track.category)}
            </PillBadge>
            {track.genre && (
              <PillBadge color="sun" size="sm">
                {genreLabel(track.genre)}
              </PillBadge>
            )}
          </div>

          <h3 className="mt-3 font-anton text-2xl uppercase leading-tight">{track.titleEn}</h3>
          <p className="mt-1 font-zen font-black text-lg">{track.titleJa}</p>

          <div className="mt-4 flex items-center gap-2 text-sm text-black/70 font-dm">
            <span>{track.year}</span>
            <span>·</span>
            <span>{formatDuration(track.duration)}</span>
          </div>

          <div className="mt-4 flex gap-2">
            {track.youtubeId && (
              <span className="text-xs font-anton bg-black text-cream px-2 py-1 rounded">YOUTUBE</span>
            )}
            {track.mp3Path && (
              <span className={`text-xs font-anton bg-magenta px-2 py-1 rounded ${onColorTextMap.magenta}`}>MP3</span>
            )}
            {track.mediaUrl && (
              <span className={`text-xs font-anton bg-sun px-2 py-1 rounded ${onColorTextMap.sun}`}>
                {track.mediaKind === "video" ? "VIDEO" : "AUDIO"}
              </span>
            )}
          </div>
        </div>
      </motion.article>

      {isModalOpen && <TrackModal track={track} onClose={() => setModalOpen(false)} />}
    </>
  );
}
