import { list } from "@vercel/blob";
import { PillBadge } from "@/components/ui/PillBadge";
import { TrackCard } from "@/components/tracks/TrackCard";
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

function toTrack(blob: { pathname: string; url: string; uploadedAt: Date | string }, kind: "audio" | "video"): Track {
  const title = displayTitle(blob.pathname).replace(/[-_]/g, " ").toUpperCase();
  return {
    id: blob.url,
    slug: blob.url,
    titleEn: title,
    titleJa: title,
    category: "original",
    year: new Date(blob.uploadedAt).getFullYear(),
    duration: 0,
    mediaUrl: blob.url,
    mediaKind: kind,
    featured: false,
    tags: [],
  };
}

export async function UploadedGallery() {
  const [tracks, videos] = await Promise.all([safeList("tracks/"), safeList("videos/")]);

  if (tracks.length === 0 && videos.length === 0) {
    return null;
  }

  const uploadedTracks: Track[] = [
    ...tracks.map((blob) => toTrack(blob, "audio")),
    ...videos.map((blob) => toTrack(blob, "video")),
  ];

  return (
    <section className="py-16 px-6 md:px-12 bg-cream-light border-y-2 border-black">
      <div className="max-w-7xl mx-auto">
        <PillBadge color="teal">LATEST UPLOADS</PillBadge>
        <h2 className="mt-4 font-anton text-h2 uppercase mb-10">Fresh From The Studio</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {uploadedTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </div>
    </section>
  );
}
