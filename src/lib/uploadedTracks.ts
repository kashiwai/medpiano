import { list } from "@vercel/blob";
import { getMediaOverrides, normalizePathname, type MediaOverride } from "@/lib/blobMetadata";
import type { Track } from "@/lib/types";

function displayTitle(pathname: string): string {
  const filename = pathname.split("/").pop() ?? pathname;
  const withoutExt = filename.replace(/\.[^./]+$/, "");
  // Vercel Blob の addRandomSuffix で付与されるランダムID（長い英数字の末尾）を取り除く
  return withoutExt.replace(/-[a-zA-Z0-9]{16,}$/, "");
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
    slug: blob.url,
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
