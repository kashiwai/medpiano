"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Link } from "@/i18n/routing";
import { inputStyles } from "@/components/ui/FormField";
import { ManageUploadsPanel } from "@/components/ManageUploadsPanel";

function initialPassword() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("medpiano-upload-password") ?? "";
}

type Category = "tracks" | "videos";

type UploadedItem = {
  name: string;
  url: string;
};

const ACCEPT_BY_CATEGORY: Record<Category, string> = {
  tracks: "audio/mpeg,audio/wav,audio/x-wav,audio/mp4,.mp3,.wav",
  videos: "video/mp4,video/quicktime,.mp4,.mov",
};

export default function UploadPage() {
  const [password, setPassword] = useState(initialPassword);
  const [unlocked, setUnlocked] = useState(() => initialPassword() !== "");
  const [category, setCategory] = useState<Category>("tracks");
  const [status, setStatus] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<UploadedItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUnlock() {
    if (!password) return;
    sessionStorage.setItem("medpiano-upload-password", password);
    setUnlocked(true);
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setStatus("");

    const newlyUploaded: UploadedItem[] = [];

    for (const file of Array.from(files)) {
      try {
        setStatus(`アップロード中: ${file.name}`);
        const blob = await upload(`${category}/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
          clientPayload: password,
        });
        newlyUploaded.push({ name: file.name, url: blob.url });
      } catch (error) {
        setStatus(`エラー: ${file.name} — ${(error as Error).message}`);
        setUploading(false);
        return;
      }
    }

    setUploaded((prev) => [...newlyUploaded, ...prev]);
    setStatus(`${newlyUploaded.length}件アップロード完了`);
    setUploading(false);
    setRefreshKey((k) => k + 1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  if (!unlocked) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <h1 className="font-anton text-2xl uppercase">🔒 Upload</h1>
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

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="font-anton text-3xl uppercase">🎵 Upload Tracks &amp; Videos</h1>
        <p className="mt-2 font-dm text-sm text-black/60">
          アップロードした音源・動画はWORKSページに自動反映されます（再デプロイ不要）。
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setCategory("tracks")}
          className={`rounded-full border-[3px] border-black px-4 py-2 font-anton text-sm uppercase transition-colors ${
            category === "tracks" ? "bg-magenta" : "bg-cream-light"
          }`}
        >
          🎧 Tracks (mp3 / wav)
        </button>
        <button
          onClick={() => setCategory("videos")}
          className={`rounded-full border-[3px] border-black px-4 py-2 font-anton text-sm uppercase transition-colors ${
            category === "videos" ? "bg-teal" : "bg-cream-light"
          }`}
        >
          🎬 Videos (mp4 / mov)
        </button>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-[3px] border-dashed border-black bg-cream-light p-10 text-center hover:bg-sun/20">
        <span className="text-3xl">📁</span>
        <span className="font-anton text-sm uppercase">Click to select files (multiple OK)</span>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPT_BY_CATEGORY[category]}
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {status && <p className="font-dm text-sm text-black/70">{status}</p>}

      {uploaded.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="font-anton text-sm uppercase text-black/50">Uploaded this session</h2>
          {uploaded.map((item) => (
            <div
              key={item.url}
              className="flex items-center justify-between rounded-xl border-[3px] border-black bg-cream-light px-4 py-2 text-sm"
            >
              <span className="truncate font-dm">{item.name}</span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 shrink-0 font-anton text-xs uppercase text-magenta hover:underline"
              >
                Check ↗
              </a>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 border-t-2 border-black pt-6">
        <h2 className="font-anton text-xl uppercase mb-1">📋 Manage Uploaded Files</h2>
        <p className="mb-4 font-dm text-sm text-black/60">
          表示名を編集してSaveすると、WORKSページのカード表示にすぐ反映されます。
        </p>
        <ManageUploadsPanel password={password} refreshKey={refreshKey} />
      </div>

      <div className="flex gap-2">
        <Link
          href="/works"
          className="self-start rounded-full border-[3px] border-black bg-teal px-4 py-1.5 font-anton text-xs uppercase shadow-sticker-sm"
        >
          ← Works
        </Link>
        <Link
          href="/inquiries"
          className="self-start rounded-full border-[3px] border-black bg-sun px-4 py-1.5 font-anton text-xs uppercase shadow-sticker-sm"
        >
          📬 Inquiries
        </Link>
      </div>
    </main>
  );
}
