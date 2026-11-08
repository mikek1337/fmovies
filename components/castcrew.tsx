"use client";

import { FC, useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  User,
  Clapperboard,
  PenTool,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PersonModal from "./personmodal";
import { CreditsResponseData } from "@/app/api/credits/route";

interface CastCrewProps {
  id: number;
  mediaType?: "movie" | "tv";
  className?: string;
}

const CastCrew: FC<CastCrewProps> = ({ id, mediaType = "movie", className }) => {
  const [data, setData] = useState<CreditsResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"cast" | "crew">("cast");
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [selectedPersonName, setSelectedPersonName] = useState<string | undefined>(undefined);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    axios
      .get<CreditsResponseData>(`/api/credits?id=${id}&type=${mediaType}`)
      .then((res) => {
        if (isMounted) {
          setData(res.data);
        }
      })
      .catch((err) => {
        console.warn("Failed to load credits:", err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id, mediaType]);

  const updateScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [data, activeTab, updateScrollButtons]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -400 : 400;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex items-center gap-3 mb-6">
          <Users className="size-5 text-formovies-gold" />
          <h2 className="section-title !mb-0">Cast & Crew</h2>
        </div>
        <div className="flex items-center gap-4 overflow-hidden py-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`cast-skeleton-${i}`}
              className="w-32 sm:w-36 md:w-40 shrink-0 rounded-2xl bg-white/[0.03] border border-white/5 p-3 flex flex-col gap-3 animate-pulse"
            >
              <div className="aspect-[3/4] w-full rounded-xl bg-white/10" />
              <div className="h-4 w-3/4 rounded bg-white/10" />
              <div className="h-3 w-1/2 rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || (!data.cast?.length && !data.crew?.length)) {
    return null;
  }

  const hasCast = data.cast && data.cast.length > 0;
  const hasCrew = (data.directors?.length || 0) + (data.writers?.length || 0) + (data.crew?.length || 0) > 0;

  return (
    <section className={cn("w-full relative", className)}>
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Users className="size-5 text-formovies-gold" />
          <h2 className="section-title !mb-0">Cast & Crew</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Tabs: Cast vs Key Crew */}
          <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10">
            {hasCast && (
              <button
                type="button"
                onClick={() => setActiveTab("cast")}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200",
                  activeTab === "cast"
                    ? "bg-formovies-gold text-formovies-dark shadow-sm"
                    : "text-white/60 hover:text-white"
                )}
              >
                <span>Cast</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full",
                    activeTab === "cast"
                      ? "bg-black/20 text-formovies-dark font-bold"
                      : "bg-white/10 text-white/50"
                  )}
                >
                  {data.cast.length}
                </span>
              </button>
            )}

            {hasCrew && (
              <button
                type="button"
                onClick={() => setActiveTab("crew")}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200",
                  activeTab === "crew"
                    ? "bg-formovies-gold text-formovies-dark shadow-sm"
                    : "text-white/60 hover:text-white"
                )}
              >
                <span>Key Crew</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full",
                    activeTab === "crew"
                      ? "bg-black/20 text-formovies-dark font-bold"
                      : "bg-white/10 text-white/50"
                  )}
                >
                  {(data.directors?.length || 0) + (data.writers?.length || 0)}
                </span>
              </button>
            )}
          </div>

          {/* Carousel arrows (only visible for cast tab on larger screens) */}
          {activeTab === "cast" && hasCast && (
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className={cn(
                  "size-8 rounded-lg flex items-center justify-center border transition-all duration-200",
                  canScrollLeft
                    ? "border-white/15 bg-white/5 text-white hover:bg-formovies-gold hover:text-formovies-dark hover:border-formovies-gold"
                    : "border-white/5 bg-white/[0.02] text-white/20 cursor-not-allowed"
                )}
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className={cn(
                  "size-8 rounded-lg flex items-center justify-center border transition-all duration-200",
                  canScrollRight
                    ? "border-white/15 bg-white/5 text-white hover:bg-formovies-gold hover:text-formovies-dark hover:border-formovies-gold"
                    : "border-white/5 bg-white/[0.02] text-white/20 cursor-not-allowed"
                )}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tab 1: Cast Horizontal Carousel */}
      {activeTab === "cast" && hasCast && (
        <div className="relative group/carousel">
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-4 overflow-x-auto scroll-smooth pb-4 pt-1 px-1 scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {data.cast.map((member) => (
              <div
                key={`cast-${member.id}-${member.character || member.order || Math.random()}`}
                onClick={() => {
                  setSelectedPersonId(member.id);
                  setSelectedPersonName(member.name);
                }}
                className="w-32 sm:w-36 md:w-40 shrink-0 group flex flex-col cursor-pointer"
              >
                <div className="formovies-card p-2 h-full flex flex-col justify-between hover:border-formovies-gold/40 transition-all duration-300">
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-formovies-deeper mb-3">
                    {member.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 128px, 160px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-white/10 to-transparent text-white/30">
                        <User className="size-10 stroke-1" />
                        <span className="text-[10px] mt-1 font-medium">No Photo</span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-formovies-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Episode Count for TV Series */}
                    {member.episode_count && member.episode_count > 0 && (
                      <div className="absolute bottom-2 left-2 z-10">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-formovies-gold border border-formovies-gold/30 backdrop-blur-sm">
                          {member.episode_count} eps
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-center px-1 pb-1">
                    <h3 className="font-body text-xs sm:text-sm font-semibold text-white/90 line-clamp-1 group-hover:text-formovies-gold transition-colors duration-200">
                      {member.name}
                    </h3>
                    <p className="font-body text-[11px] text-white/50 line-clamp-1 mt-0.5">
                      {member.character || "Cast"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subtle edge fade shadows */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-formovies-dark to-transparent pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-formovies-dark to-transparent pointer-events-none" />
          )}
        </div>
      )}

      {/* Tab 2: Key Crew Grid */}
      {activeTab === "crew" && hasCrew && (
        <div className="space-y-6">
          {/* Directors / Creators */}
          {data.directors && data.directors.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clapperboard className="size-4 text-formovies-gold" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  {mediaType === "tv" ? "Directors & Creators" : "Directing"}
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {data.directors.map((director) => (
                  <div
                    key={`director-${director.id}-${director.job}`}
                    onClick={() => {
                      setSelectedPersonId(director.id);
                      setSelectedPersonName(director.name);
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-formovies-gold/30 transition-all duration-200 cursor-pointer"
                  >
                    <div className="relative size-12 rounded-lg overflow-hidden bg-formovies-deeper shrink-0">
                      {director.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${director.profile_path}`}
                          alt={director.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/30">
                          <User className="size-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-body text-xs sm:text-sm font-semibold text-white/90 truncate">
                        {director.name}
                      </p>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-formovies-gold/15 text-formovies-gold mt-0.5">
                        {director.job}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Writers & Screenplay */}
          {data.writers && data.writers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <PenTool className="size-4 text-formovies-amber" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Writing & Screenplay
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {data.writers.map((writer) => (
                  <div
                    key={`writer-${writer.id}-${writer.job}`}
                    onClick={() => {
                      setSelectedPersonId(writer.id);
                      setSelectedPersonName(writer.name);
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all duration-200 cursor-pointer"
                  >
                    <div className="relative size-12 rounded-lg overflow-hidden bg-formovies-deeper shrink-0">
                      {writer.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${writer.profile_path}`}
                          alt={writer.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/30">
                          <User className="size-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-body text-xs sm:text-sm font-semibold text-white/90 truncate">
                        {writer.name}
                      </p>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/10 text-white/70 mt-0.5">
                        {writer.job}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedPersonId && (
        <PersonModal
          personId={selectedPersonId}
          personName={selectedPersonName}
          isOpen={Boolean(selectedPersonId)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedPersonId(null);
              setSelectedPersonName(undefined);
            }
          }}
        />
      )}
    </section>
  );
};

export default CastCrew;
