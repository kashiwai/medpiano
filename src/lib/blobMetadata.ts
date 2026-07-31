import { list, put, del } from "@vercel/blob";

const METADATA_PREFIX = "metadata/overrides/";

export type MediaCategory = "music" | "music-video" | "movie";

export type MediaGenre = "jpop" | "rock" | "ballad" | "anime-movie" | "cm-tieup" | "edm-dance";

export const MEDIA_GENRES: { value: MediaGenre; label: string }[] = [
  { value: "jpop", label: "J-POP" },
  { value: "rock", label: "ロック" },
  { value: "ballad", label: "バラード" },
  { value: "anime-movie", label: "アニメ・映画主題歌" },
  { value: "cm-tieup", label: "CM・タイアップ" },
  { value: "edm-dance", label: "EDM・ダンス" },
];

export type MediaOverride = {
  displayName?: string;
  category?: MediaCategory;
  genre?: MediaGenre;
  year?: number;
  lyrics?: string;
  description?: string;
};

export type MediaOverrides = Record<string, MediaOverride>;

// 日本語ファイル名は入力経路（ブラウザアップロード／手動コピペ等）によって
// Unicode正規化形式（NFC/NFD）が揺れることがあり、見た目が同じでも文字列として
// 一致しない場合がある。パス名は必ずこれを通して比較・キーとして使う。
export function normalizePathname(pathname: string): string {
  return pathname.normalize("NFC");
}

// アップロードしたファイルの表示名などを、ファイルごとに別々の小さなJSONとして
// 同じBlobストアに置く。1つの共有JSONを読み書きする方式だと、直前の書き込みが
// 反映される前に次の読み込みが走って他の項目の上書き内容が消える競合が起きたため、
// 「読み込んでからマージして書き戻す」処理が不要な、この方式に変更した。
function overridePathname(pathname: string): string {
  return `${METADATA_PREFIX}${normalizePathname(pathname)}.json`;
}

export async function getMediaOverrides(): Promise<MediaOverrides> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
  try {
    const { blobs } = await list({ prefix: METADATA_PREFIX });
    const cacheBust = Date.now();
    const entries = await Promise.all(
      blobs.map(async (blob) => {
        const originalPathname = normalizePathname(blob.pathname.slice(METADATA_PREFIX.length, -".json".length));
        try {
          const res = await fetch(`${blob.url}?v=${cacheBust}`, { cache: "no-store" });
          if (!res.ok) return null;
          const override = (await res.json()) as MediaOverride;
          return [originalPathname, override] as const;
        } catch {
          return null;
        }
      }),
    );

    return Object.fromEntries(entries.filter((entry): entry is [string, MediaOverride] => entry !== null));
  } catch {
    return {};
  }
}

// 1件だけ上書き情報を読む。PATCHで一部フィールドだけ更新する際に
// 既存の他フィールド（歌詞・カテゴリ等）を消さないよう、まずこれで現在値を取得してからマージする。
export async function getMediaOverride(pathname: string): Promise<MediaOverride> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return {};
  try {
    const { blobs } = await list({ prefix: overridePathname(pathname) });
    if (blobs.length === 0) return {};
    const res = await fetch(`${blobs[0].url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return {};
    return (await res.json()) as MediaOverride;
  } catch {
    return {};
  }
}

export async function setMediaOverride(pathname: string, override: MediaOverride): Promise<void> {
  await put(overridePathname(pathname), JSON.stringify(override), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

// ファイル削除時に、対応する上書き情報（表示名など）も一緒に消す
export async function removeMediaOverride(pathname: string): Promise<void> {
  try {
    await del(overridePathname(pathname));
  } catch {
    // 上書き情報がそもそも無かった場合は何もしない
  }
}
