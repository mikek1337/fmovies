"use client";

import { FC, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Play, Trash2, X, Film, Tv, History } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export interface RecentlyViewedItem {
  id: string;
  mediaId: string;
  MediaType: string;
  userId: string;
  poster_path: string;
  title: string;
  season: number | null;
  episodeId: number | null;
  createdAt: Date | string;
}

interface RecentlyViewedProps {
  recentlyViewed: RecentlyViewedItem[];
  hasBtn?: boolean;
  onItemsChange?: (count: number) => void;
  showClearAll?: boolean;
  layout?: "carousel" | "grid";
  showEmptyState?: boolean;
}

const RecentlyViewed: FC<RecentlyViewedProps> = ({
  recentlyViewed: initialItems,
  hasBtn = true,
  onItemsChange,
  showClearAll = false,
  layout = "carousel",
  showEmptyState = false,
}) => {
  const [items, setItems] = useState<RecentlyViewedItem[]>(initialItems);
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const handleRemoveOne = async (e: React.MouseEvent, movie: RecentlyViewedItem) => {
    e.preventDefault();
    e.stopPropagation();

    const updated = items.filter((item) => item.id !== movie.id);
    setItems(updated);
    onItemsChange?.(updated.length);

    try {
      await axios.delete(`/api/user/recentlyviewed?id=${movie.id}`);
      toast({
        title: "Removed",
        description: `"${movie.title}" removed from watch history`,
      });
    } catch {
      toast({
        title: "Failed to remove",
        description: "Could not remove item from watch history",
        variant: "destructive",
      });
    }
  };

  const handleClearAll = async () => {
    if (items.length === 0) return;
    setIsClearing(true);
    const prevItems = [...items];
    setItems([]);
    onItemsChange?.(0);

    try {
      await axios.delete("/api/user/recentlyviewed?all=true");
      toast({
        title: "Watch History Cleared",
        description: "All recently viewed titles have been removed.",
      });
    } catch {
      setItems(prevItems);
      onItemsChange?.(prevItems.length);
      toast({
        title: "Failed to clear",
        description: "Could not clear watch history.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  if (items.length === 0) {
    if (!showEmptyState) return null;

    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl bg-white/[0.02] border border-white/5">
        <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mb-4">
          <History className="size-8" />
        </div>
        <h3 className="text-base font-semibold text-white/80">
          Your Watch History is clean
        </h3>
        <p className="text-xs text-white/40 max-w-sm mt-1.5 leading-relaxed">
          Movies and series you watch will automatically show up here so you can jump back in where you left off.
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

  const renderCard = (movie: RecentlyViewedItem, i: number) => {
    const watchUrl = `/home/watch/${
      movie.MediaType === "tv" ? "series" : "movie"
    }/${movie.mediaId}`;

    return (
      <div
        key={`review-${movie.id}`}
        className={`group formovies-card flex flex-col justify-between hover:border-formovies-gold/40 transition-all duration-300 animate-fade-in-up relative ${
          layout === "carousel" ? "w-[260px] sm:w-[280px] shrink-0 snap-start" : ""
        }`}
        style={{ animationDelay: `${i * 40}ms` }}
      >
        <div className="aspect-[2/3] relative overflow-hidden rounded-t-xl bg-formovies-deeper">
          <Link href={watchUrl}>
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 260px, 280px"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-white/30">
                <Film className="size-8" />
              </div>
            )}
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-formovies-dark via-transparent to-transparent pointer-events-none" />

          {/* Media Type Badge */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-black/60 text-formovies-gold border border-formovies-gold/30 backdrop-blur-sm">
              {movie.MediaType === "tv" ? "Series" : "Movie"}
            </span>
          </div>

          {/* Remove from history button */}
          <button
            type="button"
            onClick={(e) => handleRemoveOne(e, movie)}
            title="Remove from history"
            aria-label="Remove from history"
            className="absolute top-3 right-3 z-20 size-7 rounded-full bg-black/60 hover:bg-red-500/80 text-white/70 hover:text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <X className="size-3.5" />
          </button>

          {/* Center Play Button Overlay */}
          {hasBtn && (
            <Link
              href={watchUrl}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <div className="size-14 rounded-full bg-formovies-gold/90 text-formovies-dark flex items-center justify-center backdrop-blur-sm shadow-xl shadow-formovies-gold/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <Play className="size-6 fill-current ml-0.5" />
              </div>
            </Link>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1 justify-between">
          <div>
            <Link href={watchUrl}>
              <h3 className="font-body text-sm font-semibold text-white/90 line-clamp-1 group-hover:text-formovies-gold transition-colors duration-300">
                {movie.title}
              </h3>
            </Link>

            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-3.5 h-3.5 text-white/30 shrink-0" />
              <span className="text-[11px] text-white/40 font-medium">
                {movie.MediaType !== "movie" && movie.season ? (
                  <>S{movie.season} E{movie.episodeId}</>
                ) : (
                  "Continue watching"
                )}
              </span>
            </div>
          </div>

          {hasBtn && (
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
              <Link
                href={watchUrl}
                className="flex items-center gap-2 text-xs font-semibold text-formovies-gold/90 hover:text-formovies-gold transition-colors"
              >
                <Play className="size-3.5 fill-current" />
                Resume
              </Link>
              <button
                type="button"
                onClick={(e) => handleRemoveOne(e, movie)}
                className="text-white/20 hover:text-red-400 transition-colors p-1"
                title="Remove"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {showClearAll && items.length > 0 && (
        <div className="flex items-center justify-between pb-2">
          <p className="text-xs text-white/40">
            Showing {items.length} {items.length === 1 ? "title" : "titles"}
          </p>
          <button
            type="button"
            disabled={isClearing}
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-xs font-semibold transition-all duration-200"
          >
            <Trash2 className="size-3" />
            Clear All History
          </button>
        </div>
      )}

      {layout === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((movie, i) => renderCard(movie, i))}
        </div>
      ) : (
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-4 -mx-2 px-2 snap-x snap-mandatory">
            {items.map((movie, i) => renderCard(movie, i))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentlyViewed;
