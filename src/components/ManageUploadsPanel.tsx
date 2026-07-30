"use client";

import { useCallback, useEffect, useState } from "react";
import { inputStyles } from "@/components/ui/FormField";

type MediaItem = {
  pathname: string;
  url: string;
  uploadedAt: string;
  kind: "audio" | "video";
  displayName: string | null;
};

function fallbackName(pathname: string): string {
  const filename = pathname.split("/").pop() ?? pathname;
  return filename.replace(/\.[^./]+$/, "").replace(/-[a-zA-Z0-9]{16,}$/, "").replace(/[-_]/g, " ");
}

export function ManageUploadsPanel({ password, refreshKey }: { password: string; refreshKey: number }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
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

  async function handleSave(pathname: string, currentValue: string) {
    // 入力欄を編集せずにSaveを押しても、表示中の値（既存の名前）をそのまま送る。
    // drafts[pathname] だけを見て空文字を送ってしまうと、既存の表示名が消えてしまうバグを防ぐ。
    const displayName = (drafts[pathname] ?? currentValue).trim();
    if (!displayName) {
      setSavedMessage((prev) => ({ ...prev, [pathname]: "❌ 表示名を空にはできません" }));
      return;
    }

    setSavingPathname(pathname);
    setSavedMessage((prev) => ({ ...prev, [pathname]: "" }));
    try {
      const res = await fetch("/api/media", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname, displayName, password }),
      });
      if (res.ok) {
        await load();
        setSavedMessage((prev) => ({ ...prev, [pathname]: "✅ 保存しました" }));
      } else {
        const data = await res.json().catch(() => null);
        setSavedMessage((prev) => ({ ...prev, [pathname]: `❌ ${data?.error ?? "保存に失敗しました"}` }));
      }
    } catch {
      setSavedMessage((prev) => ({ ...prev, [pathname]: "❌ 通信エラーが発生しました" }));
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
        const current = drafts[item.pathname] ?? item.displayName ?? fallbackName(item.pathname);
        return (
          <div key={item.pathname} className="flex flex-col gap-1">
            <div className="flex flex-col gap-2 rounded-2xl border-[3px] border-black bg-cream-light p-4 sm:flex-row sm:items-center">
              <span
                className={`shrink-0 rounded-full border-[2px] border-black px-3 py-1 font-anton text-xs uppercase ${
                  item.kind === "video" ? "bg-sun" : "bg-teal"
                }`}
              >
                {item.kind === "video" ? "🎬 Video" : "🎧 Track"}
              </span>
              <input
                value={current}
                onChange={(e) => setDrafts((prev) => ({ ...prev, [item.pathname]: e.target.value }))}
                className={`${inputStyles} flex-1`}
                placeholder="表示名"
                disabled={deletingPathname === item.pathname}
              />
              <button
                onClick={() => handleSave(item.pathname, current)}
                disabled={savingPathname === item.pathname || deletingPathname === item.pathname}
                className="shrink-0 rounded-full border-[3px] border-black bg-magenta px-4 py-2 font-anton text-xs uppercase shadow-sticker-sm hover:rotate-[-2deg] transition-transform disabled:opacity-50"
              >
                {savingPathname === item.pathname ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => handleDelete(item, current)}
                disabled={deletingPathname === item.pathname}
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
            {savedMessage[item.pathname] && (
              <p className="pl-2 font-dm text-xs text-black/60">{savedMessage[item.pathname]}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
