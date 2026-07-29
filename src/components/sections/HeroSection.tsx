"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { PianoIcon } from "@/components/doodles/PianoIcon";
import { Sparkle } from "@/components/doodles/Sparkle";
import { CurlyArrow } from "@/components/doodles/CurlyArrow";
import { Star } from "@/components/doodles/Star";

export function HeroSection() {
  const t = useTranslations("HomePage.hero");

  return (
    <section className="relative min-h-screen flex items-center px-6 md:px-12 py-24 overflow-hidden">
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-magenta rotate-12 rounded-3xl -z-10" />
      <div className="absolute bottom-12 -right-8 w-64 h-40 bg-teal -rotate-6 rounded-full -z-10" />
      <Sparkle className="absolute top-1/4 right-1/3 w-8 h-8 hidden md:block" />
      <CurlyArrow className="absolute top-32 left-1/2 w-16 h-16 hidden md:block" rotation={30} />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center w-full">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-anton text-hero uppercase leading-[0.85]"
          >
            {t("title1")}
            <br />
            {t("title2")}
            <br />
            {t("title3")}
          </motion.h1>
          <div className="mt-8 inline-block bg-sun border-[3px] border-black rounded-full px-6 py-3 shadow-sticker-sm rotate-[-2deg]">
            <span className="font-zen font-black text-lg">{t("subtitle")}</span>
          </div>
          <p className="mt-6 font-zen font-black text-2xl">{t("tagline")}</p>
          <p className="mt-2 font-dm text-lg text-black/70">{t("taglineEn")}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="relative"
        >
          <div className="bg-teal border-[4px] border-black rounded-3xl aspect-square p-12 shadow-sticker rotate-3">
            <PianoIcon className="w-full h-full text-black" />
          </div>
          <Star className="absolute -top-6 -right-4 w-12 h-12" />
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <ChevronDown size={32} />
      </div>
    </section>
  );
}
