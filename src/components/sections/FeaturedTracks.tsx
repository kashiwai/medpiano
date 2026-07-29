import { useTranslations } from "next-intl";
import { PillBadge } from "@/components/ui/PillBadge";
import { Button } from "@/components/ui/Button";
import { TrackCard } from "@/components/tracks/TrackCard";
import tracksData from "@/data/tracks.json";
import type { Track } from "@/lib/types";

export function FeaturedTracks() {
  const t = useTranslations("HomePage.featured");
  const featuredTracks = (tracksData as Track[]).filter((track) => track.featured).slice(0, 6);

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
