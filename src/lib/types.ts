// ============================================
// TRACK — 楽曲データ
// ============================================
export type TrackCategory =
  | "cm"
  | "movie"
  | "artist"
  | "tourism"
  | "original"
  | "music"
  | "music-video"
  | "drama"
  | "trailer";

export type Track = {
  id: string;
  slug: string;
  titleEn: string;
  titleJa: string;
  category: TrackCategory;
  year: number;
  duration: number;

  youtubeId?: string | null;
  mp3Path?: string | null;
  thumbnail?: string | null;

  // アップロード機能（Vercel Blob）経由の楽曲・動画用。
  // mp3Path は R2 相対パス前提のため、絶対URLで再生する場合はこちらを使う。
  mediaUrl?: string | null;
  mediaKind?: "audio" | "video" | null;

  client?: string | null;
  artist?: string | null;
  descriptionEn?: string;
  descriptionJa?: string;
  lyrics?: string | null;
  genre?: string | null;

  featured: boolean;
  isNew?: boolean;

  tags: string[];

  composedAt?: string;
  releaseAt?: string;
};

// ============================================
// CLIENT — 実績企業データ
// ============================================
export type ClientCategory =
  | "financial"
  | "restaurant"
  | "entertainment"
  | "media"
  | "tourism"
  | "label"
  | "other";

export type Client = {
  id: string;
  name: string;
  nameJa: string;
  category: ClientCategory;
  categoryLabelEn: string;
  categoryLabelJa: string;
  descriptionEn: string;
  descriptionJa?: string;
  logo?: string | null;
  color: "magenta" | "teal" | "sun" | "black";
  displayInMarquee: boolean;
  yearsWorking?: string;
  isAnonymous?: boolean;
};

// ============================================
// TALENT — 楽曲提供先タレント（カテゴリ集計用）
// ============================================
export type TalentCategory = {
  id: "artists" | "talents" | "adult";
  count: number;
  en: string;
  ja: string;
  descEn: string;
  descJa: string;
  color: "magenta" | "teal" | "sun";
};

// ============================================
// NEWS — お知らせ記事
// ============================================
export type NewsCategory = "release" | "mv" | "collab" | "event" | "press";

export type NewsItem = {
  id: string;
  slug: string;
  titleEn: string;
  titleJa: string;
  category: NewsCategory;
  publishedAt: string;
  excerpt: string;
  thumbnail?: string | null;
  heroImage?: string | null;
  body: string;
  youtubeId?: string | null;
  relatedTracks?: string[];
  featured: boolean;
};

// ============================================
// TIMELINE — プロフィールタイムライン
// ============================================
export type TimelineEvent = {
  year: string;
  labelEn: string;
  labelJa: string;
  active: boolean;
  highlight: boolean;
};

// ============================================
// STATS — プロフィール統計
// ============================================
export type StatEntry = {
  number: string;
  en: string;
  ja: string;
  color: "magenta" | "teal" | "sun";
  note?: string;
};

export type ProfileData = {
  timeline: TimelineEvent[];
  stats: StatEntry[];
  manifesto: {
    en: string[];
    ja: string[];
  };
};

// ============================================
// TRANSLATION — i18n
// ============================================
export type Locale = "ja" | "en";
