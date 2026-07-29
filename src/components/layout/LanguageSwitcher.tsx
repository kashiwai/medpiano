"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (newLocale: "ja" | "en") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 border-[2px] border-black rounded-full p-1">
      <button
        onClick={() => switchTo("ja")}
        className={`px-3 py-1 rounded-full font-anton text-sm uppercase transition-colors ${
          locale === "ja" ? "bg-black text-cream" : "hover:bg-black/10"
        }`}
      >
        JA
      </button>
      <button
        onClick={() => switchTo("en")}
        className={`px-3 py-1 rounded-full font-anton text-sm uppercase transition-colors ${
          locale === "en" ? "bg-black text-cream" : "hover:bg-black/10"
        }`}
      >
        EN
      </button>
    </div>
  );
}
