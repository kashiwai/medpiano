"use client";

import { Play, Pause, SkipBack, SkipForward, Shuffle, X } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import { formatDuration } from "@/lib/utils";

export function MiniPlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    shuffle,
    togglePlay,
    playNext,
    playPrev,
    seek,
    toggleShuffle,
    closePlayer,
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-black text-cream border-t-[3px] border-black">
      <div className="relative h-1 bg-cream/20">
        <div
          className="absolute inset-y-0 left-0 bg-magenta"
          style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
        />
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          aria-label="Seek"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-anton text-sm md:text-base uppercase truncate">{currentTrack.titleEn}</p>
          <p className="font-zen font-black text-xs text-cream/60 truncate">{currentTrack.titleJa}</p>
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <button
            onClick={toggleShuffle}
            aria-label="Shuffle"
            aria-pressed={shuffle}
            className={`w-8 h-8 hidden sm:flex items-center justify-center rounded-full transition-colors ${
              shuffle ? "text-magenta" : "text-cream/50 hover:text-cream"
            }`}
          >
            <Shuffle size={16} />
          </button>
          <button
            onClick={playPrev}
            aria-label="Previous"
            className="w-9 h-9 flex items-center justify-center rounded-full text-cream hover:bg-cream/10"
          >
            <SkipBack size={18} fill="currentColor" />
          </button>
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="w-11 h-11 bg-magenta text-black border-[3px] border-cream rounded-full flex items-center justify-center flex-shrink-0"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
          </button>
          <button
            onClick={playNext}
            aria-label="Next"
            className="w-9 h-9 flex items-center justify-center rounded-full text-cream hover:bg-cream/10"
          >
            <SkipForward size={18} fill="currentColor" />
          </button>
        </div>

        <div className="hidden md:block font-dm text-xs text-cream/60 flex-shrink-0 w-24 text-right">
          {formatDuration(currentTime)} / {formatDuration(duration)}
        </div>

        <button
          onClick={closePlayer}
          aria-label="Close player"
          className="w-8 h-8 flex items-center justify-center rounded-full text-cream/50 hover:text-cream flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
