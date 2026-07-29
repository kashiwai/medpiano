"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { PillBadge } from "@/components/ui/PillBadge";
import { MusicIcon } from "@/components/doodles/MusicIcon";
import { TrackModal } from "@/components/tracks/TrackModal";
import { categoryColor, formatDuration, onColorTextMap } from "@/lib/utils";
import type { Track } from "@/lib/types";

export function TrackCard({ track }: { track: Track }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const accent = categoryColor(track.category);

  return (
    <>
      <motion.article
        whileHover={{ rotate: -1, y: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-cream-light border-[3px] border-black rounded-3xl overflow-hidden shadow-sticker cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        <div className="aspect-video relative bg-black overflow-hidden">
          {track.thumbnail ? (
            <Image src={track.thumbnail} alt={track.titleEn} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-teal flex items-center justify-center">
              <MusicIcon className="w-16 h-16 text-black" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 bg-magenta border-[3px] border-black rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-black" fill="black" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <PillBadge color={accent} size="sm">
            {track.category.toUpperCase()}
          </PillBadge>

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
          </div>
        </div>
      </motion.article>

      {isModalOpen && <TrackModal track={track} onClose={() => setModalOpen(false)} />}
    </>
  );
}
