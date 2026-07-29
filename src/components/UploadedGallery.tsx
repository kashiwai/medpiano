import { PillBadge } from "@/components/ui/PillBadge";
import { TrackCard } from "@/components/tracks/TrackCard";
import { getUploadedTracks } from "@/lib/uploadedTracks";

export async function UploadedGallery() {
  const uploadedTracks = await getUploadedTracks();

  if (uploadedTracks.length === 0) {
    return null;
  }

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
