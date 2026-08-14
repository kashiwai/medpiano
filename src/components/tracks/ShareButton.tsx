"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Track } from "@/lib/types";

export function ShareButton({ track }: { track: Track }) {
  const locale = useLocale();
  const t = useTranslations("WorksPage.modal");
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/${locale}/works/${encodeURIComponent(track.slug)}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: track.titleEn, url });
      } catch {
        // ユーザーがシェアをキャンセルした場合は何もしない
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-full border-[3px] border-black bg-cream-light px-6 py-3 font-anton text-sm uppercase shadow-sticker-sm hover:rotate-[-2deg] transition-transform"
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {copied ? t("linkCopied") : t("share")}
    </button>
  );
}
