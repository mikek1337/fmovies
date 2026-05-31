"use client"
import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Film } from "lucide-react";
import useWatchList from "@/hooks/use-watchlist";

interface WatchLaterItem {
  id: string;
  userId: string;
  mediaId: string;
  MediaType: string;
  title: string;
  poster_path: string;
  season: number | null;
  episode: number | null;
}

interface WatchLaterProps {
  media: WatchLaterItem[];
}

const WatchLater: FC<WatchLaterProps> = ({ media }) => {
  const { AddWatchList } = useWatchList();

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Film className="w-12 h-12 text-white/10 mb-4" />
        <p className="text-white/30 font-body text-sm">Your watchlist is empty</p>
        <p className="text-white/20 text-xs mt-1">Start exploring and add movies to your list</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {media.map((movie, i) => (
        <div
          key={`watch-${movie.id}`}
          className="group formovies-card animate-fade-in-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="aspect-[2/3] relative overflow-hidden">
            <Link href={`/home/watch/${movie.MediaType === "tv" ? "series" : "movie"}/${movie.mediaId}`}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              />
            </Link>
            <div className="absolute inset-0 bg-gradient-to-t from-formovies-dark via-transparent to-transparent" />

            <div className="absolute top-2 right-2">
              <button
                onClick={() => AddWatchList({
                  mediaId: movie.mediaId,
                  poster_url: movie.poster_path,
                  MediaType: movie.MediaType,
                  title: movie.title
                })}
                className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-formovies-rose"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-formovies-gold/20 text-formovies-gold border border-formovies-gold/30 backdrop-blur-sm">
                {movie.MediaType === "tv" ? "Series" : "Movie"}
              </span>
            </div>
          </div>

          <Link href={`/home/watch/${movie.MediaType === "tv" ? "series" : "movie"}/${movie.mediaId}`}>
            <div className="p-3">
              <h3 className="font-body text-sm font-semibold text-white/90 line-clamp-1 group-hover:text-formovies-gold transition-colors duration-300">
                {movie.title}
              </h3>
              {movie.MediaType !== "movie" && movie.season && (
                <p className="text-[11px] text-white/40 mt-1">S{movie.season} E{movie.episode}</p>
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default WatchLater;
