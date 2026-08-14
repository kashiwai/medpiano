import { list } from "@vercel/blob";
import { getMediaOverrides, normalizePathname, type MediaOverride } from "@/lib/blobMetadata";
import tracksData from "@/data/tracks.json";
import type { Track } from "@/lib/types";

function displayTitle(pathname: string): string {
  const filename = pathname.split("/").pop() ?? pathname;
  const withoutExt = filename.replace(/\.[^./]+$/, "");
  // Vercel Blob の addRandomSuffix で付与されるランダムID（長い英数字の末尾）を取り除く
  return withoutExt.replace(/-[a-zA-Z0-9]{16,}$/, "");
}

// pathname から安定した短いハッシュを作る（同じファイルなら常に同じ値になる）。
// 日本語タイトルなど slugify で消えてしまう文字だけの場合でも一意なURLを保証する。
function shortHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36).slice(0, 6);
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// アップロード楽曲・動画の共有可能なURL用スラッグ。表示名 + pathnameのハッシュで
// 「読める・安定している・重複しない」を両立させる（表示名が日本語だけでも一意性は保たれる）。
export function trackSlug(pathname: string, displayName: string): string {
  const base = slugify(displayName);
  const hash = shortHash(normalizePathname(pathname));
  return base ? `${base}-${hash}` : hash;
}

async function safeList(prefix: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const { blobs } = await list({ prefix });
    return blobs.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );
  } catch {
    return [];
  }
}

function toTrack(
  blob: { pathname: string; url: string; uploadedAt: Date | string },
  kind: "audio" | "video",
  override: MediaOverride = {},
): Track {
  const title = (override.displayName || displayTitle(blob.pathname).replace(/[-_]/g, " ")).toUpperCase();
  // 動画はデフォルトで「MUSIC VIDEO」、実際はストーリー映像などの場合は
  // 管理画面で "movie" に切り替える運用（両者ともアップロード先のフォルダは videos/ で共通）。
  const category = override.category ?? (kind === "audio" ? "music" : "music-video");
  return {
    id: blob.url,
    slug: trackSlug(blob.pathname, title),
    titleEn: title,
    titleJa: title,
    category,
    // アップロード日時ではなく、管理画面で設定した実際の制作年を優先する。
    year: override.year ?? new Date(blob.uploadedAt).getFullYear(),
    duration: 0,
    mediaUrl: blob.url,
    mediaKind: kind,
    featured: false,
    tags: [],
    lyrics: override.lyrics ?? null,
    genre: override.genre ?? null,
    descriptionJa: kind === "video" && category !== "music-video" ? override.description : undefined,
  };
}

// 実際にアップロード済みの楽曲・動画を、新しい順に Track[] として返す。
// プレースホルダー（実データに繋がっていないハードコード楽曲）の代わりに、
// サイト上の「代表曲」「Fresh From The Studio」はすべてこれを使う。
export async function getUploadedTracks(): Promise<Track[]> {
  const [tracks, videos, overrides] = await Promise.all([
    safeList("tracks/"),
    safeList("videos/"),
    getMediaOverrides(),
  ]);

  const all = [
    ...tracks.map((blob) => toTrack(blob, "audio", overrides[normalizePathname(blob.pathname)])),
    ...videos.map((blob) => toTrack(blob, "video", overrides[normalizePathname(blob.pathname)])),
  ];

  return all.sort((a, b) => b.year - a.year);
}

// 個別共有リンク（/works/[slug]）用に、キュレーション楽曲（tracks.json）と
// アップロード楽曲（Vercel Blob）の両方からslugで検索する。
export async function getTrackBySlug(slug: string): Promise<Track | null> {
  const curated = (tracksData as Track[]).find(
    (track) => track.slug === slug && (track.youtubeId || track.mp3Path),
  );
  if (curated) return curated;

  const uploaded = await getUploadedTracks();
  return uploaded.find((track) => track.slug === slug) ?? null;
}
