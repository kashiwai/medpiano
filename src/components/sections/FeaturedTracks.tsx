import { getTranslations } from "next-intl/server";
import { PillBadge } from "@/components/ui/PillBadge";
import { Button } from "@/components/ui/Button";
import { TrackCard } from "@/components/tracks/TrackCard";
import { getUploadedTracks } from "@/lib/uploadedTracks";

export async function FeaturedTracks() {
  const t = await getTranslations("HomePage.featured");
  const featuredTracks = (await getUploadedTracks()).slice(0, 6);

  if (featuredTracks.length === 0) {
    return null;
  }

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <PillBadge color="magenta">{t("badge")}</PillBadge>
          <h2 className="mt-4 font-anton text-h1 uppercase">
            {t("title1")}
            <br />
            {t("title2")}
          </h2>
          <p className="mt-4 font-zen font-black text-xl">{t("subtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>

        <div className="text-center mt-16">
          <Button href="/works" variant="filled" color="magenta">
            {t("cta")}
          </Button>
        </div>
      </div>
    </section>
  );
}
