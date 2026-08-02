"use client";

import { Play } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import { getAudioUrl } from "@/lib/utils";
import type { Track } from "@/lib/types";

export function PlayAllButton({ tracks }: { tracks: Track[] }) {
  const { playTrack } = usePlayer();
  const playable = tracks.filter((t) => !!getAudioUrl(t));

  if (playable.length === 0) return null;

  return (
    <button
      onClick={() => playTrack(playable[0], playable)}
      className="inline-flex items-center gap-2 rounded-full border-[3px] border-black bg-magenta px-5 py-2.5 font-anton text-sm uppercase shadow-sticker-sm hover:rotate-[-2deg] transition-transform"
    >
      <Play size={16} fill="currentColor" />
      すべて再生 / Play All
    </button>
  );
}
