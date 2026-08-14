"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { inputStyles } from "@/components/ui/FormField";
import { PillBadge } from "@/components/ui/PillBadge";
import type { BrandColor } from "@/lib/utils";

function initialPassword() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("medpiano-upload-password") ?? "";
}

type InquiryStatus = "new" | "read" | "responded" | "archived";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  projectType: string;
  budget: string | null;
  timeline: string | null;
  message: string;
  referencedTrack: string | null;
  locale: string;
  status: InquiryStatus;
  createdAt: string;
};

const STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "🆕 New",
  read: "👀 Read",
  responded: "✅ Responded",
  archived: "🗄 Archived",
};

const STATUS_COLOR: Record<InquiryStatus, BrandColor> = {
  new: "magenta",
  read: "sun",
  responded: "teal",
  archived: "cream",
};

const STATUS_ORDER: InquiryStatus[] = ["new", "read", "responded", "archived"];

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function InquiriesPanel() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("id");

  const [password, setPassword] = useState(initialPassword);
  const [unlocked, setUnlocked] = useState(() => initialPassword() !== "");
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<InquiryStatus | "all">("all");

  function handleUnlock() {
    if (!password) return;
    sessionStorage.setItem("medpiano-upload-password", password);
    setUnlocked(true);
  }

  const load = useCallback(async (pw: string) => {
    setError("");
    const res = await fetch(`/api/inquiries?password=${encodeURIComponent(pw)}`, { cache: "no-store" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "読み込みに失敗しました");
      setUnlocked(false);
      sessionStorage.removeItem("medpiano-upload-password");
      return;
    }
    const data = (await res.json()) as { items: Inquiry[] };
    setItems(data.items);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(password);
  }, [unlocked, password, load]);

  async function updateStatus(id: string, status: InquiryStatus) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, password }),
      });
      if (res.ok) {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
      }
    } finally {
      setUpdatingId(null);
    }
  }

  if (!unlocked) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <h1 className="font-anton text-2xl uppercase">🔒 Inquiries</h1>
        <div className="flex w-full max-w-sm flex-col gap-3 rounded-3xl border-[3px] border-black bg-cream-light p-6 shadow-sticker">
          <label className="font-anton text-sm uppercase text-black/60">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            className={inputStyles}
            autoFocus
          />
          {error && <p className="font-dm text-xs text-magenta">{error}</p>}
          <button
            onClick={handleUnlock}
            className="rounded-full border-[3px] border-black bg-magenta px-4 py-2.5 font-anton text-sm uppercase shadow-sticker-sm hover:rotate-[-2deg] transition-transform"
          >
            Enter
          </button>
        </div>
      </main>
    );
  }

  const visibleItems = filter === "all" ? items : items.filter((item) => item.status === filter);
  const newCount = items.filter((item) => item.status === "new").length;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="font-anton text-3xl uppercase">📬 Inquiries</h1>
        <p className="mt-2 font-dm text-sm text-black/60">
          お問い合わせフォームからの送信をすべて確認できます。{newCount > 0 && `未読 ${newCount}件`}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full border-[3px] border-black px-4 py-2 font-anton text-xs uppercase transition-colors ${
            filter === "all" ? "bg-black text-cream" : "bg-cream-light"
          }`}
        >
          All ({items.length})
        </button>
        {STATUS_ORDER.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-full border-[3px] border-black px-4 py-2 font-anton text-xs uppercase transition-colors ${
              filter === status ? "bg-black text-cream" : "bg-cream-light"
            }`}
          >
            {STATUS_LABEL[status]} ({items.filter((item) => item.status === status).length})
          </button>
        ))}
      </div>

      {error && <p className="font-dm text-sm text-magenta">{error}</p>}
      {!loaded && !error && <p className="font-dm text-sm text-black/50">読み込み中...</p>}
      {loaded && visibleItems.length === 0 && (
        <p className="font-dm text-sm text-black/50">該当するお問い合わせはありません。</p>
      )}

      <div className="flex flex-col gap-4">
        {visibleItems.map((item) => (
          <div
            key={item.id}
            id={item.id}
            className={`flex flex-col gap-3 rounded-2xl border-[3px] p-5 transition-colors ${
              item.id === highlightId ? "border-magenta bg-sun/20 shadow-sticker" : "border-black bg-cream-light"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <PillBadge color={STATUS_COLOR[item.status]} size="sm">
                  {STATUS_LABEL[item.status]}
                </PillBadge>
                <span className="font-anton text-xs uppercase text-black/40">{formatDateTime(item.createdAt)}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_ORDER.filter((status) => status !== item.status).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(item.id, status)}
                    disabled={updatingId === item.id}
                    className="rounded-full border-[2px] border-black bg-cream px-3 py-1 font-anton text-[10px] uppercase text-black/70 transition-colors hover:bg-black hover:text-cream disabled:opacity-50"
                  >
                    → {STATUS_LABEL[status]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-1 sm:grid-cols-2">
              <p className="font-dm text-sm">
                <span className="text-black/50">Name: </span>
                {item.name}
              </p>
              <p className="font-dm text-sm">
                <span className="text-black/50">Email: </span>
                <a href={`mailto:${item.email}`} className="text-magenta hover:underline">
                  {item.email}
                </a>
              </p>
              {item.company && (
                <p className="font-dm text-sm">
                  <span className="text-black/50">Company: </span>
                  {item.company}
                </p>
              )}
              <p className="font-dm text-sm">
                <span className="text-black/50">Type: </span>
                {item.projectType}
              </p>
              {item.budget && (
                <p className="font-dm text-sm">
                  <span className="text-black/50">Budget: </span>
                  {item.budget}
                </p>
              )}
              {item.timeline && (
                <p className="font-dm text-sm">
                  <span className="text-black/50">Timeline: </span>
                  {item.timeline}
                </p>
              )}
              {item.referencedTrack && (
                <p className="font-dm text-sm sm:col-span-2">
                  <span className="text-black/50">Referenced Track: </span>
                  {item.referencedTrack}
                </p>
              )}
            </div>

            <p className="whitespace-pre-wrap rounded-xl border-2 border-black/10 bg-cream p-3 font-dm text-sm">
              {item.message}
            </p>

            <a
              href={`mailto:${item.email}?subject=${encodeURIComponent("Re: MedPianoへのお問い合わせ")}`}
              className="self-start rounded-full border-[3px] border-black bg-teal px-4 py-1.5 font-anton text-xs uppercase shadow-sticker-sm"
            >
              ✉️ Reply by email
            </a>
          </div>
        ))}
      </div>

      <Link
        href="/upload"
        className="self-start rounded-full border-[3px] border-black bg-cream-light px-4 py-1.5 font-anton text-xs uppercase shadow-sticker-sm"
      >
        ← Upload admin
      </Link>
    </main>
  );
}
