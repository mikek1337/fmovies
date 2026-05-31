"use client"
import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Play } from "lucide-react";

interface RecentlyViewedItem {
  id: string;
  mediaId: string;
  MediaType: string;
  userId: string;
  poster_path: string;
  title: string;
  season: number | null;
  episodeId: number | null;
  createdAt: Date;
}

interface RecentlyViewedProps {
  recentlyViewed: RecentlyViewedItem[];
  hasBtn?: boolean;
}

const RecentlyViewed: FC<RecentlyViewedProps> = ({ recentlyViewed, hasBtn }) => {
  if (recentlyViewed.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-4 -mx-2 px-2 snap-x snap-mandatory">
        {recentlyViewed.map((movie, i) => (
          <Link
            key={`review-${movie.id}`}
            href={`/home/watch/${movie.MediaType === "tv" ? "series" : "movie"}/${movie.mediaId}`}
            className="group formovies-card w-[280px] shrink-0 snap-start animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="aspect-[2/3] relative overflow-hidden">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-formovies-dark via-transparent to-transparent" />

              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-formovies-gold/20 text-formovies-gold border border-formovies-gold/30 backdrop-blur-sm">
                  {movie.MediaType === "tv" ? "Series" : "Movie"}
                </span>
              </div>

              {hasBtn && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-14 h-14 rounded-full bg-formovies-gold/90 flex items-center justify-center backdrop-blur-sm transform scale-75 group-hover:scale-100 transition-transform duration-500">
                    <Play className="w-6 h-6 text-formovies-dark fill-current ml-0.5" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-body text-sm font-semibold text-white/90 line-clamp-1 group-hover:text-formovies-gold transition-colors duration-300">
                {movie.title}
              </h3>

              <div className="flex items-center gap-2 mt-2">
                <Clock className="w-3 h-3 text-white/30" />
                <span className="text-[11px] text-white/40 font-medium">
                  {movie.MediaType !== "movie" && movie.season ? (
                    <>S{movie.season} E{movie.episodeId}</>
                  ) : (
                    "Continue watching"
                  )}
                </span>
              </div>

              {hasBtn && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <span className="flex items-center justify-center gap-2 text-xs font-semibold text-formovies-gold/80 group-hover:text-formovies-gold transition-colors duration-300">
                    <Play className="w-3.5 h-3.5" />
                    Resume
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
