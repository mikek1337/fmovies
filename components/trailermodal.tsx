"use client";

import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Play,
  Loader2,
  Film,
  Star,
  Calendar,
} from "lucide-react";
import { VideoItem } from "@/app/types/tmdb";
import { cn } from "@/lib/utils";
import axios from "axios";
import Link from "next/link";

interface LockedMediaSnapshot {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  overview?: string;
  voteAverage?: number;
  releaseDate?: string;
}

interface TrailerModalProps {
  id: number;
  mediaType?: "movie" | "tv";
  title?: string;
  overview?: string;
  voteAverage?: number;
  releaseDate?: string;
  variant?: "default" | "outline" | "ghost" | "hero";
  className?: string;
  buttonText?: string;
  onOpenChange?: (open: boolean) => void;
}

const TrailerModal: FC<TrailerModalProps> = ({
  id,
  mediaType = "movie",
  title,
  overview,
  voteAverage,
  releaseDate,
  variant = "outline",
  className,
  buttonText = "Watch Trailer",
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [trailer, setTrailer] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(false);

  // Snapshot locked state to decouple from background carousel rotation
  const [lockedMedia, setLockedMedia] = useState<LockedMediaSnapshot>({
    id,
    mediaType,
    title: title || (mediaType === "tv" ? "TV Series" : "Movie"),
    overview,
    voteAverage,
    releaseDate,
  });

  const fetchTrailer = async (targetId: number, targetType: string) => {
    setLoading(true);
    setTrailer(null);
    try {
      const res = await axios.get<{ trailer: VideoItem | null }>(
        `/api/videos?id=${targetId}&type=${targetType}`
      );
      setTrailer(res.data?.trailer || null);
    } catch (err) {
      console.warn("Failed to fetch trailer:", err);
      setTrailer(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // LOCK the exact media snapshot so carousel updates won't affect this modal
      const snapshot: LockedMediaSnapshot = {
        id,
        mediaType,
        title: title || (mediaType === "tv" ? "TV Series" : "Movie"),
        overview,
        voteAverage,
        releaseDate,
      };
      setLockedMedia(snapshot);
      setIsOpen(true);
      onOpenChange?.(true);
      fetchTrailer(snapshot.id, snapshot.mediaType);
    } else {
      setIsOpen(false);
      onOpenChange?.(false);
      setTrailer(null);
    }
  };

  const displayYear = lockedMedia.releaseDate
    ? new Date(lockedMedia.releaseDate).getFullYear()
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {variant === "hero" ? (
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm backdrop-blur-md border border-white/15 hover:border-formovies-gold/40 transition-all duration-300 shadow-lg shadow-black/20 group",
              className
            )}
          >
            <div className="size-6 rounded-full bg-formovies-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="size-3 text-formovies-gold fill-formovies-gold ml-0.5" />
            </div>
            <span>{buttonText}</span>
          </button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "border-white/10 text-white/80 hover:text-formovies-gold hover:bg-white/5 gap-1.5 transition-all duration-200",
              className
            )}
          >
            <Play className="size-3.5 fill-current" />
            {buttonText}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="!max-w-5xl w-[95vw] sm:w-[92vw] lg:w-[85vw] p-0 bg-[#0d0e12]/95 border-white/10 text-white rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl gap-0"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 pb-4 border-b border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 pr-8">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-formovies-gold/15 text-formovies-gold border border-formovies-gold/25">
                  <Film className="size-3" />
                  Official Trailer
                </span>

                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-white/70">
                  {lockedMedia.mediaType === "tv" ? "TV Series" : "Movie"}
                </span>

                {lockedMedia.voteAverage && (
                  <span className="flex items-center gap-1 text-xs text-white/60 bg-white/5 px-2 py-0.5 rounded-md">
                    <Star className="size-3 text-formovies-gold fill-formovies-gold" />
                    {lockedMedia.voteAverage.toFixed(1)}
                  </span>
                )}

                {displayYear && (
                  <span className="flex items-center gap-1 text-xs text-white/50 bg-white/5 px-2 py-0.5 rounded-md">
                    <Calendar className="size-3" />
                    {displayYear}
                  </span>
                )}
              </div>

              <DialogHeader>
                <DialogTitle className="font-display text-2xl sm:text-3xl text-white tracking-wide truncate">
                  {lockedMedia.title}
                </DialogTitle>
                {trailer?.name && trailer.name !== lockedMedia.title && (
                  <p className="text-xs text-white/40 truncate mt-0.5 font-normal">
                    {trailer.name}
                  </p>
                )}
              </DialogHeader>
            </div>
          </div>
        </div>

        {/* Video Player Area */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-formovies-gold/5 via-transparent to-transparent pointer-events-none z-10" />

          {loading && (
            <div className="flex flex-col items-center gap-3 text-white/50 z-20">
              <Loader2 className="size-10 animate-spin text-formovies-gold" />
              <p className="text-sm font-medium animate-pulse">
                Loading official trailer...
              </p>
            </div>
          )}

          {!loading && trailer && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`}
              title={trailer.name || `${lockedMedia.title} Trailer`}
              className="w-full h-full border-0 z-20"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {!loading && !trailer && (
            <div className="flex flex-col items-center gap-4 text-center p-8 text-white/50 z-20 max-w-md">
              <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Film className="size-8 text-white/30" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white/80">
                  No Official Trailer Available
                </h3>
                <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
                  We couldn&apos;t find an official YouTube preview for &ldquo;{lockedMedia.title}&rdquo;. You can still watch the full title below.
                </p>
              </div>
              <Link
                href={`/home/watch/${lockedMedia.mediaType === "tv" ? "series" : "movie"}/${lockedMedia.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-formovies-gold text-formovies-dark font-semibold text-xs hover:bg-formovies-amber transition-all"
                onClick={() => setIsOpen(false)}
              >
                <Play className="size-3.5 fill-current" />
                Go to Watch Page
              </Link>
            </div>
          )}
        </div>

        {/* Modal Footer / Quick Actions */}
        <div className="p-4 sm:p-5 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0 pr-4">
            {lockedMedia.overview ? (
              <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                {lockedMedia.overview}
              </p>
            ) : (
              <p className="text-xs text-white/30 italic">
                Experience full entertainment with ForMovies streaming.
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Link
              href={`/home/watch/${lockedMedia.mediaType === "tv" ? "series" : "movie"}/${lockedMedia.id}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-formovies-gold text-formovies-dark font-semibold text-xs sm:text-sm hover:bg-formovies-amber transition-all duration-200 shadow-md shadow-formovies-gold/20"
              onClick={() => setIsOpen(false)}
            >
              <Play className="size-4 fill-current" />
              Watch Full {lockedMedia.mediaType === "tv" ? "Series" : "Movie"}
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrailerModal;
