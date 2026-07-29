import Image from "next/image";
import { Link } from "@/i18n/routing";
import { PillBadge } from "@/components/ui/PillBadge";
import { categoryColor, formatDate } from "@/lib/utils";
import type { NewsItem, Locale } from "@/lib/types";

export function NewsCard({ news, locale }: { news: NewsItem; locale: Locale }) {
  return (
    <Link href={`/news/${news.slug}`}>
      <article className="bg-cream-light border-[3px] border-black rounded-3xl overflow-hidden shadow-sticker-sm h-full transition-transform hover:-translate-y-1 hover:rotate-[-1deg]">
        {news.thumbnail && (
          <div className="aspect-video relative bg-teal">
            <Image src={news.thumbnail} alt={news.titleEn} fill className="object-cover" />
          </div>
        )}
        <div className="p-6">
          <div className="flex gap-2 mb-3">
            <PillBadge color={categoryColor(news.category)} size="sm">
              {news.category.toUpperCase()}
            </PillBadge>
          </div>
          <time className="font-dm text-xs text-black/70">{formatDate(news.publishedAt, locale)}</time>
          <h3 className="mt-2 font-anton text-2xl uppercase leading-tight">{news.titleEn}</h3>
          <p className="mt-1 font-zen font-black text-base">{news.titleJa}</p>
        </div>
      </article>
    </Link>
  );
}
