"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

export function FAQItem({ q, qEn, a }: { q: string; qEn: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-cream border-[3px] border-black rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-6 flex items-start justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <div>
          <p className="font-zen font-black text-lg">{q}</p>
          <p className="font-dm text-sm text-black/70 mt-1">{qEn}</p>
        </div>
        <Plus size={24} className={`flex-shrink-0 mt-1 transition-transform ${open ? "rotate-45" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t-2 border-black pt-4">
              <p className="font-dm leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
