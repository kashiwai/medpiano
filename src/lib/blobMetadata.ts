import { list, put } from "@vercel/blob";

const METADATA_PATHNAME = "metadata/overrides.json";

export type MediaOverride = {
  displayName?: string;
};

export type MediaOverrides = Record<string, MediaOverride>;

// アップロードしたファイルの表示名などを、ファイル名とは別に上書き保存するための
// 小さなJSONを同じBlobストアに置く（専用DBを増やさないための最小構成）。
export async function getMediaOverrides(): Promise<MediaOverrides> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
  try {
    const { blobs } = await list({ prefix: METADATA_PATHNAME });
    const existing = blobs.find((blob) => blob.pathname === METADATA_PATHNAME);
    if (!existing) return {};
    const res = await fetch(existing.url, { cache: "no-store" });
    if (!res.ok) return {};
    return (await res.json()) as MediaOverrides;
  } catch {
    return {};
  }
}

export async function setMediaOverride(pathname: string, override: MediaOverride): Promise<MediaOverrides> {
  const current = await getMediaOverrides();
  const next: MediaOverrides = { ...current, [pathname]: { ...current[pathname], ...override } };
  await put(METADATA_PATHNAME, JSON.stringify(next, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return next;
}
