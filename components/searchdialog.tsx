"use client";

import { FC, useEffect, useState, useRef, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import {
  Search,
  Loader2,
  Star,
  Film,
  Tv,
  User,
  X,
  TrendingUp,
  History,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { cn } from "@/lib/utils";
import PersonModal from "./personmodal";

interface SearchResultItem {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv" | "person";
  poster_path?: string | null;
  profile_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  known_for_department?: string;
  known_for?: Array<{ title?: string; name?: string }>;
}

interface RecentSearchItem {
  id: number;
  title: string;
  media_type: "movie" | "tv" | "person";
  poster_path?: string | null;
  year?: string;
}

const SearchDialog: FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    "all" | "movie" | "tv" | "person"
  >("all");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [trending, setTrending] = useState<SearchResultItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMac, setIsMac] = useState(true);

  // Person modal for actor clicks
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [selectedPersonName, setSelectedPersonName] = useState<string | undefined>(
    undefined
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const hasFetchedTrending = useRef(false);

  // Detect OS for keyboard shortcut display (⌘K vs Ctrl K)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform));
    }
  }, []);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Toggle on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Quick open on "/" if user isn't typing in an input/textarea
      if (
        e.key === "/" &&
        !["input", "textarea"].includes(
          (document.activeElement?.tagName || "").toLowerCase()
        )
      ) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem("formovies_recent_searches");
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        }
      } catch {}

      // Fetch trending suggestions when modal opens
      if (!hasFetchedTrending.current) {
        hasFetchedTrending.current = true;
        axios
          .get<{ results: SearchResultItem[] }>(
            "/api/trending?media_type=all&time_window=day"
          )
          .then((res) => {
            if (res.data?.results) {
              setTrending(res.data.results.slice(0, 8));
            }
          })
          .catch(() => {});
      }

      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounce search input by 250ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Execute multi-search on debounced query
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    axios
      .get<{ results: SearchResultItem[] }>(
        `/api/movies/search?query=${encodeURIComponent(debouncedQuery)}`
      )
      .then((res) => {
        if (isMounted) {
          setResults(res.data?.results || []);
        }
      })
      .catch((err) => {
        console.warn("Search failed:", err);
        if (isMounted) setResults([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  const handleSelect = (item: SearchResultItem | RecentSearchItem) => {
    // If person, open PersonModal
    if (item.media_type === "person") {
      setSelectedPersonId(item.id);
      setSelectedPersonName("title" in item ? item.title : item.name);
      return;
    }

    // Save to recent searches
    const title =
      "title" in item && item.title
        ? item.title
        : "name" in item && item.name
        ? item.name
        : "Untitled";

    const date =
      "release_date" in item && item.release_date
        ? item.release_date
        : "first_air_date" in item && item.first_air_date
        ? item.first_air_date
        : undefined;

    const recentItem: RecentSearchItem = {
      id: item.id,
      title,
      media_type: item.media_type,
      poster_path: item.poster_path,
      year: date ? date.slice(0, 4) : undefined,
    };

    try {
      const updated = [
        recentItem,
        ...recentSearches.filter((r) => r.id !== item.id),
      ].slice(0, 8);
      setRecentSearches(updated);
      localStorage.setItem("formovies_recent_searches", JSON.stringify(updated));
    } catch {}

    setIsOpen(false);
    setQuery("");
    router.push(
      `/home/watch/${item.media_type === "tv" ? "series" : "movie"}/${item.id}`
    );
  };

  const handleRemoveRecent = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const updated = recentSearches.filter((r) => r.id !== id);
    setRecentSearches(updated);
    try {
      localStorage.setItem("formovies_recent_searches", JSON.stringify(updated));
    } catch {}
  };

  const handleClearAllRecents = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("formovies_recent_searches");
    } catch {}
  };

  // Filter results by active category tab
  const filteredResults = useMemo(() => {
    if (activeCategory === "all") return results;
    return results.filter((item) => item.media_type === activeCategory);
  }, [results, activeCategory]);

  const countFor = (cat: "movie" | "tv" | "person") =>
    results.filter((r) => r.media_type === cat).length;

  return (
    <>
      {/* Navbar Search Trigger with Keyboard Shortcut Badge */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 text-xs transition-all duration-200 group"
        title={`Search (${isMac ? "⌘K" : "Ctrl+K"})`}
      >
        <Search className="size-4 text-formovies-gold group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline font-medium">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] text-white/50 font-mono">
          <span>{isMac ? "⌘" : "Ctrl"}</span>
          <span>K</span>
        </kbd>
      </button>

      {/* Spotlight Search Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="!max-w-2xl w-[95vw] sm:w-[90vw] p-0 bg-[#0d0e12]/95 border-white/10 text-white rounded-2xl overflow-hidden shadow-[0_25px_100px_rgba(0,0,0,0.95)] backdrop-blur-2xl flex flex-col max-h-[85vh] gap-0">
          <DialogTitle className="sr-only">Global Search</DialogTitle>

          {/* Search Input Bar */}
          <div className="relative flex items-center px-4 sm:px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <Search className="size-5 text-formovies-gold shrink-0 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV series, actors, directors..."
              className="w-full bg-transparent border-0 outline-none text-white text-base sm:text-lg placeholder:text-white/30 font-medium"
            />
            {loading && (
              <Loader2 className="size-5 animate-spin text-formovies-gold shrink-0 ml-2" />
            )}
            {query && !loading && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setDebouncedQuery("");
                  inputRef.current?.focus();
                }}
                className="size-6 rounded-md hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white shrink-0 ml-2"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Category Tabs (shown when results exist) */}
          {results.length > 0 && (
            <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 border-b border-white/5 bg-white/[0.01] overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all",
                  activeCategory === "all"
                    ? "bg-formovies-gold text-formovies-dark font-bold shadow-sm"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                All ({results.length})
              </button>

              {countFor("movie") > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveCategory("movie")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1",
                    activeCategory === "movie"
                      ? "bg-formovies-gold text-formovies-dark font-bold shadow-sm"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Film className="size-3" />
                  Movies ({countFor("movie")})
                </button>
              )}

              {countFor("tv") > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveCategory("tv")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1",
                    activeCategory === "tv"
                      ? "bg-formovies-gold text-formovies-dark font-bold shadow-sm"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Tv className="size-3" />
                  Series ({countFor("tv")})
                </button>
              )}

              {countFor("person") > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveCategory("person")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1",
                    activeCategory === "person"
                      ? "bg-formovies-gold text-formovies-dark font-bold shadow-sm"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  <User className="size-3" />
                  People ({countFor("person")})
                </button>
              )}
            </div>
          )}

          {/* Modal Body / Results / Suggestions */}
          <div className="overflow-y-auto scrollbar-thin flex-1 p-3 sm:p-4 max-h-[55vh]">
            {/* 1. Live Search Results */}
            {debouncedQuery && filteredResults.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {filteredResults.map((item) => {
                  const title = item.title || item.name || "Untitled";
                  const date = item.release_date || item.first_air_date;
                  const year = date ? date.slice(0, 4) : null;
                  const poster = item.poster_path || item.profile_path;

                  if (item.media_type === "person") {
                    return (
                      <div
                        key={`person-${item.id}`}
                        onClick={() => handleSelect(item)}
                        className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-150 group"
                      >
                        <div className="relative size-12 rounded-full overflow-hidden bg-formovies-deeper border border-white/10 shrink-0">
                          {poster ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/w185${poster}`}
                              alt={title}
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

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white group-hover:text-formovies-gold transition-colors truncate">
                              {title}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/20 shrink-0">
                              {item.known_for_department || "Artist"}
                            </span>
                          </div>
                          {item.known_for && item.known_for.length > 0 && (
                            <p className="text-xs text-white/40 truncate mt-0.5">
                              Known for:{" "}
                              {item.known_for
                                .map((k) => k.title || k.name)
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>

                        <span className="text-xs text-white/30 group-hover:text-formovies-gold group-hover:translate-x-0.5 transition-all shrink-0">
                          View Bio →
                        </span>
                      </div>
                    );
                  }

                  // Movies and TV Series
                  return (
                    <div
                      key={`${item.media_type}-${item.id}`}
                      onClick={() => handleSelect(item)}
                      className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-150 group"
                    >
                      <div className="relative aspect-[2/3] w-12 rounded-lg overflow-hidden bg-formovies-deeper border border-white/10 shrink-0">
                        {poster ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w185${poster}`}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/30">
                            {item.media_type === "tv" ? (
                              <Tv className="size-5" />
                            ) : (
                              <Film className="size-5" />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-white group-hover:text-formovies-gold transition-colors truncate">
                            {title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border",
                              item.media_type === "tv"
                                ? "bg-blue-500/15 text-blue-300 border-blue-500/20"
                                : "bg-formovies-gold/15 text-formovies-gold border-formovies-gold/25"
                            )}
                          >
                            {item.media_type === "tv" ? "TV Series" : "Movie"}
                          </span>

                          {year && (
                            <span className="text-white/40">{year}</span>
                          )}

                          {item.vote_average !== undefined && item.vote_average > 0 && (
                            <span className="flex items-center gap-1 text-white/60">
                              <Star className="size-3 text-formovies-gold fill-formovies-gold" />
                              {item.vote_average.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-xs text-white/30 group-hover:text-formovies-gold group-hover:translate-x-0.5 transition-all shrink-0">
                        Watch →
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. No Results Empty State */}
            {debouncedQuery && !loading && filteredResults.length === 0 && (
              <div className="py-12 text-center">
                <Search className="size-8 text-white/20 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white/70">
                  No matches found for &ldquo;{debouncedQuery}&rdquo;
                </p>
                <p className="text-xs text-white/40 mt-1">
                  Try checking for typos or searching with different keywords.
                </p>
              </div>
            )}

            {/* 3. Empty Input State: Recent Searches & Trending Now */}
            {!debouncedQuery && (
              <div className="space-y-6 py-2">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-2 mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/50">
                        <History className="size-3.5 text-formovies-gold" />
                        <span>Recent Searches</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearAllRecents}
                        className="text-[11px] text-white/40 hover:text-white transition-colors"
                      >
                        Clear all
                      </button>
                    </div>

                    <div className="flex flex-col gap-1">
                      {recentSearches.map((item) => (
                        <div
                          key={`recent-${item.id}`}
                          onClick={() => handleSelect(item)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <History className="size-4 text-white/30 group-hover:text-formovies-gold transition-colors shrink-0" />
                            <span className="text-sm text-white/80 group-hover:text-white truncate">
                              {item.title}
                            </span>
                            {item.year && (
                              <span className="text-xs text-white/40 shrink-0">
                                ({item.year})
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveRecent(e, item.id)}
                            className="size-6 rounded hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Suggestions */}
                {trending.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
                      <TrendingUp className="size-3.5 text-formovies-gold" />
                      <span>Trending Today</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {trending.map((item) => {
                        const title = item.title || item.name || "Untitled";
                        const date = item.release_date || item.first_air_date;
                        const year = date ? date.slice(0, 4) : null;

                        return (
                          <div
                            key={`trending-${item.id}`}
                            onClick={() => handleSelect(item)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group border border-transparent hover:border-white/5"
                          >
                            <div className="relative aspect-[2/3] w-10 rounded-lg overflow-hidden bg-formovies-deeper shrink-0">
                              {item.poster_path ? (
                                <Image
                                  src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
                                  alt={title}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/30">
                                  <Film className="size-4" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-white/90 group-hover:text-formovies-gold transition-colors truncate">
                                {title}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-white/40 mt-0.5">
                                <span>
                                  {item.media_type === "tv" ? "TV" : "Movie"}
                                </span>
                                {year && <span>• {year}</span>}
                                {item.vote_average !== undefined && item.vote_average > 0 && (
                                  <span className="flex items-center gap-0.5 text-formovies-gold">
                                    ★ {item.vote_average.toFixed(1)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Shortcuts Navigation Hint */}
          <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
            <div className="flex items-center gap-3 flex-wrap">
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-mono">
                  {isMac ? "⌘" : "Ctrl"}K
                </kbd>{" "}
                to toggle
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-mono">
                  ESC
                </kbd>{" "}
                to close
              </span>
            </div>
            <span className="hidden sm:inline text-white/30">
              ForMovies Instant Search
            </span>
          </div>
        </DialogContent>
      </Dialog>

      {/* Person Modal for Artist Details */}
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
    </>
  );
};

export default SearchDialog;
