"use client";

import { useCallback, useEffect, useState } from "react";
import { inputStyles } from "@/components/ui/FormField";

type MediaCategory = "music" | "music-video" | "movie" | "drama" | "trailer";
type MediaGenre = "jpop" | "rock" | "ballad" | "anime-movie" | "cm-tieup" | "edm-dance";

// blobMetadata.ts はサーバー専用の @vercel/blob に依存しているため、
// クライアントコンポーネントからはこの型・定数をここでも複製しておく。
const VIDEO_CATEGORY_OPTIONS: { value: Extract<MediaCategory, "music-video" | "movie" | "drama" | "trailer">; label: string }[] = [
  { value: "music-video", label: "🎵 MV" },
  { value: "movie", label: "🎥 映画" },
  { value: "drama", label: "📺 ドラマ" },
  { value: "trailer", label: "🎬 予告" },
];

const GENRE_OPTIONS: { value: MediaGenre; label: string }[] = [
  { value: "jpop", label: "J-POP" },
  { value: "rock", label: "ロック" },
  { value: "ballad", label: "バラード" },
  { value: "anime-movie", label: "アニメ・映画主題歌" },
  { value: "cm-tieup", label: "CM・タイアップ" },
  { value: "edm-dance", label: "EDM・ダンス" },
];

type MuxStatus = "preparing" | "ready" | "errored";

type MediaItem = {
  pathname: string;
  url: string;
  uploadedAt: string;
  kind: "audio" | "video";
  displayName: string | null;
  category: MediaCategory;
  genre: MediaGenre | null;
  year: number;
  lyrics: string | null;
  description: string | null;
  muxStatus: MuxStatus | null;
  muxPlaybackId: string | null;
};

type Draft = {
  displayName?: string;
  category?: MediaCategory;
  genre?: MediaGenre | "";
  year?: string;
  lyrics?: string;
  description?: string;
};

function fallbackName(pathname: string): string {
  const filename = pathname.split("/").pop() ?? pathname;
  return filename.replace(/\.[^./]+$/, "").replace(/-[a-zA-Z0-9]{16,}$/, "").replace(/[-_]/g, " ");
}

export function ManageUploadsPanel({ password, refreshKey }: { password: string; refreshKey: number }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [savingPathname, setSavingPathname] = useState<string | null>(null);
  const [deletingPathname, setDeletingPathname] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/media", { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as { items: MediaItem[] };
    setItems(data.items);
    setLoaded(true);
    // 前回のセッションで変換中のまま残っている項目も、画面を開き直したら自動で追跡を再開する
    data.items
      .filter((item) => item.kind === "video" && item.muxStatus === "preparing")
      .forEach((item) => pollMuxStatus(item.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // アップロード一覧をサーバーから取得する非同期処理。ブラウザAPIの同期読み取りでは
    // 代替できないため、このマウント時fetchについてはルールを無効化する。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load, refreshKey]);

  function setDraft(pathname: string, patch: Draft) {
    setDrafts((prev) => ({ ...prev, [pathname]: { ...prev[pathname], ...patch } }));
  }

  function updateItemMux(pathname: string, patch: Partial<Pick<MediaItem, "muxStatus" | "muxPlaybackId">>) {
    setItems((prev) => prev.map((i) => (i.pathname === pathname ? { ...i, ...patch } : i)));
  }

  async function pollMuxStatus(pathname: string) {
    for (let attempt = 0; attempt < 40; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      try {
        const res = await fetch(
          `/api/mux?pathname=${encodeURIComponent(pathname)}&password=${encodeURIComponent(password)}`,
        );
        if (!res.ok) return;
        const data = (await res.json()) as { status: MuxStatus | null; playbackId: string | null };
        if (data.status === "ready" || data.status === "errored") {
          updateItemMux(pathname, { muxStatus: data.status, muxPlaybackId: data.playbackId });
          return;
        }
      } catch {
        return;
      }
    }
  }

  async function convertToHls(item: MediaItem) {
    updateItemMux(item.pathname, { muxStatus: "preparing" });
    try {
      const res = await fetch("/api/mux", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname: item.pathname, url: item.url, password }),
      });
      if (!res.ok) {
        updateItemMux(item.pathname, { muxStatus: null });
        return;
      }
      pollMuxStatus(item.pathname);
    } catch {
      updateItemMux(item.pathname, { muxStatus: null });
    }
  }

  async function handleSave(item: MediaItem) {
    const draft = drafts[item.pathname] ?? {};
    // 編集欄を触らずSaveを押しても、表示中の値（既存の値）をそのまま送る。
    // draft だけを見て空文字を送ってしまうと、既存の値が消えてしまうバグを防ぐ。
    const displayName = (draft.displayName ?? item.displayName ?? fallbackName(item.pathname)).trim();
    if (!displayName) {
      setSavedMessage((prev) => ({ ...prev, [item.pathname]: "❌ 表示名を空にはできません" }));
      return;
    }
    const category = draft.category ?? item.category;
    const genre = draft.genre ?? item.genre ?? "";
    const yearRaw = draft.year ?? String(item.year);
    const year = Number(yearRaw);
    if (!Number.isFinite(year) || year < 1900 || year > 2100) {
      setSavedMessage((prev) => ({ ...prev, [item.pathname]: "❌ 制作年が正しくありません" }));
      return;
    }
    const lyrics = draft.lyrics ?? item.lyrics ?? "";
    const description = draft.description ?? item.description ?? "";

    setSavingPathname(item.pathname);
    setSavedMessage((prev) => ({ ...prev, [item.pathname]: "" }));
    try {
      const res = await fetch("/api/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathname: item.pathname,
          displayName,
          category,
          genre,
          year,
          lyrics,
          description,
          password,
        }),
      });
      if (res.ok) {
        await load();
        setSavedMessage((prev) => ({ ...prev, [item.pathname]: "✅ 保存しました" }));
      } else {
        const data = await res.json().catch(() => null);
        setSavedMessage((prev) => ({ ...prev, [item.pathname]: `❌ ${data?.error ?? "保存に失敗しました"}` }));
      }
    } catch {
      setSavedMessage((prev) => ({ ...prev, [item.pathname]: "❌ 通信エラーが発生しました" }));
    } finally {
      setSavingPathname(null);
    }
  }

  async function handleDelete(item: MediaItem, label: string) {
    const confirmed = window.confirm(`「${label}」を削除します。この操作は取り消せません。よろしいですか？`);
    if (!confirmed) return;

    setDeletingPathname(item.pathname);
    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname: item.pathname, url: item.url, password }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.pathname !== item.pathname));
      } else {
        const data = await res.json().catch(() => null);
        setSavedMessage((prev) => ({ ...prev, [item.pathname]: `❌ ${data?.error ?? "削除に失敗しました"}` }));
      }
    } catch {
      setSavedMessage((prev) => ({ ...prev, [item.pathname]: "❌ 通信エラーが発生しました" }));
    } finally {
      setDeletingPathname(null);
    }
  }

  if (!loaded) return null;
  if (items.length === 0) {
    return <p className="font-dm text-sm text-black/50">まだアップロードされたファイルがありません。</p>;
  }

  const unconvertedVideos = items.filter((i) => i.kind === "video" && !i.muxStatus);

  return (
    <div className="flex flex-col gap-3">
      {unconvertedVideos.length > 0 && (
        <button
          onClick={() => unconvertedVideos.forEach((item) => convertToHls(item))}
          className="self-start rounded-full border-[3px] border-black bg-teal px-4 py-2 font-anton text-xs uppercase shadow-sticker-sm hover:rotate-[-2deg] transition-transform"
        >
          🎬 Convert all {unconvertedVideos.length} videos to HLS
        </button>
      )}
      {items.map((item) => {
        const draft = drafts[item.pathname] ?? {};
        const currentName = draft.displayName ?? item.displayName ?? fallbackName(item.pathname);
        const currentCategory = draft.category ?? item.category;
        const currentGenre = draft.genre ?? item.genre ?? "";
        const currentYear = draft.year ?? String(item.year);
        const currentLyrics = draft.lyrics ?? item.lyrics ?? "";
        const currentDescription = draft.description ?? item.description ?? "";
        const busy = savingPathname === item.pathname || deletingPathname === item.pathname;

        return (
          <div key={item.pathname} className="flex flex-col gap-1">
            <div className="flex flex-col gap-3 rounded-2xl border-[3px] border-black bg-cream-light p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <span
                  className={`shrink-0 rounded-full border-[2px] border-black px-3 py-1 font-anton text-xs uppercase ${
                    item.kind === "video" ? "bg-sun" : "bg-teal"
                  }`}
                >
                  {item.kind === "video" ? "🎬 Video" : "🎧 Track"}
                </span>
                <input
                  value={currentName}
                  onChange={(e) => setDraft(item.pathname, { displayName: e.target.value })}
                  className={`${inputStyles} flex-1`}
                  placeholder="表示名"
                  disabled={busy}
                />
                <input
                  type="number"
                  value={currentYear}
                  onChange={(e) => setDraft(item.pathname, { year: e.target.value })}
                  className={`${inputStyles} w-full sm:w-28`}
                  placeholder="制作年"
                  disabled={busy}
                />
                <button
                  onClick={() => handleSave(item)}
                  disabled={busy}
                  className="shrink-0 rounded-full border-[3px] border-black bg-magenta px-4 py-2 font-anton text-xs uppercase shadow-sticker-sm hover:rotate-[-2deg] transition-transform disabled:opacity-50"
                >
                  {savingPathname === item.pathname ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => handleDelete(item, currentName)}
                  disabled={busy}
                  className="shrink-0 rounded-full border-[3px] border-black bg-cream px-4 py-2 font-anton text-xs uppercase text-black/70 shadow-sticker-sm hover:bg-black hover:text-cream transition-colors disabled:opacity-50"
                >
                  {deletingPathname === item.pathname ? "Deleting..." : "🗑 Delete"}
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 font-anton text-xs uppercase text-black/40 hover:text-black"
                >
                  ↗
                </a>
              </div>

              {item.kind === "video" ? (
                <div className="flex flex-wrap items-center gap-2">
                  {VIDEO_CATEGORY_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setDraft(item.pathname, { category: c.value })}
                      disabled={busy}
                      className={`rounded-full border-[2px] border-black px-3 py-1 font-anton text-xs uppercase transition-colors disabled:opacity-50 ${
                        currentCategory === c.value ? "bg-magenta" : "bg-cream text-black/50"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}

                  <span className="mx-1 h-5 w-px bg-black/20" />

                  {item.muxStatus === "ready" ? (
                    <span className="rounded-full border-[2px] border-black bg-teal px-3 py-1 font-anton text-xs uppercase">
                      ✅ HLS Ready
                    </span>
                  ) : item.muxStatus === "preparing" ? (
                    <span className="rounded-full border-[2px] border-black bg-sun px-3 py-1 font-anton text-xs uppercase">
                      ⏳ Converting...
                    </span>
                  ) : item.muxStatus === "errored" ? (
                    <>
                      <span className="rounded-full border-[2px] border-black bg-magenta px-3 py-1 font-anton text-xs uppercase">
                        ❌ HLS Failed
                      </span>
                      <button
                        onClick={() => convertToHls(item)}
                        className="rounded-full border-[2px] border-black bg-cream px-3 py-1 font-anton text-xs uppercase text-black/70 hover:bg-black hover:text-cream transition-colors"
                      >
                        Retry
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => convertToHls(item)}
                      className="rounded-full border-[2px] border-black bg-cream px-3 py-1 font-anton text-xs uppercase text-black/50 hover:bg-black hover:text-cream transition-colors"
                    >
                      🎬 Convert to HLS
                    </button>
                  )}
                </div>
              ) : (
                <span className="w-fit rounded-full border-[2px] border-black bg-teal px-3 py-1 font-anton text-xs uppercase">
                  🎵 Music
                </span>
              )}

              <div className="flex flex-wrap gap-2">
                {GENRE_OPTIONS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() =>
                      setDraft(item.pathname, { genre: currentGenre === g.value ? "" : g.value })
                    }
                    disabled={busy}
                    className={`rounded-full border-[2px] border-black px-3 py-1 font-anton text-xs uppercase transition-colors disabled:opacity-50 ${
                      currentGenre === g.value ? "bg-sun" : "bg-cream text-black/50"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              {(item.kind === "audio" || currentCategory === "music-video") && (
                <textarea
                  value={currentLyrics}
                  onChange={(e) => setDraft(item.pathname, { lyrics: e.target.value })}
                  className={`${inputStyles} min-h-24`}
                  placeholder="歌詞（任意）"
                  disabled={busy}
                />
              )}

              {item.kind === "video" && currentCategory !== "music-video" && (
                <textarea
                  value={currentDescription}
                  onChange={(e) => setDraft(item.pathname, { description: e.target.value })}
                  className={`${inputStyles} min-h-24`}
                  placeholder="内容・あらすじ（任意）"
                  disabled={busy}
                />
              )}
            </div>
            {savedMessage[item.pathname] && (
              <p className="pl-2 font-dm text-xs text-black/60">{savedMessage[item.pathname]}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
