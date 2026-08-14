"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { TrackDetail } from "@/components/tracks/TrackDetail";
import type { Track } from "@/lib/types";

export function TrackModal({ track, onClose }: { track: Track; onClose: () => void }) {
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
          <TrackDetail track={track} />
        </div>
      </motion.div>
    </div>
  );
}
