"use client";

import { useCallback, useEffect, useState } from "react";
import { inputStyles } from "@/components/ui/FormField";

type MediaCategory = "music" | "music-video" | "movie";
type MediaGenre = "jpop" | "rock" | "ballad" | "anime-movie" | "cm-tieup" | "edm-dance";

// blobMetadata.ts はサーバー専用の @vercel/blob に依存しているため、
// クライアントコンポーネントからはこの型・定数をここでも複製しておく。
const GENRE_OPTIONS: { value: MediaGenre; label: string }[] = [
  { value: "jpop", label: "J-POP" },
  { value: "rock", label: "ロック" },
  { value: "ballad", label: "バラード" },
  { value: "anime-movie", label: "アニメ・映画主題歌" },
  { value: "cm-tieup", label: "CM・タイアップ" },
  { value: "edm-dance", label: "EDM・ダンス" },
];

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

  return (
    <div className="flex flex-col gap-3">
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
                <div className="flex gap-2">
                  {(["music-video", "movie"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setDraft(item.pathname, { category: c })}
                      disabled={busy}
                      className={`rounded-full border-[2px] border-black px-3 py-1 font-anton text-xs uppercase transition-colors disabled:opacity-50 ${
                        currentCategory === c ? "bg-magenta" : "bg-cream text-black/50"
                      }`}
                    >
                      {c === "music-video" ? "🎵 Music Video" : "🎥 Movie"}
                    </button>
                  ))}
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

              {item.kind === "video" && currentCategory === "movie" && (
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
