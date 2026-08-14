import { list, del } from "@vercel/blob";
import { NextResponse } from "next/server";
import {
  getMediaOverrides,
  getMediaOverride,
  setMediaOverride,
  removeMediaOverride,
  normalizePathname,
  MEDIA_GENRES,
  type MediaCategory,
  type MediaGenre,
} from "@/lib/blobMetadata";

async function listUploaded(prefix: "tracks/" | "videos/") {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const { blobs } = await list({ prefix });
    return blobs
      .filter((blob) => blob.pathname !== "metadata/overrides.json")
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  } catch {
    return [];
  }
}

export async function GET() {
  const [tracks, videos, overrides] = await Promise.all([
    listUploaded("tracks/"),
    listUploaded("videos/"),
    getMediaOverrides(),
  ]);

  const toItem = (blob: { pathname: string; url: string; uploadedAt: Date }, kind: "audio" | "video") => {
    const override = overrides[normalizePathname(blob.pathname)] ?? {};
    return {
      pathname: blob.pathname,
      url: blob.url,
      uploadedAt: blob.uploadedAt,
      kind,
      displayName: override.displayName ?? null,
      category: override.category ?? (kind === "audio" ? "music" : "music-video"),
      genre: override.genre ?? null,
      year: override.year ?? new Date(blob.uploadedAt).getFullYear(),
      lyrics: override.lyrics ?? null,
      description: override.description ?? null,
      muxStatus: override.muxStatus ?? null,
      muxPlaybackId: override.muxPlaybackId ?? null,
    };
  };

  return NextResponse.json({
    items: [
      ...tracks.map((b) => toItem(b, "audio")),
      ...videos.map((b) => toItem(b, "video")),
    ],
  });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { pathname, displayName, category, genre, year, lyrics, description, password } = body as {
    pathname?: string;
    displayName?: string;
    category?: MediaCategory;
    genre?: MediaGenre | "";
    year?: number;
    lyrics?: string;
    description?: string;
    password?: string;
  };

  if (!process.env.UPLOAD_PASSWORD || password !== process.env.UPLOAD_PASSWORD) {
    return NextResponse.json({ error: "パスワードが違います。" }, { status: 401 });
  }
  if (!pathname) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // 1フィールドだけの更新でも他のフィールド（歌詞・カテゴリ等）を消さないよう、
  // 既存の上書き情報を読み込んでからマージする。
  const current = await getMediaOverride(pathname);
  const next = { ...current };
  if (typeof displayName === "string") next.displayName = displayName.trim() || undefined;
  if (
    category === "music" ||
    category === "music-video" ||
    category === "movie" ||
    category === "drama" ||
    category === "trailer"
  )
    next.category = category;
  if (genre === "") next.genre = undefined;
  else if (MEDIA_GENRES.some((g) => g.value === genre)) next.genre = genre as MediaGenre;
  if (typeof year === "number" && Number.isFinite(year)) next.year = year;
  if (typeof lyrics === "string") next.lyrics = lyrics.trim() || undefined;
  if (typeof description === "string") next.description = description.trim() || undefined;

  await setMediaOverride(pathname, next);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { pathname, url, password } = body as {
    pathname?: string;
    url?: string;
    password?: string;
  };

  if (!process.env.UPLOAD_PASSWORD || password !== process.env.UPLOAD_PASSWORD) {
    return NextResponse.json({ error: "パスワードが違います。" }, { status: 401 });
  }
  if (!pathname || !url) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await del(url);
  await removeMediaOverride(pathname);
  return NextResponse.json({ ok: true });
}
