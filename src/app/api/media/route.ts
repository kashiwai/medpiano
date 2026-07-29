import { list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getMediaOverrides, setMediaOverride } from "@/lib/blobMetadata";

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

  const toItem = (blob: { pathname: string; url: string; uploadedAt: Date }, kind: "audio" | "video") => ({
    pathname: blob.pathname,
    url: blob.url,
    uploadedAt: blob.uploadedAt,
    kind,
    displayName: overrides[blob.pathname]?.displayName ?? null,
  });

  return NextResponse.json({
    items: [
      ...tracks.map((b) => toItem(b, "audio")),
      ...videos.map((b) => toItem(b, "video")),
    ],
  });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { pathname, displayName, password } = body as {
    pathname?: string;
    displayName?: string;
    password?: string;
  };

  if (!process.env.UPLOAD_PASSWORD || password !== process.env.UPLOAD_PASSWORD) {
    return NextResponse.json({ error: "パスワードが違います。" }, { status: 401 });
  }
  if (!pathname || typeof displayName !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await setMediaOverride(pathname, { displayName: displayName.trim() || undefined });
  return NextResponse.json({ ok: true });
}
