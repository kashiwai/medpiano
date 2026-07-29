import { list } from "@vercel/blob";
import { PillBadge } from "@/components/ui/PillBadge";

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

export async function UploadedGallery() {
  const [tracks, videos] = await Promise.all([safeList("tracks/"), safeList("videos/")]);

  if (tracks.length === 0 && videos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-6 md:px-12 bg-cream-light border-y-2 border-black">
      <div className="max-w-7xl mx-auto">
        <PillBadge color="teal">LATEST UPLOADS</PillBadge>
        <h2 className="mt-4 font-anton text-h2 uppercase mb-10">Fresh From The Studio</h2>

        {tracks.length > 0 && (
          <div className="mb-12">
            <h3 className="mb-4 font-anton text-sm uppercase text-black/40">🎧 Tracks</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map((blob) => (
                <div
                  key={blob.url}
                  className="flex flex-col gap-2 rounded-2xl border-[3px] border-black bg-cream p-4 shadow-sticker-sm"
                >
                  <p className="truncate font-anton text-sm uppercase">{displayTitle(blob.pathname)}</p>
                  <audio controls preload="none" className="w-full" src={blob.url} />
                </div>
              ))}
            </div>
          </div>
        )}

        {videos.length > 0 && (
          <div>
            <h3 className="mb-4 font-anton text-sm uppercase text-black/40">🎬 Videos</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {videos.map((blob) => (
                <div
                  key={blob.url}
                  className="flex flex-col gap-2 rounded-2xl border-[3px] border-black bg-cream p-4 shadow-sticker-sm"
                >
                  <p className="truncate font-anton text-sm uppercase">{displayTitle(blob.pathname)}</p>
                  <video
                    controls
                    preload="none"
                    playsInline
                    className="aspect-video w-full rounded-xl border-[3px] border-black bg-black object-cover"
                    src={blob.url}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
