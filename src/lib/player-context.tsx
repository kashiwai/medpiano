"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getAudioUrl } from "@/lib/utils";
import type { Track } from "@/lib/types";

type PlayerContextValue = {
  queue: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  seek: (time: number) => void;
  toggleShuffle: () => void;
  closePlayer: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = currentIndex >= 0 ? (queue[currentIndex] ?? null) : null;

  const playTrack = useCallback((track: Track, nextQueue?: Track[]) => {
    const list = nextQueue ?? [track];
    const index = list.findIndex((t) => t.id === track.id);
    setQueue(list);
    setCurrentIndex(index >= 0 ? index : 0);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [currentTrack]);

  const playNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (queue.length === 0) return prev;
      if (shuffle && queue.length > 1) {
        let next = Math.floor(Math.random() * queue.length);
        while (next === prev) next = Math.floor(Math.random() * queue.length);
        return next;
      }
      return prev + 1 < queue.length ? prev + 1 : prev;
    });
  }, [queue.length, shuffle]);

  const playPrev = useCallback(() => {
    const audio = audioRef.current;
    // 再生開始から3秒以上経っていれば「前へ」は曲の頭出しとして扱う（一般的な音楽プレイヤーの挙動）
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);

  const closePlayer = useCallback(() => {
    setQueue([]);
    setCurrentIndex(-1);
    setIsPlaying(false);
  }, []);

  // トラック切り替え時に音源を差し替えて再生する。currentTime のリセットは
  // 外部システム（audio 要素）の状態を React 側に同期させるためのものなので許容する。
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    const src = getAudioUrl(currentTrack);
    if (!src) return;
    audio.src = src;
    audio.currentTime = 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTime(0);
    if (isPlaying) audio.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => playNext();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [playNext]);

  return (
    <PlayerContext.Provider
      value={{
        queue,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        shuffle,
        playTrack,
        togglePlay,
        playNext,
        playPrev,
        seek,
        toggleShuffle,
        closePlayer,
      }}
    >
      {children}
      <audio ref={audioRef} preload="metadata" />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
