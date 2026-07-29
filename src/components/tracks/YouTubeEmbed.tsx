"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export function YouTubeEmbed({ videoId }: { videoId: string }) {
  const [loaded, setLoaded] = useState(false);
  const thumbUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="aspect-video border-[3px] border-black rounded-2xl overflow-hidden bg-black">
      {loaded ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      ) : (
        <button onClick={() => setLoaded(true)} className="w-full h-full relative group" aria-label="Play video">
          {/* eslint-disable-next-line @next/next/no-img-element -- YouTube サムネはリモート固定URLのため next/image 最適化不要 */}
          <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
            <div className="w-20 h-20 bg-magenta border-[4px] border-black rounded-full flex items-center justify-center shadow-sticker">
              <Play className="w-10 h-10 text-black" fill="black" />
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
