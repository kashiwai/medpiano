import type { TrackCategory, NewsCategory } from "@/lib/types";

// Tailwind は `bg-${color}` のような動的テンプレートリテラルを静的解析できないため、
// カラー系のクラスは必ずこのマップ経由で解決する（ビルド後にスタイルが消える事故を防ぐ）。
export type BrandColor = "magenta" | "teal" | "sun" | "black" | "cream";

export const bgColorMap: Record<BrandColor, string> = {
  magenta: "bg-magenta",
  teal: "bg-teal",
  sun: "bg-sun",
  black: "bg-black",
  cream: "bg-cream",
};

export const textColorMap: Record<BrandColor, string> = {
  magenta: "text-magenta",
  teal: "text-teal",
  sun: "text-sun",
  black: "text-black",
  cream: "text-cream",
};

export const borderColorMap: Record<BrandColor, string> = {
  magenta: "border-magenta",
  teal: "border-teal",
  sun: "border-sun",
  black: "border-black",
  cream: "border-cream",
};

// magenta/teal/sun/cream は黒文字、black は cream 文字（コントラスト確保）
export const onColorTextMap: Record<BrandColor, string> = {
  magenta: "text-black",
  teal: "text-black",
  sun: "text-black",
  black: "text-cream",
  cream: "text-black",
};

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "--:--";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export function formatDate(isoDate: string, locale: string = "ja"): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function categoryColor(category: TrackCategory | NewsCategory | string): BrandColor {
  switch (category) {
    case "cm":
      return "sun";
    case "movie":
      return "black";
    case "artist":
      return "magenta";
    case "tourism":
      return "teal";
    case "original":
      return "magenta";
    case "music":
      return "teal";
    case "music-video":
      return "magenta";
    case "release":
      return "magenta";
    case "mv":
      return "teal";
    case "collab":
      return "sun";
    case "event":
      return "black";
    case "press":
      return "teal";
    default:
      return "teal";
  }
}

// "music-video" のようなハイフン区切りのカテゴリはバッジ表示上そのまま大文字化すると読みにくいため専用マップを使う
const categoryLabelMap: Partial<Record<TrackCategory, string>> = {
  music: "MUSIC",
  "music-video": "MUSIC VIDEO",
};

export function categoryLabel(category: TrackCategory | string): string {
  return categoryLabelMap[category as TrackCategory] ?? category.toUpperCase();
}

export function r2Url(path: string): string {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";
  return `${base}/${path}`;
}
