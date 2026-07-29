"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import type { Track } from "@/lib/types";

export function AudioPlayer({ src, track }: { src: string; track: Track }) {
  const [isPlaying, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!isPlaying);
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number(e.target.value);
    audio.currentTime = value;
    setCurrentTime(value);
  }

  return (
    <div className="bg-black text-cream border-[3px] border-black rounded-2xl p-8 relative overflow-hidden">
      <div className="relative flex items-center gap-6">
        <button
          onClick={togglePlay}
          className="w-20 h-20 bg-magenta border-[3px] border-cream rounded-full flex items-center justify-center flex-shrink-0"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
        </button>

        <div className="flex-1">
          <p className="font-anton text-2xl uppercase mb-2">{track.titleEn}</p>
          <p className="font-zen font-black text-sm mb-4 text-cream/70">{track.titleJa}</p>

          <div className="relative h-2 bg-cream/20 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-magenta rounded-full"
              style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
            />
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Seek"
            />
          </div>

          <div className="mt-2 flex justify-between text-xs font-dm">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" controlsList="nodownload noplaybackrate" />
    </div>
  );
}
