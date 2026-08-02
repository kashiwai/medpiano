import { PillBadge } from "@/components/ui/PillBadge";
import { TrackCard } from "@/components/tracks/TrackCard";
import { PlayAllButton } from "@/components/player/PlayAllButton";
import { getUploadedTracks } from "@/lib/uploadedTracks";

export async function UploadedGallery() {
  const uploadedTracks = await getUploadedTracks();

  if (uploadedTracks.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-6 md:px-12 bg-cream-light border-y-2 border-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <PillBadge color="teal">LATEST UPLOADS</PillBadge>
            <h2 className="mt-4 font-anton text-h2 uppercase">Fresh From The Studio</h2>
          </div>
          <PlayAllButton tracks={uploadedTracks} />
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {uploadedTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </div>
    </section>
  );
}
