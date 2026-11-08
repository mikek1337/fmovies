"use client";

import { FC, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Film,
  Play,
  Trash2,
  Tv,
  Search,
  BookmarkX,
} from "lucide-react";
import useWatchList from "@/hooks/use-watchlist";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export interface WatchLaterItem {
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
  onItemsChange?: (count: number) => void;
  showFilters?: boolean;
}

const WatchLater: FC<WatchLaterProps> = ({
  media: initialMedia,
  onItemsChange,
  showFilters = true,
}) => {
  const [items, setItems] = useState<WatchLaterItem[]>(initialMedia);
  const [filterType, setFilterType] = useState<"all" | "movie" | "tv">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { AddWatchList } = useWatchList();
  const { toast } = useToast();

  const handleRemove = async (item: WatchLaterItem) => {
    // Optimistically remove from UI
    const updated = items.filter((i) => i.id !== item.id);
    setItems(updated);
    onItemsChange?.(updated.length);

    try {
      await axios.delete(`/api/user/watchlist?id=${item.id}&mediaId=${item.mediaId}`);
      toast({
        title: "Removed",
        description: `"${item.title}" removed from your watchlist`,
      });
    } catch {
      // Fallback: call AddWatchList toggle
      AddWatchList({
        mediaId: item.mediaId,
        poster_url: item.poster_path,
        MediaType: item.MediaType,
        title: item.title,
      });
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesType =
        filterType === "all" ? true : item.MediaType === filterType;
      const matchesSearch = searchQuery.trim()
        ? item.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
        : true;
      return matchesType && matchesSearch;
    });
  }, [items, filterType, searchQuery]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl bg-white/[0.02] border border-white/5">
        <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mb-4">
          <BookmarkX className="size-8" />
        </div>
        <h3 className="text-base font-semibold text-white/80">
          Your Watchlist is empty
        </h3>
        <p className="text-xs text-white/40 max-w-sm mt-1.5 leading-relaxed">
          Explore movies and series, and click the &ldquo;Watchlist&rdquo; button to keep track of titles you want to watch later.
        </p>
        <div className="flex items-center gap-3 mt-6">
          <Link
            href="/home/movies"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-formovies-gold text-formovies-dark font-semibold text-xs hover:bg-formovies-amber transition-all"
          >
            <Film className="size-3.5" />
            Explore Movies
          </Link>
          <Link
            href="/home/series"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 text-white font-semibold text-xs hover:bg-white/15 transition-all"
          >
            <Tv className="size-3.5" />
            Explore Series
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      {showFilters && items.length > 3 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
          {/* Search within watchlist */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
            <input
              type="text"
              placeholder="Filter watchlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 outline-none focus:border-formovies-gold/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/10">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all",
                filterType === "all"
                  ? "bg-formovies-gold text-formovies-dark font-bold shadow-sm"
                  : "text-white/50 hover:text-white"
              )}
            >
              All ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("movie")}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all",
                filterType === "movie"
                  ? "bg-formovies-gold text-formovies-dark font-bold shadow-sm"
                  : "text-white/50 hover:text-white"
              )}
            >
              Movies ({items.filter((i) => i.MediaType === "movie").length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("tv")}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all",
                filterType === "tv"
                  ? "bg-formovies-gold text-formovies-dark font-bold shadow-sm"
                  : "text-white/50 hover:text-white"
              )}
            >
              Series ({items.filter((i) => i.MediaType === "tv").length})
            </button>
          </div>
        </div>
      )}

      {/* Grid of Watchlist Items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredItems.map((movie, i) => (
          <div
            key={`watch-${movie.id}`}
            className="group formovies-card flex flex-col justify-between hover:border-formovies-gold/40 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="aspect-[2/3] relative overflow-hidden rounded-t-xl bg-formovies-deeper">
              <Link
                href={`/home/watch/${
                  movie.MediaType === "tv" ? "series" : "movie"
                }/${movie.mediaId}`}
              >
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-white/30">
                    <Film className="size-8" />
                  </div>
                )}
              </Link>
              <div className="absolute inset-0 bg-gradient-to-t from-formovies-dark via-transparent to-transparent pointer-events-none" />

              {/* Media Type Badge */}
              <div className="absolute top-2 left-2 z-10 pointer-events-none">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-black/60 text-formovies-gold border border-formovies-gold/30 backdrop-blur-sm">
                  {movie.MediaType === "tv" ? "Series" : "Movie"}
                </span>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(movie)}
                title="Remove from watchlist"
                aria-label="Remove from watchlist"
                className="absolute top-2 right-2 z-20 size-7 rounded-full bg-black/60 hover:bg-red-500/80 text-white/70 hover:text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <X className="size-3.5" />
              </button>

              {/* Hover Play CTA Overlay */}
              <Link
                href={`/home/watch/${
                  movie.MediaType === "tv" ? "series" : "movie"
                }/${movie.mediaId}`}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="size-11 rounded-full bg-formovies-gold text-formovies-dark flex items-center justify-center shadow-lg shadow-formovies-gold/30 transform scale-75 group-hover:scale-100 transition-transform">
                  <Play className="size-5 fill-current ml-0.5" />
                </div>
              </Link>
            </div>

            <div className="p-3">
              <Link
                href={`/home/watch/${
                  movie.MediaType === "tv" ? "series" : "movie"
                }/${movie.mediaId}`}
              >
                <h3 className="font-body text-xs sm:text-sm font-semibold text-white/90 line-clamp-1 group-hover:text-formovies-gold transition-colors">
                  {movie.title}
                </h3>
              </Link>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px] text-white/40">
                <span>
                  {movie.MediaType === "tv" && movie.season
                    ? `S${movie.season} E${movie.episode || 1}`
                    : "Ready to watch"}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(movie)}
                  className="hover:text-red-400 text-white/30 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchLater;
